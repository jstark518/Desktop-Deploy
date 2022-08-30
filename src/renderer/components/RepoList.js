import { Divider, List } from '@mui/material';
import React from 'react'
import {useState, useEffect} from 'react'
import Repo from './Repo'

/**
 * @property {[Repo]} repoList
 * @return {JSX.Element|string}
 * @constructor
 */

export default function RepoList(gitAPIDataRepoList) {
  const [repoList, setRepoList] = useState(/**@type {Repo[]} */[]);
  console.log(repoList);
  

  useEffect(() => {
    window.repo.list().then((list) => {
      setRepoList(list);
    });
  }, [])

  return (
    <div>
        <List
          sx={{
            flexDirection: 'column',
            minWidth: 600
          }}
        >
      
          {
            repoList.map((repo, index) => (
              <Repo key={repo.name} singleRepo={repo}/>
            ))
          }
        </List>
        
    </div>
  )
}
