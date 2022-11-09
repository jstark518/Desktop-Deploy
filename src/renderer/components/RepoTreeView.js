import React, { useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import { styled } from "@mui/system";
import RepoIcon from "./CustomIcons/RepoIcon";
import RepoBranchIcon from "./CustomIcons/RepoBranchIcon";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const RepoStyledTreeItemRoot = styled(TreeItem)({
    color: "black", 
    borderRadius: "5px", 
    backgroundColor: "#d9d9d9", 
    fontFamily: "Roboto",
    margin: "10px", 
    [`& .${treeItemClasses.content}`]: {
      '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
        backgroundColor: "#CFEDD9",
        border: "1px dotted black",               
        borderRadius: "5px"
      }
    }
  })

function RepoStyledTreeItem(props) {
  const { labelText, labelIcon: LabelIcon, color, bgColor, ...other } = props;

  return (
    <RepoStyledTreeItemRoot
      label={
        <Box sx={{ justifyContent: 'left', display: 'flex', alignItems: 'center', p: 0.5, pl: 1, pr: 1, m: 0 }}>
          <LabelIcon color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1, mr: 1, ml: 0.5 }}>
            {labelText}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
}

const BranchStyledTreeItemRoot = styled(TreeItem)({
    [`& .${treeItemClasses.label}`]: {
      '&.MuiTreeItem-label': {
        fontSize: "0.7rem",
        overflow: "hidden",
      }
    }
  })

function BranchStyledTreeItem(props) {
  const { labelText, labelIcon: LabelIcon, color, bgColor, ...other } = props;
  return (
    <BranchStyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
          <LabelIcon color="inherit" />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit', flexGrow: 1, mr: 1, ml: 0.5 }}>
            {labelText.slice(0, 15)}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
}

const CommitStyledTreeItem = styled(TreeItem)({
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
  const [repoSrc, setRepoSrc] = useState([]);

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    const nodeData = JSON.parse(nodeIds);
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
      onSelectNode({ selection: nodeData, repo: repoData[nodeData.repoIndex], repoSrc });
    }
  };
  /*
    Determines which Repo list to display based on the currentAuthType
  */
  useEffect(() => {
   if (currentAuthType === "bitbucket") {
    window.repo.bbList().then((list) => {
      setListTitle('Bitbucket Repositories:');
      setRepoSrc("bb");
      setRepoData(list);
    })
  };
    if (currentAuthType === "github") {
      window.repo.ghList().then((list) => {
        setListTitle('Github Repositories:');
        setRepoSrc("gh");
        setRepoData(list);
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
        <RepoStyledTreeItem
          key={repo.name + index}
          nodeId={JSON.stringify({
            type: "repo",
            repoIndex: index,
            name: repo.name,
            ...repo,
          })}
          labelText={repo.name}
          labelIcon={RepoIcon}
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
                labelText={branch.name}
                labelIcon={RepoBranchIcon}
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
        </RepoStyledTreeItem>
      ))}
    </TreeView>
  );
}
