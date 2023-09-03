
let products = [];

function main() {
    initElectronListeners();
    initListeners();
    loadProducts();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
}

async function loadProducts() {

    products = await window.api.getAllProducts();
    refreshProducts(products);

}

function refreshProducts(prodsToShow) {
    let i = 0, len = prodsToShow.length;
    const magicalContainer = document.getElementById("magical-container");
    magicalContainer.innerHTML = "";
    if (len === 0) {
        const notRecordsFound = document.createElement("h2");
        notRecordsFound.className = "not-records-found";
        notRecordsFound.innerText = "No Records Found";
        magicalContainer.append(notRecordsFound);
        return;
    }
    const productElemTemplate = document.getElementById("magical-product-element");
    let elm;
    let prodNumberElem;
    let prodNameElem;
    let prodPriceElem;
    while (i < len) {

        elm = productElemTemplate.cloneNode(true);
        elm.removeAttribute("hidden");
        elm.id = prodsToShow[i].id;
        elm.className = "product-element";
        prodNumberElem = elm.querySelector("[data-id='product-number']");
        prodNumberElem.innerText = prodsToShow[i].id;
        prodNameElem = elm.querySelector("[data-id='product-name']");
        prodNameElem.innerText = prodsToShow[i].name;
        prodPriceElem = elm.querySelector("[data-id='product-price']");
        prodPriceElem.innerText = prodsToShow[i].price;

        elm.addEventListener("click", async (event) => {
            const error = await window.api.goTo({
                window_name: "product_form.html", 
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

function initListeners() {
    const returnBtn = document.getElementById("return-btn");
    const createBtn = document.getElementById("create-btn");
    
    returnBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({move_type: "pop"}));
    })
    createBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({window_name: "product_form.html", move_type: "push", values: {id: -1}}));
    })
}
