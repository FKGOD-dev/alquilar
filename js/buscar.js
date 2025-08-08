// ===== Utils / Tema =====
const $  = (s) => document.querySelector(s);
const $$ = (s, ctx=document) => ctx.querySelectorAll(s);

function loadSavedTheme(){
  const saved = localStorage.getItem('theme');
  document.body.classList.toggle('light-mode', saved === 'light');

  const btn = $('#themeToggle');
  if (btn) {
    btn.innerHTML = document.body.classList.contains('light-mode')
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }

  const header = document.querySelector('.header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 6);
  window.addEventListener('scroll', onScroll, {once:false});
  onScroll();
}
function toggleTheme(){ const isLight = !document.body.classList.contains('light-mode'); localStorage.setItem('theme', isLight ? 'light' : 'dark'); loadSavedTheme(); }
window.toggleTheme = toggleTheme;

// ===== Datos =====
const SPORTS = [
  { id:'f5',    name:'Fútbol 5' },
  { id:'padel', name:'Pádel' },
  { id:'tenis', name:'Tenis' },
  { id:'basquet', name:'Básquet' },
];
const FEATURES = [
  {label:'Techada', value:'techada'},
  {label:'Descubierta', value:'descubierta'},
  {label:'Césped sintético', value:'cesped'},
  {label:'Cristal', value:'cristal'},
  {label:'Iluminación LED', value:'iluminacion'},
];

const COMPLEXES = [
  { id:'cdc', name:'Complejo Deportivo Central', address:'Av. Corrientes 1234, Villa Crespo, CABA', barrio:'Villa Crespo', sports:['f5','padel','tenis','basquet'], features:['techada','cesped','cristal','iluminacion'], rating:4.2, reviews:47, img:'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1400&auto=format' },
  { id:'pn',  name:'Parque Norte Club',          address:'Av. Cantilo 3215, Núñez, CABA',         barrio:'Núñez',        sports:['padel','tenis','f5'],          features:['descubierta','cristal','iluminacion'], rating:4.5, reviews:128, img:'https://images.unsplash.com/photo-1518602164577-365ea76149d2?q=80&w=1400&auto=format' },
  { id:'villaolimpica', name:'Villa Olímpica Sports', address:'Av. Cruz 4600, Villa Soldati, CABA', barrio:'Villa Soldati', sports:['f5','basquet'], features:['techada','iluminacion'], rating:4.1, reviews:64, img:'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1400&auto=format' },
];

// ===== Estado =====
const filter = {
  locationText: '',
  sport: 'all',
  date: new Date(),
  time: '11:00',
  feature: null
};

// ===== Helpers =====
const $el = (tag, cls, html='') => { const e=document.createElement(tag); if(cls) e.className=cls; if(html) e.innerHTML=html; return e; };
const pad = (n)=> String(n).padStart(2,'0');

// ===== Mini select (único abierto a la vez) =====
function closeAllMini(){ $$('.select-mini.open').forEach(s=>{ s.classList.remove('open'); s.setAttribute('aria-expanded','false'); }); }
document.addEventListener('click', (e)=>{ if(!e.target.closest('.select-mini') && !e.target.closest('.input-mini')) closeAllMini(); });

function buildMiniSelect({rootId, triggerId, menuId, valueId, options, onChange, initialIndex=0}){
  const root = $(rootId), trigger = $(triggerId), menu = $(menuId), value = $(valueId);
  if(!root) return;
  value.textContent = options[initialIndex]?.label ?? '';
  menu.innerHTML = '';

  options.forEach((opt,i)=>{
    const item = $el('div','mini-option' + (i===initialIndex?' active':''), opt.label);
    item.setAttribute('role','option');
    item.addEventListener('click',()=>{
      menu.querySelectorAll('.mini-option').forEach(o=>o.classList.remove('active'));
      item.classList.add('active');
      value.textContent = opt.label;
      onChange(opt,i);
      root.classList.remove('open'); root.setAttribute('aria-expanded','false');
      renderResults();
    });
    menu.appendChild(item);
  });

  trigger.onclick = (e)=>{
    e.stopPropagation();
    const willOpen = !root.classList.contains('open');
    closeAllMini();
    if (willOpen){ root.classList.add('open'); root.setAttribute('aria-expanded','true'); }
  };
}

// ===== Superbar =====
const hours = Array.from({length:16},(_,i)=> `${pad(8+i)}:00`);
const barrios = ['Villa Crespo','Núñez','Villa Soldati'];

function buildSuperbar(){
  // Deportes
  const sportOpts = [{label:'Deportes', value:'all'}, ...SPORTS.map(s=>({label:s.name, value:s.id}))];
  buildMiniSelect({
    rootId:'#sportSelectTop', triggerId:'#sportTriggerTop', menuId:'#sportMenuTop', valueId:'#sportValueTop',
    options:sportOpts, onChange:(opt)=>{ filter.sport = opt.value; }
  });

  // Hora
  const timeOpts = hours.map(h=>({label:`${h}hs`, value:h}));
  const initialHourIdx = hours.findIndex(h=>h==='11:00');
  buildMiniSelect({
    rootId:'#timeSelectTop', triggerId:'#timeTriggerTop', menuId:'#timeMenuTop', valueId:'#timeValueTop',
    options:timeOpts, onChange:(opt)=>{ filter.time = opt.value; }, initialIndex: initialHourIdx>=0? initialHourIdx : 0
  });

  // Ubicación (live + clear)
  const input = $('#locInput'), suggest = $('#locSuggest'), clear = $('#locClear');
  function updateClear(){ input.parentElement.classList.toggle('has-text', !!input.value.trim()); }

  input.addEventListener('input', ()=>{
    filter.locationText = input.value.trim();
    updateClear();

    // sugerencias
    const q = input.value.trim().toLowerCase();
    const list = q ? barrios.filter(b=> b.toLowerCase().includes(q)) : [];
    suggest.innerHTML = list.map(b=> `<div class="suggest-item">${b}</div>`).join('');
    input.parentElement.classList.toggle('open', list.length>0);

    // filtra en vivo
    renderResults();
  });

  suggest.addEventListener('click', (e)=>{
    const it = e.target.closest('.suggest-item'); if(!it) return;
    input.value = it.textContent; filter.locationText = it.textContent;
    suggest.innerHTML=''; input.parentElement.classList.remove('open'); updateClear(); renderResults();
  });

  clear.addEventListener('click', ()=>{
    input.value = ''; filter.locationText = '';
    suggest.innerHTML=''; input.parentElement.classList.remove('open'); updateClear(); renderResults();
  });
  updateClear();

  // Calendario
  initCalendar();

  // CTA
  $('#doSearch').onclick = ()=>{
    renderResults();
    $('#resultsGrid')?.scrollIntoView({behavior:'smooth', block:'start'});
  };
}

// ===== Calendario =====
let calCursor = new Date(new Date().setDate(1));

function initCalendar(){
  $('#dateTriggerTop').addEventListener('click',(e)=>{
    e.stopPropagation();
    const root = $('#dateSelectTop');
    const willOpen = !root.classList.contains('open');
    closeAllMini();
    if (willOpen){ root.classList.add('open'); root.setAttribute('aria-expanded','true'); }
  });
  $('#calPrev').addEventListener('click', ()=>{ calCursor.setMonth(calCursor.getMonth()-1); buildCalendar(); });
  $('#calNext').addEventListener('click', ()=>{ calCursor.setMonth(calCursor.getMonth()+1); buildCalendar(); });
  buildCalendar();
}
function buildCalendar(){
  const monthName = calCursor.toLocaleDateString('es-AR',{month:'long', year:'numeric'});
  $('#calTitle').textContent = monthName.charAt(0).toUpperCase()+monthName.slice(1);
  const grid = $('#calGrid'); grid.innerHTML='';

  const week = ['L','M','M','J','V','S','D']; week.forEach(w => grid.appendChild($el('div','cal-week', w)));

  const first = new Date(calCursor);
  const startDay = (first.getDay()+6)%7;
  const daysInMonth = new Date(calCursor.getFullYear(), calCursor.getMonth()+1, 0).getDate();
  const prevMonthDays = new Date(calCursor.getFullYear(), calCursor.getMonth(), 0).getDate();

  for(let i=startDay-1; i>=0; i--) grid.appendChild($el('div','cal-day muted', prevMonthDays - i));

  const today = new Date(); today.setHours(0,0,0,0);
  for(let d=1; d<=daysInMonth; d++){
    const dateObj = new Date(calCursor.getFullYear(), calCursor.getMonth(), d);
    const cell = $el('div','cal-day', d);
    if (+dateObj === +new Date(filter.date.getFullYear(), filter.date.getMonth(), filter.date.getDate())) cell.classList.add('selected');
    if (+dateObj === +today) cell.classList.add('today');
    cell.addEventListener('click', ()=>{
      filter.date = dateObj;
      const isToday = +dateObj === +today;
      $('#dateValueTop').textContent = isToday
        ? 'Hoy'
        : dateObj.toLocaleDateString('es-AR',{weekday:'short', day:'2-digit', month:'2-digit'});
      $('#dateSelectTop').classList.remove('open');
      renderResults();
    });
    grid.appendChild(cell);
  }
  const totalCells = week.length + startDay + daysInMonth;
  const rest = (7 - (totalCells % 7)) % 7;
  for(let i=1; i<=rest; i++) grid.appendChild($el('div','cal-day muted', i));
}

// ===== Chips rápidos =====
function buildQuickFilters(){
  const wrap = $('#featureChips'); wrap.innerHTML='';
  FEATURES.forEach(f=>{
    const chip = $el('button','filter-chip', f.label);
    chip.onclick = ()=>{
      wrap.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
      if (filter.feature===f.value) {
        filter.feature=null;
        updateFiltersActions(false);
      } else {
        filter.feature=f.value;
        chip.classList.add('active');
        updateFiltersActions(true);
      }
      renderResults();
    };
    wrap.appendChild(chip);
  });
  updateFiltersActions(false);
}
function updateFiltersActions(show){
  const actions = $('#filtersActions');
  actions.classList.toggle('show', !!show);
  $('#clearChips').onclick = ()=>{
    filter.feature=null;
    $('#featureChips').querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
    updateFiltersActions(false);
    renderResults();
  };
}

// ===== Filtros =====
function passLocation(c){
  const q = filter.locationText.trim().toLowerCase();
  if (!q) return true;
  return c.barrio.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
}
const passSport   = (c)=> filter.sport==='all' || c.sports.includes(filter.sport);
const passFeature = (c)=> !filter.feature || c.features?.includes(filter.feature);

// ===== Navegación =====
function goToDetails(id){
  const qs = new URLSearchParams();
  if (filter.sport!=='all') qs.set('deporte', filter.sport);
  window.location.href = `cancha-detalle.html?club=${encodeURIComponent(id)}&${qs.toString()}`;
}

// ===== Render =====
function emptyState(){
  const box = $el('div','empty-center');
  box.innerHTML = `
    <div class="icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="opacity:.9">
        <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </div>
    <div class="title">Sin resultados</div>
    <div class="sub">No encontramos complejos con esos filtros.</div>
  `;
  return box;
}

function renderResults(){
  const wrap = $('#resultsWrap');
  wrap.classList.remove('is-empty');
  wrap.innerHTML = `<div class="results-grid reveal" id="resultsGrid"></div>`;
  const grid = $('#resultsGrid');

  const list = COMPLEXES.filter(c => passLocation(c) && passSport(c) && passFeature(c));

  if (!list.length){
    wrap.classList.add('is-empty');
    wrap.innerHTML = '';
    wrap.appendChild(emptyState());
    return;
  }

  list.forEach(c=>{
    const card = $el('article','result-card reveal');

    const cover = $el('div','result-cover');
    const img = new Image(); img.src = c.img; img.alt = c.name; cover.appendChild(img);

    const body  = $el('div','result-body');
    const title = $el('h3','result-title', c.name);

    const addrBtn = $el('button','address-chip', `
      <span class="chip-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10z"/><circle cx="12" cy="11" r="2.5"/>
        </svg>
      </span>
      <span class="chip-text">${c.address}</span>
    `);
    addrBtn.onclick = (ev)=>{ ev.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`,'_blank'); };

    const tags = $el('div','tags');
    c.sports.slice(0,3).forEach(id=>{
      const name = SPORTS.find(s=>s.id===id)?.name || id;
      const t = $el('span','tag', name);
      t.onclick = (ev)=>{ ev.stopPropagation(); filter.sport=id; renderResults(); window.scrollTo({top:0,behavior:'smooth'}); };
      tags.appendChild(t);
    });
    c.features.slice(0,2).forEach(f=>{
      const label = FEATURES.find(x=>x.value===f)?.label || f;
      const t = $el('span','tag', label);
      t.onclick = (ev)=>{ ev.stopPropagation(); filter.feature=f; updateFiltersActions(true); renderResults(); window.scrollTo({top:0,behavior:'smooth'}); };
      tags.appendChild(t);
    });

    const footer = $el('div','card-footer');
    const ratingWrap = $el('div','rating-wrap');
    const stars = $el('span','stars'); const r = Math.round(c.rating);
    stars.innerHTML = '★★★★★'.split('').map((_,i)=>`<span class="star ${i<r?'filled':''}">★</span>`).join('');
    const number = $el('span','rating-number', `${c.rating.toFixed(1)} (${c.reviews})`);
    ratingWrap.appendChild(stars); ratingWrap.appendChild(number);

    const btn = $el('button','btn-ghost','Ver detalles');
    btn.onclick = (ev)=>{ ev.stopPropagation(); goToDetails(c.id); };

    body.appendChild(title); body.appendChild(addrBtn); body.appendChild(tags);
    footer.appendChild(ratingWrap); footer.appendChild(btn);

    card.appendChild(cover); card.appendChild(body); body.appendChild(footer);
    card.addEventListener('click', ()=> goToDetails(c.id));

    grid.appendChild(card);
  });

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  },{threshold:.15});
  $$('.reveal').forEach(el=> io.observe(el));
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', ()=>{
  loadSavedTheme();
  buildSuperbar();
  buildQuickFilters();

  // Preselección (?deporte=padel)
  const params = new URLSearchParams(location.search);
  const d = params.get('deporte');
  if (d && SPORTS.some(s=>s.id===d)){ filter.sport = d; $('#sportValueTop').textContent = SPORTS.find(s=>s.id===d).name; }

  renderResults();
});
