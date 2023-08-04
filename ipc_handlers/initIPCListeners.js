const { handleGetAllDocuments } = require("./handleGetAllDocuments");

function initIPCListeners(ipcMain, db) {
    ipcMain.handle("company-info", (event, companyId) => handleGetCompany(db, companyId));
    ipcMain.handle("save-invoice", (event, document) => handleSaveDocument(db, document));
    ipcMain.handle("all-documents", (event, args) => handleGetAllDocuments(db));
}

exports.initIPCListeners = initIPCListeners;
