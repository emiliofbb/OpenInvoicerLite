const { saveLogo } = require("../db/company");
const { dialog } = require("electron");
const fs = require("fs");

async function handleLogoSelection(db, company_id) {
    const rest = await dialog
        .showOpenDialog({
            title: "Seleccione un Logo",
            properties: ["openFile"],
            filters: [{ name: "Images", extensions: ["jpg", "png"] }],
        })
        .then((result) => {
            if (result.filePaths.length === 0 || result.canceled) {
                return {error: "Seleccione un logo si lo desea."};
            } else {
                return result.filePaths[0];
            }
        })
        .catch(() => {
            return {error: "Algo ha ocurrido durante la selecion del Logo."}
        });

    if (rest.error) {
        return rest;
    }

    const logoBase64 = fs.readFileSync(rest).toString("base64");
    try {
        saveLogo(db, company_id, rest);
    } catch(err) {
        return {error: "Error en el guardado del Logo."};
    }
    return {logo: logoBase64};
}

exports.handleLogoSelection = handleLogoSelection;
