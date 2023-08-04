const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { createCompany, getCompany } = require("./db/company");
const { getAllDocuments, getDocument, createDocument, documentIsValid, updateDocument } = require("./db/document");
const { createAddress } = require("./utils/Addressify");
const { createTablesIfNotExists } = require("./db/createTablesIfNotExists");
const { initIPCListeners } = require("./ipc_handlers/initIPCListeners");

const pathToDB = path.join(app.getPath('userData'), 'oil.db');
const db = require('better-sqlite3')(pathToDB);
createTablesIfNotExists(db);

//Manage first boot problems
if (require("electron-squirrel-startup")) app.quit();

let mainWin = null;

const tablesCreated = createTablesIfNotExists(db);

if (!tablesCreated) {
    // TODO: if not created show the problem to the user.
    app.quit();
}

function handleSaveCompanyInfo(event, args) {
    try {
        // TODO: get id from method and send it back to view
        createCompany(db, args);
        return {
            error: false,
            description: "Información guardada correctamente.",
        };
    } catch(Err) {
        return {
            error: true,
            description: "Error en el guardado. Inténtelo de nuevo más tarde.",
        };
    }

}

function getCompanyInfo(event, args) {
    return getCompany(db, 1);
}

async function handleLogoSelection(event, args) {
    const rest = await dialog
        .showOpenDialog({
            title: "Seleccione un Logo",
            properties: ["openFile"],
            filters: [{ name: "Images", extensions: ["jpg", "png"] }],
        })
        .then((result) => {
            if (result.filePaths.length === 0 || result.canceled) {
                return "";
            } else {
                return result.filePaths[0];
            }
        });

    if (rest === "") {
        return "";
    }
    const logoBase64 = fs.readFileSync(rest).toString("base64");
}

async function handleOpenWindow(event, args) {
    createWindow(args.window, args.dependencies);
}

function saveInvoice(args) {
    if (args.id !== -1) {
        try {
            createDocument(db, args);    
        } catch (Err) {
            
        }
    } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        args.creationDate = dd + "/" + mm + "/" + yyyy;
        args.id = id;
    }

    if (mainWin) {
        mainWin.webContents.send("load-invoices", loadInvoices());
    }

    return {
        id: args.id,
        error: false,
        description: "Documento guardado correctamente.",
    };
}

async function handleSaveInvoice(event, args) {
    return saveInvoice(args);
}

async function generateInvoice(event, document) {
    if (!document.id) {
        return {error: "El documento necesita un identificador para poder exportarse. Hable con un tecnico."};
    }
    if (document.id === -1) {
        createDocument(db, document);
    } else {
        updateDocument(db, document);
    }
}

function loadInvoices() {
    return getAllDocuments(db);
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1100,
        height: 700,
        webPreferences: {
            //devTools: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.menuBarVisible = false;
    win.autoHideMenuBar = false;

    //win.webContents.openDevTools();

    win.loadFile("./src/home/index.html");
    return win;
};

app.whenReady().then(() => {
    
    initIPCListeners(ipcMain, db);
    mainWin = createWindow("home-window", null);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
