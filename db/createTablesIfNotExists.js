
function createTablesIfNotExists(db) {
    const createTableCustomerStmt = db.prepare(
        `CREATE TABLE IF NOT EXISTS customer(
            id INTEGER PRIMARY KEY UNIQUE,
            name TEXT,
            direction TEXT,
            city TEXT,
            country TEXT
        )`)

    const createTableCompanyStmt = db.prepare(
        `CREATE TABLE IF NOT EXISTS company(
            id INTEGER PRIMARY KEY UNIQUE,
            name TEXT,
            CIF TEXT UNIQUE,
            email TEXT,
            telephone TEXT,
            direction TEXT,
            city TEXT,
            country TEXT,
            logo TEXT
        )`)

    const createTableDocumentStmt = db.prepare(
        `CREATE TABLE IF NOT EXISTS document(
            id INTEGER PRIMARY KEY UNIQUE,
            code TEXT,
            creation_date INTEGER,
            type TEXT NOT NULL,
            pay_limit_date INTERGER,
            customer_id INTEGER NOT NULL,
            company_id INTEGER NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES customer(id)
            FOREIGN KEY(company_id) REFERENCES company(id)
        )`)

    const createTableProductStmt = db.prepare(
        `CREATE TABLE IF NOT EXISTS product(
            id INTEGER PRIMARY KEY UNIQUE,
            price REAL,
            name TEXT,
            description TEXT
        )`)
    const createTableDocumentLineStmt = db.prepare(
        `CREATE TABLE IF NOT EXISTS document_line(
            id INTEGER PRIMARY KEY UNIQUE,
            quantity REAL NOT NULL,
            prod_name TEXT NOT NULL,
            prod_price REAL NOT NULL,
            document_id INTEGER NOT NULL,
            iva REAL NOT NULL,
            FOREIGN KEY(document_id) REFERENCES document(id) ON DELETE CASCADE
        )`)

    try {
        createTableCustomerStmt.run();
        createTableCompanyStmt.run();
        createTableDocumentStmt.run();
        //createTableProductStmt.run();
        createTableDocumentLineStmt.run();
    } catch(Error) {
        return false;
    }
    return true;
}

exports.createTablesIfNotExists = createTablesIfNotExists;
