const {app, BrowserWindow, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');

function onReady () {
  win = new BrowserWindow({width: 1600, height: 1000})
  // 获取脚本（命令行）中配置的环境变量
  const buildType = process.env.BUILD_TYPE;
  if (buildType === 'develop') {
    // 加载开发时的路径
    console.log('加载开发时的路径');
    loadUrlWhenDevelop();
  } else {
    // 加载打包时的路径
    console.log('加载打包时的路径');
    loadUrlWhenPackage();
  }

  // 打开开发者工具
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

function loadUrlWhenPackage() {
  // 打包时的启动路径为angular项目ng build后的dist/下的项目文件
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'dist/line-data-record/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

function loadUrlWhenDevelop() {
  // 开发时为了保留angular热加载特性，所以启动路径指向localhost:4200
  win.loadURL('http://localhost:4200');
}

//在ready事件里
app.on('ready', async () => {
  // Ctrl + Shift + i 快捷键调起/关闭控制台
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools()
    } else {
      win.webContents.openDevTools()
    }
  })
  onReady();
})


// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    onReady()
  }
})
