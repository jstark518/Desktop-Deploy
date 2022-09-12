const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("repo", {
    list: () => ipcRenderer.invoke("repos.list"),
    clone: (url, node) => ipcRenderer.invoke("repo.clone", url, node)
});
/*
node:  
*/