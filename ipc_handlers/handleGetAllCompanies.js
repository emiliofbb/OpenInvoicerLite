const { getAllCompanies } = require("../db/company");

function handleGetAllCompanies(db) {
    try {
        return  getAllCompanies(db);
    } catch(Err) {
        return {error: "Error al conseguir todas las empresas."};
    }
}

module.exports = handleGetAllCompanies;
