
let documents = [];
let docsFiltered = [];

function main() {
    initElectronListeners();
    initListeners();
    loadDocuments();
    prepareFilters();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
}

async function loadDocuments() {

    documents = await window.api.getAllDocuments(); 
    docsFiltered = documents;
    refreshDocuments(documents);

}

function refreshDocuments() {
    let i = 0, len = docsFiltered.length;
    const magicalContainer = document.getElementById("magical-container");
    while (i < len) {

        magicalContainer.append(createDocumentElement(docsFiltered[i]));

        ++i;
    }
}

function createDocumentElement(doc) {
    
    

}

function prepareFilters() {
    
}

function initListeners() {
    const companiesBtn = document.getElementById("companies-btn");
    const customersBtn = document.getElementById("customers-btn");
    const productsBtn = document.getElementById("products-btn");
    const configBtn = document.getElementById("config-btn");
    
    companiesBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({window_name: "companies.html", move_type: "push"}));
    })
    customersBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({window_name: "customers.html", move_type: "push"}));
    })
    productsBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({window_name: "products.html", move_type: "push"}));
    })
    configBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({window_name: "config.html", move_type: "push"}));
    })
}
