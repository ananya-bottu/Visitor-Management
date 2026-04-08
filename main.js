const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity:false
        }
    });

    // Correcting the file path using path.join
    const filePath = path.join(__dirname, 'frontend/views/staring_animation.html');

    // Load the file
    mainWindow.loadFile(filePath).catch(err => console.error("Failed to load:", err));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        app.whenReady().then(() => {
            mainWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: true
                }
            });

            mainWindow.loadFile(filePath).catch(err => console.error("Failed to reload:", err));
        });
    }
});