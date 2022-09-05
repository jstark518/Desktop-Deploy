import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react'
import { useState } from 'react';

export default function BranchList(bl) {
  const [branchList, setBranchList] = useState(bl.bl);
  const [open, setOpen] = useState(false);

  // to interact with the Commit dropdown
  const handleClick = () => {
    setOpen(!open);
}
  return (
    <div>
        <List>
          <ListItemButton
            onClick={(e) =>handleClick(e, 'clicked')}
          >
            <ListItemText
                primary='Branches'
                sx={{
                    marginLeft: 1,
                }}
                primaryTypographyProps={{
                    fontSize: 14
                }} 
            >
            </ListItemText>
          </ListItemButton>
            {open &&
              branchList.map((branch, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={branch.name}
                    sx={{
                      marginLeft: 1
                    }}
                    primaryTypographyProps={{
                      fontSize: 12
                    }}
                  ></ListItemText>
                </ListItem>
              ))
            }
        </List>
    </div>
  )
}
