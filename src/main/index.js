"use strict";
const os = require("os"); // node.js module providing operating system related utility and methods
const pty = require("node-pty"); // Useful for writing the terminal emulator (using xterm.js)
const crypto = require("crypto");
import {app, BrowserWindow, ipcMain} from "electron";
import * as path from "path";
import {githubRepo} from "./api/repos/github.ts";
import {CleanOptions, simpleGit} from "simple-git";
import {bitbucketRepo} from "./api/repos/bitbucket.ts";

const fs = require("fs");
simpleGit().clean(CleanOptions.FORCE);
const { dialog, session } = require("electron");
const isDevelopment = process.env.NODE_ENV !== "production";

let githubRepoInstance = new githubRepo(),           // Create a new instance of the gitHubRepo class
    repoList = githubRepoInstance.getRepoList(),     // Returns github repo list from the githubRepo class as a promise
    resolvedRepoList = null;                         // The resolved value will be stored in this variable

// Resolves the promise
repoList.then((list) => {
  // Save resolved value in a local cache file
  githubRepoInstance.cache(list);
  resolvedRepoList = list;
});

let bitbucketRepoInstance = new bitbucketRepo(),          // Create a new instance of the bitbucket class
    bitBucketRepoList = bitbucketRepoInstance.getRepos(), // Returns the repo list as a promise from the bitbucket class
    resolvedBitBucketRepoList = null;                     // The resolved value will be stored in this variable

// Resolves the promise
bitBucketRepoList.then((list) => {
  // Save resolved value in a local cache file
  bitbucketRepoInstance.cache(list);
  resolvedBitBucketRepoList = list;
});


let ptyProcess = null;

ipcMain.on("terminal.ready", (event) => {
  if (ptyProcess == null) {
    const shellName = os.platform() === "win32" ? "powershell.exe" : "/bin/zsh";

    ptyProcess = pty.spawn(shellName, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
      encoding: "UTF-8",
    });

    ptyProcess.on("data", function (data) {
      // Filter out the weird line with just a % sign
      if (md5(data) !== "b1d4266a2330b94cd8baa1be8572bd89") {
        mainWindow.webContents.send("terminal.incomingData", data);
      }
    });
    ipcMain.on("terminal.keystroke", (event, key) => {
      ptyProcess.write(key);
    });
  } else {
    ptyProcess.write("clear; clear;\n");
  }
});

ipcMain.handle("bbUser", async (event) => {  
  // Create a new instance of the bitbucket class
  let bitbucketRepoInstance = new bitbucketRepo();
  return await bitbucketRepoInstance.getUser();
});

// Passing promise to the front-end
ipcMain.handle("repo.gh.list", (event) => repoList);
ipcMain.handle("repo.bb.list", (event) => bitBucketRepoList);

ipcMain.handle("repo.details", (event, path) => {
  return new Promise(async (resolve, reject) => {
    const git = simpleGit(path).fetch(),
        branch = await git.revparse(['--abbrev-ref', 'HEAD']),
        commit = await git.revparse(['HEAD']),
        status = await git.status(['-s', '--branch']);

    resolve(JSON.stringify({branch, commit, status, packageMgr: loadRepoPackageFile(path)}));
  });
});

// Check if repo is cloned
ipcMain.handle("repo.isCloned", async (event, url) => {
  const repo = resolvedRepoList.find((e) => e.clone === url),
  repoPath = path.join(
      app.getAppPath(),
      "/.library/repo/",
      url.replace("https://", "")
  );
  return repo.path && repo.path === repoPath && fs.existsSync(repoPath) ? repoPath : false;
});

// Value from the front-end component CommitView.js
ipcMain.handle("repo.gh.clone", async (event, url, node) => {
  let repo = resolvedRepoList.find((e) => e.clone === url),
    parsedUrl = new URL(url);

  const auth = await githubRepoInstance.getAuth(),
    repoPath = path.join(
      app.getAppPath(),
      "/.library/repo/",
      url.replace("https://", "")
    );

  parsedUrl.username = auth.username.login;
  parsedUrl.password = auth.token;

  if (repo.path && repo.path === repoPath) {
    /*
     * repo is already checked out
     */
    const git = simpleGit(repoPath);
    await git.fetch().checkout(node.commitHash || node.hash, ["-f"]);
    return loadRepoPackageFile(repoPath);
    // return repoPath;
  }

  if (repo.path && repo.path !== repoPath && fs.existsSync(repo.path)) {
    fs.rmdir(
      repo.path,
      {
        recursive: true,
      },
      (e) => e && console.log(e)
    );
  }

  if (!fs.existsSync(repoPath)) {
    await simpleGit()
      .clone(parsedUrl.toString(), repoPath)
      .checkout(node.commitHash);
  } else {
    await simpleGit(repoPath)
      .fetch()
      .checkout(node.commitHash || node.hash);
  }

  resolvedRepoList.find((e) => e.clone === url).path = repoPath;
  githubRepoInstance.cache(resolvedRepoList);
  loadRepoPackageFile(repoPath);
  return [repoPath];
});

function loadRepoPackageFile(repoPath) {
  const packageFile = path.join(repoPath, "package.json"),
      composerFile = path.join(repoPath, "composer.json"),
      output = {};

  if (fs.existsSync(packageFile)) {
    const data = fs.readFileSync(packageFile),
        packageJSON = JSON.parse(data),
        scripts = packageJSON.scripts,
        details = {
          name: packageJSON.name,
          version: packageJSON.version,
          description: packageJSON.description,
          author: packageJSON.author,
        };
    output.package = packageJSON;
  }
  if (fs.existsSync(composerFile)) {
    const data = fs.readFileSync(composerFile),
        composerJSON = JSON.parse(data),
        scripts = composerJSON.scripts,
        details = {
          name: composerJSON.name,
          description: composerJSON.description,
        };
    output.composer = composerJSON;
  }
  const packageManagers = {
    yarn:
        fs.existsSync(path.join(repoPath, "yarn.lock")) &&
        fs.statSync(path.join(repoPath, "yarn.lock")).mtime,
    npm:
        fs.existsSync(path.join(repoPath, "package-lock.json")) &&
        fs.statSync(path.join(repoPath, "package-lock.json")).mtime,
    nodeVendor: fs.existsSync(path.join(repoPath, "node_modules")),
    composer:
        fs.existsSync(path.join(repoPath, "composer.lock")) &&
        fs.statSync(path.join(repoPath, "composer.lock")).mtime,
    composerVendor: fs.existsSync(path.join(repoPath, "vendor")),
  };

  output.packageMangers = packageManagers;

  if (packageManagers.yarn && packageManagers.nodeVendor) {
    const mtime =
        fs.existsSync(path.join(repoPath, "node_modules", ".yarn-integrity")) &&
        fs.statSync(path.join(repoPath, "node_modules", ".yarn-integrity"))
            .mtime;
    output.node_modules = mtime >= packageManagers.yarn;
  }

  if (packageManagers.npm && packageManagers.nodeVendor) {
    const mtime =
        fs.existsSync(
            path.join(repoPath, "node_modules", ".package-lock.json")
        ) &&
        fs.statSync(path.join(repoPath, "node_modules", ".package-lock.json"))
            .mtime;
    output.node_modules = mtime >= packageManagers.npm;
  }

  if (
      (packageManagers.yarn || packageManagers.npm) &&
      !packageManagers.nodeVendor
  ) {
    output.node_modules = false;
  }

  if (packageManagers.composer && packageManagers.composerVendor) {
    const mtime =
        fs.existsSync(path.join(repoPath, "vendor", "autoload.php")) &&
        fs.statSync(path.join(repoPath, "vendor", "autoload.php")).mtime;
    output.vendor = mtime >= packageManagers.composer;
  }

  if (packageManagers.composer && !packageManagers.composerVendor) {
    output.vendor = false;
  }
  return output;
}

const filter = {
  urls: ["https://api.github.com/*", "https://api.bitbucket.org/*"],
};

// global reference to mainWindow (necessary to prevent window from being
// garbage collected)
let mainWindow;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(app.getAppPath(), "/src/renderer/preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  return mainWindow;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user
  // explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have
  // been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    async (details, callback) => {
      let auth = null;
      if (details.url.includes('https://api.github.com/')){
        auth = await githubRepoInstance.getAuth();
        details.requestHeaders["Authorization"] = "bearer " + auth.token;
        callback({ requestHeaders: details.requestHeaders });
      }else if (details.url.includes('https://api.bitbucket.org/')){
        auth = await bitbucketRepoInstance.auth();
        details.requestHeaders["Authorization"] = "bearer " + auth.access_token;
        callback({ requestHeaders: details.requestHeaders });
      }
    }
  );
});

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}