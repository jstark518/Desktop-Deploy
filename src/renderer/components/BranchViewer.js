import React, {useEffect, useState} from 'react';
import {CircularProgress, Typography} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import {MUIButton} from "./MUIButton";
import {HeaderPaperStyledContainer} from "./PaperStyledContainer";


export default function BranchViewer({selectedNode, setCloneData, cloneData, authType}) {
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


    const clone = () => {
        window.repo
            .ghClone(selectedNode.repo.clone, selectedNode.selection)
            .then((resp) => setCloneData(resp));
    };

    if (data == null)
        return (
            <CircularProgress />
        );

    let localDate = new Date(0);
    let message = "";
    if (authType === 'github') {
        localDate = new Date(data.commit.author.date)
        message = data.commit.message
    } else if (authType === 'bitbucket') {
        localDate = new Date(data.target.date)
        message = data.target.message
    }

    return (
        <HeaderPaperStyledContainer>
            <Grid container spacing={2}>
                <Grid item={true} xs={12}>
                    <Typography variant="h5">
                        Branch - {selectedNode.selection.name}
                    </Typography>
                </Grid>
                <Grid item={true} xs={12}>
                    <Typography variant="subtitle1" sx={{color: "black"}}>
                        Latest commit: {localDate.toLocaleString()}
                    </Typography>
                </Grid>
                <Grid item={true} xs={12}
                      sx={{
                          height: "12rem",
                          overflow: "scroll",
                          overflowX: "hidden",
                          "&::-webkit-scrollbar": {
                              width: 2
                          }
                      }}
                >
                    <Typography variant="subtitle1" sx={{color: "#71697A"}}>
                        {message}
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
                        URL - {selectedNode.selection.url}
                    </Typography>
                </Grid>
                <Grid item={true} xs={4}
                      sx={{
                          display: "flex",
                          justifyContent: "right",
                      }}
                >
                    <MUIButton onClick={clone} title="Clone"/>
                </Grid>
            </Grid>
        </HeaderPaperStyledContainer>
    );
}
