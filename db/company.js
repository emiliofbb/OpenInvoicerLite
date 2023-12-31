
function companyIsValid(company) {
    if (!company.id || 
        !company.name || 
        !company.CIF 
    ) {
        
        return false;
    
    }
    return true;
}

function getAllCompanies(db) {
    const stmt = db.prepare('SELECT id, name, CIF, email, telephone, direction, city, country, logo FROM company');
    const companies = stmt.all();

    return companies;
}

function getCompany(db, id) {
    
    if (!id) {
        throw new Error('ER20: No se puede ejecutar este comando. Contacte con su técnico.');
    }

    const stmt = db.prepare('SELECT id, name, CIF, email, telephone, direction, city, country, logo FROM company WHERE id=?');
    const company = stmt.get(id);

    return company;
}

function createCompany(db, company) {
    if (!companyIsValid(company)) {
        throw new Error('ER01: La empresa no tiene un formato adecuado.');
    }

    const stmt = db.prepare('INSERT INTO company (name, CIF, email, telephone, direction, city, country) VALUES (?,?,?,?,?,?,?)');

    try {
        const info = stmt.run(company.name, company.CIF, company.email, company.telephone, company.direction, company.city, company.country);
        return info.lastInsertRowid;
    } catch(Err) {
        throw new Error('ER12: Error en la creación.');
    }
}

function deleteCompany(db, id) {
    if (!id) {
        throw new Error('ER20: Debe introducir un id correcto.');
    }

    const stmt = db.prepare('DELETE FROM company WHERE id=?');

    try {
        stmt.run(id);
    } catch(Err) {
        throw new Error('ER11: Error al eliminar.');
    }
}

function updateCompany(db, company) {
    if (!companyIsValid(company)) {
        throw new Error('ER01: La empresa no tiene un formato adecuado.');
    }

    const stmt = db.prepare('UPDATE company SET name=?, CIF=?, email=?, telephone=?, direction=?, city=?, country=? WHERE id=?');

    try {
        stmt.run(company.name, company.CIF, company.email, company.telephone, company.direction, company.city, company.country, company.id);
        return {id: company.id};
    } catch (Err) {
        throw new Error('ER10: Error al actualizar los datos.')
    }

}

function saveLogo(db, company_id, route) {
    if (!company_id || !route || route === "") {
        throw new Error('ER01: Id de la empresa en mal estado o ruta no selecionada.');
    }

    const stmt = db.prepare('UPDATE company SET logo=? WHERE id=?');

    try {
        stmt.run(route, company_id);
        return {id: company_id};
    } catch (Err) {
        throw new Error('ER10: Error al actualizar los datos.')
    }
}

exports.getAllCompanies = getAllCompanies;
exports.getCompany = getCompany;
exports.createCompany = createCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.saveLogo = saveLogo;
