
function documentLineIsValid(docLine) {
    if (!docLine.id || 
        !docLine.quantity || 
        !docLine.prod_price ||
        !docLine.prod_name ||
        !docLine.document_id ||
        !docLine.iva
    ) {
        return false;
    }
    return true;
}

function getAllDocumentLinesByDocId(db, id) {
    if (!id) {
        throw new Error('ER20: Necesitas un identificador del documento.');
    }
    const stmt = db.prepare(`SELECT id, quantity, prod_name, prod_price, iva
        FROM document_line 
        WHERE document_id=?`);
    const document_lines = stmt.all(id);

    return document_lines;
}

function getDocumentLine(db, id) {
    
    if (!id) {
        throw new Error('ER20: No se puede ejecutar este comando. Contacte con su técnico.');
    }

    const stmt = db.prepare(`SELECT id, quantity, prod_name, prod_price, iva
        FROM document_line  
        WHERE id=?`);
    const document_line = stmt.get(id);

    return document_line;
}

function createDocumentLine(db, document_line) {
    if (!documentLineIsValid(document_line)) {
        throw new Error('ER01: La línea del documento no tiene un formato adecuado.');
    }

    const stmt = db.prepare(`INSERT INTO document_line
        (quantity, prod_name, prod_price, document_id, iva)
        VALUES (?,?,?,?,?)`);

    try {
        const info = stmt.run(document_line.quantity, document_line.prod_name, document_line.prod_price, document_line.document_id, document_line.iva);
        return info.lastInsertRowid;
    } catch(Err) {
        throw new Error('ER12: Error en la creación.');
    }
}

function deleteDocumentLine(db, id) {
    if (!id) {
        throw new Error('ER20: Debe introducir un id correcto.');
    }

    const stmt = db.prepare('DELETE FROM document_line WHERE id=?');

    try {
        stmt.run(id);
    } catch(Err) {
        throw new Error('ER11: Error al eliminar.');
    }
}

function updateDocumentLine(db, document_line) {
    if (!documentLineIsValid(document_line)) {
        throw new Error('ER01: La línea del documento no tiene un formato adecuado.');
    }

    const stmt = db.prepare(`UPDATE document_line
        SET quantiy=?, 
            prod_name=?,
            prod_price=?,
            document_id=?,
            iva=?
        WHERE id=?`);

    try {
        stmt.run(document_line.quantity, document_line.prod_name, document_line.prod_price, document_line.document_id, document_line.iva, document_line.id);
        return {id: document_line.id};
    } catch (Err) {
        throw new Error('ER10: Error al actualizar los datos.')
    }

}

exports.getAllDocumentLinesByDocId = getAllDocumentLinesByDocId;
exports.getDocumentLine = getDocumentLine;
exports.createDocumentLine = createDocumentLine;
exports.deleteDocumentLine = deleteDocumentLine;
exports.updateDocumentLine = updateDocumentLine;
exports.documentLineIsValid = documentLineIsValid;
