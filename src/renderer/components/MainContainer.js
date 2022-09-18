import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components";

import CommitView from "./CommitView";
import RepoTreeView from './RepoTreeView';

const AppHeader = styled.div`
  background: #50514F;
  width: 100%;
  font-size: 2rem;
  padding: 0.5em;
  height: 4rem;
  color: white;
  font-family: 'Roboto';
  font-weight: 200;
`;

const MainContainerStyle = styled.div`
  margin: 0;
  padding: 0;
`;

const FlexContainer = styled.div`
  display: flex;
  height: calc(100vh - 4rem);
`;

const TreeViewContainer = styled.div`
  background: #70716F;
  width: 15rem;
  height:100%;
  overflow: auto;
  padding-top: 10px;
`;

const CommitViewContainer = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-wrap: anywhere;
`;

export default function MainContainer({gitRepoAPIData}) {
  const [repoData, setRepoData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  console.log(selectedNode);

  return (
    <MainContainerStyle>
        <AppHeader>Desktop Deploy</AppHeader>
        <FlexContainer>
        <TreeViewContainer><RepoTreeView onSelectNode={setSelectedNode}/></TreeViewContainer>
        <CommitViewContainer><CommitView selectedNode={selectedNode}></CommitView></CommitViewContainer>
        </FlexContainer>
    </MainContainerStyle>
  )
}
