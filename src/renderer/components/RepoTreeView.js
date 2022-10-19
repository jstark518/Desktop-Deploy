import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import { styled } from "@mui/system";
import React from "react";
import { useEffect, useState } from "react";
import RightArrowIcon from "./CustomIcons/RightArrowIcon";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const RepoStyledTreeItem = styled(TreeItem, {
  shouldForwardProp: (props) => props !== "key" || props !== "nodeId" || props !== "label"})({
    color: "black", 
    borderRadius: "5px", 
    backgroundColor: "#d9d9d9", 
    fontFamily: "Roboto",
    padding: '5px 0 5px 0', 
    margin: "10px", 
    [`& .${treeItemClasses.content}`]: {
      '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
        backgroundColor: "#CFEDD9",
        border: "1px dotted black",               
        borderRadius: "5px"
      }
    }
  })

function StyledTreeItem(props) {
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <RepoStyledTreeItem
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pl: 1, pr: 1, m: 0 }}>
          <LabelIcon color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
}

const BranchStyledTreeItem = styled(TreeItem, {
  shouldForwardProp: (props) => props !== "key" || props !== "nodeId" || props !== "label"})({
    [`& .${treeItemClasses.label}`]: {
      '&.MuiTreeItem-label': {
        fontSize: "0.7rem",
        overflowWrap: "break-word",
      }
    }
  })

const CommitStyledTreeItem = styled(TreeItem, {
  shouldForwardProp: (props) => props !== "key" || props !== "nodeId" || props !== "label"})({
    [`& .${treeItemClasses.label}`]: {
      '&.MuiTreeItem-label': {
        fontSize: "0.7rem",
        overflowWrap: "break-word",
        padding: "0 0 10px 0"
      }
    }
  })


export default function RepoTreeView({ onSelectNode, currentAuthType }) {
  const [repoData, setRepoData] = useState([]);
  const [selected, setSelected] = useState([]);
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
  /*
    Determines which Repo list to display based on the currentAuthType
  */
  useEffect(() => {
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
        onNodeSelect will fire a function when a TreeItem is selected.
        nodeId is returned as a string, so it must be converted to JSON.
        We used nodeId to pass data from the TreeItem.
      */
      onNodeSelect={handleSelect}
      sx={{ 
        padding: "1rem",
        [`& .${treeItemClasses.label}`]: {
          '&.MuiTreeItem-label': {
            fontSize: "0.8rem",
          }
        }
      }}
    >
      <Typography variant="3" sx={{ fontSize: "20px", fontFamily: "Roboto", fontWeight: 400 }}>{listTitle}</Typography>
      {repoData.map((repo, index) => (
        /*
          We separate each Repo into its Default Repo, branches, commits, and tags, placing each into a TreeItem.
          "nodeId" is a stringified JSON object, since "onNodeSelect" requires a string.
        */
        <StyledTreeItem
          key={repo.name + index}
          nodeId={JSON.stringify({
            type: "repo",
            repoIndex: index,
            name: repo.name,
            ...repo,
          })}
          labelText={repo.name}
          labelIcon={RightArrowIcon}
        > 
          <TreeItem
            nodeId={JSON.stringify({ type: "branches", index })}
            label="Branches"
          >
            {repo.branches.map((branch, i) => (
              <BranchStyledTreeItem
                key={branch.name + i}
                nodeId={JSON.stringify({
                  type: "branch",
                  repoIndex: index,
                  ...branch,
                })}
                label={branch.name}                
              ></BranchStyledTreeItem>
            ))}
          </TreeItem>
          <TreeItem
            nodeId={JSON.stringify({ type: "commits", index })}
            label="Commits"
          >
            {repo.commits.map((commit, i) => (
              <CommitStyledTreeItem
                key={"commit" + i}
                nodeId={JSON.stringify({
                  type: "commit",
                  repoIndex: index,
                  ...commit,
                })}
                label={commit.message.slice(0, 15)+"..."}
              ></CommitStyledTreeItem>
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
        </StyledTreeItem>
      ))}
    </TreeView>
  );
}
