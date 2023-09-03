
let documents = [];

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
    refreshDocuments(documents);

}

function refreshDocuments(docsToShow) {
    let i = 0, len = docsToShow.length;
    const magicalContainer = document.getElementById("magical-container");
    magicalContainer.innerHTML = "";
    if (len === 0) {
        const notRecordsFound = document.createElement("h2");
        notRecordsFound.className = "not-records-found";
        notRecordsFound.innerText = "No Records Found";
        magicalContainer.append(notRecordsFound);
        return;
    }
    const documentElemTemplate = document.getElementById("magical-document-element");
    let elm;
    let docNumberElem;
    let companyElem;
    let customerElem;
    let creationDateElem;
    while (i < len) {

        elm = documentElemTemplate.cloneNode(true);
        elm.removeAttribute("hidden");
        elm.id = docsToShow[i].id;
        elm.className = "document-element";
        docNumberElem = elm.querySelector("[data-id='doc-number']");
        docNumberElem.innerText = docsToShow[i].id;
        companyElem = elm.querySelector("[data-id='company-name']");
        companyElem.innerText = docsToShow[i].company_name;
        customerElem = elm.querySelector("[data-id='customer-name']");
        customerElem.innerText = docsToShow[i].customer_name;
        creationDateElem = elm.querySelector("[data-id='creation-date']");
        creationDateElem.innerText = docsToShow[i].creation_date;

        elm.addEventListener("click", async (event) => {
            const error = await window.api.goTo({
                window_name: "document_form.html", 
                move_type: "push",
                values: {
                    id: parseInt(event.currentTarget.id) 
                }
            });
            console.error(error);
        })

        magicalContainer.append(elm);

        ++i;
    }
}

async function prepareFilters() {
    const companies = await window.api.getAllCompanies();
    const customers = await window.api.getAllCustomers();
    const docTypeFilter = document.getElementById("doc-type-select");
    const companyFilter = document.getElementById("company-select");
    const customerFilter = document.getElementById("customer-select");

    let opt;
    let i = 0, len = companies.length;
    while(i < len) {
       
        opt = document.createElement("option");
        opt.setAttribute("value", companies[i].id);
        opt.innerText = companies[i].name

        companyFilter.append(opt);
        ++i;
    }
    i = 0, len = customers.length;
    while(i < len) {

        opt = document.createElement("option");
        opt.setAttribute("value", customers[i].id);
        opt.innerText = customers[i].name

        customerFilter.append(opt);

        ++i;
    }

    setUpFiltersListeners(docTypeFilter, companyFilter, customerFilter);
}

function setUpFiltersListeners(docTypeFilter, companyFilter, customerFilter) {
    
    docTypeFilter.addEventListener("change", (event) => 
        recalculateFilters()
    );
    companyFilter.addEventListener("change", (event) => 
        recalculateFilters()
    );
    customerFilter.addEventListener("change", (event) => 
        recalculateFilters()
    );
}

function filterByDocType(filterValue, docs) {
    if (!filterValue) {
        return docs;
    }
    const posValues = ["all", "presupuesto", "factura"];
    if (
        !posValues.includes(filterValue)
    ) {
        return docs;
    }
    if (filterValue !== "all") {
        return docs.filter((doc) => {
            if (doc.type === filterValue) {
                return true;
            }
            return false;
        });
    } else {
        return docs
    }
}
function filterByCompany(filterValue, docs) {
    if (!filterValue) {
        return docs;
    }
    if (filterValue !== -1) {
        return docs.filter((doc) => {
            if (doc.company_id === filterValue) {
                return true;
            }
            return false;
        });
    } else {
        return docs;
    }
}
function filterByCustomer(filterValue, docs) {
    if (!filterValue) {
        return docs;
    }
    if (filterValue !== -1) {
        return docs.filter((doc) => {
            if (doc.customer_id === filterValue) {
                return true;
            }
            return false;
        });
    } else {
        return docs;
    }
}

function recalculateFilters() {
    const docTypeFilterValue = document.getElementById("doc-type-select").value;
    const companyFilterValue = Number.parseInt(document.getElementById("company-select").value);
    const customerFilterValue = Number.parseInt(document.getElementById("customer-select").value);
    
    let docsToFilter = documents;

    docsToFilter = filterByDocType(docTypeFilterValue, docsToFilter);
    docsToFilter = filterByCompany(companyFilterValue, docsToFilter);
    docsToFilter = filterByCustomer(customerFilterValue, docsToFilter);
    
    refreshDocuments(docsToFilter);
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
