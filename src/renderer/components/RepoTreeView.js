import React from 'react';
import {useState, useEffect} from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function RepoTreeView({onSelectNode}) {
    const [repoData, setRepoData] = useState([]);
    const [selected, setSelected] = useState([]);

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
        const nodeData = JSON.parse(nodeIds);
        console.log(nodeData);
        if(nodeData.type === "commit" || nodeData.type === "branch" || nodeData.type === "tag") {
            onSelectNode({selection: nodeData, repo: repoData[nodeData.repoIndex]});
        }
      };    

    useEffect(() => {
        window.repo.list().then((list) => {
          setRepoData(list);
        });
      }, [])


    return (
        <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={handleSelect}
        >

        {repoData.map(((repo, index) => (
            <TreeItem key={repo.name + index} nodeId={JSON.stringify({type: 'repo', index, name: repo.name})} label={repo.name}>
                <TreeItem nodeId={JSON.stringify({type: 'branches',index})} label="Branches">
                    {repo.branches.map((branch, i) => (
                    <TreeItem key={branch.name + i} nodeId={JSON.stringify({type: "branch", repoIndex: index, ...branch})} label={branch.name}>
                    </TreeItem>
                    ))}
                </TreeItem>
                <TreeItem nodeId={JSON.stringify({type: 'commits',index})} label='Commits'>
                    {repo.commits.map((commit, i) => (
                    <TreeItem key={'commit' + i} nodeId={JSON.stringify({type: "commit", repoIndex: index, ...commit})} label={commit.message}></TreeItem>
                    ))}
                </TreeItem>
                <TreeItem nodeId={JSON.stringify({type: 'tags',index})} label='Tags'>
                    {repo.tags.map((tag, i) => (
                    <TreeItem key={'tag' + i} nodeId={JSON.stringify({type: "tag", repoIndex: index, ...tag})} label={tag.name}></TreeItem>
                    ))}
                </TreeItem>
            </TreeItem>)))}
        </TreeView>
    )
}
