import { Button, Card, CardContent } from '@mui/material'
import { Typography } from '@mui/material'
import React from 'react'
import BitbucketIcon from '../renderer/components/CustomIcons/BitbucketIcon.js'
import GitHubIcon from '@mui/icons-material/GitHub';

export default function LoginPage() {
  return (
    <div>
        <Card sx={{ margin: "auto", marginTop: "20px", maxWidth: 300}}varient="outlined">
            <CardContent>
                <Typography variant='h1' sx={{fontSize: 25, fontWeight: 'bold'}}>Sign in</Typography>
                <Typography sx={{fontSize: 12}} color='text.secondary'>Using your Bitbucket or GitHub credentials!</Typography>
                <Button variant='contained' sx={{marginTop: '20px', width: '100%', textTransform: 'none'}} endIcon={<BitbucketIcon />}>Sign in with Bitbucket</Button>
                <Button variant='contained' sx={{marginTop: '20px', width: '100%', textTransform: 'none'}} endIcon={<GitHubIcon />}>Sign in with GitHub</Button>
            </CardContent>
        </Card>
    </div>
  )
}
