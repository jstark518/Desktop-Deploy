import React, {useEffect, useRef, useState} from "react";
import {styled} from "@mui/system";
import {Terminal} from "xterm";
import PubSub from "pubsub-js";

require("xterm/css/xterm.css");

const XTermStyle = styled("div")({
  maxHeight: '20vh',
  flex: 1
});

export default function Xterm() {
  const [term, setTerm] = useState(null);
  const termElement = useRef(null);

  const subscribeMethod = (topic, msg) => {
    console.log("XTERM", topic, msg);
  };

  useEffect(() => {
    if (termElement) {
      const terminal = new Terminal();
      terminal.options.fontSize = 10;
      terminal.open(termElement.current);
      setTerm(terminal);
      window.termAPI.onData((e, data) => terminal.write(data));
      terminal.onData((e) => window.termAPI.send(e));
      window.termAPI.ready();
      PubSub.subscribe("runScript", subscribeMethod);
    }
  }, []);

  return <XTermStyle ref={termElement}></XTermStyle>;
}
