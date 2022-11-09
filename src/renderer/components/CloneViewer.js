import React from 'react';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid"; // Grid version 1
import Stack from "@mui/material/Stack";
import {styled} from "@mui/system";
import {PaperStyledContainer} from "./PaperStyledContainer";
import {RunScript} from "./RunScript";

const FlexListStyle = styled("div")({
    flex: 1,
    maxHeight: '8rem',
    marginLeft: "16px",
    overflow: "scroll",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
        width: 2
    }
});

export default function CloneViewer({cloneData, selectedNode}) {
    if (typeof cloneData !== "undefined" && cloneData !== null) {
        // cloneData could be from status or clone.
        const packageMgr = typeof cloneData.packageMgr != "undefined" ? cloneData.packageMgr : cloneData,
            javascript = packageMgr.packageMangers.npm !== false ? "npm" : packageMgr.packageMangers.yarn !== false ? "yarn" : "None",
            nodeNeedsUpdate = packageMgr.node_modules === false,
            path = selectedNode.repo.path;

        return (
            <PaperStyledContainer elevation={2}>
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
                                            Scripts({script, index, path})
                                        )}
                                    </Stack>
                                </FlexListStyle>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{flexDirection: "column", justifyContent: "space-between"}}>
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
                            <Grid item={true} xs={12} sx={{marginTop: "16px", textAlign: "right"}}>
                                <RunScript script={[javascript + " install"]} path={path}/>
                            </Grid>
                        </Grid>
                    </Grid>
            </PaperStyledContainer>
        );
    }
}

export function Dependencies({dep, index}) {
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

export function Scripts({script, index, path}) {
    return (
        <Box sx={{display: "flex", flexDirection: "columns", alignItems: "center", justifyContent: "space-between"}}
             key={'script-' + index}>
            <Typography variant="body2"
                        sx={{
                            color: "#50514F",
                            fontSize: '10px'
                        }}
            >
                {" "}{script[0]}: {script[1]}{" "}
            </Typography>
            <RunScript script={script} path={path}/>
        </Box>
    );
}