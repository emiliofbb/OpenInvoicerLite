const { getCustomer } = require("../db/customer");

function handleGetCustomer(db, id) {
    try {
        return getCustomer(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleGetCustomer;
