import {Box, Button, Paper, Typography} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import {styled} from "@mui/system";
import React from "react";
import {useEffect, useState} from "react";

// import styled from "styled-components";

const RepoContainerStyle = styled("div")({
  flex : 1,
  background : "#88D3A0",
  padding : 16,
  borderRadius : "5px",
  marginBottom : "10px",
});

const RepoFlexContainerStyle = styled("div")({flex : 1});

const CloneContainerStyle = styled(Paper, {
  shouldForwardProp : (props) => props !== "elevation",
})({background : "#E6FEE6", padding : 16, flex : 1});

// Wrapping MUIComponent in a styled component
const StyledMUIButton = styled(Button, {
  shouldForwardProp : (props) => props !== "variant",
})({
  backgroundColor : "#6D20C5",
  color : "white",
  "&:hover" : {color : "black", border : "2px black solid"},
});

// The main viewer. This calls the other views when needed.
export default function CommitView({selectedNode}) {
  const [cloneData, setCloneData] = useState(null);

  if (selectedNode == null)
    return (<RepoFlexContainerStyle>
            <span>Select a Repo</span></RepoFlexContainerStyle>);

  console.log(selectedNode.selection);

  if (selectedNode.selection.type === "repo") {
    return (
      <DefaultRepoView
    setCloneData = {setCloneData} cloneData = {cloneData} selectedNode =
    {
      selectedNode
    } />
    );
  }
  if (selectedNode.selection.type === "branch") {
    return <BranchView selectedNode={selectedNode} / >
        ;
  }
  if (selectedNode.selection.type === "tag") {
    return <TagView selectedNode = {
      selectedNode
    } />;
  }
  if (selectedNode.selection.type === "commit") {
    return <CommitDetailView selectedNode={selectedNode} />;
  }
}

export function DefaultRepoView({setCloneData, cloneData, selectedNode}) {
  const url = selectedNode.selection.url;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => { setData(data); });
  }, [ url ]);
  console.log(data);

  const clone = () => {
    console.log(selectedNode.repo.clone);
    window.repo.clone(selectedNode.repo.clone, selectedNode.selection)
        .then((resp) => setCloneData(resp));
  };

  // In case data has not been set
  if (data == null)
    return (<RepoFlexContainerStyle>
            <span>Loading....</span></RepoFlexContainerStyle>);

  return (
    <RepoFlexContainerStyle>
      <RepoContainerStyle>
        <Grid container spacing={2}>
          <Grid item={true} xs={12}>
            <Typography variant="h5">
              Repo - {selectedNode.selection.name}:
            </Typography>
          </Grid>
          <Grid item={true} xs={12}>
            <Typography variant="subtitle1">{data.description}</Typography>
          </Grid>
          <Grid item={true} xs={8}>
            <Typography variant="body1" sx={{
    flex: 1, fontSize: "12px" }}>
              URL - {selectedNode.selection.url}:
            </Typography>
          </Grid>
          <Grid
            item={true}
            xs={4}
            sx={{
    display: "flex", justifyContent: "right" }}
          >
            <StyledMUIButton onClick={clone} variant="contained">
              Clone
            </StyledMUIButton>
          </Grid>
        </Grid>
      </RepoContainerStyle>
      <CloneView cloneData={cloneData}></CloneView>
    </RepoFlexContainerStyle>
  );
}

export function BranchView({selectedNode}) {
  const url = selectedNode.selection.url;
  const [data, setData] = useState(null);
  console.log(selectedNode);

  useEffect(() => {
    fetch(url).then((response) => response.json()).then((data) => {
      console.log(data);
      setData(data);
    });
  }, [ url ]);
  console.log(data);
  const clone = () => {
    console.log(selectedNode.repo.clone);
    window.repo.clone(selectedNode.repo.clone, selectedNode.selection);
  };

  if (data == null)
    return <span>Loading...
                   .</span>;
  const localDate = new Date(data.commit.author.date);
  return (
      <RepoContainerStyle>
        <Grid container spacing={2}>
          <Grid item={true} xs={12}>
            <Typography variant="h5" sx={{ color: "#71697A" }}>
              Branch -{selectedNode.selection.name}:
            </Typography><
                       /Grid>
          <Grid item={true} xs={2}>
            <Typography variant="subtitle1" sx={{ color: "#71697A" }}>
              Latest commit:
            </Typography><
                       /Grid>
          <Grid item={true} xs={4}>
            <Typography variant="subtitle1" sx={{ color: "#71697A" }}>
              {localDate.toLocaleString()}
            </Typography><
                       /Grid>
          <Grid item={true} xs={6}>
            <Typography variant="subtitle1" sx={{ color: "#71697A" }}>
              {data.commit.message}
            </Typography><
                       /Grid>
          <Grid item={true} xs={8}>
            <Typography
              variant="body1"
              sx={{
                flex: 1,
                fontSize: "12px",
              }}
            >
              URL -{selectedNode.selection.url}:{" "}
            </Typography></Grid>
          <Grid
            item={true}
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "right",
            }}
          >
            <StyledMUIButton onClick={clone} variant="contained">
              Clone
            </StyledMUIButton><
                       /Grid>
        </Grid><
                       /RepoContainerStyle>
  );
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
            <Typography variant="h6">Commit Message:</Typography>{
                   selectedNode.selection.message}</Paper>
        </Grid>
               <Grid item = {true} xs = {8}>
               <Typography variant =
                    "body1" sx = {{ flex: 1, fontSize: "12px" }}>URL -
               {selectedNode.selection.url}: </Typography>
        </Grid><
           Grid
          item={true}
          xs={4}
          sx={{
      display: "flex", justifyContent: "right" }}
        >
          <StyledMUIButton onClick={clone} variant="contained">
            Clone
          </StyledMUIButton>
        </Grid>
      </Grid>
    </RepoContainerStyle>
  );
}

export function TagView({selectedNode}) {
  return <span>{selectedNode.selection.url}<
             /span>;
}

export function FileChanged(index, { file }) {
  return (
    <tr key={file.filename + index}>
      <td>{file.filename}</td>
             <td>+ {file.additions} -
             {file.deletions} lines</td>
      <td>{file.status}</td>
             </tr>
  );
}

export function CloneView({ cloneData }) {
  console.log(cloneData);
  if (cloneData !== null) {
    return (
      <CloneContainerStyle elevation={2}>
        <Grid container spacing={2}>
          <Grid item={true} xs={12} sx={{ marginBottom: "16px" }}>
            <Typography variant="h5">Cloned Repo Info:</Typography><
         Typography
  variant = "h6"
  sx =
      {{ fontSize: "18px", color: "#50514F", }} >
      {cloneData.description}<
          /Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", color: "#50514F" }}
            >
              Version: {cloneData.version}
            </Typography><
      Typography
  variant = "body1"
  sx = {{ fontSize: "14px", color: "#50514F", }} >
       Author: {cloneData.author}</Typography>
          </Grid>
       <Grid container spacing = {2}><Grid item = {true} xs = {6}>< Typography
  variant = "h6"
  sx = {{ fontSize: "16px", marginLeft: "16px", }} >
       Dependencies: </Typography>
            </Grid>
       <Grid item = {true} xs = {6}>< Typography
  variant = "h6"
                sx={{
    fontSize: "16px",
                }}
              >
                Scripts:
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item={true}
            xs={6}
            sx={{
              height: "12rem",
              overflow: "scroll",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: 2,
              },
            }}
          >
            {console.log(cloneData.dependencies)}
            <Stack spacing={1}>
              {Object.entries(cloneData.dependencies).map((dep) =>
                Dependencies({ dep })
              )}
            </Stack>
          </Grid>
          <Grid item={true} xs={6}>
            <Stack spacing={1}>
              {Object.entries(cloneData.scripts).map((script) =>
                Scripts({ script })
              )}
            </Stack>
          </Grid>
        </Grid>
      </CloneContainerStyle>
    );
  }
}

export function Dependencies({ dep }) {
  return (
    <Typography variant="body2" sx={{ color: "#50514F", fontSize: "10px" }}>
      {dep[0]}: {dep[1]}
    </Typography>
  );
}

export function Scripts({script}) {
  return (
    <Typography
  variant = "body2"
  sx = {{ color: "#50514F", }} > {script[0]}: {script[1]} < /Typography>
  );
}
