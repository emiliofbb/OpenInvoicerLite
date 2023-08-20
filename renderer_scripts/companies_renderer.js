
let companies = [];

function main() {
    initElectronListeners();
    initListeners();
    loadCompanies();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
}

async function loadCompanies() {

    companies = await window.api.getAllCompanies();
    refreshCompanies(companies);

}

function refreshCompanies(compsToShow) {
    let i = 0, len = compsToShow.length;
    const magicalContainer = document.getElementById("magical-container");
    magicalContainer.innerHTML = "";
    if (len === 0) {
        const notRecordsFound = document.createElement("h2");
        notRecordsFound.className = "not-records-found";
        notRecordsFound.innerText = "No Records Found";
        magicalContainer.append(notRecordsFound);
        return;
    }
    const companyElemTemplate = document.getElementById("magical-company-element");
    let elm;
    let compCIFElem;
    let compNameElem;
    while (i < len) {

        elm = companyElemTemplate.cloneNode(true);
        elm.removeAttribute("hidden");
        elm.id = compsToShow[i].id;
        elm.className = "company-element";
        compCIFElem = elm.querySelector("[data-id='company-cif']");
        compCIFElem.innerText = compsToShow[i].CIF;
        compNameElem = elm.querySelector("[data-id='company-name']");
        compNameElem.innerText = compsToShow[i].name;

        elm.addEventListener("click", async (event) => {
            const error = await window.api.goTo({
                window_name: "company_form.html", 
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

function initListeners() {
    const returnBtn = document.getElementById("return-btn");
    const createBtn = document.getElementById("create-btn");
    
    returnBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({move_type: "pop"}));
    })
    createBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({window_name: "company_form.html", move_type: "push", values: {id: -1}}));
    })
}
