
let customers = [];

function main() {
    initElectronListeners();
    initListeners();
    loadCustomers();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
}

async function loadCustomers() {

    customers = await window.api.getAllCustomers();
    refreshCustomers(customers);

}

function refreshCustomers(custsToShow) {
    let i = 0, len = custsToShow.length;
    const magicalContainer = document.getElementById("magical-container");
    magicalContainer.innerHTML = "";
    if (len === 0) {
        const notRecordsFound = document.createElement("h2");
        notRecordsFound.className = "not-records-found";
        notRecordsFound.innerText = "No Records Found";
        magicalContainer.append(notRecordsFound);
        return;
    }
    const customerElemTemplate = document.getElementById("magical-customer-element");
    let elm;
    let custNumberElem;
    let custNameElem;
    let custDirElem;
    while (i < len) {

        elm = customerElemTemplate.cloneNode(true);
        elm.removeAttribute("hidden");
        elm.id = custsToShow[i].id;
        elm.className = "customer-element";
        custNumberElem = elm.querySelector("[data-id='customer-number']");
        custNumberElem.innerText = custsToShow[i].id;
        custNameElem = elm.querySelector("[data-id='customer-name']");
        custNameElem.innerText = custsToShow[i].name;

        elm.addEventListener("click", async (event) => {
            const error = await window.api.goTo({
                window_name: "customer_form.html", 
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
        console.log(await window.api.goTo({window_name: "customer_form.html", move_type: "push", values: {id: -1}}));
    })
}
