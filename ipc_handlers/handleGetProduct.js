const { getProduct } = require("../db/product");

function handleGetProduct(db, id) {
    try {
        return  getProduct(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleGetProduct;
