const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("repo", {
  bbUser: () => ipcRenderer.invoke("bbUser"),
  ghList: () => ipcRenderer.invoke("repo.gh.list"),
  bbList: () => ipcRenderer.invoke("repo.bb.list"),
  ghClone: (url, node) => ipcRenderer.invoke("repo.gh.clone", url, node),
  isCloned: (url) =>  ipcRenderer.invoke("repo.isCloned", url),
  details: (path) => ipcRenderer.invoke("repo.details", path),
});

contextBridge.exposeInMainWorld("termAPI", {
  ready: (e) => ipcRenderer.send("terminal.ready", e),
  send: (e) => ipcRenderer.send("terminal.keystroke", e),
  onData: (callback) => ipcRenderer.on("terminal.incomingData", callback),
});
 