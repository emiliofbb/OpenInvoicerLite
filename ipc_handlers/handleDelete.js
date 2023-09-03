const { deleteCompany } = require("../db/company");
const { deleteCustomer } = require("../db/customer");
const { deleteDocument } = require("../db/document");
const { deleteProduct } = require("../db/product");

function handleDeleteCompany(db, id) {
    try {
        return deleteCompany(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

function handleDeleteCustomer(db, id) {
    try {
        return deleteCustomer(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

function handleDeleteDocument(db, id) {
    try {
        return deleteDocument(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

function handleDeleteProduct(db, id) {
    try {
        return deleteProduct(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

exports.handleDeleteCompany = handleDeleteCompany;
exports.handleDeleteProduct = handleDeleteProduct;
exports.handleDeleteCustomer = handleDeleteCustomer;
exports.handleDeleteDocument = handleDeleteDocument;
