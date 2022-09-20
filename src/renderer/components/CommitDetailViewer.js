import React from 'react';
import { Button, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

const RepoContainerStyle = styled("div")({
    flex: 1,
    background: "#88D3A0",
    padding: 16,
    borderRadius: "5px",
    marginBottom: "10px",
});

export default function CommitDetailView({ selectedNode }) {
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