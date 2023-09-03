const { deleteCompany } = require("../db/company");

function handleDeleteCompany(db, id) {
    try {
        return deleteCompany(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleDeleteCompany;
