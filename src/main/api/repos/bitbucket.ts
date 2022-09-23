import * as React from 'react';
import { useEffect, FC, ReactElement } from 'react'
import * as path from 'path';
import * as http from 'http';
import * as url from 'url';
import { authConfig } from './contracts/auth';
import * as ElectronStore from 'electron-store';
import {Branch, Commit, CommitType, Repo, repoCache, Tag} from "./contracts/repo";


// function to get config files from the app path
// const getConfig = (): authConfig => {
//     const fs = require('fs'),
//         file = path.join(app.getAppPath(), '.env.json'),
//         data = fs.readFileSync(file);
//     return JSON.parse(data) as authConfig;
// }


// export default function Bitbucket({}: Props) {

//     const [ token, setToken ] = React.useState<string | null>(null);

//     useEffect(() => {
//         console.log("Bitbucket API Called");
//         const {clientId, clientSecret, callback} = getConfig().bitbucket;
//         fetch(`https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}`)
//             .then(res => res.json())
//             .then(json => setToken(json.access_token))
//     }, [])


//   if(token !== null)
//     return token
// }


const {app, shell} = require('electron');
const Store: ElectronStore = new ElectronStore();
const bitbucketStoreKey = "bitbucket-oauth";
const cacheDataFile = ".cache.data.bb.json";

export class bitbucketRepo {
    data: any = null;
    private config?: authConfig;
    private token?: any;
    private user?: any;
    private cache?: repoCache;

    getConfig(): authConfig {
        if (this.config == null) {
            const fs = require('fs'),
                file = path.join(app.getAppPath(), '.env.json'),
                data = fs.readFileSync(file);
            this.config = JSON.parse(data) as authConfig;
        }
        return this.config;
    }

    async auth() {
        const self = this;
        return new Promise(async (resolve, reject) => {
            const {clientId, clientSecret, callback} = this.getConfig().bitbucket,
            server = http.createServer(async (req, res) => {
                const query = url.parse(req.url, true).query;
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<html><head><title>Bitbucket Auth</title></head><body><h1>Bitbucket Auth</h1><p>Authenticating...</p></body></html>');
                if (query.code) {
                    const code = query.code as string;
                    const token = await self.getToken(code);
                    self.token = token;
                    Store.set(bitbucketStoreKey, token);
                    resolve(token);
                }
                res.end();
            }).listen(8416);
            const authUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}`;
            await shell.openExternal(authUrl);
        });
    }

    async getToken(code: string): Promise<string> {
        const {clientId, clientSecret, callback} = this.getConfig().bitbucket;

        return new Promise((resolve, reject) => {
            const request = http.request({
                hostname: "bitbucket.org",
                path: "/site/oauth2/access_token",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
                }
            }, (response) => {
                let data = "";
                response.on("data", (chunk) => {
                    data += chunk;
                });
                response.on("end", () => {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(json.error_description);
                    } else {
                        this.token = json.access_token;
                        resolve(this.token);
                    }
                });
            });
            request.write(`grant_type=authorization_code&code=${code}&redirect_uri=${callback}`);
            request.end();
        });
    }

    async getUser(): Promise<any> {
        if (this.user == null) { 
            this.user = await fetch("https://api.bitbucket.org/2.0/user", {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            }).then(res => res.json());
        }
        return this.user;
    }

    async getAuth() {
        if (this.token == null) {
            this.token = Store.get(bitbucketStoreKey);
        }
        return this.token;
    }

    async getRepos(): Promise<Repo[]> {
        const user = await this.getUser();
        const repos = await fetch(`https://api.bitbucket.org/2.0/repositories/${user.username}`, {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }).then(res => res.json());
        return repos.values.map((repo: any) => {
            return {
                name: repo.name,
                description: repo.description,
                url: repo.links.html.href,
                branches: [],
                tags: [],
                commits: []
            } as Repo;
        });
    }

}