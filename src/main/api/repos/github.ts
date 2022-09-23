import {Endpoints} from "@octokit/types";
import * as path from "path";
import {oauthAuthorizationUrl} from "@octokit/oauth-authorization-url";
import * as http from "http";
import * as url from "url";
import {createOAuthUserAuth} from "@octokit/auth-oauth-user";
import {Branch, Commit, CommitType, Repo, repoCache, Tag} from "./contracts/repo";
import {authConfig} from "./contracts/auth";
import {OAuthAppAuthentication, OAuthAppAuthInterface} from "@octokit/auth-oauth-user/dist-types/types";
import * as ElectronStore from "electron-store";

type listUserReposResponse = Endpoints["GET /user/repos"]["response"];
type listRepoBranches = Endpoints["GET /repos/{owner}/{repo}/branches"]["response"];
type listRepoTags = Endpoints["GET /repos/{owner}/{repo}/tags"]["response"];
type listRepoCommits = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"];

const { Octokit } = require("@octokit/core");

const {app, shell} = require('electron');
const Store: ElectronStore = new ElectronStore();
const githubStoreKey = "github-oauth";
const cacheDataFile = ".cache.data.gh.json";

export class githubRepo {
    data: any = null;
    private octokitInstance?: typeof Octokit;
    private credentials?: any;
    private config?: authConfig;
    private user?: any;

    getConfig(): authConfig {
        if (this.config == null) {
            const fs = require('fs'),
                file = path.join(app.getAppPath(), '.env.json'),
                data = fs.readFileSync(file);
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

    async auth(cache = true) {
        const self = this;
        return new Promise(async (resolve, reject) => {
            const fromCache = cache ? Store.get(githubStoreKey) : null;
            if(fromCache != null) {
                console.log("Loading github oAuth from cache");
                self.credentials = fromCache;
                resolve(self.credentials);
            }
            else if (self.credentials != null) {
                resolve(self.credentials);
            } else {
                const {clientId, clientSecret, callback} = this.getConfig().github,
                oauthApp =
                    oauthAuthorizationUrl({
                        clientType: "oauth-app",
                        clientId: clientId,
                        redirectUrl: callback,
                        scopes: ["repo"]
                    }),
                server = http.createServer(async function (req, res) {
                    const queryObject = url.parse(req.url, true).query;
                    console.log(queryObject);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write('Good to go, you can close this window now.');
                    res.end();
                    if (typeof queryObject.code != "undefined") {
                        server.close();
                        self.credentials = await self.processOauth(queryObject.code as string);
                        Store.set(githubStoreKey, self.credentials);
                        resolve(self.credentials);
                    }
                }).listen(8415);
                await shell.openExternal(oauthApp.url);
            }
        });
    }

    async processOauth(code: string): Promise<OAuthAppAuthentication> {
        const {clientId, clientSecret, callback} = this.getConfig().github;
        return createOAuthUserAuth({
            clientId,
            clientSecret,
            redirectUrl: callback,
            code
        })();
    }

    private async octokit(cache = true) {
        if(this.octokitInstance == null || !cache) {
            let auth = await this.auth(cache);
            this.octokitInstance = await new Octokit({
                authStrategy: createOAuthUserAuth,
                auth
            });
            const user = await this.octokitInstance.request('GET /user');
            this.user = user.data;
        }
        return this.octokitInstance;
    }

    async getAuth() {
        const octokit = await this.octokit();
        const auth = await octokit.auth();
        return {username: this.user, token: auth.token};
    }

    async getRepoList() {
        const cache = this.getCache();
        let {lastModified, repos} = cache;
        if(!(lastModified instanceof Date)) {
            lastModified = new Date(lastModified);
        }
        const octokit = await this.octokit();
        let repoResult: listUserReposResponse = await octokit.request('GET /user/repos', {per_page: 40, since: lastModified});
        for (const repo of repoResult.data) {
            let cacheRepo = repos.find((e) => e.name == repo.name) || this.pushAndReturn(repos, {name: repo.name, branches: [], tags: [], commits: []});
            cacheRepo.branches = await this.getBranches(repo.branches_url, lastModified, cacheRepo.branches);
            cacheRepo.tags = await this.getTags(repo.tags_url, lastModified, cacheRepo.tags);
            cacheRepo.commits = await this.getCommits(repo.commits_url, lastModified, cacheRepo.commits);
            cacheRepo.url = repo.url;
            cacheRepo.clone = repo.clone_url;
            
        }
        return Promise.all(repos);
    }

    async getBranches(url: string, since: Date, cache: Branch[]): Promise<Branch[]> {
        const octokit = await this.octokit();
        let branches: listRepoBranches = await octokit.request('GET ' + url.replace('{/branch}', ''), {since: since});
        branches.data.forEach((b) => {
            let cachedBranch = cache.find((e) => e.name == b.name) || this.pushAndReturn(cache,{name: b.name}) as Branch;
            cachedBranch.commitHash = b.commit.sha;
            cachedBranch.url = b.commit.url
        });
        return cache;
    }

    async getTags(url: string, since: Date, cache: Tag[]): Promise<Tag[]> {
        const octokit = await this.octokit();
        let tags: listRepoTags = await octokit.request('GET ' + url, {since: since});
        tags.data.forEach((t) => {
            let cachedTag = cache.find((e) => e.name == t.name) || {name: t.name} as Tag;
            cachedTag.commitHash = t.commit.sha;
            cachedTag.url = t.commit.url;
        });
         return cache;
    }

    async getCommits(url: string, since: Date, cache: Commit[]): Promise<Commit[]> {
        const octokit = await this.octokit();
        let commits: listRepoCommits = await octokit.request('GET ' + url.replace("{/sha}", ""), {since: since});
        commits.data.forEach((c) => {
            let cachedCommit = cache.find((e) => e.hash == c.sha) || this.pushAndReturn(cache, {hash: c.sha}) as Commit;
            cachedCommit.message = c.commit.message;
            cachedCommit.type = CommitType.commit;
            cachedCommit.url = c.url;
            cachedCommit.date = new Date(c.commit.committer.date);
        });
        return cache;
    }

    pushAndReturn(dest: any, e: any) {
        dest.push(e);
        return e;
    }

    clone(url: string) {

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

    getNewestCommit = (list: Repo[]): Date => list.reduce((repo_carry, repo) => repo.commits.reduce((carry, commit) => commit.date > carry ? commit.date : carry, repo_carry), new Date(0));
}
