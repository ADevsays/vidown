import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../build', 'icon', '2.jpeg'),
    title: 'ViDown',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
    }
  });

  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('ViDown - Adevsays');
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('run-python-script', async (_, videoData) => {
  const outPath = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (outPath.canceled || outPath.filePaths.length === 0) {
    console.error("The users canceled the file directory", outPath);
    mainWindow.webContents.send('python-script-done', false);
    throw new Error();
  }
  const parseData = JSON.stringify(videoData);
  const pyPath = path.join(process.resourcesPath, 'downloader_youtube.py');
  const pythonScript = spawn('python', [pyPath, parseData, outPath.filePaths[0]]);

  pythonScript.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonScript.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    const errorString = Buffer.from(data).toString();
    mainWindow.webContents.send('python-script-done', false);
    mainWindow.webContents.send('python-script-error', errorString);
  });

  pythonScript.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    mainWindow.webContents.send('python-script-done', true);

  });
})

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
