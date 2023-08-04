const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { createTablesIfNotExists } = require("./db/createTablesIfNotExists");
const { initIPCListeners } = require("./ipc_handlers/initIPCListeners");
const Stack = require("./utils/Stack");

const pathToDB = path.join(app.getPath('userData'), 'oil.db');
const db = require('better-sqlite3')(pathToDB);
createTablesIfNotExists(db);

const historyStack = new Stack;

//Manage first boot problems
if (require("electron-squirrel-startup")) app.quit();

let mainWin = null;

const tablesCreated = createTablesIfNotExists(db);

if (!tablesCreated) {
    // TODO: if not created show the problem to the user.
    app.quit();
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

function saveInvoice(args) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        args.creationDate = dd + "/" + mm + "/" + yyyy;
        args.id = id;
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
    historyStack.push("main.htlm");
    win.loadFile("./views/main.html");
    return win;
};

app.whenReady().then(() => {
    mainWin = createWindow("home-window", null);
    initIPCListeners(ipcMain, db, mainWin, historyStack);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
