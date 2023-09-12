const { getDocument } = require("../db/document");
const { getAllDocumentLinesByDocId } = require("../db/document_line");

function handleGetDocument(db, id) {
    try {
        const doc = getDocument(db, id);
        doc.document_lines = getAllDocumentLinesByDocId(db, id);

        return doc;
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleGetDocument;
