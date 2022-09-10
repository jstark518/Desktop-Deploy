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
        /*
        calls setRepoData for current user.
        "windows.repo" data comes from GitHub API.
        */
        window.repo.list().then((list) => {
          setRepoData(list);
          console.log(list);
        });
      }, [])


    return (
        <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        /*
        "TreeView" Prop, onNodeSelect, will fire a function.
        It returns the value of prop "nodeId" from the selected node (TreeItem).
        "nodeId" for each node has to be a string.
        */
        onNodeSelect={handleSelect}
        >
        {/*
        First use of the repoData, which was set in useEffect.
        We map the Repos from GitHub into a "TreeView" component (MUI version of an ul).
        Each Repo is in it's own "TreeItem" (MUI version of an li).
        */}
        {repoData.map(((repo, index) => (
             /*
            We separate each branch, commit, and tag into a TreeItem, each nested in the current repo-TreeItem.
            "nodeId" is a stringified JSON object, since "onNodeSelect" requires a string.
            passing props from repo.branch, repo.commit, repo.tag to access elsewhere in the application.
            */
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
