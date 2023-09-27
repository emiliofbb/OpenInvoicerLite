

function main() {
    initElectronListeners();
    initListeners();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
    
    window.api.dataInit((_, values) => {loadDocument(values);});
    
}

async function loadDocument(values) {

    if (!values) {
        return;
    }

    await initSelects();

    if (!values.id || values.id === -1) {
        return;
    }

    const doc = await window.api.getDocument(values.id);
    const magicalForm = document.getElementById("magical-form");
    const baseRow = document.getElementById("base-dl-row");
    const magicalTable = document.getElementById("magical-table");
    setMagicalFormData(magicalForm, doc);
    setMagicalTableData(magicalTable, baseRow, doc.document_lines, loadDataInProdInputs);
}

async function initSelects() {
    
    const customers = await window.api.getAllCustomers();
    const companies = await window.api.getAllCompanies();

    const selectCompanies = document.getElementById("company_id");
    const selectCustomers = document.getElementById("customer_id");

    let optValues;
    let opt;
    for (optValues of customers) {
        opt = document.createElement("option");
        opt.value = optValues.id;
        opt.innerText = optValues.name;
        selectCustomers.append(opt);
    }
    for (optValues of companies) {
        opt = document.createElement("option");
        opt.value = optValues.id;
        opt.innerText = optValues.name;
        selectCompanies.append(opt);
    }
}

function initListeners() {
    const returnBtn = document.getElementById("return-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const saveBtn = document.getElementById("save-btn");
    const idInput = document.getElementById("id");

    returnBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({move_type: "pop"}));
    });

    deleteBtn.addEventListener("click", async (event) => {
        const result = await window.api.deleteDocument(parseInt(idInput.value));
        if (!result) {
            const error = await window.api.goTo({move_type: "pop"});
            console.error(error);
        } else {
            console.error(result.error);
        }
    });

    saveBtn.addEventListener("click", async (event) => {
        const magicalForm = document.getElementById("magical-form");
        const magicalTable = document.getElementById("magical-table");
        const formData = getMagicalFormData(magicalForm);
        console.log(formData);
        formData.document_lines = getMagicalTableData(magicalTable);
        if (!formData.id) {
            formData.id = -1;
        }
        const result = await window.api.saveDocument(formData);
        if (result.error) {
            console.error(result.error);
        } else {
            idInput.value = result.id;
        }
    });

    initFormDocumentLinesListeners();

}

function initFormDocumentLinesListeners() {
    const deleteDLBtn = document.getElementById("remove-dl");
    const addDLBtn = document.getElementById("add-dl");
    const modifyDLBtn = document.getElementById("modify-dl");
    const baseRow = document.getElementById("base-dl-row");
    const magicalTable = document.getElementById("magical-table");

    const idDL = document.getElementById("dl-id");
    const prodName = document.getElementById("dl-prod-name");
    const prodPrice = document.getElementById("dl-price");
    const prodQuantity = document.getElementById("dl-quantity");
    const iva = document.getElementById("dl-iva");
    let newDLId = -1;

    deleteDLBtn.addEventListener("click", async (event) => {
        if (idDL.value === "not-set") {
            return;
        } else {

            const rowToDelete = document.getElementById("dl-" + idDL.value);
            rowToDelete.remove();

            idDL.value = "not-set";
            prodName.value = "";
            prodPrice.value = "";
            prodQuantity.value = "";
            iva.value = "";
        }
    });

    addDLBtn.addEventListener("click", async (event) => {

        if (!validateProduct(prodName, prodPrice, prodQuantity, iva)) {
            return;
        }

        const newDL = {};
        newDL.id = newDLId--;
        newDL.prod_name = prodName.value;
        newDL.prod_price = parseFloat(prodPrice.value);
        newDL.quantity = parseFloat(prodQuantity.value);
        newDL.iva = parseFloat(iva.value);
        createNewRowInMagicalTable(magicalTable, baseRow, newDL, loadDataInProdInputs)

        idDL.value = "not-set";
        prodName.value = "";
        prodPrice.value = "";
        prodQuantity.value = "";
        iva.value = "";
    });

    modifyDLBtn.addEventListener("click", async (event) => {
        if (idDL.value === "not-set") {
            return;
        } else {

            const rowToModify = document.getElementById("dl-" + idDL.value);

            if (!rowToModify) {
                return;
            }

            if (!validateProduct(prodName, prodPrice, prodQuantity, iva)) {
                return;
            }

            const item = {};

            item.id = idDL.value;
            item.prod_name = prodName.value;
            item.prod_price = prodPrice.value;
            item.quantity = prodQuantity.value;
            item.iva = iva.value

            modifyRowInMagicalTable(rowToModify, item);

            idDL.value = "not-set";
            prodName.value = "";
            prodPrice.value = "";
            prodQuantity.value = "";
            iva.value = "";
        }
    });
}

function validateProduct( prodName, prodPrice, prodQuantity, iva) {

    if (
        prodName.value === "" || 
        prodPrice.value === "" ||
        prodQuantity.value === "" ||
        iva.value === ""
    ) {
        return false;
    }
    if (
        Number.isNaN(parseFloat(prodQuantity.value)) ||
        Number.isNaN(parseFloat(iva.value)) ||
        Number.isNaN(parseFloat(prodPrice.value))
    ) {
        return false;
    }

    return true

}

function loadDataInProdInputs(item) {

    const idDL = document.getElementById("dl-id");
    const prodName = document.getElementById("dl-prod-name");
    const prodPrice = document.getElementById("dl-price");
    const prodQuantity = document.getElementById("dl-quantity");
    const iva = document.getElementById("dl-iva");

    const actualRow = document.getElementById("dl-" + item.id);
    if (parseInt(idDL.value) === item.id) {
        
        idDL.value = "not-set";
        prodName.value = "";
        prodPrice.value = "";
        prodQuantity.value = "";
        iva.value = "";

        return;
        // TODO: Show that row is now unselected  
    }
    if (!Number.isInteger(parseInt(idDL.value))) {
        
        idDL.value = item.id;
        prodName.value = item.prod_name;
        prodPrice.value = item.prod_price;
        prodQuantity.value = item.quantity;
        iva.value = item.iva;

        return;

        // TODO: Show that the current row is selected
    }
    if (parseInt(idDL.value) !== item.id) {
        
        idDL.value = item.id;
        prodName.value = item.prod_name;
        prodPrice.value = item.prod_price;
        prodQuantity.value = item.quantity;
        iva.value = iva;

        return;

        // TODO: Show that the current row is selected
    }
}
