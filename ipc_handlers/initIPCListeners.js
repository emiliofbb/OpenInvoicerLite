const handleGetAllCompanies = require("./handleGetAllCompanies");
const handleGetAllCustomers = require("./handleGetAllCustomers");
const handleGetAllDocuments = require("./handleGetAllDocuments");
const handleGetAllProducts = require("./handleGetAllProducts");
const handleGoTo = require("./handleGoTo");

function initIPCListeners(ipcMain, db, mainWin, historyStack) {
    ipcMain.handle("company-info", (event, companyId) => handleGetCompany(db, companyId));
    ipcMain.handle("save-invoice", (event, document) => handleSaveDocument(db, document));
    ipcMain.handle("all-documents", (event, args) => handleGetAllDocuments(db));
    ipcMain.handle("go-to", (event,args) => handleGoTo(mainWin, historyStack, args));
    ipcMain.handle("all-customers", (event, args) => handleGetAllCustomers(db));
    ipcMain.handle("all-companies", (event, args) => handleGetAllCompanies(db));
    ipcMain.handle("all-products", (event, args) => handleGetAllProducts(db));
}

exports.initIPCListeners = initIPCListeners;
