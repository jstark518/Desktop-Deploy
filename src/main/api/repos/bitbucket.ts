import * as path from 'path';
import * as http from 'http';
import * as url from 'url';
import { authConfig, bitBucketCredentials } from './contracts/auth';
import * as ElectronStore from 'electron-store';
import fetch from 'node-fetch';
// Implementing the interface WIP
import {Branch, Commit, CommitType, Repo, repoCache} from "./contracts/repo";


const {app, shell} = require('electron');
const Store: ElectronStore = new ElectronStore();
const bitbucketAccessToken = "bitbucket-access-token";


export class bitbucketRepo {
    data: any = null;
    private config?: authConfig;
    private AccessToken?: any;
    private oAuthCode?: string = null;

    getConfig(): authConfig {
        if (this.config == null) {
            // Load fs module, used to read the config file (.env.json)
            const fs = require('fs'),
                // Get the path to the config file
                file = path.join(app.getAppPath(), '.env.json'),
                // Read the config file
                data = fs.readFileSync(file);
            // Parse the config file, this.config is now an object containing the config credentials
            this.config = JSON.parse(data) as authConfig;
        }
        return this.config;
    }

   async auth() {
        const self = this;
        return new Promise(async (resolve, reject) => {
            const fromCache: any = Store.get(bitbucketAccessToken) ? Store.get(bitbucketAccessToken) : null;
            // Check if we have an AccessToken in Electron Store
            if(fromCache != null) {
                // Check if the AccessToken is expired
                if (fromCache.expires_in < Date.now()) {
                    // Refresh the AccessToken
                    console.log(" Reloading bitbucket oAuth from cache...");
                    const token = await self.refreshAccessToken(fromCache.refresh_token);
                    self.AccessToken = token;
                    resolve(token);
                    console.log(" bitbucket Access Token:");
                    console.log(token);
                    resolve(token);
                }
            }
            // Return AccessToken if we have one in class in case we are in the middle of the auth process
            else if (self.AccessToken != null) {
                resolve(self.AccessToken);
            // Otherwise, we need to get a oAuthCode from bitbucket API
            } else {
                // Get the config credentials
                const { clientId } = self.getConfig().bitbucket,
                // Initial oAuth URL to get the code from the callback. Using the clientId from the config file
                authUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code`,
                // Create a new local server to listen for the callback from bitbucket
                server = http.createServer(async (req, res) => {
                    // Get the query object from the callback URL.
                    const query = url.parse(req.url || '', true).query;
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.write('Bitbucket oAuth successful! You can close this window.');
                    res.end();
                    // If the query has a code property, we have the code from bitbucket
                    if (typeof query.code !== 'undefined') {
                        // Server is no longer needed, close it
                        server.close();
                        // Get the code from query
                        self.oAuthCode = query.code as string;
                        // Get the AccessToken by passing the code to the getAccessToken method
                        self.AccessToken = await self.getAccessToken(self.oAuthCode);
                        // Save the AccessToken in Electron Store
                        Store.set(bitbucketAccessToken, self.AccessToken);
                        // Resolve the promise with the AccessToken, for use in other methods
                        resolve (self.AccessToken);
                    }
                }).listen(8416);
                // Open the authUrl in the default browser to make the request to bitbucket. Our local server will listen for the callback
                await shell.openExternal(authUrl);
            }
        });
    }
    // Get the AccessToken from bitbucket API
    async getAccessToken(code: string): Promise<any> {
        const self = this;
        const { clientId, clientSecret } = self.getConfig().bitbucket;
        // Make a POST request to bitbucket API with the code and credentials
        return new Promise(async (resolve, reject) => {
            const token = await fetch(`https://bitbucket.org/site/oauth2/access_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}`
            // Parse the response as JSON
            }).then(res => res.json());
            resolve(token);
        });
    }

    async refreshAccessToken(rToken?: string): Promise<any> {
        const self = this;
        const { clientId, clientSecret } = self.getConfig().bitbucket;
        // Make a POST request to bitbucket API with the code and credentials
        return new Promise(async (resolve, reject) => {
            const token = await fetch(`https://bitbucket.org/site/oauth2/access_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=refresh_token&refresh_token=${rToken}&client_id=${clientId}&client_secret=${clientSecret}`
            // Parse the response as JSON
            }).then(res => res.json())
            .catch(err => {
                console.log(err);
            });
            Store.set(bitbucketAccessToken, token);
            resolve(token);
        });
    }

    async getRepos(): Promise <any> {
        const self = this;
        return new Promise(async (resolve, reject) => {
            // Get the AccessToken
            const auth = self.AccessToken || await self.auth();
            // Make a GET request to bitbucket API with the AccessToken
            const repos = await fetch(`https://api.bitbucket.org/2.0/repositories`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.access_token}`
                }
            // Parse the response as JSON
            }).then(res => {
                resolve(res.json());
            }).catch(async (err) => {
                if (err.status === 401) {
                    console.log("Unable to get repos");
                }
            });    
        });
    }
}