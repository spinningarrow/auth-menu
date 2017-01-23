const { app, Menu, MenuItem, Tray, nativeImage, clipboard, dialog } = require('electron')
const jsSHA = require('jssha')
const storage = require('electron-json-storage')
const appIcon = require('./js/app-icon')
const KeyUtilities = require('./js/key-utilities')
const keyUtilities = new KeyUtilities(jsSHA)

function createMenu(secrets) {
	const template = []

	if (!secrets.length) {
		template.push({
			label: 'No secrets found',
			enabled: false
		})
	}

	secrets.forEach(item => {
		template.push({ label: item.display, enabled: false })
		template.push({
			label: keyUtilities.generate(item.secretKey),
			click() {
				clipboard.writeText(keyUtilities.generate(item.secretKey))
			}
		})
		template.push({ type: 'separator' })
	})

	template.push({ type: 'separator', id: 'mainSeparator' })
	template.push({
		label: 'Configure…',
		click() {
			dialog.showMessageBox({
				type: 'info',
				title: 'Configure AuthMenu',
				message: 'This feature is still being developed.',
				detail: `For the time being, please manually edit the file at\n${app.getPath('userData')}/storage/authmenu.json`
			})
		}
	})
	template.push({ label: 'Quit', click() { app.quit() } })

	return Menu.buildFromTemplate(template)
}

function createTray() {
	const tray = new Tray(appIcon)
	tray.setToolTip('AuthMenu')

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

	return tray
}

app.on('ready', createTray)
app.dock.hide()
