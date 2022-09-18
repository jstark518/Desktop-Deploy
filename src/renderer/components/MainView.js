import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import React from "react";
import { useEffect, useState } from "react";
import BranchViewer from "./BranchViewer";
import { DefaultRepoViewer } from "./DefaultRepoViewer";

// The main viewer. This calls the other views when needed.
export default function MainView({ selectedNode }) {
  const [cloneData, setCloneData] = useState(null);

  if (selectedNode == null) return <span>Select a Repo</span>;

  console.log(selectedNode.selection);

  if (selectedNode.selection.type === "repo") {
    return (
      <DefaultRepoViewer
        setCloneData={setCloneData}
        cloneData={cloneData}
        selectedNode={selectedNode}
      />
    );
  }
  if (selectedNode.selection.type === "branch") {
    return <BranchViewer selectedNode={selectedNode} />;
  }
  if (selectedNode.selection.type === "tag") {
    return <TagView selectedNode={selectedNode} />;
  }
  if (selectedNode.selection.type === "commit") {
    return <CommitDetailView selectedNode={selectedNode} />;
  }
}


export function CommitDetailView({ selectedNode }) {
  console.log(selectedNode);

  const clone = () => {
      console.log(selectedNode.repo.clone);
      window.repo
        .clone(selectedNode.repo.clone, selectedNode.selection)
        .then((resp) => console.log(resp));
    },
    localDate = new Date(selectedNode.selection.date);

  return (
    <RepoContainerStyle>
      <Grid container spacing={2}>
        <Grid item={true} xs={12}>
          <Typography variant="h5" sx={{ color: "#71697A" }}>
            Commit - {localDate.toLocaleString()}:
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Paper elevation={3} sx={{ padding: "1em", flex: 1 }}>
            <Typography variant="h6">Commit Message:</Typography>
            {selectedNode.selection.message}
          </Paper>
        </Grid>
        <Grid item={true} xs={8}>
          <Typography variant="body1" sx={{ flex: 1, fontSize: "12px" }}>
            URL -{selectedNode.selection.url}:
          </Typography>
        </Grid>
        <Grid
          item={true}
          xs={4}
          sx={{ display: "flex", justifyContent: "right" }}
        >
          <StyledMUIButton onClick={clone} variant="contained">
            Clone
          </StyledMUIButton>
        </Grid>
      </Grid>
    </RepoContainerStyle>
  );
}

export function TagView({ selectedNode }) {
  return <span>{selectedNode.selection.url}</span>;
}

export function FileChanged(index, { file }) {
  /*
    files: Array(10)
    0: additions: 2
    blob_url:
        "https://github.com/jstark518/Desktop-Deploy/blob/3824a4009637cfa0f0bb0c0adc7abcf7a5e81c60/.gitignore"
    changes: 2
    contents_url:
        "https://api.github.com/repos/jstark518/Desktop-Deploy/contents/.gitignore?ref=3824a4009637cfa0f0bb0c0adc7abcf7a5e81c60"
    deletions: 0
    filename: ".gitignore"
    patch:
        "@@ -107,3 +107,5 @@ dist\n /.tmp/\n /.idea/\n /.env.json\n+/.cache.data.gh.json\n+.DS_Store"
    raw_url:
        "https://github.com/jstark518/Desktop-Deploy/raw/3824a4009637cfa0f0bb0c0adc7abcf7a5e81c60/.gitignore"
    sha: "3655ab548616dba12cafa1ec9b3793b1f34b84fe"
        status: "modified"
     */
  return (
    <tr key={file.filename + index}>
      <td>{file.filename}</td>
      <td>
        +{file.additions} -{file.deletions} lines
      </td>
      <td>{file.status}</td>
    </tr>
  );
}

