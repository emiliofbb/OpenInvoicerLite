const { deleteProduct } = require("../db/product");

function handleDeleteProduct(db, id) {
    try {
        return deleteProduct(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleDeleteProduct;
