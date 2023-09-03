const { getCompany } = require("../db/company");

function handleGetCompany(db, id) {
    try {
        return getCompany(db, id);
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleGetCompany;
