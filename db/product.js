
function productIsValid(product) {
    if (!product.id || 
        !product.name || 
        !product.price
    ) {
        return false;
    }
    return true;
}

function getAllProducts(db) {
    const stmt = db.prepare('SELECT id, name, price FROM product');
    const products = stmt.all();

    return products;
}

function getProduct(db, id) {

    if (!id) {
        throw new Error('ER20: No se puede ejecutar este comando. Contacte con su técnico.');
    }

    const stmt = db.prepare('SELECT id, name, price FROM product WHERE id=?');
    const product = stmt.get(id);

    return product;
}

function createProduct(db, product) {
    if (!productIsValid(product)) {
        throw new Error('ER01: El producto no tiene un formato adecuado.');
    }

    const stmt = db.prepare('INSERT INTO product (name, price) VALUES (?,?)');

    try {
        const info = stmt.run(product.name, product.price);
        return info.lastInsertRowid;
    } catch(Err) {
        throw new Error('ER12: Error en la creación.');
    }
}

function deleteProduct(db, id) {
    if (!id) {
        throw new Error('ER20: Debe introducir un id correcto.');
    }

    const stmt = db.prepare('DELETE FROM product WHERE id=?');

    try {
        stmt.run(id);
    } catch(Err) {
        throw new Error('ER11: Error al eliminar.');
    }
}

function updateProduct(db, product) {
    if (!productIsValid(product)) {
        throw new Error('ER01: El producto no tiene un formato adecuado.');
    }

    const stmt = db.prepare('UPDATE product SET name=?, price=? WHERE id=?');

    try {
        stmt.run(product.name, product.price, product.id);
        return {id: product.id};
    } catch (Err) {
        throw new Error('ER10: Error al actualizar los datos.')
    }

}

exports.getAllProducts = getAllProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
exports.updateProduct = updateProduct;
