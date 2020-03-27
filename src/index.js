const { app, powerSaveBlocker, Menu, Tray } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const INACTIVE = path.join(__dirname, 'inactive.png')
const ACTIVE = path.join(__dirname, 'active.png')

let powerSaveId = undefined
let tray

const showActive = () => {
  tray.setImage(ACTIVE)
  tray.setToolTip('Sleep is not allowed')
}

const showInactive = () => {
  tray.setImage(INACTIVE)
  tray.setToolTip('Sleep is allowed')
}

const isActive = () => {
  return powerSaveId !== undefined && powerSaveBlocker.isStarted(powerSaveId)
}

const toggle = () => {
  if (isActive()) {
    powerSaveBlocker.stop(powerSaveId)
    powerSaveId = undefined
    showInactive()
  } else {
    powerSaveId = powerSaveBlocker.start('prevent-display-sleep')
    showActive()
  }
}

const contextMenu = Menu.buildFromTemplate([
  { label: 'Exit', role: 'quit' },
])

const createTrayIcon = () => {
  tray = new Tray(INACTIVE)
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', () => toggle())
  tray.on('right-click', () => tray.popUpContextMenu(contextMenu))
  showInactive()
}
app.dock.hide()
app.whenReady().then(createTrayIcon)
