import React from 'react';
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import CloneViewer from "./CloneViewer";
import CloneButton from "./MUIButton";

const RepoFlexContainerStyle = styled("div")({ flex: 1, padding: '16px' });

const RepoContainerStyle = styled("div")({
    background: "#b7e4c6",
    padding: '20px',
    margin: '20px',
    borderRadius: "5px",
    marginBottom: "10px",
  });

export default function DefaultRepoViewer({ setCloneData, selectedNode }) {
    const url = selectedNode.selection.url;
    console.log(url);
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
    if (data == null) 
    return(
      <RepoFlexContainerStyle>
        <span>Loading....</span>
      </RepoFlexContainerStyle>
    );
  
  
    return (
      <div>
        {console.log(data)}
        <RepoContainerStyle>
          <Grid container spacing={2}>
            <Grid item={true} xs={12}>
              <Typography variant="h5" sx={{fontSize: '18px', textDecoration: 'underline'}}>
                Repo - {selectedNode.selection.name}:
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              <Typography variant="subtitle1" sx={{fontSize: '14px'}}>{data.description}</Typography>
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
              <CloneButton onClick={clone}/>
            </Grid>
          </Grid>
        </RepoContainerStyle>
      </div>
    );
  }
