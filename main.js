const jsSHA = require('jssha')
const secret = 'xxxxxxxxxxxxxxxx';
const electron = require('electron')
const Menu = electron.Menu
const Tray = electron.Tray
const nativeImage = electron.nativeImage
const KeyUtilities = require('./KeyUtilities')
const clipboard = electron.clipboard
// const totp = require('./totp')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
	debugger;
	keyUtilities = new KeyUtilities(jsSHA)
	keyUtilities.generate(secret)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createTray() {
	// tray = new Tray(nativeImage.createFromBuffer(Buffer.from('Î')))
	keyUtilities = new KeyUtilities(jsSHA)
	const otp = keyUtilities.generate(secret)
	tray = new Tray(nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAclJREFUOBF9k89OIkEQxgdNJFzUs/smcIC4m+x7QHgGCBz2CfR9mHkLJpgAgaxe9EDgIP8Sscvv13aPaIyVfKnq6qqa6qpvTpMPOZVpH8fkSvY/4a8wEp6FKF9jk5NwU5a+DHY+GAwsTVOKUgC5EIhBYk5CNeS3cN9oNB6l006nY5IX0Ov1KJLV63Xu7oU/AhJzkzMdHubzue33e2u32yS49Xptm83GyuWya7VattvtjBjdUSR2IjNJzqvV6tN2u+Wrh+l0epDPFouFB/ZkMjnQDUVCJzznk2TNZtPG4zGBlue5rVYrWy6X3sZHETpRVnac+UuHu36/b5VK5VW2DYdD4s0554FNQe70nNcwEwZLbnLLpCUvvJe2+epxMjbdcEcMsWE7N6wCB4UwvC6VSoWOPu84igl+nwBhRt1ulwNPcD88wRHDiqVzgdxCMgYUpu3nEIcYC7KdsOK0yArGRa1We2JFkm/XGLZzICaQLTLWl/BEms1mnixhVZ5IkEnbcawYngQi/VdWQaRIx2s5H+hEOtNMnLrxVGbF+CAbMQK0R2Ju8WPQSWTYiFWFdd35cDFWmhik+Jnej0fVgoMJ3wi3gidM8KOKL78BwQGUGQf6EuIAAAAASUVORK5CYII='))
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Item1', type: 'radio'},
		{label: 'Item1', type: 'radio', checked: true},
		{label: otp, type: 'radio'},
		{label: keyUtilities.generate(secret), type: 'radio'}
	])
	tray.setToolTip('This is my life')
	// tray.setContextMenu(contextMenu)

	console.log('tray done')

	tray.on('click', _ => {
		console.log('tray clicked', _)
		// const contextMenu = Menu.buildFromTemplate([
		// 	{label: 'Item1', type: 'radio'},
		// 	{label: 'Item1', type: 'radio', checked: true},
		// 	{label: otp, type: 'radio'}
		// ])
		// tray.setContextMenu(contextMenu)
		// contextMenu.append({label: keyUtilities.generate(secret), type: 'radio'})
		const contextMenu = Menu.buildFromTemplate([
			{label: 'sahil.bajaj@go-jek.com', enabled: false},
			{label: keyUtilities.generate(secret), click: _ => clipboard.writeText(keyUtilities.generate(secret))}
		])
		// tray.setContextMenu(contextMenu)
		tray.popUpContextMenu(contextMenu)
	})

	// createWindow()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
app.on('ready', createTray)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
