
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
    refreshDocuments();

}

function refreshDocuments() {
    let i = 0, len = docsFiltered.length;
    const magicalContainer = document.getElementById("magical-container");
    const documentElemTemplate = document.getElementById("magical-document-element");
    let elm;
    let docNumberElem;
    let companyElem;
    let customerElem;
    let creationDateElem;
    while (i < len) {

        elm = documentElemTemplate.cloneNode(true);
        elm.removeAttribute("hidden");
        elm.id = docsFiltered[i].id;
        elm.className = "document-element";
        docNumberElem = elm.querySelector("[data-id='doc-number']");
        docNumberElem.innerText = docsFiltered[i].id;
        companyElem = elm.querySelector("[data-id='company-name']");
        companyElem.innerText = docsFiltered[i].company_name;
        customerElem = elm.querySelector("[data-id='customer-name']");
        customerElem.innerText = docsFiltered[i].customer_name;
        creationDateElem = elm.querySelector("[data-id='creation-date']");
        creationDateElem.innerText = docsFiltered[i].creation_date;

        elm.addEventListener("click", async (event) => {
            const error = await window.api.goTo({
                window_name: "document_form.html", 
                move_type: "push",
                values: {
                    id: event.currentTarget.id 
                }
            });
            console.error(error);
        })

        magicalContainer.append(elm);

        ++i;
    }
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
