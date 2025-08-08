// ===== Tema (persistencia) =====
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  if (btn) {
    btn.innerHTML = isLight
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }
}
(function loadSavedTheme(){
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light-mode');
  // ícono inicial
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = document.body.classList.contains('light-mode')
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }
})();

// ===== Utilidades =====
const $ = (sel) => document.querySelector(sel);
function fmtCurrency(n){ return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0}).format(n || 0); }
function parseParams(){
  const p = new URLSearchParams(window.location.search);
  return {
    cancha: p.get('cancha') || 'Complejo Deportivo Central',
    direccion: p.get('direccion') || '',
    fecha: p.get('fecha') || new Date().toISOString().split('T')[0],
    horario: p.get('horario') || '10:00',
    precio: Number(p.get('precio') || 8000)
  };
}
function formatDateYYYYMMDDtoES(dateStr){
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-AR', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
  } catch { return dateStr; }
}

// ===== Cargar resumen =====
const data = parseParams();
$('#sumCancha').textContent    = data.cancha;

// Dirección con placeholder visible si no hay dato
const dirEl = $('#sumDireccion');
const dirTxt = (data.direccion || '').trim();
if (dirTxt) {
  dirEl.textContent = dirTxt;
  dirEl.classList.remove('placeholder');
} else {
  dirEl.textContent = 'Dirección';
  dirEl.classList.add('placeholder');
}

$('#sumFecha').textContent     = formatDateYYYYMMDDtoES(data.fecha);
$('#sumHorario').textContent   = data.horario;
$('#sumTotal').textContent     = fmtCurrency(data.precio);

// ===== Método de pago =====
let pagoSeleccionado = null;
const options = [...document.querySelectorAll('.payment-option')];

options.forEach(opt => {
  opt.addEventListener('click', () => {
    options.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    pagoSeleccionado = opt.dataset.method;
  });
});

// ===== Validación simple =====
function validar(){
  const requiredIds = ['nombre','apellido','email','telefono'];
  for (const id of requiredIds){
    const el = document.getElementById(id);
    if (!el.value.trim()){
      el.focus();
      shake(el);
      return false;
    }
  }
  if (!pagoSeleccionado){
    shake($('#paymentOptions'));
    return false;
  }
  return true;
}
function shake(el){
  el.style.transition = 'transform .12s';
  el.style.transform = 'translateX(6px)';
  setTimeout(()=>{ el.style.transform='translateX(-6px)'; }, 120);
  setTimeout(()=>{ el.style.transform='translateX(0)'; }, 240);
}

// ===== Confirmación =====
$('#confirmarBtn').addEventListener('click', () => {
  if (!validar()) return;

  // Completar modal
  $('#mCancha').textContent  = data.cancha;
  $('#mFecha').textContent   = $('#sumFecha').textContent;
  $('#mHorario').textContent = data.horario;
  $('#mTotal').textContent   = fmtCurrency(data.precio);
  $('#mPago').textContent    = pagoSeleccionado
    ? pagoSeleccionado.charAt(0).toUpperCase() + pagoSeleccionado.slice(1)
    : '—';

  // Mostrar modal
  const modal = $('#successModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Reproducir animación (reinicio)
  const check = modal.querySelector('.check');
  if (check) {
    check.style.animation = 'none';
    void check.offsetWidth; // reflow
    check.style.animation = '';
  }
});

function closeModal(){
  const modal = $('#successModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$('#closeModal').addEventListener('click', closeModal);
document.getElementById('successModal').addEventListener('click', (e)=>{
  if (e.target.id === 'successModal') closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
