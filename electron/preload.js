const { contextBridge, ipcRenderer } = require('electron');

const validChannels = ['run-python-script', 'python-script-done', 'python-script-error'];

contextBridge.exposeInMainWorld(
  'electron',
  {
    send: (channel, data) => {
      // whitelist channels
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (_, ...args) => func(...args));
      }
    }
  }
);