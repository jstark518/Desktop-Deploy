import React, {useEffect, useRef, useState} from "react";
import {styled} from "@mui/system";
import {Terminal} from "xterm";
import PubSub from "pubsub-js";

require("xterm/css/xterm.css");

const XTermStyle = styled("div")({
  maxHeight: '20vh',
  flex: 1
});

export default function Xterm({setShowFunc}) {
  const [children, setChildren] = useState({});

  const subscribeMethod = (topic, msg) => {
    if(children[msg.path] == null) {
        children[msg.path] = msg.path;
        setChildren({...children});
    }
    setShowFunc(true);
    setTimeout(() => {
      PubSub.publish("runScript-" + msg.path, msg);
    }, 100);
  };

  useEffect(() => {
     PubSub.subscribe("runScript", subscribeMethod);
  }, []);

  return (<>{Object.entries(children).map((v, k) => <XTermChild key={k} path={v[0]}/>)}</>);
}

function XTermChild({path}) {
  const termElement = useRef(null);
  const terminal = new Terminal();

  const subscribeMethod = (topic, msg) => {
    // We're just writing the output to the terminal for now, still need to run the script
    terminal.write(msg.script[0] + "\n");
  }

  useEffect(() => {
    PubSub.subscribe("runScript-" + path, subscribeMethod);
    if (termElement) {
      terminal.options.fontSize = 10;
      terminal.open(termElement.current);
      terminal.write(path + "\n");
      // window.termAPI.onData((e, data) => terminal.write(data));
      // terminal.onData((e) => window.termAPI.send(e));
      // window.termAPI.ready();
    }
  }, []);
  return (<XTermStyle ref={termElement}></XTermStyle>);
}