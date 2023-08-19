const { getAllProducts } = require("../db/product");

function handleGetAllProducts(db) {
    try {
        return getAllProducts(db);
    } catch(Err) {
        return {error: "Error al leer todos los productos. Intentalo de nuevo mas tarde."};
    }
}

module.exports = handleGetAllProducts;
