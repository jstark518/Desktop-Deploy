import React, {useEffect, useState} from 'react';
import {CircularProgress, Typography} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import {MUIButton} from "./MUIButton";
import {HeaderPaperStyledContainer} from "./PaperStyledContainer";

export default function DefaultRepoViewer({setCloneData, selectedNode}) {
    const url = selectedNode.selection.url;
    const path = selectedNode.repo.path;
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (path) {
                    window.repo.details(path).then((d) => {
                        const data = JSON.parse(d);
                        setCloneData(data);
                    });
                }
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

    // In case data has not been set
    if (data == null) {
        return (
            <CircularProgress />
        );
    }

    return (
        <HeaderPaperStyledContainer elevation={2}>
            <Grid container spacing={2}>
                <Grid item={true} xs={12}>
                    <Typography variant="h5" sx={{fontSize: '18px', textDecoration: 'underline'}}>
                        Repo - {selectedNode.selection.name}
                    </Typography>
                </Grid>
                <Grid item={true} xs={12}>
                    <Typography variant="subtitle1" sx={{fontSize: '14px'}}>{data.description}</Typography>
                </Grid>
                <Grid item={true} xs={8}>
                    <Typography variant="body1" sx={{flex: 1, fontSize: "12px"}}>
                        URL - {selectedNode.selection.url}
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={4}
                    sx={{display: "flex", justifyContent: "right"}}
                >
                    {path ? "" : (<MUIButton onClick={clone} title="Clone"/>)}
                </Grid>
            </Grid>
        </HeaderPaperStyledContainer>
    );
}
