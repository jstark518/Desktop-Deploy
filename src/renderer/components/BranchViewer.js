import React from 'react';
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import CloneButton from './MUIButton';
import CloneViewer from './CloneViewer';

const RepoFlexContainerStyle = styled("div")({ flex: 1, padding: '16px' });

const RepoContainerStyle = styled("div")({
    flex: 1,
    background: "#88D3A0",
    padding: '16px',
    margin: '16px',
    borderRadius: "5px",
    marginBottom: "10px",
});

export default function BranchViewer({ selectedNode, setCloneData, cloneData }) {
    const url = selectedNode.selection.url;
    const [data, setData] = useState(null);
    console.log(selectedNode);
  
    useEffect(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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

    if (data == null)
    return (
      <RepoFlexContainerStyle>
        <span>Loading....</span>
      </RepoFlexContainerStyle>
    );
  
    const localDate = new Date(data.commit.author.date);
    return (
      <div>
        <RepoContainerStyle>
          <Grid container spacing={2}>
            <Grid item={true} xs={12}>
              <Typography variant="h5">
                Branch -{selectedNode.selection.name}:
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              <Typography variant="subtitle1" sx={{ color: "black" }}>
                Latest commit: {localDate.toLocaleString()}
              </Typography>
            </Grid>
            <Grid 
                item={true} 
                xs={12}
                sx={{
                    height: "12rem",
                    overflow: "scroll",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                      width: 2
                    }
                }}
            >
              <Typography variant="subtitle1" sx={{ color: "#71697A" }}>
                {data.commit.message}
              </Typography>
            </Grid>
            <Grid item={true} xs={8}>
              <Typography
                variant="body1"
                sx={{
                  flex: 1,
                  fontSize: "12px",
                }}
              >
                URL -{selectedNode.selection.url}:{" "}
              </Typography>
            </Grid>
            <Grid
              item={true}
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "right",
              }}
            >
              <CloneButton onClick={clone} />
            </Grid>
          </Grid>
        </RepoContainerStyle>
        <CloneViewer cloneData={cloneData} />
      </div>
    );
  }
