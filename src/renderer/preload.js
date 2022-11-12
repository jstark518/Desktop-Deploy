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
  getInstance: async (cwd, onData) => {
    const inst = await ipcRenderer.invoke("terminal.getInstance", cwd);
    ipcRenderer.on(inst, onData);
    return (data) => ipcRenderer.send(inst, data);
  }
});
 