import { Button, Card, CardContent } from '@mui/material'
import { Typography } from '@mui/material'
import React, { useState } from 'react'
import BitbucketIcon from '../renderer/components/CustomIcons/BitbucketIcon.js'
import GitHubIcon from '@mui/icons-material/GitHub';
import {useAuth} from '../renderer/components/CustomHooks/useAuth.js'
import {createBrowserRouter, RouterProvider, useNavigate, HashRouter, Routes, Route, redirect} from 'react-router-dom';


export default function LoginPage(bitbucketLogin, githubLogin) {
    const navigate = useNavigate();



    const handleBitBucketLogin = async () => {
        bitbucketLogin().then((res) => {
            setTimeout(() => {
                
            console.log(res)
            }, 5000);
        })
    }

    const handleGithubLogin = () => {
            githubLogin().then((res) => {
                console.log(res)
        })
    }

    return (
        <div>
            <Card sx={{ margin: "auto", marginTop: "20px", maxWidth: 300}}varient="outlined">
                <CardContent>
                    <Typography variant='h1' sx={{fontSize: 25, fontWeight: 'bold'}}>Sign in</Typography>
                    <Typography sx={{fontSize: 12}} color='text.secondary'>Using your Bitbucket or GitHub credentials!</Typography>
                    <Button 
                        onClick={
                            () => {
                               handleBitBucketLogin()
                            }

                        }
                        variant='contained'
                        sx={{marginTop: '20px', width: '100%', textTransform: 'none'}} 
                        endIcon={<BitbucketIcon />}
                    >
                        Sign in dd Bitbucket
                    </Button>
                    <Button 
                        onClick={
                            () => {
                                handleGithubLogin()
                            }
                        }
                        variant='contained' 
                        sx={{marginTop: '20px', width: '100%', textTransform: 'none'}} 
                        endIcon={<GitHubIcon />}
                    >
                        Sign in with GitHub
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
