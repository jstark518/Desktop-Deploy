import {baseRepo} from "./repos";
import * as path from "path";
import {oauthAuthorizationUrl} from "@octokit/oauth-authorization-url";
import * as http from "http";
import * as url from "url";
const { Octokit } = require("@octokit/core");
import {createOAuthUserAuth} from "@octokit/auth-oauth-user";

const {app, shell} = require('electron')

export class githubRepo extends baseRepo {
    data = null;
    oauthCredentials = null;
    _octokit = null;

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
            if (self.oauthCredentials != null) {
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
                    self.oauthCredentials = self.processOauth(queryObject.code)
                    resolve(self.oauthCredentials);
                }
            }).listen(8415);
            await shell.openExternal(oauthApp.url);
        });
    }

    async processOauth(code) {
        const {clientId, clientSecret, callback} = this.getConfig();
        return createOAuthUserAuth({
            clientId,
            clientSecret,
            redirectUrl: callback,
            code
        })();
    }

    async octokit() {
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
        let repos = await octokit.request('GET /user/repos');
        return repos.data;
    }
}
