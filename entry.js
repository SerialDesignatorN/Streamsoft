const Electron = require('electron');
const Application = Electron.app;
const BrowserWindow = Electron.BrowserWindow
const DesktopCapturer = Electron.desktopCapturer
const Path = require('path')
const APP_ICON = Path.join(__dirname, '/build/icons/512x512.png');

const InitializeApplication = () => {
    const UIWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        frame: false,
        icon: APP_ICON,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(UIWindow.webContents)
    UIWindow.loadFile('./ui/index.html')
    UIWindow.setMenuBarVisibility(false)
}
Application.on('ready', () => {
    InitializeApplication()
})
Application.on('quit' , () => {
    Application.quit()
})
Application.on('window-all-closed', () => {
    Application.quit()
})
try {
    require('electron-reloader')(module)
} catch (e) {
    console.log(e)
}