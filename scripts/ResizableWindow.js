const ElectronRemote = require('@electron/remote')
const UIMinimize = document.getElementById('minimize')
const UIMaximize = document.getElementById('maximize')
const UIClose = document.getElementById('close')
const UITextMaximize = document.getElementById('ui-text-maximize')

const GetWindow = () => ElectronRemote.BrowserWindow.getFocusedWindow()

const Minimize = () => GetWindow().minimize()
const Maximize = () => {
    const GetCondition = () => GetWindow().isMaximized()
    GetCondition() ? GetWindow().unmaximize() : GetWindow().maximize()
    GetCondition() ? UITextMaximize.innerText = 'stack' : UITextMaximize.innerHTML = 'crop_square'
}
const Close = () => {
    GetWindow().close()
}
UIClose.addEventListener('click', Close)
UIMaximize.addEventListener('click', Maximize)
UIMinimize.addEventListener('click', Minimize)