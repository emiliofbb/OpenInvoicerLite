const { getAllCustomers } = require("../db/customer");

function handleGetAllCustomers(db) {
    try {
        return getAllCustomers(db);
    } catch(Err) {
        return {error: "Error al leer todos los documentos. Intentalo de nuevo mas tarde."};
    }
}

module.exports = handleGetAllCustomers;
