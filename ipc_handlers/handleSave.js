const { createCompany, updateCompany } = require("../db/company");
const { createCustomer, updateCustomer } = require("../db/customer");
const { createDocument, updateDocument } = require("../db/document");
const { createProduct, updateProduct } = require("../db/product");

function handleSaveCompany(db, company) {
    try {
        if (!company) {
            return {error: "Debes proporcionar una empresa para poder guardar."};
        }
        if (company.id === -1) {
            return {id: createCompany(db, company)};
        } else {
            return {id: updateCompany(db, company)};
        }
    } catch(Err) {
        return {error: Err.message};
    }
}

function handleSaveCustomer(db, customer) {
    try {
        if (!customer) {
            return {error: "Debes proporcionar una empresa para poder guardar."};
        }
        if (customer.id === -1) {
            return {id: createCustomer(db, customer)};
        } else {
            return {id: updateCustomer(db, customer)};
        }
    } catch(Err) {
        return {error: Err.message};
    }
}

function handleSaveDocument(db, document) {
    try {
        if (!document) {
            return {error: "Debes proporcionar una empresa para poder guardar."};
        }
        if (document.id === -1) {
            return {id: createDocument(db, document)};
        } else {
            return {id: updateDocument(db, document)};
        }
    } catch(Err) {
        return {error: Err.message};
    }
}

function handleSaveProduct(db, product) {
    try {
        if (!product) {
            return {error: "Debes proporcionar una empresa para poder guardar."};
        }
        if (product.id === -1) {
            return {id: createProduct(db, product)};
        } else {
            return {id: updateProduct(db, product)};
        }
    } catch(Err) {
        return {error: Err.message};
    }
}

exports.handleSaveCompany = handleSaveCompany;
exports.handleSaveProduct = handleSaveProduct;
exports.handleSaveCustomer = handleSaveCustomer;
exports.handleSaveDocument = handleSaveDocument;
