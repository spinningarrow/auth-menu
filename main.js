const {app, Menu, MenuItem, Tray, nativeImage, clipboard, dialog} = require('electron')
const jsSHA = require('jssha')
const KeyUtilities = require('./KeyUtilities')
const keyUtilities = new KeyUtilities(jsSHA)
const storage = require('electron-json-storage')

let tray = null

function createMenu(data) {
	const template = []

	if (data.length) {
		data.forEach(item => {
			template.push({label: item.display, enabled: false})
			template.push({label: keyUtilities.generate(item.secretKey), click() {clipboard.writeText(keyUtilities.generate(item.secretKey))}})
			template.push({type: 'separator'})
		})
	} else {
		template.push({label: 'No data found', enabled: false})
	}

	template.push({type: 'separator', id: 'mainSeparator'})
	template.push({label: 'Configure…', click() { dialog.showMessageBox({type: 'info', title: 'Configure AuthMenu', message: 'This feature is still being developed.', detail: `For the time being, please manually edit the file at\n${app.getPath('userData')}/storage/authmenu.json`})}})
	template.push({label: 'Quit', click() { app.quit() }})

	return Menu.buildFromTemplate(template)
}

function createTray() {
	tray = new Tray(nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAclJREFUOBF9k89OIkEQxgdNJFzUs/smcIC4m+x7QHgGCBz2CfR9mHkLJpgAgaxe9EDgIP8Sscvv13aPaIyVfKnq6qqa6qpvTpMPOZVpH8fkSvY/4a8wEp6FKF9jk5NwU5a+DHY+GAwsTVOKUgC5EIhBYk5CNeS3cN9oNB6l006nY5IX0Ov1KJLV63Xu7oU/AhJzkzMdHubzue33e2u32yS49Xptm83GyuWya7VattvtjBjdUSR2IjNJzqvV6tN2u+Wrh+l0epDPFouFB/ZkMjnQDUVCJzznk2TNZtPG4zGBlue5rVYrWy6X3sZHETpRVnac+UuHu36/b5VK5VW2DYdD4s0554FNQe70nNcwEwZLbnLLpCUvvJe2+epxMjbdcEcMsWE7N6wCB4UwvC6VSoWOPu84igl+nwBhRt1ulwNPcD88wRHDiqVzgdxCMgYUpu3nEIcYC7KdsOK0yArGRa1We2JFkm/XGLZzICaQLTLWl/BEms1mnixhVZ5IkEnbcawYngQi/VdWQaRIx2s5H+hEOtNMnLrxVGbF+CAbMQK0R2Ju8WPQSWTYiFWFdd35cDFWmhik+Jnej0fVgoMJ3wi3gidM8KOKL78BwQGUGQf6EuIAAAAASUVORK5CYII='))
	tray.setToolTip('AuthMenu')

	let contextMenu = null
	let secrets = []

	storage.get('authmenu', (error, data) => {
		if (error) {
			dialog.showErrorBox('Error loading data', error)
			return
		}
		secrets = data
	})

	tray.on('click', _ => {
		tray.popUpContextMenu(createMenu(secrets))
	})
}

app.on('ready', createTray)
app.dock.hide()
