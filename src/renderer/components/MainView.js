import React, {useState} from "react";
import BranchViewer from "./BranchViewer";
import DefaultRepoViewer from "./DefaultRepoViewer";
import CommitDetailViewer from "./CommitDetailViewer";
import TagViewer from "./TagViewer";
import CloneViewer from "./CloneViewer";
import {Alert, Container} from "@mui/material";

// The main viewer. This calls the other views when needed.
export default function MainView({selectedNode, authType}) {
    const [cloneData, setCloneData] = useState(null);

    if (selectedNode == null)
        return (
            <Alert severity="info" sx={{margin: "1rem"}}>Select a Repo</Alert>
        )

    if (selectedNode.selection.type === "branches") {
        return (
            <Alert severity="info" sx={{margin: "1rem"}}>Select a Branch</Alert>
        )
    }

    if (selectedNode.selection.type === "commits") {
        return (
            <Alert severity="info" sx={{margin: "1rem"}}>Select a Commit</Alert>
        )
    }

    if (selectedNode.selection.type === "tags") {
        return (
            <Alert severity="info" sx={{margin: "1rem"}}>Select a Tag</Alert>
        )
    }

    if (selectedNode.selection.type === "repo") {
        return (
            <Container>
                <DefaultRepoViewer
                    selectedNode={selectedNode}
                    setCloneData={setCloneData}
                />
                <CloneViewer cloneData={cloneData} selectedNode={selectedNode}/>
            </Container>
        );
    }
    if (selectedNode.selection.type === "branch") {
        return (
            <Container>
                <BranchViewer
                    setCloneData={setCloneData}
                    selectedNode={selectedNode}
                    authType={authType}
                />
                <CloneViewer cloneData={cloneData} selectedNode={selectedNode}/>
            </Container>
        );
    }
    if (selectedNode.selection.type === "tag") {
        return (
            <Container>
                <TagViewer
                    cloneData={cloneData}
                    setCloneData={setCloneData}
                    selectedNode={selectedNode}
                />
                <CloneViewer cloneData={cloneData} selectedNode={selectedNode}/>
            </Container>);
    }
    if (selectedNode.selection.type === "commit") {
        return (
            <Container>
                <CommitDetailViewer
                    cloneData={cloneData}
                    setCloneData={setCloneData}
                    selectedNode={selectedNode}
                />
                <CloneViewer cloneData={cloneData} selectedNode={selectedNode}/>
            </Container>
        );
    }
} 