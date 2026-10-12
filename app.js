// Expoguaviare demo — vanilla JS, offline, localStorage
const $ = s => document.querySelector(s);
const fmt = n => '$' + n.toLocaleString('es-CO');

// Tabs
document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.nav button').forEach(x => x.setAttribute('aria-selected','false'));
  b.setAttribute('aria-selected','true');
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  $('#panel-' + b.dataset.tab).classList.add('active');
}));
document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
  document.querySelector(`.nav button[data-tab="${b.dataset.goto}"]`).click();
  window.scrollTo({top:300,behavior:'smooth'});
}));

// --- AGROMARKET img1-2 ---
const AGRO = [
  {id:'yuca', e:'🥔', n:'Yuca fresca', d:'Finca El Retorno · 1kg', p:2500},
  {id:'cacao', e:'🍫', n:'Cacao Guaviare', d:'Asoproagro · 500g', p:18000},
  {id:'asai', e:'🫐', n:'Asaí congelado', d:'Pulpa 1L', p:15000},
  {id:'cafe', e:'☕', n:'Café Serranía', d:'Tostado medio 500g', p:22000},
  {id:'miel', e:'🍯', n:'Miel de monte', d:'750ml artesanal', p:25000},
  {id:'platano', e:'🍌', n:'Plátano hartón', d:'Racimo / docena', p:8000},
];
let cart = JSON.parse(localStorage.getItem('agro_cart')||'[]');
function renderAgro(){
  $('#agroGrid').innerHTML = AGRO.map(a=>`<div class="card"><div class="emoji">${a.e}</div><h3>${a.n}</h3><small>${a.d}</small><div class="price">${fmt(a.p)}</div><button data-add="${a.id}">Agregar</button></div>`).join('');
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{cart.push(AGRO.find(x=>x.id===b.dataset.add));saveCart();});
}
function saveCart(){localStorage.setItem('agro_cart',JSON.stringify(cart));renderCart();}
function renderCart(){
  const box=$('#cartList');
  if(!cart.length){box.innerHTML='<li>Vacío — agrega del catálogo</li>';$('#cartTotal').textContent='$0';return;}
  const counts={};cart.forEach(i=>counts[i.id]=(counts[i.id]||0)+1);
  box.innerHTML=Object.entries(counts).map(([id,q])=>{const p=AGRO.find(x=>x.id===id);return `<li><span>${p.e} ${p.n} ×${q}</span><b>${fmt(p.p*q)}</b></li>`}).join('');
  $('#cartTotal').textContent=fmt(cart.reduce((s,i)=>s+i.p,0));
}
$('#clearCart').onclick=()=>{cart=[];saveCart();$('#agroQR').hidden=true;};
$('#checkoutBtn').onclick=()=>{
  if(!cart.length)return alert('Carrito vacío');
  const total=cart.reduce((s,i)=>s+i.p,0);
  const id='AG-'+Math.floor(1000+Math.random()*9000);
  $('#orderId').textContent=id;
  $('#orderDetail').textContent=`${cart.length} productos · ${fmt(total)} · pago simulado OK`;
  $('#agroQR').hidden=false;cart=[];saveCart();
};
renderAgro();renderCart();

// --- IA RUPESTRE img1-3 ---
const HIST=[
 {n:'El Jaguar de Chiribiquete',c:94,t:'Guardián del tepuy. Los jaguares aparecen en 60% de los paneles: poder y conexión con la selva. 19.000 años aprox.'},
 {n:'Danzante de la Serranía',c:88,t:'Figura humana en ritual. Representa fiestas de cosecha y pagamento a los dueños del monte.'},
 {n:'Anaconda ancestral',c:91,t:'Serpiente creadora de ríos. Los Nukak la narran como madre del Guaviare y del Vaupés.'},
];
$('#iaFile').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  $('#iaPreview').src=URL.createObjectURL(f);
});
$('#iaBtn').onclick=()=>{
  if(!$('#iaPreview').src||$('#iaPreview').src.startsWith('file')&&!$('#iaFile').files.length){}
  const h=HIST[Math.floor(Math.random()*HIST.length)];
  $('#iaResult').innerHTML=`<div class="alert"><b>${h.n}</b><br><small>${h.t}</small><div class="confbar" style="margin-top:.4rem"><i id="cf"></i></div><small>Confianza ${h.c}% · modelo Teachable Machine (simulado)</small></div>`;
  requestAnimationFrame(()=>setTimeout(()=>{const el=$('#cf');if(el)el.style.width=h.c+'%';},50));
};

// --- GANADERO img1-4 ---
let herd=JSON.parse(localStorage.getItem('herd')||'[]');
$('#ganadoForm').addEventListener('submit',e=>{
  e.preventDefault();
  herd.push({ch:$('#gChapeta').value.trim()||('G-'+Math.floor(Math.random()*999)),n:$('#gNombre').value.trim(),peso:+$('#gPeso').value||0,vac:$('#gVacuna').value.trim()||'—',f:$('#gFecha').value||''});
  localStorage.setItem('herd',JSON.stringify(herd));e.target.reset();renderHerd();
});
function monthsSince(d){if(!d)return 99;return (Date.now()-new Date(d).getTime())/2592000000;}
function renderHerd(){
  const tb=$('#ganadoBody');
  tb.innerHTML=herd.length?herd.map(g=>{
    const m=monthsSince(g.f);const st=m>6?'<span class="tag bad">Vacuna vencida</span>':m>4?'<span class="tag warn">Próxima vacuna</span>':'<span class="tag">Al día</span>';
    return `<tr><td><b>${g.ch}</b><br><small>${g.n||''} · QR [${g.ch}]</small></td><td>${g.peso} kg</td><td>${g.vac}<br><small>${g.f||'sin fecha'}</small></td><td>${st}</td></tr>`;
  }).join(''):'<tr><td colspan="4">Sin registros — agrega el primero para la feria ganadera.</td></tr>';
  const venc=herd.filter(g=>monthsSince(g.f)>6).length;
  $('#ganadoAlerts').innerHTML=herd.length?`<div class="alert" style="color:#111"><b>${herd.length}</b> animales · <b>${venc}</b> con vacuna vencida</div><p style="color:#cfe6d5">Chapeta QR lista para imprimir y pegar en el stand.</p>`:'<p style="color:#cfe6d5">Sin alertas todavía.</p>';
}
renderHerd();

// --- PUNTOGO img2-1 ---
const POS=[
 {id:'tinto',e:'☕',n:'Tinto',p:1500,stock:50},
 {id:'empanada',e:'🥟',n:'Empanada',p:3000,stock:40},
 {id:'gaseosa',e:'🥤',n:'Gaseosa',p:3500,stock:30},
 {id:'billar',e:'🎱',n:'Hora billar',p:10000,stock:8},
];
let ticket=[],fiados=JSON.parse(localStorage.getItem('fiados')||'[]');
let stock=JSON.parse(localStorage.getItem('pos_stock')||JSON.stringify(Object.fromEntries(POS.map(p=>[p.id,p.stock]))));
function renderPOS(){
  $('#posGrid').innerHTML=POS.map(p=>`<div class="card"><div class="emoji">${p.e}</div><h3>${p.n}</h3><small>Stock: ${stock[p.id]}</small><div class="price">${fmt(p.p)}</div><button data-pos="${p.id}" ${stock[p.id]<=0?'disabled':''}>${stock[p.id]<=0?'Agotado':'Cobrar'}</button></div>`).join('');
  document.querySelectorAll('[data-pos]').forEach(b=>b.onclick=()=>{if(stock[b.dataset.pos]>0){ticket.push(POS.find(x=>x.id===b.dataset.pos));renderTicket();}});
  renderFiados();
}
function renderTicket(){
  const box=$('#posList');
  box.innerHTML=ticket.length?ticket.map(t=>`<li><span>${t.e} ${t.n}</span><b>${fmt(t.p)}</b></li>`).join(''):'<li>Vacío</li>';
  $('#posTotal').textContent=fmt(ticket.reduce((s,i)=>s+i.p,0));
}
$('#posClear').onclick=()=>{ticket=[];renderTicket();$('#ticketBox').hidden=true;};
$('#cobrarBtn').onclick=()=>{
  if(!ticket.length)return alert('Ticket vacío');
  const mode=$('#netMode').value, total=ticket.reduce((s,i)=>s+i.p,0), fiado=$('#fiadoName').value.trim();
  ticket.forEach(t=>stock[t.id]--);localStorage.setItem('pos_stock',JSON.stringify(stock));
  if(fiado){fiados.push({c:fiado,v:total,f:new Date().toLocaleString()});localStorage.setItem('fiados',JSON.stringify(fiados));}
  $('#ticketBox').hidden=false;
  $('#ticketBox').innerHTML=`*** PUNTOGO GUAVIARE ***<br>Modo: ${mode.toUpperCase()} ${mode==='offline'?'· guardado local, sincroniza luego':''}<br>Items: ${ticket.length} · Total: ${fmt(total)}<br>${fiado?'FIADO A: '+fiado:'PAGO DE CONTADO'}<br><div class="qr-fake">||||||||||||||||</div>Gracias por su compra`;
  ticket=[];$('#fiadoName').value='';renderTicket();renderPOS();
};
function renderFiados(){
  $('#fiadosList').innerHTML=fiados.length?fiados.map(f=>`<li><span>${f.c}</span><b>${fmt(f.v)}</b></li>`).join(''):'<li>Sin fiados</li>';
  const box=$('#netBadge');
  const update=()=>box.textContent=($('#netMode')?.value==='offline'?'OFFLINE · VENDIENDO SIN WIFI':'OFFLINE READY');
  $('#netMode').onchange=update;update();
}
renderPOS();renderTicket();
