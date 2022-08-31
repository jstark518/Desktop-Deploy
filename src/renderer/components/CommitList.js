import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Box } from '@mui/system';
import React, { useState } from 'react'
import Repo from './Repo'

export default function CommitList(cl) {
    const [commitList, setCommitList] = useState(cl.cl); 
    const [open, setOpen] = useState(false)

    // to interact with the Commit dropdown
    const handleClick = () => {
        setOpen(!open);
    }



    // console.log("This is what CommitList Receives: ");
    // console.log(cl);
// Showing the state is just a list of commits
    // console.log("This is the state 'commitList': ");
    // console.log(commitList);

  return (
    <div>
        <List>
            <ListItemButton
                onClick={(e) =>handleClick(e, 'clicked')}
            >
                <ListItemText
                    primary='Commits'
                    sx={{
                        marginLeft: 1
                    }}
                    primaryTypographyProps={{
                        fontSize: 14
                    }} 
                >
                </ListItemText>
            </ListItemButton>
            {open &&
                commitList.map((commit, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={commit.message}
                            sx={{
                                marginLeft: 1
                            }}
                            primaryTypographyProps={{
                                fontSize: 12
                            }}
                        >
                        </ListItemText>
                    </ListItem>
                ))
            }
        </List>
    </div>
  )
}
