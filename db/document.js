const { documentLineIsValid, getAllDLIdsByDocId} = require("./document_line");

function documentIsValid(document) {
    if (!typeIsValid(document.type) || 
        !document.id || 
        !document.customer_id || 
        !document.company_id) {
        return false;
    }

    return true;
}

function typeIsValid(type) {
    const validTypes = ['factura', 'presupuesto'];

    if (!type) {
        return false;
    }
    if (validTypes.includes(type)) {
        return true;
    }
    return false;
}

function getAllDocuments(db) {
    const stmt = db.prepare(`SELECT document.id as id, document.creation_date as creation_date, 
        document.pay_limit_date as pay_limit_date, document.type as type,
        customer.name as customer_name, company.name as company_name, 
        customer.id as customer_id, company.id as company_id
        FROM document
        INNER JOIN customer ON customer.id = document.customer_id
        INNER JOIN company  ON company.id = document.company_id`);

    const documents = stmt.all();
    return documents;
}

function getAllDocumentsByType(db, type) {
    if (!typeIsValid(type)) {
        throw new Error('ER20: Tipo de documento no especificado.');
    }

    const stmt = db.prepare(`SELECT document.id, document.creation_date, 
        document.pay_limit_date, document.type, customer.name, company.name 
        FROM document
        INNER JOIN customer ON customer.id = document.customer_id 
        INNER JOIN company  ON company.id = document.company_id
        WHERE document.type=?`);

    const documents = stmt.all(type);
    return documents;
}

function getDocument(db, id) {
    if (!id) {
        throw new Error('ER20: Identificador del documento no especificado.');
    }

    const stmt = db.prepare(`SELECT document.id, document.creation_date, 
        document.pay_limit_date, document.type, document.company_id, document.customer_id
        FROM document
        WHERE document.id=?`);

    const document = stmt.get(id);
    return document;
}

function createDocument(db, document) {
    if (!documentIsValid(document)) {
        throw new Error('ER01: El documento no es correcto. Revise los datos.')
    }
    const stmt = db.prepare(`INSERT INTO document
        (creation_date, pay_limit_date, type, customer_id, company_id)
        VALUES(?,?,?,?,?)`);

    try {
        const info = stmt.run(document.creation_date, document.pay_limit_date, document.type, document.customer_id, document.company_id);
        return info.lastInsertRowid;
    } catch(Err) {
        throw new Error('ER12: Error al insertar. Compruebe los datos o reporte el bug.')
    }
}

function deleteDocument(db, id) {
    if (!id) {
        throw new Error('ER20: Identificador no introducido. Revise los datos.')
    }
    
    const stmt = db.prepare('DELETE FROM document WHERE id=?');

    try {
        stmt.run(id);
    } catch (Err) {
        throw new Error('ER11: Error en el borrado del documento.');
    }
}

function updateDocument(db, document) {
    if (!documentIsValid(document)) {
        throw new Error('ER01: El documento no es correcto. Revise los datos.')
    }

    const stmt = db.prepare(`UPDATE document
        SET pay_limit_date=?,
            type=?,
            customer_id=?,
            company_id=?
        WHERE id=?`);

    try {
        stmt.run(document.pay_limit_date, document.type, document.customer_id, document.company_id, document.id);
        return {id: document.id};
    } catch (Err) {
        throw new Error('ER10: Error en el guardado del documento.')
    }
}

function saveDocument(db, document) {
    if (!documentIsValid(document)) {
        throw new Error('ER01: El documento no es correcto. Revise los datos.')
    }

    const insertDocumentLine = db.prepare(`INSERT INTO document_line
        (quantity, prod_name, prod_price, document_id, iva)
        VALUES (?,?,?,?,?)`);

    const updateDocumentLine = db.prepare(`UPDATE document_line
        SET quantiy=?, 
            prod_name=?,
            prod_price=?,
            document_id=?,
            iva=?
        WHERE id=?`);

    const deleteDocumentLine = db.prepare(`DELETE FROM document_line WHERE id=?`);

    if (document.id === -1) {

        const insertDocument = db.prepare(`INSERT INTO document
            (creation_date, pay_limit_date, type, customer_id, company_id)
            VALUES(?,?,?,?,?)`);

        const saveDoc = db.transaction((d) => {
            let docId = null;
            try {
                const info = insertDocument.run(d.creation_date, d.pay_limit_date, d.type, d.customer_id, d.company_id);
                docId = info.lastInsertRowid;
            } catch (Err) {
                throw new Error("ER10: Error en el guardado del documento.");
            }
            let dl;
            for (dl of document.document_lines) {
                if (!documentLineIsValid(dl)) {
                    throw new Error("Error líneas del documento no válidas.");
                }
                try {
                    if (dl.id === -1) {
                        insertDocumentLine.run(dl.quantity, dl.prod_name, dl.prod_price, docId, dl.iva);
                    } else {
                        updateDocumentLine.run(dl.quantity, dl.prod_name, dl.prod_price, docId, dl.iva, dl.id);
                    }
                } catch (Err) {
                    throw new Error("Error no se pudo guardar el documento debido a errores en el guardado de las líneas del documento.");
                }
            }
        });
        saveDoc(document);
    } else {
        const actualDLs = getAllDLIdsByDocId(db, document.id);
        const dlsToDelete = [];
        let dlVar;
        for (dlVar of document.document_lines) {
            if (!actualDLs.includes(dlVar.id) && dlVar.id > 0) {
                dlsToDelete.push(dlVar.id);
            }
        }

        const saveDoc = db.transaction((d) => {
            try {
                const updateDocument = db.prepare(`UPDATE document
                    SET 
                    creation_date=?,
                    pay_limit_date=?,
                    type=?,
                    customer_id=?,
                    company_id=?
                    WHERE id=?`);
                updateDocument.run(d.creation_date, d.pay_limit_date, d.type, d.customer_id, d.company_id, d.id);
            } catch (Err) {
                throw new Error("ER10: Error en el guardado del documento.");
            }
            let dl;
            for (dl of dlsToDelete) {
                deleteDocumentLine.run(dl);
            }
            for (dl of document.document_lines) {
                if (!dl.id || !dl.quantity || !dl.product_id || !d.id) {
                    throw new Error("Error líneas del documento no válidas.");
                }
                try {
                    if (dl.id === -1) {
                        insertDocumentLine.run(dl.quantity, dl.prod_name, dl.prod_price, docId, dl.iva);
                    } else {
                        updateDocumentLine.run(dl.quantity, dl.prod_name, dl.prod_price, docId, dl.iva, dl.id);
                    }
                } catch (Err) {
                    throw new Error("Error no se pudo guardar el documento debido a errores en el guardado de las líneas del documento.");
                }
            }
        });
        saveDoc(document);
    }
}

exports.getAllDocuments = getAllDocuments;
exports.getAllDocumentsByType = getAllDocumentsByType;
exports.getDocument = getDocument;
exports.createDocument = createDocument;
exports.deleteDocument = deleteDocument;
exports.updateDocument = updateDocument;
exports.documentIsValid = documentIsValid;
exports.saveDocument = saveDocument;
