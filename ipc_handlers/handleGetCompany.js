const { getCompany } = require("../db/company");
const fs = require("fs" );

function handleGetCompany(db, id) {
    try {
        const company = getCompany(db, id);
        if (company.logo || company.logo !== "") {
            try {
                const logoBase64 = fs.readFileSync(company.logo).toString("base64");
                company.logo = logoBase64;
                return company;
            } catch (er) {
                return company;
            }
        }
    } catch(Err) {
        return {error: Err.message};
    }
}

module.exports = handleGetCompany;
