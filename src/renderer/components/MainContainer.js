import React,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import RepoList from './RepoList';
import { Container, ListItemButton, ListItemText, Paper } from '@mui/material';
import { Box } from '@mui/system';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



export default function MainContainer({gitRepoAPIData}) {
  const [repoData, setRepoData] = useState([])
  console.log(gitRepoAPIData);
  console.log('repoData:')
  console.log(repoData);

  useEffect(() => {
    window.repo.list().then((list) => {
      setRepoData(list);
      
    });
  }, [])

  
  return (
    <div>
        <h1>GIT-GUI</h1>

        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {console.log("Inside Tree View")}
          {console.log(repoData)}
          {repoData.map(((repo, index) => (
            <TreeItem key={repo.name + index} nodeId={repo.name + index} label={repo.name}>
              <TreeItem nodeId={'branches' + index} label="Branches">
                {repo.branches.map((branch, index) => (
                  <TreeItem key={branch.name + index} nodeId={branch.name + index} label={branch.name}></TreeItem>
                ))}
              </TreeItem>
              <TreeItem nodeId={'commits' + index} label='Commits'>
                {repo.commits.map((commit, index) => (
                  <TreeItem key={'commit' + index} nodeId={'commit' + index} label={commit.message}></TreeItem>
                ))}
              </TreeItem>
              <TreeItem nodeId={'tags' + index} label='Tags'>
                {repo.tags.map((tag, index) => (
                  <TreeItem key={'tag' + index} nodeId={'tag' + index} label={tag.name}></TreeItem>
                ))}
              </TreeItem>
            </TreeItem>)))}
        </TreeView>


{/* This is a different way to display the data using more components */}
        {/* <Paper elevation={1}>
          <Container maxWidth='lg'>
            <Box sx={{display: 'flex', maxWidth: 600}}>
              <RepoList gitAPIDataRepoList={gitRepoAPIData}/>
            </Box>
          </Container>
        </Paper> */}
    </div>
  )
}
