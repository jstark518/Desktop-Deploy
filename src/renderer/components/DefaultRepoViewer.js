import React from 'react';
import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import CloneViewer from "./CloneViewer";

const RepoContainerStyle = styled("div")({
    background: "#88D3A0",
    padding: 16,
    borderRadius: "5px",
    marginBottom: "10px",
  });

  // Wrapping MUIComponent in a styled component
const StyledMUIButton = styled(Button, {
    shouldForwardProp: (props) => props !== "variant",
  })({
    backgroundColor: "#6D20C5",
    color: "white",
    "&:hover": { color: "black", border: "2px black solid" },
  });

export function DefaultRepoViewer({ setCloneData, cloneData, selectedNode }) {
    const url = selectedNode.selection.url;
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        });
        // resets CloneViewer when changing repos
        setCloneData(null)
    }, [url]);
    console.log(data);
  
    const clone = () => {
      console.log(selectedNode.repo.clone);
      window.repo
        .clone(selectedNode.repo.clone, selectedNode.selection)
        .then((resp) => setCloneData(resp));
    };
  
    // In case data has not been set
    if (data == null) return <span>Loading... .</span>;
  
    return (
      <div>
        {console.log(data)}
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
              <Typography variant="body1" sx={{ flex: 1, fontSize: "12px" }}>
                URL - {selectedNode.selection.url}:
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
        <CloneViewer cloneData={cloneData}/>
      </div>
    );
  }
