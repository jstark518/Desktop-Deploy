import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "./CustomHooks/useAuth";
import RightArrowIcon from "./CustomIcons/RightArrowIcon";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

export default function RepoTreeView({ onSelectNode, currentAuthType }) {
  const [repoData, setRepoData] = useState([]);
  const [selected, setSelected] = useState([]);
  const {authType } = useAuth();

  const [listTitle, setListTitle] = useState('Repositories:');

  

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);

    /* Data from the TreeItem selected, nodeId string:
        {
            type: 'repo',
            repoIndex: number,
            name: repo.name,
            branches: [obejct],
            clone: string,
            commits: [object],
            tags: [object],
            url: string
        }
    */
    const nodeData = JSON.parse(nodeIds);
    console.log("TreeItem selected returns string converted to this JSON");
    console.log(nodeData);
    console.log(repoData);
    // sending node data to MainContainer.js
    if (
      nodeData.type === "repo" ||
      nodeData.type === "commit" ||
      nodeData.type === "branch" ||
      nodeData.type === "tag" ||
      nodeData.type === "branches" ||
      nodeData.type === "commits" ||
      nodeData.type === "tags"
    ) {
      onSelectNode({ selection: nodeData, repo: repoData[nodeData.repoIndex] });
    }
  };

  useEffect(() => {
    /*
    Resolve the promise passed from index.js.
    repo() and list() are exposed to window object from preload.js.
    list() calls the API in index.js
    */
   if (currentAuthType === "bitbucket") {
    window.repo.bblist().then((list) => {
      setListTitle('Bitbucket Repositories:');
      setRepoData(list);
      console.log('From useEffect: ',list);
    })
  };
    if (currentAuthType === "github") {
      window.repo.ghlist().then((list) => {
        setListTitle('Github Repositories:');
        setRepoData(list);
        console.log('From useEffect: ',list);
      })}
  }, []);

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
      sx={{ padding: "20px" }}
    >
      <Typography variant="3" sx={{ fontSize: "20px", fontFamily: "Roboto", fontWeight: 400 }}>{listTitle}</Typography>
      {/*
        First use of the repoData, which was set in useEffect.
        We map the Repos from GitHub into a "TreeView" component (MUI version of an ul).
        Each Repo is in it's own "TreeItem" (MUI version of an li).
        */}
      {repoData.map((repo, index) => (
        /*
            We separate each branch, commit, and tag into a TreeItem, each nested in the current repo-TreeItem.
            "nodeId" is a stringified JSON object, since "onNodeSelect" requires a string.
            passing props from repo.branch, repo.commit, repo.tag to access elsewhere in the application.
            */
        <TreeItem
          key={repo.name + index}
          nodeId={JSON.stringify({
            type: "repo",
            repoIndex: index,
            name: repo.name,
            ...repo,
          })}
          label={repo.name}
          sx={{ 
            color: "black", 
            borderRadius: "5px", 
            backgroundColor: "#d9d9d9", 
            fontFamily: "Roboto",
            fontSize: "1rem",
            padding: '5px', 
            margin: "10px", 
            [`& .${treeItemClasses.content}`]: 
              {'&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': 
                {
                  backgroundColor: "#CFEDD9",
                  borderRadius: "5px"
                }
              } 
          }}
        >
          <TreeItem
            nodeId={JSON.stringify({ type: "branches", index })}
            label="Branches"
          >
            {repo.branches.map((branch, i) => (
              <TreeItem
                key={branch.name + i}
                nodeId={JSON.stringify({
                  type: "branch",
                  repoIndex: index,
                  ...branch,
                })}
                label={branch.name}

              ></TreeItem>
            ))}
          </TreeItem>
          <TreeItem
            nodeId={JSON.stringify({ type: "commits", index })}
            label="Commits"
          >
            {repo.commits.map((commit, i) => (
              <TreeItem
                key={"commit" + i}
                nodeId={JSON.stringify({
                  type: "commit",
                  repoIndex: index,
                  ...commit,
                })}
                label={commit.message}
              ></TreeItem>
            ))}
          </TreeItem>
          <TreeItem
            nodeId={JSON.stringify({ type: "tags", index })}
            label="Tags"
          >
            {repo.tags.map((tag, i) => (
              <TreeItem
                key={"tag" + i}
                nodeId={JSON.stringify({
                  type: "tag",
                  repoIndex: index,
                  ...tag,
                })}
                label={tag.name}
              ></TreeItem>
            ))}
          </TreeItem>
        </TreeItem>
      ))}
    </TreeView>
  );
}
