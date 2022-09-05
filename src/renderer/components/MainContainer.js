import React,{useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import RepoTreeView from './RepoTreeView';



export default function MainContainer({gitRepoAPIData}) {
  const [repoData, setRepoData] = useState([]);
  
  return (
    <div>
        <h1>GIT-GUI</h1>
        <RepoTreeView data={repoData}/>
    </div>
  )
}
