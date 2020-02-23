import { app, BrowserWindow, globalShortcut, Menu, Tray } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import * as path from 'path';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appTray;
let iconPath = path.join(__dirname, 'logo4.ico');
const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

function registerShortcuts () {
  globalShortcut.register('Control+Shift+J', () => {mainWindow.webContents.toggleDevTools()})
  globalShortcut.register('Control+Shift+Z', () => {mainWindow.webContents.reload()})
}

function unregisterShortcuts () {
  globalShortcut.unregister('Control+Shift+J', () => {mainWindow.webContents.toggleDevTools()})
  globalShortcut.unregister('Control+Shift+Z', () => {mainWindow.webContents.reload()})
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#141517',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });

  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    registerShortcuts();
    mainWindow.on('focus', registerShortcuts);
    mainWindow.on('blur', unregisterShortcuts);
  }

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    appTray = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  appTray = new Tray(iconPath);
  appTray.setToolTip('Complexity Gambling');
  appTray.setContextMenu(Menu.buildFromTemplate([
    {
        label: 'Show App', click: function () {
            mainWindow.show();
        }
    },
    {
        label: 'Quit', click: function () {
            app.isQuiting = true;
            app.quit();
        }
    }
  ]));

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.