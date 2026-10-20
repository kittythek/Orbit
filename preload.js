const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('orbit', {
  info: () => ipcRenderer.invoke('sys:info'),
  live: () => ipcRenderer.invoke('sys:live'),
  open: (url) => ipcRenderer.invoke('open', url)
});
