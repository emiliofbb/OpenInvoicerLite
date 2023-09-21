
const idInput = document.getElementById("id");
const idDL = document.getElementById("dl-id");

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
    const deleteDLBtn = document.getElementById("remove-dl");
    const addDLBtn = document.getElementById("add-dl");
    const modifyDLBtn = document.getElementById("modify-dl");
    
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

    deleteDLBtn.addEventListener("click", async (event) => {
        const result = await window.api.deleteDocumentLine(parseInt(idDL.value));
        if (!result) {
            // TODO: Delete line from table
        } else {
            console.error(result.error);
        }
    });

    addDLBtn.addEventListener("click", async (event) => {
        // TODO: Add new line to table
    });

    modifyDLBtn.addEventListener("click", async (event) => {
        // TODO: Modify line in the table
    });

}

function loadDataInProdInputs(item) {

    document.getElementById();
    document.getElementById();
    document.getElementById();
    document.getElementById();

}
