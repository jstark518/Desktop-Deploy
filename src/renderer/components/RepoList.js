import { List } from '@mui/material';
import React from 'react'
import {useState} from 'react'
import exampleData from '../data';
import Repo from './Repo'

export default function RepoList() {
  const [repoList, setRepoList] = useState(exampleData);

  return (
    <div>
        <List
          sx={{
            flexDirection: 'column',
            width: '100%'
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
