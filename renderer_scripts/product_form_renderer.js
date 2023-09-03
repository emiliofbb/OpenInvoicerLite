
const idInput = document.getElementById("id");

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
    const deleteBtn = document.getElementById("delete-btn");
    const saveBtn = document.getElementById("save-btn");
    
    returnBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({move_type: "pop"}));
    });

    deleteBtn.addEventListener("click", async (event) => {
        const result = await window.api.deleteProduct(parseInt(idInput.value));
        if (!result) {
            const error = await window.api.goTo({move_type: "pop"});
            console.error(error);
        } else {
            console.error(result.error);
        }
    });
}
