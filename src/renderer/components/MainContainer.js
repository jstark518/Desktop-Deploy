import React,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import RepoList from './RepoList';
import { ListItemButton, ListItemText, Paper } from '@mui/material';
import { Box } from '@mui/system';



export default function MainContainer({exampleData}) {
  return (
    <div>
        <h1>GIT-GUI</h1>
        <Paper
          elevation={1}
        >
          <Box 
            sx={{display: 'flex', width: '100%'}}
          >
            <RepoList exampleData={exampleData}/>
          </Box>
        </Paper>
    </div>
  )
}
