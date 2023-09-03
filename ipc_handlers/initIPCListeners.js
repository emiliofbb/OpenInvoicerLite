const handleGetAllCompanies = require("./handleGetAllCompanies");
const handleGetAllCustomers = require("./handleGetAllCustomers");
const handleGetAllDocuments = require("./handleGetAllDocuments");
const handleGetAllProducts = require("./handleGetAllProducts");
const handleGetProduct = require("./handleGetProduct");
const handleGetCompany = require("./handleGetCompany");
const handleGetCustomer = require("./handleGetCustomer");
const handleGetDocument = require("./handleGetDocument");
const handleGoTo = require("./handleGoTo");
const handleDeleteProduct = require("./handleDeleteProduct");
const handleDeleteCompany = require("./handleDeleteCompany");
const handleDeleteCustomer = require("./handleDeleteCustomer");
const handleDeleteDocument = require("./handleDeleteDocument");

function initIPCListeners(ipcMain, db, mainWin, historyStack) {
    ipcMain.handle("company-info", (event, companyId) => handleGetCompany(db, companyId));
    ipcMain.handle("save-invoice", (event, document) => handleSaveDocument(db, document));
    ipcMain.handle("all-documents", (event, args) => handleGetAllDocuments(db));
    ipcMain.handle("go-to", (event,args) => handleGoTo(mainWin, historyStack, args));
    ipcMain.handle("all-customers", (event, args) => handleGetAllCustomers(db));
    ipcMain.handle("all-companies", (event, args) => handleGetAllCompanies(db));
    ipcMain.handle("all-products", (event, args) => handleGetAllProducts(db));
    ipcMain.handle("get-product", (event, id) => handleGetProduct(db, id));
    ipcMain.handle("get-company", (event, id) => handleGetCompany(db, id));
    ipcMain.handle("get-customer", (event, id) => handleGetCustomer(db, id));
    ipcMain.handle("get-document", (event, id) => handleGetDocument(db, id));
    ipcMain.handle("delete-product", (event, id) => handleDeleteProduct(db, id));
    ipcMain.handle("delete-company", (event, id) => handleDeleteCompany(db, id));
    ipcMain.handle("delete-customer", (event, id) => handleDeleteCustomer(db, id));
    ipcMain.handle("delete-document", (event, id) => handleDeleteDocument(db, id));
}

exports.initIPCListeners = initIPCListeners;
