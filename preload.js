const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {

    getAllDocuments: () => ipcRenderer.invoke('all-documents'),
    goTo: (command) => ipcRenderer.invoke("go-to", command),
    dataInit: (callback) => ipcRenderer.on("data-init", callback),
});
