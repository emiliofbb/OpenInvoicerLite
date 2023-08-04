const config = require("../config/goto.json");

function handleGoTo(mainWin, historyStack, command) {
    if (!command) {
        return {error: "Error. Es necesario un comando para desplazarse entre ventanas."};
    }
    if (!command.move_type || !config.move_types.includes(command.move_type)) {
        return {error: "Error. Tipo de movimiento inexistente o no valido."};
    }
    let modified = false;
    if (command.move_type === "pop") {
        historyStack.pop();
        modified = true;
    }
    if (command.move_type === "push" && config.window_names.includes(command.window_name)) {
        historyStack.push(command.window_name);
        modified = true;
    }
    if (!modified) {
        return { error: "Compruebe el comando de ejecucion del sistema actual. Es probable que exista algun error en el."};
    }
    mainWin.loadFile("./views/" + historyStack.first.value);
    mainWin.webContents.addListener("did-finish-load", (ev, input) => {
        mainWin.webContents.send(
            "data-init",
            command.values
        );
        mainWin.webContents.removeAllListeners("did-finish-load");
    });
}

module.exports = handleGoTo;
