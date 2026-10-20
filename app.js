(() => {
const $ = (s) => document.querySelector(s);
const api = window.orbit;

const COLORS = { windows: '#3ea6ff', mac: '#cfd8ea', ubuntu: '#ff6a3d', debian: '#e8235f', arch: '#1793d1', fedora: '#5b8def', linuxmint: '#87cf3e', linux: '#ffc94a' };

// body = extruded on every layer; detail = front face only
const LOGOS = {
  windows: { vb: '0 0 100 100', body: '<rect x="9" y="9" width="39" height="39" rx="2"/><rect x="52" y="9" width="39" height="39" rx="2"/><rect x="9" y="52" width="39" height="39" rx="2"/><rect x="52" y="52" width="39" height="39" rx="2"/>' },
  mac: { vb: '0 0 24 24', body: '<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>' },
  ubuntu: { vb: '0 0 100 100', body: '<circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="9"/><circle cx="11" cy="50" r="11"/><circle cx="69.5" cy="16.5" r="11"/><circle cx="69.5" cy="83.5" r="11"/>' },
  debian: { vb: '0 0 100 100', body: '<path d="M62 18C30 8 6 40 22 68c14 24 52 22 60-8 6-22-14-34-30-24-12 8-10 26 4 28" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>' },
  arch: { vb: '0 0 100 100', body: '<path d="M50 6 90 94C72 80 62 76 50 76S28 80 10 94Z"/>', detail: '<path d="M50 38 66 76Q58 72 50 72Q42 72 34 76Z" fill="var(--bg)"/>' },
  fedora: { vb: '0 0 100 100', body: '<circle cx="50" cy="50" r="44"/>', detail: '<text x="50" y="72" text-anchor="middle" font-size="66" font-weight="800" font-family="system-ui,sans-serif" fill="var(--bg)">f</text>' },
  linuxmint: { vb: '0 0 100 100', body: '<rect x="8" y="8" width="84" height="84" rx="24"/>', detail: '<text x="50" y="70" text-anchor="middle" font-size="64" font-weight="800" font-family="system-ui,sans-serif" fill="var(--bg)">m</text>' },
  linux: {
    vb: '0 0 100 100',
    body: '<ellipse cx="50" cy="55" rx="28" ry="38"/><ellipse cx="33" cy="94" rx="14" ry="5.5"/><ellipse cx="67" cy="94" rx="14" ry="5.5"/><ellipse cx="20" cy="62" rx="7" ry="22" transform="rotate(14 20 62)"/><ellipse cx="80" cy="62" rx="7" ry="22" transform="rotate(-14 80 62)"/>',
    detail: '<ellipse cx="50" cy="64" rx="18" ry="27" fill="#f4f7ff"/><circle cx="42" cy="32" r="3.4" fill="var(--bg)"/><circle cx="58" cy="32" r="3.4" fill="var(--bg)"/><path d="M50 38 43 45Q50 50 57 45Z" fill="#ffb02e"/>'
  }
};

const logoKey = (o) => o.family === 'windows' ? 'windows' : o.family === 'mac' ? 'mac' : (LOGOS[o.distro] ? o.distro : 'linux');
const gb = (b, d = 1) => (b / 2 ** 30).toFixed(d);
const short = (m) => m.replace(/\((R|TM)\)|\bCPU\b|@.*$/g, '').replace(/\s+/g, ' ').trim();
const fmtUp = (s) => { const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60); return (d ? d + 'd ' : '') + h + 'h ' + m + 'm'; };

function browserInfo() {
  const p = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
  const family = p.includes('win') ? 'windows' : p.includes('mac') ? 'mac' : 'linux';
  return { os: { family, distro: '', name: { windows: 'Windows', mac: 'macOS', linux: 'Linux' }[family], version: '' },
    cpu: { model: 'Unknown CPU', cores: navigator.hardwareConcurrency || 0, mhz: 0 }, memTotal: (navigator.deviceMemory || 0) * 2 ** 30, kernel: '—', arch: '—', host: '—' };
}

// ---- 3D extruded logo ----
const stack = $('#stack'), stage = $('#stage');
function buildLogo(key) {
  const L = LOGOS[key], N = 14, GAP = 2.4;
  stack.innerHTML = '';
  for (let i = 0; i < N; i++) {
    const front = i === N - 1, el = document.createElement('div');
    el.className = 'layer';
    el.innerHTML = `<svg viewBox="${L.vb}">${L.body}${front ? (L.detail || '') : ''}</svg>`;
    el.style.transform = `translateZ(${(i - N / 2) * GAP}px)`;
    el.style.color = `color-mix(in srgb, var(--accent) ${front ? 100 : i === 0 ? 70 : 36 + i * 3.4}%, #02040a)`;
    stack.appendChild(el);
  }
}

// ---- motion state ----
let ang = 0, vel = 0, tilt = -10, drag = false, lx = 0, ly = 0, last = performance.now();
const IDLE = 0.4;
const M = { cpu: { c: 0, t: 0 }, mem: { c: 0, t: 0 }, disk: { c: 0, t: 0 } };
let memTotal = 0, diskTotal = 0;

stage.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; stage.setPointerCapture(e.pointerId); });
stage.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
  ang += dx * 0.55; vel = dx * 0.55; tilt = Math.max(-40, Math.min(18, tilt + dy * 0.2));
});
const end = () => { drag = false; vel = Math.max(-30, Math.min(30, vel)); };
stage.addEventListener('pointerup', end);
stage.addEventListener('pointercancel', end);

function tick(t) {
  const dt = Math.min(3, (t - last) / 16.67); last = t;
  if (!drag) { vel += (IDLE - vel) * Math.min(1, 0.022 * dt); tilt += (-10 - tilt) * Math.min(1, 0.02 * dt); }
  ang += vel * dt;
  stack.style.transform = `rotateX(${tilt}deg) rotateY(${ang}deg)`;
  for (const k in M) M[k].c += (M[k].t - M[k].c) * Math.min(1, 0.1 * dt);
  $('#cpuv').textContent = Math.round(M.cpu.c);
  $('#cpub').style.transform = `scaleX(${M.cpu.c / 100})`;
  $('#memv').textContent = gb(M.mem.c * memTotal);
  $('#memb').style.transform = `scaleX(${M.mem.c})`;
  $('#diskv').textContent = gb(M.disk.c * diskTotal, 0);
  $('#diskb').style.transform = `scaleX(${M.disk.c})`;
  requestAnimationFrame(tick);
}

// ---- diagnostics ----
async function poll() {
  if (!api) return;
  const s = await api.live();
  M.cpu.t = s.cpu;
  memTotal = s.memTotal; M.mem.t = s.memUsed / s.memTotal;
  diskTotal = s.diskTotal; M.disk.t = s.diskTotal ? s.diskUsed / s.diskTotal : 0;
  $('#memt').textContent = ' / ' + gb(s.memTotal) + ' GB';
  $('#memnote').textContent = Math.round(M.mem.t * 100) + '% in use';
  $('#diskt').textContent = ' / ' + gb(s.diskTotal, 0) + ' GB';
  $('#f-uptime').textContent = fmtUp(s.uptime);
  $('#f-load').textContent = s.load.toFixed(2);
  $('#f-net').textContent = s.net ? s.net.ip + ' · ' + s.net.name : 'Offline';
}

function fillStatic(info) {
  $('#osname').textContent = info.os.name;
  $('#osver').textContent = info.os.version;
  document.title = info.os.name + ' · Orbit';
  $('#cpuinfo').textContent = info.cpu.cores + ' threads' + (info.cpu.mhz ? ' · ' + (info.cpu.mhz / 1000).toFixed(1) + ' GHz' : '');
  memTotal = info.memTotal;
  $('#f-kernel').textContent = info.kernel;
  $('#f-arch').textContent = info.arch;
  $('#f-host').textContent = info.host;
  if (info.windows || !api) { $('#t-load').style.display = 'none'; $('#f-load').style.display = 'none'; }
  if (!api) $('#f-net').textContent = 'Open the desktop app for live data';
  if (navigator.getBattery) navigator.getBattery().then((b) => {
    const u = () => { $('#f-batt').textContent = b.charging && b.level === 1 ? 'Plugged in' : Math.round(b.level * 100) + '%' + (b.charging ? ' · charging' : ''); };
    u(); b.addEventListener('levelchange', u); b.addEventListener('chargingchange', u);
  }).catch(() => {});
}

// ---- boot sequence ----
const boot = $('#boot');
let finished = false, timer;
function finish() {
  if (finished) return; finished = true; clearTimeout(timer);
  boot.classList.add('out');
  $('#app').classList.add('live');
  vel = 26; // spin-up that eases into the idle spin
  setTimeout(() => boot.remove(), 700);
}
boot.addEventListener('pointerdown', finish);
addEventListener('keydown', finish);

async function start() {
  const info = api ? await api.info() : browserInfo();
  const key = logoKey(info.os);
  document.documentElement.style.setProperty('--accent', COLORS[key]);
  buildLogo(key);
  fillStatic(info);
  await poll();
  setInterval(poll, 1000);
  requestAnimationFrame(tick);

  const rows = [['platform', (info.os.name + ' ' + info.os.version).trim()], ['processor', short(info.cpu.model)], ['threads', String(info.cpu.cores)],
    ['memory', gb(info.memTotal) + ' GB'], ['kernel', info.kernel]];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = reduce ? 0 : 300, t0 = reduce ? 0 : 900;
  rows.forEach((r, i) => setTimeout(() => {
    if (finished) return;
    const li = document.createElement('li');
    li.innerHTML = `<span></span><b></b>`;
    li.firstChild.textContent = r[0]; li.lastChild.textContent = r[1];
    $('#log').appendChild(li);
    requestAnimationFrame(() => li.classList.add('show'));
    $('#barfill').style.transform = `scaleX(${(i + 1) / rows.length})`;
  }, t0 + i * step));
  timer = setTimeout(finish, t0 + rows.length * step + 500);
}

document.querySelectorAll('.links a').forEach((a) => a.addEventListener('click', (e) => { if (api) { e.preventDefault(); api.open(a.href); } }));
start();
})();
