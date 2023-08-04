const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {

    getAllDocuments: () => ipcRenderer.invoke('all-documents')
});
