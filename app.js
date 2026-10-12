// Guaviare Demo Feria - JS simple, offline
const $ = s => document.querySelector(s);
const fmt = n => '$' + n.toLocaleString('es-CO');

// Tabs
document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', 'false'));
  b.setAttribute('aria-selected', 'true');
  document.querySelectorAll('.card-panel').forEach(p => p.classList.remove('active'));
  $('#panel-' + b.dataset.tab).classList.add('active');
}));
document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
  document.querySelector('.tabs button[data-tab="' + b.dataset.goto + '"]').click();
  document.querySelector('.main').scrollIntoView({ behavior: 'smooth' });
}));

// QR simple dibujado en canvas (determinista por texto, para demo sin internet)
function drawQR(canvas, text) {
  const n = 21, ctx = canvas.getContext('2d'), s = canvas.width / n;
  let h = 0; for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const border = x < 7 && y < 7 || x > n - 8 && y < 7 || x < 7 && y > n - 8;
    if (border) {
      const inBox = (x < 7 && y < 7) ? (x === 0 || x === 6 || y === 0 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5)) : (x > n - 8 && y < 7) ? ((x === n - 7 || x === n - 1 || y === 0 || y === 6 || (x > n - 6 && x < n - 2 && y > 1 && y < 5))) : ((x === 0 || x === 6 || y === n - 7 || y === n - 1 || (x > 1 && x < 5 && y > n - 6 && y < n - 2)));
      if (inBox) ctx.fillRect(x * s, y * s, s, s);
    } else if (rnd() > 0.52) ctx.fillRect(x * s, y * s, s, s);
  }
}

// --- MERCADO ---
const MERCADO = [
  { id: 'yuca', ini: 'Y', col: '#1B5E20', n: 'Yuca fresca', d: 'Finca El Retorno · bolsa 1 kg', p: 2500 },
  { id: 'cacao', ini: 'C', col: '#6B4A2B', n: 'Cacao', d: 'Asoproagro · 500 g', p: 18000 },
  { id: 'asai', ini: 'A', col: '#5B2D8E', n: 'Asaí', d: 'Pulpa congelada · 1 L', p: 15000 },
  { id: 'cafe', ini: 'F', col: '#8A4A0B', n: 'Café Serranía', d: 'Tostado medio · 500 g', p: 22000 },
  { id: 'miel', ini: 'M', col: '#C25E0E', n: 'Miel de monte', d: 'Artesanal · 750 ml', p: 25000 },
  { id: 'platano', ini: 'P', col: '#2E7D32', n: 'Plátano hartón', d: 'Docena', p: 8000 },
];
let carrito = [];
function pintarMercado() {
  $('#mercadoGrid').innerHTML = MERCADO.map(m =>
    '<div class="prod"><div class="avatar" style="background:' + m.col + '">' + m.ini + '</div><h4>' + m.n + '</h4><small>' + m.d + '</small><div class="pr">' + fmt(m.p) + '</div><button data-m="' + m.id + '">Agregar</button></div>').join('');
  document.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { carrito.push(MERCADO.find(x => x.id === b.dataset.m)); pintarCarrito(); });
}
function pintarCarrito() {
  const box = $('#cartList');
  if (!carrito.length) { box.innerHTML = '<li><span>Vacío por ahora</span></li>'; $('#cartTotal').textContent = '$0'; return; }
  const q = {}; carrito.forEach(i => q[i.id] = (q[i.id] || 0) + 1);
  box.innerHTML = Object.entries(q).map(([id, n]) => { const p = MERCADO.find(x => x.id === id); return '<li><span>' + p.n + ' ×' + n + '</span><b>' + fmt(p.p * n) + '</b></li>'; }).join('');
  $('#cartTotal').textContent = fmt(carrito.reduce((s, i) => s + i.p, 0));
}
$('#clearCart').onclick = () => { carrito = []; pintarCarrito(); $('#orderBox').hidden = true; };
$('#checkoutBtn').onclick = () => {
  if (!carrito.length) { $('#cartList').innerHTML = '<li><span>Agrega al menos un producto para hacer el pedido.</span></li>'; return; }
  const total = carrito.reduce((s, i) => s + i.p, 0);
  const folio = 'PED-' + Math.floor(1000 + Math.random() * 9000);
  $('#orderTitle').textContent = 'Pedido ' + folio + ' · ' + fmt(total);
  $('#orderDetail').textContent = carrito.length + ' productos · pago simulado aprobado. Escanea en el stand.';
  drawQR($('#orderQR'), folio + total);
  $('#orderBox').hidden = false; carrito = []; pintarCarrito();
};
pintarMercado(); pintarCarrito();

// --- PINTURAS ---
const HISTORIAS = [
  { t: 'El Jaguar del tepuy', d: 'Guardián de la selva. Aparece en la mayoría de los paneles de Chiribiquete. Para las comunidades, representa poder y cuidado del territorio. Tiene unos 19.000 años.' },
  { t: 'El Danzante', d: 'Figura humana en fiesta de cosecha. Habla de música, pagamento y agradecimiento a los dueños del monte.' },
  { t: 'La Anaconda madre', d: 'Serpiente que creó los ríos. En la historia Nukak, es la madre del Guaviare y del Vaupés.' },
];
$('#fotoInput').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  $('#fotoPrev').src = URL.createObjectURL(f); $('#fotoErr').classList.remove('show');
});
$('#analizarBtn').onclick = () => {
  if (!$('#fotoInput').files.length) { $('#fotoErr').classList.add('show'); return; }
  const h = HISTORIAS[Math.floor(Math.random() * HISTORIAS.length)];
  $('#analizarBtn').textContent = 'Leyendo pintura…'; $('#analizarBtn').disabled = true;
  setTimeout(() => {
    $('#analizarBtn').textContent = 'Contar historia'; $('#analizarBtn').disabled = false;
    $('#historiaBox').innerHTML = '<div class="notice"><b>' + h.t + '</b><br>' + h.d + '<br><small>Modelo de demostración. En real se entrena con 30 fotos por figura.</small></div>';
  }, 900);
};

// --- GANADO ---
let hato = JSON.parse(localStorage.getItem('hato') || '[]');
const meses = f => { if (!f) return 99; return (Date.now() - new Date(f).getTime()) / 2592000000; };
$('#ganadoForm').addEventListener('submit', e => {
  e.preventDefault();
  const ch = $('#gChapeta').value.trim(), peso = +$('#gPeso').value;
  let ok = true;
  $('#eChapeta').classList.toggle('show', !ch); if (!ch) ok = false;
  $('#ePeso').classList.toggle('show', !(peso >= 50)); if (!(peso >= 50)) ok = false;
  if (!ok) return;
  hato.push({ ch, n: $('#gNombre').value.trim(), peso, vac: $('#gVacuna').value.trim() || 'Aftosa', f: $('#gFecha').value });
  localStorage.setItem('hato', JSON.stringify(hato)); e.target.reset(); $('#gVacuna').value = 'Aftosa'; pintarHato();
});
function pintarHato() {
  const tb = $('#ganadoBody');
  tb.innerHTML = hato.length ? hato.map(g => {
    const m = meses(g.f);
    const est = m > 6 ? '<span class="badge bad">Vacuna vencida</span>' : m > 4 ? '<span class="badge warn">Vacunar pronto</span>' : '<span class="badge ok">Al día</span>';
    return '<tr><td><b>' + g.ch + '</b><br><small>' + (g.n || 'Sin nombre') + '</small></td><td>' + g.peso + ' kg</td><td>' + g.vac + '<br><small>' + (g.f || 'Sin fecha') + '</small></td><td>' + est + '</td></tr>';
  }).join('') : '<tr><td colspan="4">Sin animales. Registra el primero con el formulario de arriba.</td></tr>';
  const v = hato.filter(g => meses(g.f) > 6).length;
  $('#ganadoAlerts').innerHTML = hato.length ? '<b>' + hato.length + ' animales.</b> ' + (v ? '<span class="badge bad">' + v + ' con vacuna vencida</span>' : '<span class="badge ok">Todos al día</span>') : 'Aún no hay animales. Registra el primero.';
}
pintarHato();

// --- CAJA ---
const CAJA = [
  { id: 'tinto', ini: 'T', col: '#6B4A2B', n: 'Tinto', p: 1500 },
  { id: 'emp', ini: 'E', col: '#C25E0E', n: 'Empanada', p: 3000 },
  { id: 'gas', ini: 'G', col: '#1B5E20', n: 'Gaseosa', p: 3500 },
  { id: 'bil', ini: 'B', col: '#2B1B12', n: 'Hora de billar', p: 10000 },
];
let cuenta = [], fiados = JSON.parse(localStorage.getItem('fiados') || '[]');
function pintarCaja() {
  $('#cajaGrid').innerHTML = CAJA.map(c =>
    '<div class="prod"><div class="avatar" style="background:' + c.col + '">' + c.ini + '</div><h4>' + c.n + '</h4><div class="pr">' + fmt(c.p) + '</div><button data-c="' + c.id + '">Sumar a la cuenta</button></div>').join('');
  document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { cuenta.push(CAJA.find(x => x.id === b.dataset.c)); pintarCuenta(); });
  pintarFiados();
}
function pintarCuenta() {
  $('#cuentaList').innerHTML = cuenta.length ? cuenta.map(t => '<li><span>' + t.n + '</span><b>' + fmt(t.p) + '</b></li>').join('') : '<li><span>Vacía</span></li>';
  $('#cuentaTotal').textContent = fmt(cuenta.reduce((s, i) => s + i.p, 0));
}
$('#anularBtn').onclick = () => { cuenta = []; pintarCuenta(); $('#ticketBox').hidden = true; };
$('#cobrarBtn').onclick = () => {
  if (!cuenta.length) { $('#cuentaList').innerHTML = '<li><span>Suma algo a la cuenta primero.</span></li>'; return; }
  const modo = $('#modoRed').value === 'sin' ? 'Sin wifi · guardado en el equipo' : 'Con internet';
  const total = cuenta.reduce((s, i) => s + i.p, 0);
  const quien = $('#fiadoNombre').value.trim();
  if (quien) { fiados.push({ c: quien, v: total }); localStorage.setItem('fiados', JSON.stringify(fiados)); }
  $('#ticketBox').hidden = false;
  $('#ticketBox').innerHTML = '<b>Ticket · ' + fmt(total) + '</b><br><small>' + modo + '<br>' + cuenta.length + ' productos' + (quien ? '<br>Fiado a: <b>' + quien + '</b>' : '<br>Pagado de contado') + '</small><canvas width="120" height="120"></canvas><br><small>Gracias por su compra</small>';
  drawQR($('#ticketBox canvas'), 'T' + total + Date.now());
  cuenta = []; $('#fiadoNombre').value = ''; pintarCuenta(); pintarCaja();
};
function pintarFiados() {
  $('#fiadosList').innerHTML = fiados.length ? fiados.map(f => '<li><span>' + f.c + '</span><b>' + fmt(f.v) + '</b></li>').join('') : '<li><span>Ninguno. Todo al día.</span></li>';
}
pintarCaja(); pintarCuenta();
