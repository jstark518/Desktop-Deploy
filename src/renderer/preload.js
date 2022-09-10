const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("repo", {
    list: () => ipcRenderer.invoke("repos.list"),
    clone: (url, node) => ipcRendpcerer.invoke("repo.clone", url, node)
});
