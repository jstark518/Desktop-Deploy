import React, {useEffect} from 'react';
import {Typography, Paper} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import {MUIButton} from "./MUIButton";
import {HeaderPaperStyledContainer} from "./PaperStyledContainer";


export default function CommitDetailView({cloneData, setCloneData, selectedNode}) {
    useEffect(() => {
        // resets CloneViewer when changing repos
        setCloneData(null)
    }, [selectedNode]);

    const clone = () => {
            window.repo
                .ghClone(selectedNode.repo.clone, selectedNode.selection)
                .then((resp) => setCloneData(resp));
        },
        localDate = new Date(selectedNode.selection.date);

    return (
        <HeaderPaperStyledContainer>
            <Grid container spacing={2}>
                <Grid item={true} xs={12}>
                    <Typography variant="h5" sx={{color: "#71697A"}}>
                        Commit - {localDate.toLocaleString()}
                    </Typography>
                </Grid>
                <Grid item={true} xs={12}>
                    <Paper elevation={3} sx={{padding: "1em", flex: 1}}>
                        <Typography variant="h6">Commit Message:</Typography>
                        {selectedNode.selection.message}
                    </Paper>
                </Grid>
                <Grid item={true} xs={8}>
                    <Typography variant="body1" sx={{flex: 1, fontSize: "12px"}}>
                        URL -{selectedNode.selection.url}
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={4}
                    sx={{display: "flex", justifyContent: "right"}}
                >
                    <MUIButton onClick={clone} title="Clone"/>
                </Grid>
            </Grid>
        </HeaderPaperStyledContainer>
    );
}