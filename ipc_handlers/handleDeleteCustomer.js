const { deleteCustomer } = require("../db/customer");

function handleDeleteCustomer(db, id) {
    try {
        return deleteCustomer(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleDeleteCustomer;
