import React from 'react';
import {useState, useEffect} from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function RepoTreeView(data) {
    const [repoData, setRepoData] = useState([]);
    const [selected, setSelected] = useState([]);

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
        console.log(nodeIds);
      };    

    useEffect(() => {
        window.repo.list().then((list) => {
          setRepoData(list);
          
        });
      }, [])

    return (
        <div>
            <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onNodeSelect={handleSelect}
            >
            
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
        </div>
    )
}
