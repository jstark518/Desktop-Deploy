// react component serving as the main entrance to the application, including a login page and the main page
import React from 'react';
import { useEffect } from 'react';
import {useAuth} from '../renderer/components/CustomHooks/useAuth.js';
import MainContainer from './MainContainer.jsx';
import {Card, CardContent, Typography, Button} from '@mui/material';
import BitbucketIcon from '../renderer/components/CustomIcons/BitbucketIcon.js'
import GitHubIcon from '@mui/icons-material/GitHub';
import {createBrowserRouter, RouterProvider, useNavigate, HashRouter, Routes, Route, redirect} from 'react-router-dom';

export default function MainEntrance() {
    const navigate = useNavigate();
    const {authed, authType, bitbucketLogin, githubLogin, logout} = useAuth();

    useEffect(() => {
        if (authed) {
            navigate('/main')
        } else {
            navigate('/login')
        }
    }, [authed])


    return (
        <Routes>
            <Route
                path='/login'
                element={<LoginPage bitbucketLogin={bitbucketLogin} githubLogin={githubLogin} />}    
            ></Route>

            <Route 
                path='/main'
                element={<MainContainer authed={authed} authType={authType} />}
            ></Route>
        </Routes>
    )
}

function LoginPage({bitbucketLogin, githubLogin}) {

    const handleBitBucketLogin = () => {
        console.log(bitbucketLogin)
        bitbucketLogin();
    }

    const handleGithubLogin = () => {
        console.log(githubLogin)
        githubLogin();
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
                        Sign in with Bitbucket
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