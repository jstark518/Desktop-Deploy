import {styled} from "@mui/system";
import React, {useEffect, useRef, useState} from "react";
import {Terminal} from "xterm";

require("xterm/css/xterm.css");

const XTermStyle = styled("div")({
  maxHeight : "30vh",
  flex : 0,
  margin : "0 -1rem",
});

export default function Xterm() {
  const [term, setTerm] = useState(null);
  const termElement = useRef(null);
  useEffect(() => {
    if (termElement) {
      const terminal = new Terminal();
      terminal.setOption("fontSize", 10);
      terminal.open(termElement.current);
      setTerm(terminal);
      window.termAPI.onData((e, data) => terminal.write(data));
      terminal.onData((e) => window.termAPI.send(e));
      window.termAPI.ready();
    }
  }, []);

  return <XTermStyle ref = {termElement}>< /XTermStyle>;
}
