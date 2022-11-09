import { styled } from "@mui/system";
import React from "react";
import { useState } from "react";
import BranchViewer from "./BranchViewer";
import DefaultRepoViewer from "./DefaultRepoViewer";
import CommitDetailViewer from "./CommitDetailViewer";
import TagViewer from "./TagViewer";
import CloneViewer from "./CloneViewer";

const RepoFlexContainerStyle = styled("div")({ flex: 1, padding: '10px' });

// The main viewer. This calls the other views when needed.
export default function MainView({ selectedNode, authType }) {
  const [cloneData, setCloneData] = useState(null);

  if (selectedNode == null)
    return (
      <RepoFlexContainerStyle>
        <span>Select a Repo</span>
      </RepoFlexContainerStyle>
    )

  if (selectedNode.selection.type === "branches") {
    return (
      <RepoFlexContainerStyle>
        <span>Select a Branch</span>
      </RepoFlexContainerStyle>
    )
  }

  if (selectedNode.selection.type === "commits") {
    return (
      <RepoFlexContainerStyle>
        <span>Select a Commit</span>
      </RepoFlexContainerStyle>
    )
  }

  if (selectedNode.selection.type === "tags") {
    return (
      <RepoFlexContainerStyle>
        <span>Select a Tag</span>
      </RepoFlexContainerStyle>
    )
  }
  
  if (selectedNode.selection.type === "repo") {
    return (
      <div>
      <DefaultRepoViewer
        selectedNode={selectedNode}
        setCloneData={setCloneData}
      />
      <CloneViewer cloneData={cloneData} />
      </div>
    );
  }
  if (selectedNode.selection.type === "branch") {
    return (
      <div>
        <BranchViewer
          setCloneData={setCloneData}
          selectedNode={selectedNode}
          authType={authType}
        />
        <CloneViewer cloneData={cloneData} />
      </div>
    );
  }
  if (selectedNode.selection.type === "tag") {
    return <TagViewer 
      cloneData={cloneData}
      setCloneData={setCloneData}
      selectedNode={selectedNode} 
    />;
  }
  if (selectedNode.selection.type === "commit") {
    return <CommitDetailViewer 
      cloneData={cloneData}
      setCloneData={setCloneData}
      selectedNode={selectedNode} 
    />;
    }
} 