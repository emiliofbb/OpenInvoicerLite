const { getDocument } = require("../db/document");

function handleGetDocument(db, id) {
    try {
        return getDocument(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleGetDocument;
