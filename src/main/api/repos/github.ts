import {Endpoints} from "@octokit/types";
import * as path from "path";
import {oauthAuthorizationUrl} from "@octokit/oauth-authorization-url";
import * as http from "http";
import * as url from "url";
import {createOAuthUserAuth} from "@octokit/auth-oauth-user";
import {Branch, Commit, CommitType, Repo, Tag} from "./contracts/repo";

type listUserReposResponse = Endpoints["GET /user/repos"]["response"];
type listRepoBranches = Endpoints["GET /repos/{owner}/{repo}/branches"]["response"];
type listRepoTags = Endpoints["GET /repos/{owner}/{repo}/tags"]["response"];
type listRepoCommits = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"];

const { Octokit } = require("@octokit/core");

const {app, shell} = require('electron')

export class githubRepo {
    data: any = null;
    _octokit: any = null;
    private oauthCreditionals: any;

    getConfig() {
        if (this.oauthCreditionals == null) {
            const fs = require('fs'),
                file = path.join(app.getAppPath(), '.env.json'), data = fs.readFileSync(file);
            this.oauthCreditionals = JSON.parse(data).github;
        }
        return this.oauthCreditionals;
    }

    async auth() {
        const self = this;
        return new Promise(async (resolve, reject) => {
            // @ts-ignore
            if (self.oauthCredentials != null) {
                // @ts-ignore
                resolve(self.oauthCredentials);
            }
            const  {clientId, clientSecret, callback} = this.getConfig(),
                oauthApp =
                    oauthAuthorizationUrl({
                        clientType: "oauth-app",
                        clientId: clientId,
                        redirectUrl: callback,
                        scopes: ["repo"]
                    }),
            server = http.createServer(async function (req, res) {
                const queryObject = url.parse(req.url, true).query;
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write('Good to go, you can close this window now.');
                res.end();
                if (typeof queryObject.code != "undefined") {
                    server.close();
                    // @ts-ignore
                    self.oauthCredentials = self.processOauth(queryObject.code as string)
                    // @ts-ignore
                    resolve(self.oauthCredentials);
                }
            }).listen(8415);
            await shell.openExternal(oauthApp.url);
        });
    }

    async processOauth(code: string) {
        const {clientId, clientSecret, callback} = this.getConfig();
        return createOAuthUserAuth({
            clientId,
            clientSecret,
            redirectUrl: callback,
            code
        })();
    }

    private async octokit() {
        if(this._octokit == null) {
            let auth = await this.auth();
            this._octokit = new Octokit({
                authStrategy: createOAuthUserAuth,
                auth
            });
        }
        return this._octokit;
    }

    async getRepoList() {
        const octokit = await this.octokit();
        let repos: listUserReposResponse = await octokit.request('GET /user/repos', {per_page: 10});
        let result = repos.data.map(async (repo) => {
            return {
                branches: await this.getBranches(repo.branches_url),
                name: repo.name,
                tags: await this.getTags(repo.tags_url),
                commits: await this.getCommits(repo.commits_url),
                url: repo.url
            };
        });
        return Promise.all(result);
    }

    async getBranches(url: string): Promise<Branch[]> {
        const octokit = await this.octokit();
        let branches: listRepoBranches = await octokit.request('GET ' + url.replace('{/branch}', ''));
        return branches.data.map((b): Branch => {
            return {
                commitHash: b.commit.sha, name: b.name, url: b.commit.url
            }
        });
    }

    async getTags(url: string): Promise<Tag[]> {
        const octokit = await this.octokit();
        let tags: listRepoTags = await octokit.request('GET ' + url);
        return tags.data.map((t): Tag => {
            return {name: t.name, commitHash: "", url: t.commit.url}
        });
    }

    async getCommits(url: string): Promise<Commit[]> {
        const octokit = await this.octokit();
        let commits: listRepoCommits = await octokit.request('GET ' + url.replace("{/sha}", ""));
        return commits.data.map((c): Commit => {
            return {hash: c.sha, message: c.commit.message, type: CommitType.commit, url: c.url};
        });
    }
}
