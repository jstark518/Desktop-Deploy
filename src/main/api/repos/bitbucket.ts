import * as React from 'react';
import { useEffect, FC, ReactElement } from 'react'
import * as path from 'path';
import * as http from 'http';
import * as url from 'url';
import { authConfig } from './contracts/auth';
import { app, shell } from 'electron';


type Props = {}

// function to get config files from the app path
const getConfig = (): authConfig => {
    const fs = require('fs'),
        file = path.join(app.getAppPath(), '.env.json'),
        data = fs.readFileSync(file);
    return JSON.parse(data) as authConfig;
}


export default function Bitbucket({}: Props) {

    useEffect(() => {
        console.log("Bitbucket API Called");
        const {clientId, clientSecret, callback} = getConfig().bitbucket;
        fetch(`https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}`)
            .then(res => res.json())
            .then(json => console.log(json))
        console.log( clientId, clientSecret, callback);
    }, [])


  return 
}