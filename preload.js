const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {

    getAllDocuments: () => ipcRenderer.invoke('all-documents'),
    goTo: (command) => ipcRenderer.invoke("go-to", command),
    dataInit: (callback) => ipcRenderer.on("data-init", callback),
    getAllCompanies: () => ipcRenderer.invoke("all-companies"),
    getAllCustomers: () => ipcRenderer.invoke("all-customers"),
    getAllProducts: () => ipcRenderer.invoke("all-products"),
    getProduct: (id) => ipcRenderer.invoke("get-product", id),
    getCompany: (id) => ipcRenderer.invoke("get-company", id),
    getCustomer: (id) => ipcRenderer.invoke("get-customer", id),
    getDocument: (id) => ipcRenderer.invoke("get-document", id),
    deleteProduct: (id) => ipcRenderer.invoke("delete-product", id),
    deleteCompany: (id) => ipcRenderer.invoke("delete-company", id),
    deleteCustomer: (id) => ipcRenderer.invoke("delete-customer", id),
    deleteDocument: (id) => ipcRenderer.invoke("delete-document", id),
    saveProduct: (product) => ipcRenderer.invoke("save-product", product),
    saveCompany: (company) => ipcRenderer.invoke("save-company", company),
    saveCustomer: (customer) => ipcRenderer.invoke("save-customer", customer),
    saveDocument: (document) => ipcRenderer.invoke("save-document", document),
    selectLogo: (id) => ipcRenderer.invoke("select-logo", id),
});
