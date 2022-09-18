import React from 'react';
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

const CloneContainerStyle = styled(Paper, {
    shouldForwardProp: (props) => props !== "elevation",
})({ background: "#E6FEE6", padding: 16 });

export default function CloneViewer({ cloneData }) {
    console.log(cloneData);
    if (cloneData !== null) {
      return (
        <CloneContainerStyle elevation={2}>
          <Grid container spacing={2}>
            <Grid item={true} xs={12} sx={{ marginBottom: "16px" }}>
              <Typography variant="h5">Cloned Repo Info:</Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "18px",
                  color: "#50514F",
                }}
              >
                {cloneData.description}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: "14px", color: "#50514F" }}
              >
                Version: {cloneData.version}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "14px",
                  color: "#50514F",
                }}
              >
                Author: {cloneData.author}
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item={true} xs={6}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "16px",
                    marginLeft: "16px",
                  }}
                >
                  Dependencies:
                </Typography>
              </Grid>
              <Grid item={true} xs={6}>
                <Typography
                  variant="h6"
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
                    width: 2
                    }
                }}
            >
              {console.log(cloneData.dependencies)}
              <Stack spacing={1}>
                {Object.entries(cloneData.dependencies).map((dep) =>
                  Dependencies({ dep })
                )}
              </Stack>
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
                    }
                }}    
            >
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
  
  export function Scripts({ script }) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "#50514F",
        }}
      >
        {script[0]}: {script[1]}
      </Typography>
    );
  }
  