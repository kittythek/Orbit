const { app, BrowserWindow, ipcMain, shell } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const LINKS = new Set(['https://linktr.ee/Sin10', 'https://github.com/kittythek']);
const MAC_NAMES = { 26: 'Tahoe', 15: 'Sequoia', 14: 'Sonoma', 13: 'Ventura', 12: 'Monterey', 11: 'Big Sur' };

function osRelease() {
  const out = {};
  try {
    for (const line of fs.readFileSync('/etc/os-release', 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^"|"$/g, '');
    }
  } catch {}
  return out;
}

function platformInfo() {
  if (process.platform === 'win32') {
    const build = parseInt(os.release().split('.')[2] || '0', 10);
    return { family: 'windows', name: build >= 22000 ? 'Windows 11' : 'Windows 10', version: 'Build ' + build };
  }
  if (process.platform === 'darwin') {
    let v = '';
    try { v = execFileSync('sw_vers', ['-productVersion'], { encoding: 'utf8' }).trim(); } catch {}
    const nick = MAC_NAMES[parseInt(v, 10)];
    return { family: 'mac', name: nick ? 'macOS ' + nick : 'macOS', version: v ? 'Version ' + v : '' };
  }
  const r = osRelease();
  return {
    family: 'linux',
    distro: (r.ID || '').toLowerCase(),
    name: r.NAME || 'Linux',
    version: r.VERSION_ID ? 'Version ' + r.VERSION_ID : (r.VERSION || '')
  };
}

let prev = snap();
function snap() {
  let idle = 0, total = 0;
  for (const c of os.cpus()) {
    const t = c.times;
    idle += t.idle;
    total += t.user + t.nice + t.sys + t.idle + t.irq;
  }
  return { idle, total };
}
function cpuPercent() {
  const n = snap();
  const di = n.idle - prev.idle, dt = n.total - prev.total;
  prev = n;
  return dt > 0 ? Math.max(0, Math.min(100, Math.round(100 * (1 - di / dt)))) : 0;
}
async function disk() {
  try {
    const s = await fs.promises.statfs(os.homedir());
    const total = s.blocks * s.bsize;
    return { used: total - s.bavail * s.bsize, total };
  } catch { return { used: 0, total: 0 }; }
}
function network() {
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    for (const a of list || []) if (a.family === 'IPv4' && !a.internal) return { name, ip: a.address };
  }
  return null;
}

ipcMain.handle('sys:info', () => {
  const cpus = os.cpus();
  return {
    os: platformInfo(),
    cpu: { model: cpus[0] ? cpus[0].model : 'Unknown CPU', cores: cpus.length, mhz: cpus[0] ? cpus[0].speed : 0 },
    memTotal: os.totalmem(),
    kernel: os.type() + ' ' + os.release(),
    arch: os.arch(),
    host: os.hostname(),
    windows: process.platform === 'win32'
  };
});
ipcMain.handle('sys:live', async () => {
  const d = await disk();
  return {
    cpu: cpuPercent(),
    memUsed: os.totalmem() - os.freemem(),
    memTotal: os.totalmem(),
    diskUsed: d.used,
    diskTotal: d.total,
    uptime: os.uptime(),
    load: os.loadavg()[0],
    net: network()
  };
});
ipcMain.handle('open', (_e, url) => { if (LINKS.has(url)) shell.openExternal(url); });

function createWindow() {
  const win = new BrowserWindow({
    width: 1120, height: 700, minWidth: 900, minHeight: 600,
    backgroundColor: '#070b14', show: false, autoHideMenuBar: true, title: 'Orbit',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => { if (LINKS.has(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.loadFile('index.html');
}

// Unzipped Linux builds can't use Chromium's setuid sandbox helper; Orbit only loads its own local files.
if (process.platform === 'linux') app.commandLine.appendSwitch('no-sandbox');

if (!app.requestSingleInstanceLock()) app.quit();
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => app.quit());
