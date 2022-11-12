import React, {useEffect, useRef, useState} from "react";
import {styled} from "@mui/system";
import {Terminal} from "xterm";
import PubSub from "pubsub-js";

require("xterm/css/xterm.css");

const XTermStyle = styled('div')((props) => ({
  display: props.display == "true" ? 'block' : 'none',
  maxHeight: '20vh',
  flex: 1
}));

export default function Xterm({setShowFunc}) {
  const [children, setChildren] = useState({});
  const [focused, setFocused] = useState("");

  const subscribeMethod = (topic, msg) => {
    if(children[msg.path] == null) {
        children[msg.path] = msg.path;
        setChildren({...children});
    }
    setShowFunc(true);
    setFocused(msg.path);
    setTimeout(() => {
      PubSub.publish("runScript-" + msg.path, msg);
    }, 100);
  };

  useEffect(() => {
     PubSub.subscribe("runScript", subscribeMethod);
  }, []);

  return (<>{Object.entries(children).map((v, k) => <XTermChild key={k} focused={(v[0] === focused).toString()} path={v[0]}/>)}</>);
}

function XTermChild({path, focused}) {
  const termElement = useRef(null);
  const terminal = new Terminal();

  const subscribeMethod = (topic, msg) => {
    // We're just writing the output to the terminal for now, still need to run the script
    console.log(msg.script[0] + "\n");
  }

  useEffect(() => {
    PubSub.subscribe("runScript-" + path, subscribeMethod);
    if (termElement) {
      terminal.options.fontSize = 10;
      terminal.open(termElement.current);
      window.termAPI.getInstance(path, (e, data) => {
        // We are getting data, we need to display it in the terminal.
        terminal.write(data);
      }).then((write) => {
        console.log("New terminal:", path);
        // User is typing, send it to the backend.
        terminal.onData((e) => write(e));
      });
    }
  }, []);
  return (<XTermStyle display={focused} ref={termElement}></XTermStyle>);
}