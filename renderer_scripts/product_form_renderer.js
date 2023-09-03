
function main() {
    initElectronListeners();
    initListeners();
    loadProduct();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
    
    window.api.dataInit((_, values) => {loadProduct(values);});
}

async function loadProduct(values) {

    if (!values) {
        return;
    }

    if (!values.id || values.id === -1) {
        return;
    }
    const product = await window.api.getProduct(values.id);
    const magicalForm = document.getElementById("magical-form");
    setMagicalFormData(magicalForm, product);

}

function initListeners() {
    const returnBtn = document.getElementById("return-btn");
    
    returnBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({move_type: "pop"}));
    })
}
