const {app, Menu, Tray, nativeImage, clipboard} = require('electron')
const jsSHA = require('jssha')
const secret = 'xxxxxxxxxxxxxxxx';
const KeyUtilities = require('./KeyUtilities')
const keyUtilities = new KeyUtilities(jsSHA)

let tray = null

function createTray() {
	tray = new Tray(nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAclJREFUOBF9k89OIkEQxgdNJFzUs/smcIC4m+x7QHgGCBz2CfR9mHkLJpgAgaxe9EDgIP8Sscvv13aPaIyVfKnq6qqa6qpvTpMPOZVpH8fkSvY/4a8wEp6FKF9jk5NwU5a+DHY+GAwsTVOKUgC5EIhBYk5CNeS3cN9oNB6l006nY5IX0Ov1KJLV63Xu7oU/AhJzkzMdHubzue33e2u32yS49Xptm83GyuWya7VattvtjBjdUSR2IjNJzqvV6tN2u+Wrh+l0epDPFouFB/ZkMjnQDUVCJzznk2TNZtPG4zGBlue5rVYrWy6X3sZHETpRVnac+UuHu36/b5VK5VW2DYdD4s0554FNQe70nNcwEwZLbnLLpCUvvJe2+epxMjbdcEcMsWE7N6wCB4UwvC6VSoWOPu84igl+nwBhRt1ulwNPcD88wRHDiqVzgdxCMgYUpu3nEIcYC7KdsOK0yArGRa1We2JFkm/XGLZzICaQLTLWl/BEms1mnixhVZ5IkEnbcawYngQi/VdWQaRIx2s5H+hEOtNMnLrxVGbF+CAbMQK0R2Ju8WPQSWTYiFWFdd35cDFWmhik+Jnej0fVgoMJ3wi3gidM8KOKL78BwQGUGQf6EuIAAAAASUVORK5CYII='))
	tray.setToolTip('AuthMenu')

	tray.on('click', _ => {
		const contextMenu = Menu.buildFromTemplate([
			{label: 'sahil@sahil.com', enabled: false},
			{label: keyUtilities.generate(secret), click: _ => clipboard.writeText(keyUtilities.generate(secret))}
		])
		tray.popUpContextMenu(contextMenu)
	})
}

app.on('ready', createTray)
