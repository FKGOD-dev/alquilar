// ===== Estado =====
let horariosSeleccionados = [];
let currentImageIndex = 0;
let currentRating = 0;

const SPORTS = [
  { id: 'f5',  name: 'Fútbol 5', price: 8000,  features: ['Césped sintético','Vestuarios'] },
  { id: 'padel', name: 'Pádel',    price: 6000,  features: ['Paredes de blindex','Iluminación LED'] },
  { id: 'f7',  name: 'Fútbol 7', price: 12000, features: ['Césped sintético','Vestuarios'] },
];

let selectedSport = SPORTS[0];
let baseDate = new Date();          // hoy
let selectedOffset = 0;             // 0..9 (máx 10 días)
const MAX_DAYS = 10;

const galleryImages = [
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FuY2hhIFByaW5jaXBhbDwvdGV4dD48L3N2Zz4=', alt:'Vista principal' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDU5NjY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmVzdHVhcmlvczwvdGV4dD48L3N2Zz4=', alt:'Vestuarios' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDQ3ODU3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+w4FyZWEgU29jaWFsPC90ZXh0Pjwvc3ZnPg==', alt:'Área social' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTY0ZTNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXN0YWNpb25hbWllbnRvPC90ZXh0Pjwvc3ZnPg==', alt:'Estacionamiento' },
];

/* ===== Tema ===== */
function toggleTheme(){
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  btn.innerHTML = isLight
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}
(function loadSavedTheme(){
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light-mode');
  document.getElementById('themeToggle').innerHTML =
    document.body.classList.contains('light-mode')
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
})();

/* ===== Planner ===== */
function fmtPrice(n){ return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0}).format(n) }
function addDays(date,off){ const d=new Date(date); d.setDate(d.getDate()+off); return d }
function esDateLabel(d){
  return d.toLocaleDateString('es-AR',{weekday:'short', day:'2-digit', month:'2-digit'});
}

function renderSports(){
  const sel = document.getElementById('sportSelect');
  sel.innerHTML = SPORTS.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  sel.value = selectedSport.id;
  sel.onchange = () => {
    selectedSport = SPORTS.find(s => s.id === sel.value);
    document.getElementById('price').textContent = fmtPrice(selectedSport.price) + '/hora';
    horariosSeleccionados = [];
    updateReserveButton();
    renderSlots();
  };
  // precio inicial
  document.getElementById('price').textContent = fmtPrice(selectedSport.price) + '/hora';
}

function renderDayStrip(){
  const strip = document.getElementById('dayStrip');
  strip.innerHTML = '';
  for (let i=0; i<MAX_DAYS; i++){
    const d = addDays(baseDate,i);
    const el = document.createElement('button');
    el.className = 'day-chip' + (i===selectedOffset?' active':'');
    el.innerHTML = `<strong>${d.toLocaleDateString('es-AR',{weekday:'short'})}</strong><small>${d.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})}</small>`;
    el.onclick = () => { selectedOffset=i; updateDateUI(); renderSlots(); };
    strip.appendChild(el);
  }
}

function updateDateUI(){
  const d = addDays(baseDate,selectedOffset);
  document.getElementById('dateLabel').textContent = d.toLocaleDateString('es-AR',{weekday:'long', day:'2-digit', month:'long'});
  document.getElementById('prevDay').disabled = selectedOffset===0;
  document.getElementById('nextDay').disabled = selectedOffset===MAX_DAYS-1;
  // activar chip
  [...document.querySelectorAll('.day-chip')].forEach((c,i)=>c.classList.toggle('active',i===selectedOffset));
}

function seededRandom(key){
  // simple hash -> pseudo random [0,1)
  let h=0; for(let i=0;i<key.length;i++){ h = Math.imul(31,h) + key.charCodeAt(i) | 0; }
  const x = Math.sin(h) * 10000; return x - Math.floor(x);
}

function isOccupied(sportId, dateISO, time){
  const k = `${sportId}|${dateISO}|${time}`;
  return seededRandom(k) < 0.28; // ~28% ocupados
}

function renderSlots(){
  const row = document.getElementById('slotsRow');
  row.innerHTML = '';
  horariosSeleccionados = [];
  updateReserveButton();

  const d = addDays(baseDate,selectedOffset);
  const dateISO = d.toISOString().slice(0,10);
  for (let h=8; h<=23; h++){
    const label = `${String(h).padStart(2,'0')}:00`;
    const btn = document.createElement('button');
    const occ = isOccupied(selectedSport.id, dateISO, label);
    btn.className = `slot-btn ${occ?'occupied':'available'}`;
    btn.textContent = label;
    if (!occ){
      btn.onclick = () => {
        if (btn.classList.contains('selected')){
          btn.classList.remove('selected');
          horariosSeleccionados = horariosSeleccionados.filter(t=>t!==label);
        } else {
          btn.classList.add('selected');
          horariosSeleccionados.push(label);
        }
        updateReserveButton();
      };
    }
    row.appendChild(btn);
  }
}

function updateReserveButton(){
  const btn = document.getElementById('reserveBtn');
  if (horariosSeleccionados.length===0){ btn.textContent='Seleccionar horario'; btn.disabled=true; btn.style.opacity='.6'; return; }
  btn.disabled=false; btn.style.opacity='1';
  btn.textContent = horariosSeleccionados.length===1
    ? `Reservar ${horariosSeleccionados[0]}`
    : `Reservar ${horariosSeleccionados.length} horarios`;
}

document.getElementById('prevDay').addEventListener('click', ()=>{ if (selectedOffset>0){ selectedOffset--; updateDateUI(); renderSlots(); }});
document.getElementById('nextDay').addEventListener('click', ()=>{ if (selectedOffset<MAX_DAYS-1){ selectedOffset++; updateDateUI(); renderSlots(); }});

/* ===== Reserva ===== */
function iniciarReserva(){
  if (horariosSeleccionados.length===0) return;
  const d = addDays(baseDate,selectedOffset).toISOString().slice(0,10);
  const params = new URLSearchParams({
    cancha: document.getElementById('clubName').textContent,
    direccion: document.getElementById('clubAddress').textContent,
    fecha: d,
    horario: horariosSeleccionados.join(', '),
    precio: horariosSeleccionados.length * selectedSport.price
  });
  window.location.href = `reserva.html?${params.toString()}`;
}

/* ===== Galería y utilidades previas ===== */
function openGallery(){ const m=document.getElementById('galleryModal'); m.classList.add('show'); currentImageIndex=0; updateGalleryImage(); generateThumbnails(); document.body.style.overflow='hidden'; }
function closeModal(id){ const m=document.getElementById(id); m.classList.remove('show'); document.body.style.overflow=''; }
function changeImage(dir){ currentImageIndex=(currentImageIndex+dir+galleryImages.length)%galleryImages.length; updateGalleryImage(); }
function updateGalleryImage(){
  const img=document.getElementById('currentImage'); const idx=document.getElementById('currentIndex'); const tot=document.getElementById('totalImages');
  if(img){ img.src=galleryImages[currentImageIndex].src; img.alt=galleryImages[currentImageIndex].alt; }
  if(idx) idx.textContent=currentImageIndex+1; if(tot) tot.textContent=galleryImages.length;
  document.querySelectorAll('.thumbnail').forEach((t,i)=>t.classList.toggle('active',i===currentImageIndex));
}
function generateThumbnails(){ const c=document.getElementById('thumbnails'); if(!c) return; c.innerHTML=''; galleryImages.forEach((im,i)=>{ const th=new Image(); th.src=im.src; th.alt=im.alt; th.className='thumbnail'; th.onclick=()=>{currentImageIndex=i;updateGalleryImage();}; if(i===currentImageIndex) th.classList.add('active'); c.appendChild(th);}); }

/* ===== Reseñas (igual que tenías) ===== */
let currentStars = 0;
function openReviewModal(){ const m=document.getElementById('reviewModal'); m.classList.add('show'); document.body.style.overflow='hidden'; currentStars=0; updateStarRating(); }
function setRating(n){ currentStars=n; updateStarRating(); }
function updateStarRating(){ document.querySelectorAll('.star-input').forEach((s,i)=>s.classList.toggle('active',i<currentStars)); }
function submitReview(e){
  e.preventDefault();
  if(currentStars===0) return;
  const name=document.getElementById('reviewerName').value.trim();
  const text=document.getElementById('reviewText').value.trim();
  if(!name||!text) return;
  closeModal('reviewModal'); addNewReview(name,text,currentStars); showSuccessModal();
}
function addNewReview(name,text,stars){
  const list=document.getElementById('reviewsList');
  const item=document.createElement('div'); item.className='review-item';
  item.innerHTML=`<div class="review-header"><span class="reviewer-name">${escapeHTML(name)}</span><div><span class="stars">${'★'.repeat(stars)}${'☆'.repeat(5-stars)}</span><span class="review-date">Hace unos momentos</span></div></div><p class="review-text">${escapeHTML(text)}</p>`;
  list.prepend(item);
  const countEl=document.getElementById('reviewCount'); countEl.textContent = (+countEl.textContent)+1;
}
function showSuccessModal(){ const m=document.getElementById('reviewSuccessModal'); m.classList.add('show'); setTimeout(()=>{m.classList.remove('show');document.body.style.overflow='';},2500); }
function escapeHTML(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

function openMaps(){
  const addr = document.getElementById('clubAddress').textContent;
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`,'_blank');
}

/* ===== Init ===== */
function initialize(){
  renderSports();
  renderDayStrip();
  updateDateUI();
  renderSlots();
  // thumbnails prefetch
  galleryImages.forEach(im=>{const i=new Image(); i.src=im.src;});
  // cerrar modal al click afuera
  document.addEventListener('click',e=>{
    document.querySelectorAll('.modal').forEach(m=>{
      if(e.target===m){ m.classList.remove('show'); document.body.style.overflow=''; }
    });
  });
}
document.addEventListener('DOMContentLoaded', initialize);
