function setMagicalFormData(magicalFormElement, object) {
    let key;
    let input;
    for (key in object) {
        input = magicalFormElement.querySelector("#" + key);
        if (!input) {
            continue;
        }
        if (!object[key]) {
            continue;
        }
        if (input.getAttribute("data-type") === "select") {
            input.value = object[key];
        } else if (input.getAttribute("data-type") === "boolean") {
            input.checked = object[key];
        } else {
            input.value = object[key];
        }
    } 
}

function getMagicalFormData(magicalFormElement) {
    let result = {};
    let value;

    const inputs = magicalFormElement.querySelectorAll('input');
    const selects = magicalFormElement.querySelectorAll('select');
    let input;
    for (input of inputs) {
        switch(input.getAttribute('data-type')) {
            case "integer":
                value = parseInt(input.value);
                break;
            case "float":
                value = parseFloat(input.value);
                break;
            case "string":
                value = input.value;
                break;
            case "boolean":
                value = !!input.checked;
                break;
            case "date":
                value = new Date(input.value).toISOString().substring(0,10);
                break;
            default:
                value = null;
                break;
        }
        result[input.id] = value;
    }

    for (input of selects) {
        if (!parseInt(input.value)) {
            result[input.id] = null;
        } else {
            result[input.id] = parseInt(input.value);
        }
    }

    return result;
}

function setMagicalTableData(tableBody, baseRow, rows) {
    
    let row;
    let rowElem;
    for (row of rows) {
        rowElem = baseRow.cloneNode(true);
        rowElem.hidden = false;
        rowElem.id = "dl-" + row.id;
    }

}
