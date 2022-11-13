import {SmallMUIButton} from "./MUIButton";
import React from "react";
import PubSub from "pubsub-js";

export function RunScript({script, path}) {
    const onClick = () => {
        PubSub.publish("runScript", {script, path});
    }
    return (
        <SmallMUIButton title={"Run: " + script[0]} sx={{minWidth: "135px"}} onClick={onClick}/>
    );
}
