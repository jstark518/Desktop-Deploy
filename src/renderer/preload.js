const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("repo", {
    list: () => ipcRenderer.invoke("repos.list")
});