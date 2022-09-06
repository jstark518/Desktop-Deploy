import React,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import RepoTreeView from './RepoTreeView';
import CommitView from "./CommitView";
import styled from "styled-components";

const AppHeader = styled.div`
  background: #d4cdd4;
  width: 100%;
  font-size: 2rem;
  padding: 0.5em;
  height: 4rem;
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
  background: #ede7ed;
  width: 15rem;
  height:100%;
  overflow: auto;
`;

const CommitViewContainer = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-wrap: anywhere;
`;


export default function MainContainer({gitRepoAPIData}) {
  const [repoData, setRepoData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
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
