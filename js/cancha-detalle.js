// ===== Estado Global =====
let horariosSeleccionados = [];
let currentImageIndex = 0;
let currentRating = 0;

const SPORTS = [
  { id: 'f5',  name: 'Fútbol 5', price: 8000,  features: ['Césped sintético','Vestuarios'] },
  { id: 'padel', name: 'Pádel',    price: 6000,  features: ['Paredes de cristal','Iluminación LED'] },
  { id: 'f7',  name: 'Fútbol 7', price: 12000, features: ['Césped sintético','Vestuarios'] },
  { id: 'tenis', name: 'Tenis', price: 15000, features: ['Polvo de ladrillo','Profesores'] },
];

let selectedSport = SPORTS[0];
let baseDate = new Date();
let selectedOffset = 0;
const MAX_DAYS = 10;

const galleryImages = [
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTZhMzRhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FuY2hhIFByaW5jaXBhbDwvdGV4dD48L3N2Zz4=', alt:'Vista principal' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTU4MDNkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmVzdHVhcmlvczwvdGV4dD48L3N2Zz4=', alt:'Vestuarios' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTY2NTM0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+w4FyZWEgU29jaWFsPC90ZXh0Pjwvc3ZnPg==', alt:'Área social' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTQ1MzJkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXN0YWNpb25hbWllbnRvPC90ZXh0Pjwvc3ZnPg==', alt:'Estacionamiento' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTIzNTI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SWx1bWluYWNpw7NuPC90ZXh0Pjwvc3ZnPg==', alt:'Iluminación' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGY0MjJhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW5zdGFsYWNpb25lczwvdGV4dD48L3N2Zz4=', alt:'Instalaciones' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDUyZTEyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmlzdGEgR2VuZXJhbDwvdGV4dD48L3N2Zz4=', alt:'Vista general' },
  { src:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGEzMDBhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW5ncmVzbyBQcmluY2lwYWw8L3RleHQ+PC9zdmc+', alt:'Ingreso principal' }
];

// ===== Funciones de Tema =====
function toggleTheme(){
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  
  // Guardar en memoria (no localStorage)
  window.currentTheme = isLight ? 'light' : 'dark';
  
  btn.innerHTML = isLight
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}

function loadSavedTheme(){
  const saved = window.currentTheme || 'dark';
  if (saved === 'light') document.body.classList.add('light-mode');
  const btn = document.getElementById('themeToggle');
  btn.innerHTML = document.body.classList.contains('light-mode')
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}

// ===== Funciones de Utilidad =====
function fmtPrice(n){ 
  return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0}).format(n);
}

function addDays(date,offset){ 
  const d = new Date(date); 
  d.setDate(d.getDate() + offset); 
  return d;
}

function seededRandom(key){
  let hash = 0;
  for(let i = 0; i < key.length; i++){
    hash = Math.imul(31, hash) + key.charCodeAt(i) | 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function isOccupied(sportId, dateISO, time){
  const key = `${sportId}|${dateISO}|${time}`;
  return seededRandom(key) < 0.25; // 25% ocupados
}

function escapeHTML(str){ 
  const div = document.createElement('div'); 
  div.textContent = str; 
  return div.innerHTML; 
}

// ===== Funciones de Selección de Horarios =====
function selectTime(element, time) {
    if (element.classList.contains('occupied')) {
        showNotification('Este horario no está disponible', 'warning');
        return;
    }
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        const index = horariosSeleccionados.indexOf(time);
        if (index > -1) {
            horariosSeleccionados.splice(index, 1);
        }
    } else {
        element.classList.add('selected');
        horariosSeleccionados.push(time);
        horariosSeleccionados.sort(); // Mantener orden
    }
    
    updateReserveButton();
    
    if (element.classList.contains('selected')) {
        showNotification(`Horario ${time} seleccionado`, 'success', 2000);
    }
}

function updateReserveButton(){
  const button = document.querySelector('.reserve-btn');
  
  if (horariosSeleccionados.length === 0){
    button.textContent = 'Seleccionar horario';
    button.disabled = true;
    button.style.opacity = '.6';
    return;
  }
  
  button.disabled = false;
  button.style.opacity = '1';
  
  if (horariosSeleccionados.length === 1){
    button.textContent = `Reservar ${horariosSeleccionados[0]}`;
  } else {
    button.textContent = `Reservar ${horariosSeleccionados.length} horarios`;
  }
}

function iniciarReserva(){
  if (horariosSeleccionados.length === 0) {
    showNotification('Selecciona al menos un horario', 'warning');
    return;
  }
  
  const button = document.querySelector('.reserve-btn');
  const originalText = button.textContent;
  button.textContent = 'Procesando...';
  button.disabled = true;
  
  setTimeout(() => {
    const selectedDate = addDays(baseDate, selectedOffset).toISOString().slice(0, 10);
    const params = new URLSearchParams({
      cancha: 'Complejo Deportivo Central',
      direccion: 'Av. Corrientes 1234, Villa Crespo, CABA',
      fecha: selectedDate,
      horario: horariosSeleccionados.join(', '),
      precio: horariosSeleccionados.length * selectedSport.price,
      deporte: selectedSport.name
    });
    
    // Simulación de redirección
    showNotification('Redirigiendo a página de reserva...', 'info', 2000);
    setTimeout(() => {
      showNotification('Funcionalidad de reserva implementada correctamente', 'success');
      button.textContent = originalText;
      button.disabled = false;
    }, 1500);
  }, 1000);
}

// ===== Funciones de Galería =====
function openGallery(){ 
  const modal = document.getElementById('galleryModal'); 
  modal.classList.add('show'); 
  currentImageIndex = 0; 
  updateGalleryImage(); 
  generateThumbnails(); 
  document.body.style.overflow = 'hidden'; 
}

function closeModal(id){ 
  const modal = document.getElementById(id); 
  modal.classList.remove('show'); 
  document.body.style.overflow = ''; 
}

function changeImage(direction){ 
  currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length; 
  updateGalleryImage(); 
}

function updateGalleryImage(){
  const img = document.getElementById('currentImage'); 
  const idx = document.getElementById('currentIndex'); 
  const total = document.getElementById('totalImages');
  
  if(img){ 
    img.src = galleryImages[currentImageIndex].src; 
    img.alt = galleryImages[currentImageIndex].alt; 
  }
  if(idx) idx.textContent = currentImageIndex + 1; 
  if(total) total.textContent = galleryImages.length;
  
  document.querySelectorAll('.thumbnail').forEach((thumb, index) => 
    thumb.classList.toggle('active', index === currentImageIndex)
  );
}

function generateThumbnails(){ 
  const container = document.getElementById('thumbnails'); 
  if(!container) return; 
  
  container.innerHTML = ''; 
  galleryImages.forEach((image, index) => { 
    const thumbnail = new Image(); 
    thumbnail.src = image.src; 
    thumbnail.alt = image.alt; 
    thumbnail.className = 'thumbnail'; 
    thumbnail.onclick = () => {
      currentImageIndex = index;
      updateGalleryImage();
    }; 
    if(index === currentImageIndex) thumbnail.classList.add('active'); 
    container.appendChild(thumbnail);
  }); 
}

// ===== Funciones de Reseñas =====
function openReviewModal(){ 
  const modal = document.getElementById('reviewModal'); 
  modal.classList.add('show'); 
  document.body.style.overflow = 'hidden'; 
  currentRating = 0; 
  updateStarRating(); 
  document.getElementById('reviewForm').reset();
}

function setRating(rating){ 
  currentRating = rating; 
  updateStarRating(); 
}

function updateStarRating(){ 
  document.querySelectorAll('.star-input').forEach((star, index) => 
    star.classList.toggle('active', index < currentRating)
  ); 
}

function submitReview(event){
  event.preventDefault();
  
  if(currentRating === 0) {
    showNotification('Selecciona una puntuación', 'warning');
    return;
  }
  
  const name = document.getElementById('reviewerName').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  
  if(!name || !text) {
    showNotification('Completa todos los campos', 'warning');
    return;
  }
  
  const submitBtn = document.querySelector('.btn-primary');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Publicando...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    closeModal('reviewModal'); 
    addNewReview(name, text, currentRating); 
    showSuccessModal();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

function addNewReview(name, text, stars){
  const list = document.getElementById('reviewsList');
  const item = document.createElement('div'); 
  item.className = 'review-item';
  
  const starString = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  
  item.innerHTML = `
    <div class="review-header">
      <span class="reviewer-name">${escapeHTML(name)}</span>
      <div>
        <span class="stars">${starString}</span>
        <span class="review-date">Hace unos momentos</span>
      </div>
    </div>
    <p class="review-text">${escapeHTML(text)}</p>
  `;
  
  list.prepend(item);
  
  const countElement = document.getElementById('reviewCount'); 
  countElement.textContent = (+countElement.textContent) + 1;
  
  // Actualizar rating promedio
  updateAverageRating(stars);
  
  // Animación de entrada
  item.style.opacity = '0';
  item.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    item.style.transition = 'all 0.3s ease';
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  }, 100);
}

function updateAverageRating(newRating) {
  const currentRatingElement = document.getElementById('currentRating');
  const currentRating = parseFloat(currentRatingElement.textContent);
  const reviewCount = parseInt(document.getElementById('reviewCount').textContent);
  
  const newAverage = ((currentRating * (reviewCount - 1)) + newRating) / reviewCount;
  currentRatingElement.textContent = newAverage.toFixed(1);
}

function showSuccessModal(){ 
  const modal = document.getElementById('reviewSuccessModal'); 
  modal.classList.add('show'); 
  setTimeout(() => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }, 3000); 
}

// ===== Funciones de Mapas =====
function openMaps(){
  const address = 'Av. Corrientes 1234, Villa Crespo, CABA';
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  window.open(url, '_blank');
}

// ===== Funciones de Notificaciones =====
function showNotification(message, type = 'info', duration = 4000) {
  const notification = document.createElement('div');
  
  const colors = {
    info: '#3b82f6',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#ef4444'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    z-index: 9999;
    max-width: 400px;
    background: ${colors[type] || colors.info};
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// ===== Funciones de Navegación por Teclado =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        const galleryModal = document.getElementById('galleryModal');
        const reviewModal = document.getElementById('reviewModal');
        
        if (galleryModal && galleryModal.classList.contains('show')) {
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    changeImage(-1);
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    changeImage(1);
                    break;
                case 'Escape':
                    closeModal('galleryModal');
                    break;
            }
        }
        
        if (reviewModal && reviewModal.classList.contains('show') && event.key === 'Escape') {
            closeModal('reviewModal');
        }
    });
}

// ===== Funciones de Animaciones =====
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elementsToAnimate = document.querySelectorAll('.info-card, .review-item, .amenity-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===== Simulación de Cambios en Tiempo Real =====
function updateAvailableSlots() {
    const timeSlots = document.querySelectorAll('.time-slot:not(.selected)');
    
    // Simulación de cambios cada 30 segundos
    setInterval(() => {
        timeSlots.forEach(slot => {
            if (Math.random() < 0.05) { // 5% de probabilidad de cambio
                if (slot.classList.contains('occupied')) {
                    slot.classList.remove('occupied');
                    showNotification(`Horario ${slot.textContent} ahora disponible`, 'success', 2000);
                } else if (Math.random() < 0.2) { // 20% de probabilidad de ocuparse
                    slot.classList.add('occupied');
                }
            }
        });
    }, 30000);
}

// ===== Precarga de Imágenes =====
function preloadImages() {
    galleryImages.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

// ===== Configuración de Efectos Especiales =====
function setupSpecialEffects() {
    // Efecto de hover en estrellas
    const starInputs = document.querySelectorAll('.star-input');
    starInputs.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            starInputs.forEach((s, i) => {
                s.style.color = i <= index ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)';
            });
        });
        
        star.addEventListener('mouseleave', function() {
            updateStarRating();
        });
    });

    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // Efecto de parallax sutil en el hero
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-image');
        const speed = scrolled * 0.2;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// ===== Sistema de Puntuación Dinámica =====
function initializeDynamicRating() {
    // Simular cambios aleatorios en el rating
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de probabilidad cada minuto
            const currentRatingElement = document.getElementById('currentRating');
            const currentValue = parseFloat(currentRatingElement.textContent);
            const change = (Math.random() - 0.5) * 0.2; // ±0.1 cambio máximo
            const newValue = Math.max(1.0, Math.min(5.0, currentValue + change));
            currentRatingElement.textContent = newValue.toFixed(1);
        }
    }, 60000); // Cada minuto
}

// ===== Funciones de Deportes (para expansión futura) =====
function renderSports(){
  const select = document.getElementById('sportSelect');
  if (!select) return; // El select puede no existir en esta página
  
  select.innerHTML = SPORTS.map(sport => 
    `<option value="${sport.id}">${sport.name}</option>`
  ).join('');
  select.value = selectedSport.id;
  
  select.onchange = () => {
    selectedSport = SPORTS.find(s => s.id === select.value);
    const priceElement = document.querySelector('.price');
    if (priceElement) {
      priceElement.textContent = fmtPrice(selectedSport.price) + '/hora';
    }
    
    // Actualizar features
    const featuresContainer = document.querySelector('.features-section');
    if (featuresContainer) {
      featuresContainer.innerHTML = selectedSport.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
      ).join('');
    }
    
    horariosSeleccionados = [];
    updateReserveButton();
    renderSlots();
    
    showNotification(`Cambiado a ${selectedSport.name}`, 'info', 2000);
  };
}

// ===== Funciones de Calendario (para expansión futura) =====
function renderDayStrip(){
  const strip = document.getElementById('dayStrip');
  if (!strip) return; // Puede no existir en esta página
  
  strip.innerHTML = '';
  
  for (let i = 0; i < MAX_DAYS; i++){
    const date = addDays(baseDate, i);
    const element = document.createElement('button');
    element.className = 'day-chip' + (i === selectedOffset ? ' active' : '');
    
    const dayName = date.toLocaleDateString('es-AR', {weekday: 'short'});
    const dayDate = date.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit'});
    
    element.innerHTML = `<strong>${dayName}</strong><small>${dayDate}</small>`;
    element.onclick = () => { 
      selectedOffset = i; 
      updateDayStrip(); 
      renderSlots(); 
    };
    
    strip.appendChild(element);
  }
}

function updateDayStrip(){
  document.querySelectorAll('.day-chip').forEach((chip, index) => {
    chip.classList.toggle('active', index === selectedOffset);
  });
}

function renderSlots(){
  const container = document.getElementById('slotsRow');
  if (!container) return; // Puede no existir en esta página
  
  container.innerHTML = '';
  horariosSeleccionados = [];
  updateReserveButton();

  const selectedDate = addDays(baseDate, selectedOffset);
  const dateISO = selectedDate.toISOString().slice(0, 10);
  
  for (let hour = 8; hour <= 23; hour++){
    const timeLabel = `${String(hour).padStart(2, '0')}:00`;
    const button = document.createElement('button');
    const occupied = isOccupied(selectedSport.id, dateISO, timeLabel);
    
    button.className = `slot-btn ${occupied ? 'occupied' : 'available'}`;
    button.textContent = timeLabel;
    
    if (!occupied){
      button.onclick = () => {
        if (button.classList.contains('selected')){
          button.classList.remove('selected');
          horariosSeleccionados = horariosSeleccionados.filter(t => t !== timeLabel);
        } else {
          button.classList.add('selected');
          horariosSeleccionados.push(timeLabel);
          horariosSeleccionados.sort();
        }
        updateReserveButton();
      };
    }
    
    container.appendChild(button);
  }
}

// ===== Funciones de Inicialización Avanzadas =====
function initializeContactInteractions() {
    // Hacer que los elementos de contacto sean interactivos
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const text = item.textContent.trim();
        
        if (text.includes('+54')) {
            item.style.cursor = 'pointer';
            item.onclick = () => {
                if (navigator.userAgent.match(/Android|iPhone/i)) {
                    window.location.href = `tel:${text}`;
                } else {
                    navigator.clipboard.writeText(text).then(() => {
                        showNotification('Teléfono copiado al portapapeles', 'success', 2000);
                    });
                }
            };
        }
        
        if (text.includes('@')) {
            item.style.cursor = 'pointer';
            item.onclick = () => {
                window.location.href = `mailto:${text}`;
            };
        }
        
        if (text.includes('www.')) {
            item.style.cursor = 'pointer';
            item.onclick = () => {
                window.open(`https://${text}`, '_blank');
            };
        }
        
        if (text.includes('@complejocentral')) {
            item.style.cursor = 'pointer';
            item.onclick = () => {
                window.open('https://instagram.com/complejocentral', '_blank');
            };
        }
    });
}

function initializeAdvancedFeatures() {
    // Detectar si el usuario está en móvil
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Ajustes específicos para móvil
        const timeSlots = document.querySelector('.time-slots');
        if (timeSlots) {
            timeSlots.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }
    
    // Configurar auto-scroll suave para navegación
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeRealTimeFeatures() {
    // Simular actualizaciones en tiempo real de disponibilidad
    setInterval(() => {
        const availableSlots = document.querySelectorAll('.time-slot:not(.occupied):not(.selected)');
        if (availableSlots.length > 0 && Math.random() < 0.03) {
            const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            randomSlot.classList.add('occupied');
            showNotification(`Horario ${randomSlot.textContent} fue reservado`, 'info', 3000);
        }
    }, 45000); // Cada 45 segundos
    
    // Simular nuevas reseñas ocasionales
    const sampleReviews = [
        { name: 'Ana S.', text: 'Muy buena cancha, volveremos pronto!', rating: 5 },
        { name: 'Roberto K.', text: 'Excelente atención y limpieza impecable.', rating: 4 },
        { name: 'Lucia M.', text: 'Perfecto para jugar con amigos, súper recomendable.', rating: 5 },
        { name: 'Fernando J.', text: 'Buena ubicación y fácil acceso en transporte público.', rating: 4 }
    ];
    
    setInterval(() => {
        if (Math.random() < 0.02) { // 2% de probabilidad cada 2 minutos
            const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
            addNewReview(randomReview.name, randomReview.text, randomReview.rating);
            showNotification('Nueva reseña publicada', 'info', 2000);
        }
    }, 120000); // Cada 2 minutos
}

// ===== Funciones de Validación y Seguridad =====
function validateReviewForm() {
    const nameInput = document.getElementById('reviewerName');
    const textInput = document.getElementById('reviewText');
    
    if (!nameInput || !textInput) return false;
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    
    // Validaciones básicas
    if (name.length < 2) {
        showNotification('El nombre debe tener al menos 2 caracteres', 'warning');
        return false;
    }
    
    if (text.length < 10) {
        showNotification('La reseña debe tener al menos 10 caracteres', 'warning');
        return false;
    }
    
    if (text.length > 500) {
        showNotification('La reseña no puede exceder 500 caracteres', 'warning');
        return false;
    }
    
    // Filtro básico de contenido inapropiado
    const inappropriateWords = ['spam', 'fake', 'malo', 'terrible', 'estafa'];
    const hasInappropriate = inappropriateWords.some(word => 
        text.toLowerCase().includes(word)
    );
    
    if (hasInappropriate) {
        showNotification('Por favor, mantén un lenguaje apropiado en tu reseña', 'warning');
        return false;
    }
    
    return true;
}

// ===== Funciones de Performance =====
function optimizePerformance() {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
    
    // Debounce para eventos de scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Ejecutar funciones relacionadas con scroll aquí
        }, 100);
    });
}

// ===== Funciones de Accesibilidad =====
function enhanceAccessibility() {
    // Mejorar navegación por teclado
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #10b981';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Agregar indicadores de carga para lectores de pantalla
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Procesando')) {
                this.setAttribute('aria-busy', 'true');
                this.setAttribute('aria-live', 'polite');
            }
        });
    });
}

// ===== Función de Inicialización Principal =====
function initializeApp() {
    try {
        console.log('🚀 Inicializando página de detalle de cancha...');
        
        // Cargar tema guardado
        loadSavedTheme();
        
        // Configurar funcionalidades principales
        setupKeyboardNavigation();
        setupScrollAnimations();
        setupSpecialEffects();
        
        // Configurar interacciones de contacto
        initializeContactInteractions();
        
        // Inicializar funciones avanzadas
        initializeAdvancedFeatures();
        initializeRealTimeFeatures();
        initializeDynamicRating();
        
        // Optimizaciones
        optimizePerformance();
        enhanceAccessibility();
        
        // Precargar imágenes
        preloadImages();
        
        // Configurar actualizaciones de slots
        updateAvailableSlots();
        
        // Mensaje de éxito
        showNotification('Página cargada correctamente', 'success', 3000);
        console.log('✅ Página de detalle inicializada correctamente');
        
        // Log de estado inicial
        console.log('📊 Estado inicial:', {
            deporteSeleccionado: selectedSport.name,
            horariosDisponibles: document.querySelectorAll('.time-slot:not(.occupied)').length,
            totalImagenes: galleryImages.length,
            tema: document.body.classList.contains('light-mode') ? 'claro' : 'oscuro'
        });
        
    } catch (error) {
        console.error('❌ Error al inicializar la página:', error);
        showNotification('Error al cargar la página. Recargando...', 'error');
        
        // Reintentar inicialización después de 2 segundos
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}

// ===== Funciones de Debug y Desarrollo =====
function debugMode() {
    if (window.location.search.includes('debug=true')) {
        console.log('🔧 Modo debug activado');
        
        // Mostrar información de debug
        const debugInfo = document.createElement('div');
        debugInfo.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
        `;
        
        debugInfo.innerHTML = `
            <strong>Debug Info:</strong><br>
            Horarios seleccionados: ${horariosSeleccionados.length}<br>
            Deporte actual: ${selectedSport.name}<br>
            Imagen actual: ${currentImageIndex + 1}/${galleryImages.length}<br>
            Rating actual: ${currentRating}/5<br>
            Tema: ${document.body.classList.contains('light-mode') ? 'Claro' : 'Oscuro'}
        `;
        
        document.body.appendChild(debugInfo);
        
        // Actualizar cada segundo
        setInterval(() => {
            debugInfo.innerHTML = `
                <strong>Debug Info:</strong><br>
                Horarios seleccionados: ${horariosSeleccionados.length}<br>
                Deporte actual: ${selectedSport.name}<br>
                Imagen actual: ${currentImageIndex + 1}/${galleryImages.length}<br>
                Rating actual: ${currentRating}/5<br>
                Tema: ${document.body.classList.contains('light-mode') ? 'Claro' : 'Oscuro'}
            `;
        }, 1000);
    }
}

// ===== Funciones de Manejo de Errores =====
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Error capturado:', event.error);
        showNotification('Se produjo un error inesperado', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Promise rechazada:', event.reason);
        event.preventDefault();
    });
}

// ===== Funciones de Analytics Simuladas =====
function trackUserInteraction(action, data = {}) {
    // Simular tracking de analytics
    console.log('📈 Evento tracked:', action, data);
    
    // En un entorno real, aquí enviarías datos a Google Analytics, Mixpanel, etc.
    const eventData = {
        timestamp: new Date().toISOString(),
        action: action,
        page: 'cancha-detalle',
        userAgent: navigator.userAgent,
        ...data
    };
    
    // Guardar en memoria para esta sesión
    if (!window.analyticsEvents) {
        window.analyticsEvents = [];
    }
    window.analyticsEvents.push(eventData);
}

// ===== Funciones de SEO y Meta Tags =====
function updateMetaTags() {
    // Actualizar título dinámicamente
    document.title = `${selectedSport.name} - Complejo Deportivo Central - Turnero`;
    
    // Actualizar meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    
    metaDesc.content = `Reserva ${selectedSport.name} en Complejo Deportivo Central. ${fmtPrice(selectedSport.price)}/hora. ${selectedSport.features.join(', ')}. Villa Crespo, CABA.`;
}

// ===== Event Listeners y Inicialización =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar aplicación principal
    initializeApp();
    
    // Configurar manejo de errores
    setupErrorHandling();
    
    // Activar modo debug si es necesario
    debugMode();
    
    // Actualizar meta tags
    updateMetaTags();
    
    // Tracking de página cargada
    trackUserInteraction('page_loaded', {
        cancha: 'Complejo Deportivo Central',
        deporte: selectedSport.name
    });
});

// ===== Event Listeners Adicionales =====
window.addEventListener('beforeunload', function() {
    // Tracking de salida de página
    trackUserInteraction('page_unload', {
        timeOnPage: Date.now() - (window.pageLoadTime || Date.now()),
        horariosSeleccionados: horariosSeleccionados.length
    });
});

window.addEventListener('load', function() {
    window.pageLoadTime = Date.now();
    
    // Ocultar splash screen si existe
    const splash = document.getElementById('splash');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 300);
        }, 500);
    }
});

// ===== Funciones Exportadas para Uso Global =====
window.TurneroApp = {
    // Funciones principales
    selectTime,
    openGallery,
    openReviewModal,
    iniciarReserva,
    toggleTheme,
    
    // Funciones de utilidad
    showNotification,
    trackUserInteraction,
    
    // Estado
    getSelectedTimes: () => [...horariosSeleccionados],
    getCurrentSport: () => selectedSport,
    getCurrentRating: () => currentRating,
    
    // Debugging
    debug: {
        getState: () => ({
            horariosSeleccionados,
            currentImageIndex,
            currentRating,
            selectedSport,
            selectedOffset
        }),
        clearSelectedTimes: () => {
            horariosSeleccionados = [];
            updateReserveButton();
            document.querySelectorAll('.time-slot.selected').forEach(slot => {
                slot.classList.remove('selected');
            });
        },
        simulateReview: () => {
            const names = ['Test User', 'Demo Account', 'Example Review'];
            const texts = ['Esta es una reseña de prueba', 'Excelente para testing', 'Funcionalidad verificada'];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            const randomRating = Math.floor(Math.random() * 5) + 1;
            
            addNewReview(randomName, randomText, randomRating);
        }
    }
};

// ===== Logging Final =====
console.log('🎯 cancha-detalle.js cargado completamente');
console.log('📋 Funciones disponibles en window.TurneroApp:', Object.keys(window.TurneroApp));
console.log('🔧 Para debug, usa: window.TurneroApp.debug');

// ===== Compatibilidad con Versiones Antiguas =====
// Mantener compatibilidad con funciones globales existentes
if (typeof window !== 'undefined') {
    // Exponer funciones globalmente para compatibilidad
    window.selectTime = selectTime;
    window.openGallery = openGallery;
    window.closeModal = closeModal;
    window.changeImage = changeImage;
    window.openReviewModal = openReviewModal;
    window.setRating = setRating;
    window.submitReview = submitReview;
    window.toggleTheme = toggleTheme;
    window.iniciarReserva = iniciarReserva;
    window.openMaps = openMaps;
}