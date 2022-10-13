import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Container, Button, Box } from '@mui/material'
import MainView from "./MainView";
import RepoTreeView from "./RepoTreeView";
import Xterm from "./XTerm";
import { TroubleshootRounded } from "@mui/icons-material";
import TerminalIcon from '@mui/icons-material/Terminal';
import BottomViewContainer from "./BottomViewContainer";
import { useAuth } from "./CustomHooks/useAuth";

const AppHeader = styled.div`
  background: #50514f;
  width: 100%;
  font-size: 2rem;
  padding: 0.5em;
  height: 4rem;
  color: white;
  font-family: "Roboto";
  font-weight: 200;
`;

const MainContainerStyle = styled.div`
  margin: 0;
  padding: 0;
`;

const MainViewStyle = styled.div`
  padding: '10px';
`;

const FlexContainer = styled.div`
  display: flex;
  height: calc(100vh - 4rem);
  overflow: hidden;
`;

const TreeViewContainer = styled.div`
  background: #70716f;
  width: 15rem;
  height: 100%;
  overflow: auto;
  padding-top: 10px;
`;

const MainViewContainer = styled.div`
  flex: 1;
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default function MainContainer({ gitRepoAPIData }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const { authType, authed } = useAuth();
  console.log("currentAuthType: " + currentAuthType);
  console.log(selectedNode);
  console.log(authType);


  if (authed) {
    return (
    <MainContainerStyle>
      <AppHeader>Desktop Deploy</AppHeader>
      <FlexContainer>
        <TreeViewContainer>
          <RepoTreeView onSelectNode={setSelectedNode} authType={authType} />
        </TreeViewContainer>
        <MainViewContainer>
          <MainView selectedNode={selectedNode}></MainView>
          <BottomViewContainer/>
        </MainViewContainer>
      </FlexContainer>
    </MainContainerStyle>
  )};
}
