const { getAllDocuments } = require("../db/document");

function handleGetAllDocuments(db) {
    try {
        return getAllDocuments(db);
    } catch(Err) {
        return {error: "Error al leer todos los documentos. Intentalo de nuevo mas tarde."};
    }
}

module.exports = handleGetAllDocuments;
