const { deleteDocument } = require("../db/document");

function handleDeleteDocument(db, id) {
    try {
        return deleteDocument(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleDeleteDocument;
