import * as path from 'path';
import * as http from 'http';
import * as url from 'url';
import { authConfig } from './contracts/auth';
import * as ElectronStore from 'electron-store';
import fetch from 'node-fetch';
// Implementing the interface WIP
import {Branch, Tag, Commit, CommitType, Repo, repoCache} from "./contracts/repo";


const {app, shell} = require('electron');
const Store: ElectronStore = new ElectronStore();
const bitbucketAccessToken = "bitbucket-access-token";
const cacheDataFile = ".cache.data.bb.json";



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

    getCache(): repoCache {
        const fs = require('fs'),
            file = path.join(app.getAppPath(), cacheDataFile), data = fs.readFileSync(file, {flag: "a+"});
        try {
            return JSON.parse(data) as repoCache;
        }
        catch (e) {
            return {lastModified: new Date(0), repos: []} as repoCache;
        }
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

    async getUser (): Promise<any> {
        const self = this;
        return new Promise(async (resolve, reject) => {
            const auth = await self.auth() as any;
            const user = await fetch(`https://api.bitbucket.org/2.0/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.access_token}`
                } 
            }).then(res => res.json());
            resolve(user);
        });
    }

    async getRepos(): Promise <Repo []> {
        const self = this;
        // load data from cache
        const cache = self.getCache();
        // Destructure the cache object
        let { lastModified, repos } = cache;
        if(!(lastModified instanceof Date)) {
            lastModified = new Date(lastModified);
        }
        // Get bitbucket user data, to be used in the request
        const userInfo = await self.getUser();
        // url for user repos from userInfo
        const repoUrl = userInfo.links.repositories.href;
        console.log(' Bitbucket User Info in getRepos:');
        console.log(userInfo);
        return new Promise(async (resolve, reject) => {
            // Get the AccessToken
            const auth = self.AccessToken || await self.auth();
            // Make a GET request to bitbucket API with the AccessToken and the repoUrl. Response is a list of repos
            const userRepos: any = await fetch(`${repoUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.access_token}`
                }
            }).then(res => res.json());
            console.log(' Bitbucket Repos:');
            console.log(userRepos.values);
            // Iterate through repos, if it already exists in cache, declare repoCache to it's value, if not, create and save the cache using pushAndReturn method
            for (let repo of userRepos.values) {
                let repoCache = cache.repos.find((r: any) => r.name === repo.full_name) || self.pushAndReturn(repos,{name: repo.name, branches: [], tags: [], commits: []});
                // If the repo has been modified since the last time we checked, get the branches, tags, and commits
                repoCache.branches = await this.getBranches(repo.links.branches.href, lastModified, repoCache.branches);
                repoCache.tags = await this.getTags(repo.links.tags.href, lastModified, repoCache.tags);
                repoCache.commits = await this.getCommits(repo.links.commits.href, lastModified, repoCache.commits);
            }
            resolve(repos);
        });
    }

    async getBranches(branchUrl: string, since: Date, cache: Branch[]): Promise <Branch []> {
        const self = this;
        // Get access token for request
        const auth = self.AccessToken || await self.auth();
        let repoBranches: any = await fetch(`${branchUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.access_token}`
            }
        }).then(res => res.json());
        console.log(' Bitbucket Branches:');
        console.log(repoBranches.values);
        // Iterate through the branches to save in cache
        for(let branch of repoBranches.values) {
            let branchCache = cache.find((b: any) => b.name === branch.name) || self.pushAndReturn(cache, {name: branch.name}) as Branch;
            branchCache.commitHash = branch.target.hash;
            branchCache.url = branch.links.self.href;
        };
        
        return cache;
    }

    async getTags(tagUrl: string, since: Date, cache: Tag[]): Promise <Tag []> {
        const self = this;
        const auth = self.AccessToken || await self.auth();
        let repoTags: any = await fetch(`${tagUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.access_token}`
            }
        }).then(res => res.json());
        console.log(' Bitbucket Tags:');
        console.log(repoTags.values);
        for(let tag of repoTags.values) {
            let tagCache = cache.find((t: any) => t.name === tag.name) || self.pushAndReturn(cache, {name: tag.name, date: tag.date, }) as Tag;
            tagCache.commitHash = tag.target.hash;
            tagCache.url = tag.links.html.href;
        };

        return cache;
    }

    async getCommits(commitUrl: string, since: Date, cache: Commit[]): Promise <Commit []> {
        const self = this;
        const auth = self.AccessToken || await self.auth();
        let repoCommits: any = await fetch(`${commitUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.access_token}`
            }
        }).then(res => res.json());
        console.log(' Bitbucket Commits:');
        console.log(repoCommits.values);
        for(let commit of repoCommits.values) {
            let commitCache = cache.find((c: any) => c.hash === commit.hash) || self.pushAndReturn(cache, {hash: commit.hash, date: commit.date, message: commit.message, author: commit.author.raw}) as Commit;
            commitCache.url = commit.links.html.href;
        };
        
        return cache;
    }
    


    pushAndReturn(dest: any, e: any) {
        dest.push(e);
        return e;
    }

    cache(list: Repo[]) {
        const fs = require('fs'),
           file = path.join(app.getAppPath(), cacheDataFile),
           writeToCache = {
           lastModified: this.getNewestCommit(list),
           repos: list
       }
       fs.writeFileSync(file, JSON.stringify(writeToCache));
    }

    // Initial Date is 1970-01-01, reduce iterates through every commit in each repo and returns the date of the newest commit. 
    // Once all repos are iterated through, the newest commit date is returned as the lastModified date.
    getNewestCommit = (list: Repo[]): Date => list.reduce((repo_carry, repo) => repo.commits.reduce((carry, commit) => commit.date > carry ? commit.date : carry, repo_carry), new Date(0));
}