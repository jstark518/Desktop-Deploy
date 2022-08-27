const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("repo", {
    /**
     * List
     * @returns {Promise<Repo>}
     */
    list: () => ipcRenderer.invoke("repos.list")
});