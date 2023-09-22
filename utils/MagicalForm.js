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

function setMagicalTableData(tableBody, baseRow, rows, callback) {
    
    let row;
    for (row of rows) {
        createNewRowInMagicalTable(tableBody, baseRow, row, callback);
    }

}

function getMagicalTableData(magicalTable) {
    let tableData = []; 

    const rows = magicalTable.querySelectorAll('[data-type="row"]');
    let row;
    let cols;
    let col;
    let object;
    let value;
    for (row of rows) {
        if (row.id === "base-dl-row") {
            continue; 
        }
        object = {};
        cols = row.querySelectorAll('[data-id]');
        for (col of cols) {
            switch(col.getAttribute('data-type')) {
                case "integer":
                    value = parseInt(col.innerText);
                    if (col.getAttribute('data-id') === "id" && value < 0) {
                        value = -1;
                    }
                    break;
                case "float":
                    value = parseFloat(col.innerText);
                    break;
                case "string":
                    value = col.innerText;
                    break;
                case "date":
                    value = new Date(col.innerText).toISOString().substring(0,10);
                    break;
                default:
                    value = null;
                    break;
            }
            object[col.getAttribute("data-id")] = value;
        }
        tableData.push(object);
    }
    return tableData;
}

function createNewRowInMagicalTable(tableBody, baseRow, row, callback) {

    let rowElem;

    rowElem = baseRow.cloneNode(true);
    rowElem.hidden = false;
    rowElem.id = "dl-" + row.id;

    let key;
    let col;
    for (key in row) {
        col = rowElem.querySelector('[data-id="' + key + '"]');
        col.innerText = row[key];
    }

    rowElem.addEventListener("click", (_) => {
        callback(row);
    });

    tableBody.append(rowElem);

}
