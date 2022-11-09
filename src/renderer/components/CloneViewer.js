import React from 'react';
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

const RepoFlexContainerStyle = styled("div")({ flex: 1, height: '30vh' });

const LoadingFlexContainerStyle = styled("div")({ flex: 1, padding: '16px' });

const FlexListStyle = styled("div")({ 
  flex: 1, 
  height: '5rem',
  marginLeft: "16px",
  overflow: "scroll",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
  width: 2
  } 

});

const CloneContainerStyle = styled(Paper, {
    shouldForwardProp: (props) => props !== "elevation",
})({ background: "#E6FEE6", padding: '16px', margin: '16px', flex: 1 });

export default function CloneViewer({ cloneData }) {
    console.log(cloneData);
    if (typeof cloneData !== "undefined" && cloneData !== null) {
        // cloneData could be from status or clone.
        const packageMgr = typeof cloneData.packageMgr != "undefined" ? cloneData.packageMgr : cloneData,
            javascript = packageMgr.packageMangers.npm !== false ? "npm" : packageMgr.packageMangers.yarn !== false ? "yarn" : "None",
            nodeNeedsUpdate = packageMgr.node_modules === false;

        return (
            <CloneContainerStyle elevation={2}>
                <RepoFlexContainerStyle>
                    <Grid container spacing={2}>
                        <Grid item={true} xs={12} sx={{marginBottom: "16px"}}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "16px",
                                    color: "#50514F",
                                    textDecoration: 'underline'
                                }}
                            >
                                {cloneData.description}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{fontSize: "14px", color: "#50514F"}}
                            >
                                Version: {packageMgr.package.version}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "14px",
                                    color: "#50514F",
                                }}
                            >
                                Author: {packageMgr.package.author}
                            </Typography>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item={true} xs={6}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: "14px",
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
                                        fontSize: "14px",
                                        marginLeft: "16px"
                                    }}
                                >
                                    Scripts:
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item={true} xs={6}>
                                <FlexListStyle>
                                    <Stack spacing={1}>
                                        {packageMgr.package.dependencies && Object.entries(packageMgr.package.dependencies).map((dep, index) =>
                                            Dependencies({dep, index})
                                        )}
                                        {packageMgr.package.devDependencies && Object.entries(packageMgr.package.devDependencies).map((dep, index) =>
                                            Dependencies({dep, index})
                                        )}
                                    </Stack>
                                </FlexListStyle>
                            </Grid>

                            <Grid item={true} xs={6}>
                                <FlexListStyle>
                                    <Stack spacing={1}>
                                        {Object.entries(packageMgr.package.scripts).map((script, index) =>
                                            Scripts({script, index})
                                        )}
                                    </Stack>
                                </FlexListStyle>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item={true} xs={12} sx={{marginTop: "16px"}}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: "14px",
                                        marginLeft: "16px",
                                    }}
                                >
                                JavaScript: {javascript} ({nodeNeedsUpdate ? "not up to date" : "is up to date"})
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </RepoFlexContainerStyle>
            </CloneContainerStyle>
        );
    }
}
  
  export function Dependencies({ dep, index }) {
    return (
      <Typography variant="body2"
      key={'dep-' + index}
        sx={{ 
          color: "#50514F", 
          fontSize: "10px" 
        }}
      >
        {dep[0]}: {dep[1]}
      </Typography>
    );
  }
  
  export function Scripts({ script, index }) {
    return (
      <Typography variant="body2"
        key={'script-' + index}
        sx={{
          color: "#50514F",
          fontSize: '10px'
        }}
      >
        {" "}{script[0]}: {script[1]}{" "}
      </Typography>
    );
  }
  