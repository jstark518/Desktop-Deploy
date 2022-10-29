const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("repo", {
  bbUser: () => ipcRenderer.invoke("bbUser"),
  ghlist: () => ipcRenderer.invoke("ghrepos.list"),
  bblist: () => ipcRenderer.invoke("bbrepos.list"),
  clone: (url, node) => ipcRenderer.invoke("repo.clone", url, node),
});

contextBridge.exposeInMainWorld("termAPI", {
  ready: (e) => ipcRenderer.send("terminal.ready", e),
  send: (e) => ipcRenderer.send("terminal.keystroke", e),
  onData: (callback) => ipcRenderer.on("terminal.incomingData", callback),
});
 