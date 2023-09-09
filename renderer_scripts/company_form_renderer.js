
const idInput = document.getElementById("id");

function main() {
    initElectronListeners();
    initListeners();
}

window.addEventListener("load", (event) => main());

function initElectronListeners() {
    
    window.api.dataInit((_, values) => {loadCompany(values);});
    
}

async function loadCompany(values) {

    if (!values) {
        return;
    }

    if (!values.id || values.id === -1) {
        return;
    }
    const company = await window.api.getCompany(values.id);
    const magicalForm = document.getElementById("magical-form");
    setMagicalFormData(magicalForm, company);

}

function initListeners() {
    const returnBtn = document.getElementById("return-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const saveBtn = document.getElementById("save-btn");
    
    returnBtn.addEventListener("click", async (event) => {
        console.log(await window.api.goTo({move_type: "pop"}));
    });

    deleteBtn.addEventListener("click", async (event) => {
        const result = await window.api.deleteCompany(parseInt(idInput.value));
        if (!result) {
            const error = await window.api.goTo({move_type: "pop"});
            console.error(error);
        } else {
            console.error(result.error);
        }
    });

    saveBtn.addEventListener("click", async (event) => {
        const magicalForm = document.getElementById("magical-form");
        const formData = getMagicalFormData(magicalForm);
        if (!formData.id) {
            formData.id = -1;
        }
        const result = await window.api.saveCompany(formData);
        if (result.error) {
            console.error(result.error);
        } else {
            idInput.value = result.id;
        }
    });
}

