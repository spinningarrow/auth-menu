const { app, Menu, MenuItem, Tray, nativeImage, clipboard, dialog } = require('electron')
const jsSHA = require('jssha')
const storage = require('electron-json-storage')
const appIcon = require('./js/app-icon')
const KeyUtilities = require('./js/key-utilities')
const keyUtilities = new KeyUtilities(jsSHA)

const APP_NAME = require('./package').name
const APP_STORAGE_KEY = APP_NAME.toLowerCase()
const APP_STORAGE_FILE_PATH = `${app.getPath('userData')}/storage/${APP_STORAGE_KEY}.json`

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
				title: `Configure ${APP_NAME}`,
				message: 'This feature is still being developed.',
				detail: `For the time being, please manually edit the file at\n${APP_STORAGE_FILE_PATH}`
			})
		}
	})
	template.push({ label: 'Quit', click() { app.quit() } })

	return Menu.buildFromTemplate(template)
}

function createTray() {
	const tray = new Tray(appIcon)
	tray.setToolTip(APP_NAME)

	let secrets = []
	storage.get(APP_STORAGE_KEY, (error, data) => {
		if (error) {
			dialog.showErrorBox('Error loading data', error)
			return
		}
		secrets = Array.isArray(data) ? data : []
	})

	tray.on('click', _ => {
		tray.popUpContextMenu(createMenu(secrets))
	})

	return tray
}

app.on('ready', createTray)
app.dock.hide()
