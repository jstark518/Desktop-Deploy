'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import * as path from 'path'
import {githubRepo} from "./api/repos/github.ts";
import { simpleGit, CleanOptions } from 'simple-git';
import {createHash} from 'crypto';
const fs = require('fs');
simpleGit().clean(CleanOptions.FORCE);
const { dialog, session } = require('electron')

const isDevelopment = process.env.NODE_ENV !== 'production'
/*
githubRepoInstance is set to the return value of the github class.
githubRepoInstance.getRepoList() interacts with GitHub APU, returns a promise.
The promise is resolved (RepoList.then....) and returns data from github API.
Data is saved in cache (gitHubRepoInstance.cache) and local variable (resolvedRepoList)
*/
let githubRepoInstance = new githubRepo();
// RepoList value is a promise
let RepoList = githubRepoInstance.getRepoList(), resolvedRepoList = null;
// Resolves the promise
RepoList.then((list) => {
    /* Value of list:
        [            
            {
                name: 'g4v',
                branches: [ [Object], [Object] ],
                tags: [],
                commits: [],
                url: 'https://api.github.com/repos/jasonguo258/g4v',
                clone: 'https://github.com/jasonguo258/g4v.git'
            }
        ]
    */
    // Save resolved value in a local cache file
    githubRepoInstance.cache(list);
    // Save resolved value in a global binding
    resolvedRepoList = list;
});

// Passing promise to the front-end
ipcMain.handle("repos.list", (event) => RepoList);
// Value from the front-end component CommitView.js
ipcMain.handle("repo.clone", async (event, url, node) => {
    let repo = resolvedRepoList.find((e) => e.clone === url), parsedUrl = new URL(url);
    const auth = await githubRepoInstance.getAuth(),
        repoPath = path.join(app.getAppPath(), "/.library/repo/", url.replace("https://", ""));

    parsedUrl.username = auth.username.login;
    parsedUrl.password = auth.token;

    if(repo.path && repo.path === repoPath) {
        /*
         * repo is already checked out
         */
        const git = simpleGit(repoPath);
        console.log("Updating Repo...", node.commitHash);
        await git.fetch().checkout(node.commitHash);
        loadRepoPackageFile(repoPath);
        return repoPath;
    }

    if(repo.path && repo.path !== repoPath && fs.existsSync(repo.path)) {
        fs.rmdir(repo.path, {
            recursive: true,
        }, (e) => e && console.log(e));
    }

    if(!fs.existsSync(repoPath)) {
        await simpleGit().clone(parsedUrl.toString(), repoPath).checkout(node.commitHash);
    } else {
        await simpleGit(repoPath).fetch().checkout(node.commitHash);
    }

    resolvedRepoList.find((e) => e.clone === url).path = repoPath;
    githubRepoInstance.cache(resolvedRepoList);
    loadRepoPackageFile(repoPath);
    return [repoPath];
});

function loadRepoPackageFile(repoPath) {
    const packageFile = path.join(repoPath, 'package.json'), composerFile = path.join(repoPath, 'composer.json');
    if (fs.existsSync(packageFile)) {
        const data = fs.readFileSync(packageFile),
            packageJSON = JSON.parse(data),
            scripts = packageJSON.scripts,
            details = {
                name: packageJSON.name,
                version: packageJSON.version,
                description: packageJSON.description,
                author: packageJSON.author
            };
        console.log("Node", details);
        console.table(scripts);
    }
    if(fs.existsSync(composerFile)) {
        const data = fs.readFileSync(composerFile),
            composerJSON = JSON.parse(data),
            scripts = composerJSON.scripts,
            details = {
                name: composerJSON.name,
                description: composerJSON.description,
            };
        console.log("Composer", details);
        console.table(scripts);
    }
    const packageManagers = {
        yarn: fs.existsSync(path.join(repoPath, "yarn.lock")) && fs.statSync(path.join(repoPath, "yarn.lock")).mtime,
        npm: fs.existsSync(path.join(repoPath, "package-lock.json")) && fs.statSync(path.join(repoPath, "package-lock.json")).mtime,
        nodeVendor: fs.existsSync(path.join(repoPath, "node_modules")),
        composer: fs.existsSync(path.join(repoPath, "composer.lock")) && fs.statSync(path.join(repoPath, "composer.lock")).mtime,
        composerVendor: fs.existsSync(path.join(repoPath, "vendor"))
    };

    if(packageManagers.yarn && packageManagers.nodeVendor) {
        const mtime = fs.existsSync(path.join(repoPath, "node_modules", ".yarn-integrity")) && fs.statSync(path.join(repoPath, "node_modules", ".yarn-integrity")).mtime,
            isUpToDate = mtime >= packageManagers.yarn;
        console.log("node_modules is up to date", isUpToDate);
    }

    if(packageManagers.npm && packageManagers.nodeVendor) {
        const mtime = fs.existsSync(path.join(repoPath, "node_modules", ".package-lock.json")) && fs.statSync(path.join(repoPath, "node_modules", ".package-lock.json")).mtime,
            isUpToDate = mtime >= packageManagers.npm;
        console.log("node_modules is up to date", isUpToDate);
    }

    if((packageManagers.yarn || packageManagers.npm) && !packageManagers.nodeVendor) {
        console.log("node_modules does not exist, but should");
    }

    if(packageManagers.composer && packageManagers.composerVendor) {
        const mtime = fs.existsSync(path.join(repoPath, "vendor", "autoload.php")) && fs.statSync(path.join(repoPath, "vendor", "autoload.php")).mtime,
            isUpToDate = mtime >= packageManagers.composer;
        console.log("vendor is up to date", isUpToDate);
    }

    if(packageManagers.composer && !packageManagers.composerVendor) {
        console.log("vendor does not exist, but should");
    }

    console.log(packageManagers);
}

const filter = {
    urls: ['https://api.github.com/*']
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(app.getAppPath(), "/src/renderer/preload.js"),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    return mainWindow
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, async (details, callback) => {
        const auth = await githubRepoInstance.getAuth();
        details.requestHeaders['Authorization'] = 'bearer ' + auth.token;
        callback({requestHeaders: details.requestHeaders});
    })
})