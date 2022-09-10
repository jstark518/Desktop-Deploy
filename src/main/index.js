'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import * as path from 'path'
import {githubRepo} from "./api/repos/github.ts";
import { simpleGit, CleanOptions } from 'simple-git';
import {createHash} from 'crypto';
const fs = require('fs');
simpleGit().clean(CleanOptions.FORCE);
const { dialog } = require('electron')

const isDevelopment = process.env.NODE_ENV !== 'production'
/*
githubRepoInstance.getRepoList() returns a promise.
The promise is resolved (RepoList.then....) and returns data from github API
Data is saved in cache and local variable
*/
let githubRepoInstance = new githubRepo();
let RepoList = githubRepoInstance.getRepoList(), resolvedRepoList = null;
RepoList.then((list) => {
    githubRepoInstance.cache(list);
    resolvedRepoList = list;

    console.log("ResolvedRepoList:");
    console.log(list);
});

//Passing data to the front-end
ipcMain.handle("repos.list", (event) => RepoList);

ipcMain.handle("repo.clone", async (event, url, node) => {
    let repo = resolvedRepoList.find((e) => e.clone === url);

    console.log("Clone button output:")
    console.log(repo);

    const repoPath = path.join(app.getAppPath(), "/.library/repo/", url.replace("https://", ""));
    if(repo.path && repo.path === repoPath) {
        /*
         * repo is already checked out
         * TODO: Fetch remote, switch branch, etc.
         */
        console.log("Repo is already checked out");
        loadRepoPackageFile(repoPath);
        return repoPath;
    }

    if(repo.path && repo.path !== repoPath && fs.existsSync(repo.path)) {
        fs.rmdir(repo.path, {
            recursive: true,
        }, (e) => e && console.log(e));
    }

    if(!fs.existsSync(repoPath)) {
        await simpleGit().clone(url, repoPath);
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
        const mtime = fs.existsSync(path.join(repoPath, "node_modules", ".yarn-integrity")) && fs.statSync(path.join(repoPath, "node_modules", ".package-lock.json")).mtime,
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
})