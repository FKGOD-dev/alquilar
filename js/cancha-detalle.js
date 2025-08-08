// ====================== UTIL ======================
const $  = (s) => document.querySelector(s);
const $$ = (s, ctx=document) => ctx.querySelectorAll(s);
const esAR = 'es-AR';
const fmtPrice = (n) => `$${(n || 0).toLocaleString('es-AR')}`;

// ====================== TEMA & HEADER ======================
function loadSavedTheme() {
  const saved = localStorage.getItem('theme');
  const btn = $('#themeToggle');
  document.body.classList.toggle('light-mode', saved === 'light');

  if (btn) {
    btn.innerHTML = document.body.classList.contains('light-mode')
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }
  syncHeaderScroll();
}
function toggleTheme() {
  const isLight = !document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  loadSavedTheme();
}
window.toggleTheme = toggleTheme;

function syncHeaderScroll(){
  const header = document.querySelector('.header');
  if (!header) return;
  const scrolled = window.scrollY > 6;
  header.classList.toggle('scrolled', scrolled);
}
window.addEventListener('scroll', syncHeaderScroll);

// Color base para estrellas según tema (más visible en claro)
function starBaseColor(){
  return document.body.classList.contains('light-mode') ? '#94a3b8' : 'rgba(255,255,255,.35)';
}

// ====================== TOAST (warnings/errores) ======================
function showNotification(msg, type = 'info', ms = 2200) {
  const colors = { info: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444' };
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;bottom:20px;right:20px;z-index:1300;padding:12px 16px;border-radius:10px;color:#fff;font-weight:800;
    background:${colors[type] || colors.info};transform:translateY(20px);transition:.25s;box-shadow:0 10px 30px rgba(0,0,0,.25)`;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => (el.style.transform = 'translateY(0)'));
  setTimeout(() => { el.style.transform = 'translateY(20px)'; setTimeout(() => el.remove(), 220); }, ms);
}

// ====================== DATOS ======================
const SPORTS = [
  { id: 'f5',    name: 'Fútbol 5', price: 8000,  courts: 3 },
  { id: 'padel', name: 'Pádel',    price: 6000,  courts: 4 },
  { id: 'tenis', name: 'Tenis',    price: 15000, courts: 3 },
  { id: 'basquet', name: 'Básquet', price: 10000, courts: 1 }
];
let selectedSport = null;     // no seleccionado al inicio
let selectedCourt = null;     // no seleccionado al inicio

// ====================== PRNG seed (ocupación determinística) ======================
function strToSeed(str){
  let h = 2166136261;
  for (let i=0;i<str.length;i++) h ^= str.charCodeAt(i), h += (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24);
  return h >>> 0;
}
function mulberry32(a){ return function(){ let t = a += 0x6D2B79F5; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14) >>> 0) / 4294967296; }; }

// ====================== PLANIFICADOR FECHA / HORARIOS ======================
const MAX_DAYS = 10;
const baseDate = new Date(new Date().setHours(12, 0, 0, 0));
let selectedOffset = 0;
let horariosSeleccionados = [];

function addDays(d, i) { const c = new Date(d); c.setDate(c.getDate() + i); return c; }
function updateDateLabel() {
  const d = addDays(baseDate, selectedOffset);
  const el = $('#dateLabel');
  if (el) el.textContent = d.toLocaleDateString(esAR, { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function isOccupied(hour){
  if (!selectedSport || !selectedCourt) return false; // hasta que elijan, no “cargamos” ocupación
  const key = `${selectedSport.id}|c${selectedCourt}|d${selectedOffset}|h${hour}`;
  const rng = mulberry32(strToSeed(key));
  const base = 0.12 + (selectedOffset%3)*0.02;
  const peak = (hour>=18 && hour<=22) ? 0.15 : 0;
  return rng() < (base + peak);
}

function renderSlots() {
  const row = $('#slotsRow');
  if (!row) return;
  row.innerHTML = '';
  horariosSeleccionados = [];
  updateUIAfterSelection();

  const locked = (!selectedSport || !selectedCourt);

  for (let hour = 8; hour <= 23; hour++) {
    const timeLabel = String(hour).padStart(2, '0') + ':00';
    const btn = document.createElement('button');
    const occupied = isOccupied(hour);
    btn.className = `time-slot ${occupied ? 'occupied' : 'available'} ${locked ? 'locked' : ''}`;
    btn.textContent = timeLabel;

    btn.addEventListener('click', () => {
      if (locked) { showNotification('Elegí deporte y N° de cancha primero', 'warning'); return; }
      if (occupied) return;
      btn.classList.toggle('selected');
      if (btn.classList.contains('selected')) {
        horariosSeleccionados.push(timeLabel);
      } else {
        horariosSeleccionados = horariosSeleccionados.filter(t => t !== timeLabel);
      }
      horariosSeleccionados.sort();
      updateUIAfterSelection();
    });

    row.appendChild(btn);
  }
}

function updateUIAfterSelection() {
  // Botón: cambia texto según selección
  const btn = $('#reserveBtn');
  const count = horariosSeleccionados.length;
  btn.disabled = count === 0;
  btn.textContent = count === 0 ? 'Seleccionar horario' : 'Reservar';

  // Precio: oculto hasta elegir deporte; luego por hora o total
  const priceEl = $('#price');
  if (!selectedSport) { priceEl.style.display = 'none'; return; }

  if (count === 0) {
    priceEl.textContent = `${fmtPrice(selectedSport.price)}/hora`;
  } else {
    const total = selectedSport.price * count;
    priceEl.textContent = `${fmtPrice(total)} / ${count} ${count===1?'hora':'horas'}`;
  }
  priceEl.style.display = '';
}

function changeDay(delta) {
  const next = selectedOffset + delta;
  if (next < 0 || next >= MAX_DAYS) return;
  selectedOffset = next;
  updateDateLabel();
  renderSlots();
}
window.changeDay = changeDay;

// teclado (fecha / galería)
document.addEventListener('keydown', (e)=>{
  const galleryOpen = $('#galleryModal')?.classList.contains('show');
  if (galleryOpen) {
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'Escape') closeModal('galleryModal');
    return;
  }
  if (e.key === 'ArrowLeft') changeDay(-1);
  if (e.key === 'ArrowRight') changeDay(1);
});

// ====================== GALERÍA ======================
const galleryImages = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1400&auto=format',
  'https://images.unsplash.com/photo-1518602164577-365ea76149d2?q=80&w=1400&auto=format',
  'https://images.unsplash.com/photo-1521417531039-94aeeaf744af?q=80&w=1400&auto=format',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1400&auto=format'
];
let currentImageIndex = 0;

function setHeroFromGallery(){
  const hero = $('#heroImage');
  if (hero) hero.style.backgroundImage = `url('${galleryImages[0]}')`;
}

function openGallery() {
  currentImageIndex = 0;
  $('#totalImages').textContent = galleryImages.length;
  $('#currentImage').src = galleryImages[currentImageIndex];
  $('#currentIndex').textContent = currentImageIndex + 1;
  openModal('galleryModal');
}
window.openGallery = openGallery;

function changeImage(delta) {
  currentImageIndex = (currentImageIndex + delta + galleryImages.length) % galleryImages.length;
  $('#currentImage').src = galleryImages[currentImageIndex];
  $('#currentIndex').textContent = currentImageIndex + 1;
}
window.changeImage = changeImage;

// ====================== MODALES ======================
function openModal(id) {
  const m = document.getElementById(id);
  if (m){ m.classList.add('show'); document.body.style.overflow='hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m){ m.classList.remove('show'); document.body.style.overflow=''; }
}
window.closeModal = closeModal;
document.addEventListener('click', (e)=>{ if (e.target.classList.contains('modal')) closeModal(e.target.id); });

// ====================== RESEÑAS ======================
let currentRatingInput = 0;

function updateStars(){
  $$('.stars').forEach(container=>{
    const rating = parseInt(container.dataset.rating || '0',10);
    const stars = container.querySelectorAll('.star');
    stars.forEach((s,i)=> s.classList.toggle('filled', i < rating));
  });
}

function openReviewModal(){
  currentRatingInput=0;
  $$('#reviewForm .star-input').forEach(s=>s.style.color=starBaseColor());
  $('#reviewerName').value = '';
  $('#reviewText').value = '';
  openModal('reviewModal');
}
window.openReviewModal = openReviewModal;

function setRating(v){
  currentRatingInput=v;
  $$('#reviewForm .star-input').forEach((s,i)=>s.style.color=i<v?'#F6D36B':starBaseColor());
}
window.setRating = setRating;

function addNewReview(name, text, rating){
  const list = $('#reviewsList');
  const item = document.createElement('div');
  item.className = 'review-item';
  item.innerHTML = `
    <div class="review-header">
      <div class="reviewer">
        <span class="reviewer-name">${name}</span>
        <span class="review-date">Ahora</span>
      </div>
      <span class="stars" data-rating="${rating}">
        <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
      </span>
    </div>
    <p class="review-text">${text}</p>`;
  list.prepend(item);
  updateStars();

  const countEl = $('#reviewCount'), ratingEl = $('#currentRating');
  const prevCount = parseInt(countEl.textContent, 10);
  const prevAvg = parseFloat(ratingEl.textContent);
  const newCount = prevCount + 1;
  ratingEl.textContent = (((prevAvg*prevCount)+rating)/newCount).toFixed(1);
  countEl.textContent = newCount.toString();

  requestAnimationFrame(()=> item.classList.add('is-visible'));
}

function submitReview(e){
  e.preventDefault();
  const name = $('#reviewerName').value.trim();
  const text = $('#reviewText').value.trim();
  if (!currentRatingInput) { showNotification('Elegí una puntuación','warning'); return; }
  if (name.length<2 || text.length<10){ showNotification('Completá nombre y una reseña de al menos 10 caracteres','warning'); return; }
  closeModal('reviewModal');
  addNewReview(name,text,currentRatingInput);
  openModal('reviewSuccessModal');
}
window.submitReview = submitReview;

// ====================== RESERVA ======================
function iniciarReserva(){
  if (!selectedSport || !selectedCourt){
    showNotification('Elegí deporte y N° de cancha primero','warning');
    return;
  }
  if (horariosSeleccionados.length===0){
    showNotification('Elegí al menos un horario','warning');
    $('#slotsRow')?.scrollIntoView({behavior:'smooth', block:'start'});
    return;
  }
  const club = $('#clubName').textContent.trim();
  const addr = $('#clubAddress')?.innerText?.trim() || '';
  const dateISO = addDays(baseDate, selectedOffset).toISOString().slice(0,10);
  const horario = horariosSeleccionados.join(', ');
  const precio = selectedSport.price * horariosSeleccionados.length; // total
  const url = `reserva.html?cancha=${encodeURIComponent(club)}&direccion=${encodeURIComponent(addr)}&fecha=${encodeURIComponent(dateISO)}&horario=${encodeURIComponent(horario)}&precio=${encodeURIComponent(precio)}&deporte=${encodeURIComponent(selectedSport?.name||'')}&court=${encodeURIComponent(selectedCourt||'')}`;
  window.location.href = url;
}
window.iniciarReserva = iniciarReserva;

function openMaps(){
  const addr = $('#clubAddress')?.innerText?.trim();
  if (!addr) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`,'_blank');
}
window.openMaps = openMaps;

// ====================== SELECTS ======================
function closeAllSelects(){ $$('.select.open').forEach(s => { s.classList.remove('open'); s.setAttribute('aria-expanded','false'); }); }
document.addEventListener('click', (ev) => {
  const anySelect = ev.target.closest?.('.select');
  if (!anySelect) closeAllSelects();
});

function setSelectDisabled(id, disabled){
  const cont = $(id);
  if (!cont) return;
  cont.classList.toggle('disabled', !!disabled);
  cont.setAttribute('aria-disabled', !!disabled);
  const trig = cont.querySelector('.select-trigger');
  if (trig) trig.disabled = !!disabled;
}

function buildSportSelect(){
  const cont = $('#sportSelect');
  const trig = $('#sportTrigger');
  const menu = $('#sportMenu');
  const value = $('#sportValue');

  // reset UI
  menu.innerHTML = '';
  value.textContent = selectedSport ? selectedSport.name : 'Elegí deporte';

  SPORTS.forEach((s) => {
    const opt = document.createElement('div');
    opt.className = 'select-option' + ((selectedSport && s.id===selectedSport.id) ? ' active':'');
    opt.setAttribute('role','option');
    opt.innerHTML = `<span>${s.name}</span><span style="margin-left:auto;opacity:.65">${fmtPrice(s.price)}/h</span>`;
    opt.addEventListener('click', () => {
      selectedSport = s;
      value.textContent = s.name;

      // Activar visual
      menu.querySelectorAll('.select-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      // Habilitar select de cancha y reconstruir
      selectedCourt = null;
      buildCourtSelect();

      // Reset slots y precio
      horariosSeleccionados = [];
      renderSlots();
      updateUIAfterSelection();

      // cerrar
      cont.classList.remove('open');
      cont.setAttribute('aria-expanded','false');
    });
    menu.appendChild(opt);
  });

  trig.onclick = (e) => { e.stopPropagation(); cont.classList.toggle('open'); cont.setAttribute('aria-expanded', cont.classList.contains('open')); };
}

function buildCourtSelect(){
  const cont = $('#courtSelect');
  const trig = $('#courtTrigger');
  const menu = $('#courtMenu');
  const value = $('#courtValue');

  // Si no hay deporte, dejar deshabilitado
  if (!selectedSport){
    setSelectDisabled('#courtSelect', true);
    value.textContent = 'Elegí cancha';
    menu.innerHTML = '';
    return;
  }

  // Habilitar y construir opciones según deporte
  setSelectDisabled('#courtSelect', false);
  menu.innerHTML = '';
  value.textContent = selectedCourt ? String(selectedCourt) : 'Elegí cancha';

  const count = selectedSport.courts || 1;
  for (let i=1;i<=count;i++){
    const opt = document.createElement('div');
    opt.className = 'select-option' + ((selectedCourt===i) ? ' active':'');
    opt.setAttribute('role','option');
    opt.innerHTML = `<span>${i}</span>`;
    opt.addEventListener('click', () => {
      selectedCourt = i;
      value.textContent = String(i);
      menu.querySelectorAll('.select-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      // Reset horarios y recargar ocupación (depende de cancha)
      horariosSeleccionados = [];
      renderSlots();
      updateUIAfterSelection();

      cont.classList.remove('open');
      cont.setAttribute('aria-expanded','false');
    });
    menu.appendChild(opt);
  }

  trig.onclick = (e) => { e.stopPropagation(); cont.classList.toggle('open'); cont.setAttribute('aria-expanded', cont.classList.contains('open')); };
}

// ====================== REVEAL ON SCROLL ======================
function makeObserver(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  $$('.reveal, .review-item').forEach(el=> io.observe(el));
}

// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();

  // Portada desde galería
  setHeroFromGallery();

  // Fecha
  $('#prevDay')?.addEventListener('click', ()=> changeDay(-1));
  $('#nextDay')?.addEventListener('click', ()=> changeDay(1));
  updateDateLabel();
  renderSlots();

  // Selects
  buildSportSelect();
  buildCourtSelect(); // arranca deshabilitado hasta elegir deporte

  // Estrellas iniciales
  updateStars();

  // Reveal on scroll
  makeObserver();
});
