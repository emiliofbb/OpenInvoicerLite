const handleGetAllDocuments = require("./handleGetAllDocuments");
const handleGoTo = require("./handleGoTo");

function initIPCListeners(ipcMain, db, mainWin, historyStack) {
    ipcMain.handle("company-info", (event, companyId) => handleGetCompany(db, companyId));
    ipcMain.handle("save-invoice", (event, document) => handleSaveDocument(db, document));
    ipcMain.handle("all-documents", (event, args) => handleGetAllDocuments(db));
    ipcMain.handle("go-to", (event,args) => handleGoTo(mainWin, historyStack, args));
}

exports.initIPCListeners = initIPCListeners;
