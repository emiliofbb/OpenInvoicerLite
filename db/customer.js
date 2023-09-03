
function customerIsValid(customer) {
    if (customer.hasOwnProperty('id') &&
        customer.hasOwnProperty('name') && 
        customer.hasOwnProperty('direction') && 
        customer.hasOwnProperty('city') && 
        customer.hasOwnProperty('country')) {
        
        return true;

    }
    return false;
}

function getAllCustomers(db) {
    const stmt = db.prepare('SELECT id, name, direction, city, country FROM customer');
    const customers = stmt.all();

    return customers;
}

function getCustomer(db, id) {
    if (!id) {
        throw new Error('ER20: No se puede ejecutar este comando. Contacte con su técnico.');
    }
    const stmt = db.prepare('SELECT id, name, direction, city, country FROM customer WHERE id=?');
    const customer = stmt.get(id);

    return customer;
}

function createCustomer(db, customer) {
    if (!customerIsValid(customer)) {
        throw new Error('ER01: El cliente no es válido.');
    }

    const stmt = db.prepare('INSERT INTO customer (name, direction, city, country) VALUES (?, ?, ?, ?)');

    try {
        const info = stmt.run(customer.name, customer.direction, customer.city, customer.country);
        return info.lastInsertRowid;
    } catch(Err) {
        throw new Error('ER12: Error durante la creación.'); 
    } 
}

function deleteCustomer(db, id) {
    const stmt = db.prepare('DELETE FROM customer WHERE id=?');

    try {
        stmt.run(id);
    } catch (Err) {
        throw new Error("ER11: Error durante la eliminación.");
    }
}

function updateCustomer(db, customer) {
    if (!customerIsValid(customer)) {
        throw new Error('ER01: El cliente no es válido.');
    }

    const stmt = db.prepare('UPDATE customer SET name=?, direction=?, city=?, country=? WHERE id=?');

    try {
        const info = stmt.run(customer.name, customer.direction, customer.city, customer.country, customer.id);        
        return {id: customer.id};
    } catch (Err) {
        throw new Error('ER10: Error durante el guardado.');
    }
}

exports.getAllCustomers = getAllCustomers; 
exports.getCustomer = getCustomer;
exports.createCustomer = createCustomer;
exports.deleteCustomer = deleteCustomer;
exports.updateCustomer = updateCustomer;
