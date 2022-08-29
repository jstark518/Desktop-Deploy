import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react'
import CommitList from './CommitList';
import { useState } from 'react';


export default function Repo({singleRepo}) {
  const [repo, setRepo] = useState(singleRepo);
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open)
  }
 
  return (
    <div>
          <ListItemButton component='div'
            onClick={(e) =>handleClick(e, 'clicked')}
          >
            <ListItemText 
              primary={repo.name}
              primaryTypographyProps={{
                fontWeight: 600
              }}  
            >
            </ListItemText>
          </ListItemButton>
          <CommitList cl={repo.commits}/>
          
          <List>
              {
                repo.branches.map((branch, index) => (
                  <ListItem>
                    <ListItemText
                      primary={branch}
                    ></ListItemText>
                  </ListItem>
                ))
              }
          </List>
    </div>
  )
}
