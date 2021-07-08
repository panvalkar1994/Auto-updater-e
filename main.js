const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
const path = require('path');


function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')
}
  
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

/**
 * Auto updater
 */
// https://github.com/panvalkar1994/Auto-updater-e/releases/download/v1.0.1/auto-updater-Setup-1.0.1.exe
const server = 'https://github.com/panvalkar1994/Auto-updater-e';
const url = `${server}/releases/download/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL({ url })

 
setInterval(() => {
  autoUpdater.checkForUpdates();
  console.log('checking...')
}, 60000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

  