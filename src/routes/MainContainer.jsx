import React, {useState} from "react";
import MainView from '../renderer/components/MainView';
import RepoTreeView from "../renderer/components/RepoTreeView";
import BottomViewContainer from "../renderer/components/BottomViewContainer";
import {styled} from "@mui/system";

const AppHeader = styled('div')({
  background: '#50514f',
  width: '100%',
  fontSize: '2rem',
  padding: '0.5em',
  height: '4rem',
  color: 'white',
  fontFamily: "Roboto",
  fontWeight: 400
});

const MainContainerStyle = styled('div')({
  margin: 0,
  padding: 0
});

const FlexContainer = styled('div')({
  display: 'flex',
  height: 'calc(100vh - 4rem)',
  overflow: 'hidden'
});

const TreeViewContainer = styled('div')({
  background: '#E2E2E2',
  width: '15rem',
  height: '100%',
  overflow: 'auto',
  paddingTop: '10px'
});

const MainViewContainer = styled('div')({
  flex: 1,
  overflowWrap: 'anywhere',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
});


export default function MainContainer({ authed, authType, logout }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Authentication hook used as the auth layer for the app
  if (authed) {
    return (
    <MainContainerStyle>
      <AppHeader>Desktop Deploy</AppHeader>
      <FlexContainer>
        <TreeViewContainer>
          <RepoTreeView onSelectNode={setSelectedNode} currentAuthType={authType} />
        </TreeViewContainer>
        <MainViewContainer>
          <MainView selectedNode={selectedNode} authType={authType}></MainView>
          <BottomViewContainer/>
        </MainViewContainer>
      </FlexContainer>
    </MainContainerStyle>
  )};
}
