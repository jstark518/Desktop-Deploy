'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import * as path from 'path'
import {githubRepo} from "./api/repos/github.ts";
import { simpleGit, CleanOptions } from 'simple-git';
import {createHash} from 'crypto';
simpleGit().clean(CleanOptions.FORCE);
const { dialog } = require('electron')

const isDevelopment = process.env.NODE_ENV !== 'production';

let githubRepoInstance = new githubRepo();
//githubRepoInstance.getRepoList() returns a promise.
const RepoList = githubRepoInstance.getRepoList();
//Pomise is resolved and cached.
RepoList.then((list) => {githubRepoInstance.cache(list);console.log(list)});
console.log(RepoList);

ipcMain.handle("repos.list", (event) => {
    return RepoList;
})

ipcMain.handle("repo.clone", async (event, url, node) => {
    const repoPath = path.join(app.getAppPath(), "/.library/repo/", url.replace("https://", ""), node.commitHash);
    console.log(repoPath, url, node);
    await simpleGit().clone(url, repoPath);
    
    return [repoPath];
});

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