import { styled } from "@mui/system";
import React from "react";
import { useState } from "react";
import BranchViewer from "./BranchViewer";
import DefaultRepoViewer from "./DefaultRepoViewer";
import CommitDetailViewer from "./CommitDetailViewer";
import TagViewer from "./TagViewer";


const RepoFlexContainerStyle = styled("div")({ flex: 1, padding: '10px' });


// The main viewer. This calls the other views when needed.
export default function MainView({ selectedNode }) {
  const [cloneData, setCloneData] = useState(null);

  if (selectedNode == null)
    return (
      <RepoFlexContainerStyle>
        <span>Select a Repo</span>
      </RepoFlexContainerStyle>
    )

  console.log(selectedNode.selection);

  
  if (selectedNode.selection.type === "repo") {
    return (
      <DefaultRepoViewer
        cloneData={cloneData}
        selectedNode={selectedNode}
        setCloneData={setCloneData}
      />
    );
  }
  if (selectedNode.selection.type === "branch") {
    return <BranchViewer selectedNode={selectedNode} />;
  }
  if (selectedNode.selection.type === "tag") {
    return <TagViewer selectedNode={selectedNode} />;
  }
  if (selectedNode.selection.type === "commit") {
    return <CommitDetailViewer 
    cloneData={cloneData}
    setCloneData={setCloneData}
    selectedNode={selectedNode} />;
  }
}