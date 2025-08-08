// Variables globales
let horariosSeleccionados = [];
let currentImageIndex = 0;
let currentRating = 0;

// Base de datos de imágenes simulada
const galleryImages = [
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGNhZjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FuY2hhIFByaW5jaXBhbDwvdGV4dD48L3N2Zz4=',
        alt: 'Vista principal de la cancha'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDVhMDQ5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmVzdHVhcmlvczwvdGV4dD48L3N2Zz4=',
        alt: 'Vestuarios y duchas'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjZiYjZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGFycmlsbGE8L3RleHQ+PC9zdmc+',
        alt: 'Área de parrilla'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODFjNzg0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXN0YWNpb25hbWllbnRvPC90ZXh0Pjwvc3ZnPg==',
        alt: 'Estacionamiento'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmU3ZDMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SWx1bWluYWNpw7NuIE5vY3R1cm5hPC90ZXh0Pjwvc3ZnPg==',
        alt: 'Iluminación nocturna'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzg4ZTNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+w4FyZWEgZGUgZGVzY2Fuc288L3RleHQ+PC9zdmc+',
        alt: 'Área de descanso'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjliNzZkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmlzdGEgR2VuZXJhbDwvdGV4dD48L3N2Zz4=',
        alt: 'Vista general del complejo'
    },
    {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTY5NzViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW5ncmVzbyBQcmluY2lwYWw8L3RleHQ+PC9zdmc+',
        alt: 'Ingreso principal'
    }
];

// Funciones de tema
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

// Funciones de selección de horarios
function selectTime(element, time) {
    if (element.classList.contains('occupied')) {
        return; // No permitir selección de horarios ocupados
    }
    
    if (element.classList.contains('selected')) {
        // Deseleccionar
        element.classList.remove('selected');
        const index = horariosSeleccionados.indexOf(time);
        if (index > -1) {
            horariosSeleccionados.splice(index, 1);
        }
    } else {
        // Seleccionar
        element.classList.add('selected');
        horariosSeleccionados.push(time);
    }
    
    // Actualizar botón de reserva
    updateReserveButton();
}

function updateReserveButton() {
    const reserveBtn = document.querySelector('.reserve-btn');
    
    if (horariosSeleccionados.length === 0) {
        reserveBtn.textContent = 'Selecciona un horario';
        reserveBtn.style.opacity = '0.6';
    } else if (horariosSeleccionados.length === 1) {
        reserveBtn.textContent = `Reservar ${horariosSeleccionados[0]}`;
        reserveBtn.style.opacity = '1';
    } else {
        reserveBtn.textContent = `Reservar ${horariosSeleccionados.length} horarios`;
        reserveBtn.style.opacity = '1';
    }
}

function iniciarReserva() {
    if (horariosSeleccionados.length === 0) {
        alert('Por favor selecciona al menos un horario antes de continuar.');
        return;
    }
    
    // Crear URL con parámetros para la página de reserva
    const params = new URLSearchParams({
        cancha: 'Complejo Deportivo Central',
        fecha: new Date().toISOString().split('T')[0],
        horario: horariosSeleccionados.join(', '),
        precio: horariosSeleccionados.length * 8000
    });
    
    window.location.href = `reserva.html?${params.toString()}`;
}

// Funciones de galería
function openGallery() {
    const modal = document.getElementById('galleryModal');
    modal.classList.add('show');
    currentImageIndex = 0;
    updateGalleryImage();
    generateThumbnails();
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    updateGalleryImage();
}

function updateGalleryImage() {
    const currentImage = document.getElementById('currentImage');
    const currentIndexElement = document.getElementById('currentIndex');
    const totalImages = document.getElementById('totalImages');
    
    if (currentImage && galleryImages[currentImageIndex]) {
        currentImage.src = galleryImages[currentImageIndex].src;
        currentImage.alt = galleryImages[currentImageIndex].alt;
    }
    
    if (currentIndexElement) {
        currentIndexElement.textContent = currentImageIndex + 1;
    }
    
    if (totalImages) {
        totalImages.textContent = galleryImages.length;
    }
    
    // Actualizar thumbnails activos
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function generateThumbnails() {
    const thumbnailsContainer = document.getElementById('thumbnails');
    
    if (!thumbnailsContainer) return;
    
    thumbnailsContainer.innerHTML = '';
    
    galleryImages.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image.src;
        thumbnail.alt = image.alt;
        thumbnail.className = 'thumbnail';
        thumbnail.onclick = () => {
            currentImageIndex = index;
            updateGalleryImage();
        };
        
        if (index === currentImageIndex) {
            thumbnail.classList.add('active');
        }
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Funciones de reseñas
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.add('show');
    
    // Resetear formulario
    document.getElementById('reviewForm').reset();
    currentRating = 0;
    updateStarRating();
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function setRating(rating) {
    currentRating = rating;
    updateStarRating();
}

function updateStarRating() {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview(event) {
    event.preventDefault();
    
    if (currentRating === 0) {
        alert('Por favor selecciona una puntuación.');
        return;
    }
    
    const reviewerName = document.getElementById('reviewerName').value;
    const reviewText = document.getElementById('reviewText').value;
    
    // Simular guardado de reseña
    setTimeout(() => {
        closeModal('reviewModal');
        addNewReview(reviewerName, reviewText, currentRating);
        showSuccessModal();
    }, 1000);
}

function addNewReview(name, text, rating) {
    const reviewsList = document.getElementById('reviewsList');
    const newReview = document.createElement('div');
    newReview.className = 'review-item';
    
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    newReview.innerHTML = `
        <div class="review-header">
            <span class="reviewer-name">${name}</span>
            <div>
                <span class="stars">${stars}</span>
                <span class="review-date">Hace unos momentos</span>
            </div>
        </div>
        <p class="review-text">${text}</p>
    `;
    
    // Insertar al principio de la lista
    reviewsList.insertBefore(newReview, reviewsList.firstChild);
    
    // Actualizar contador de reseñas
    const reviewCount = document.getElementById('reviewCount');
    const currentCount = parseInt(reviewCount.textContent);
    reviewCount.textContent = currentCount + 1;
    
    // Recalcular rating promedio (simulado)
    updateAverageRating(rating);
}

function updateAverageRating(newRating) {
    const currentRatingElement = document.getElementById('currentRating');
    const currentRating = parseFloat(currentRatingElement.textContent);
    const reviewCount = parseInt(document.getElementById('reviewCount').textContent);
    
    // Cálculo simple del nuevo promedio
    const newAverage = ((currentRating * (reviewCount - 1)) + newRating) / reviewCount;
    currentRatingElement.textContent = newAverage.toFixed(1);
}

function showSuccessModal() {
    const modal = document.getElementById('reviewSuccessModal');
    modal.classList.add('show');
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }, 3000);
}

// Funciones de navegación
function openMaps() {
    const address = "Av. Corrientes 1234, Villa Crespo, CABA";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

// Event listeners para teclado en modales
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        const galleryModal = document.getElementById('galleryModal');
        const reviewModal = document.getElementById('reviewModal');
        
        if (galleryModal && galleryModal.classList.contains('show')) {
            if (event.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (event.key === 'ArrowRight') {
                changeImage(1);
            } else if (event.key === 'Escape') {
                closeModal('galleryModal');
            }
        }
        
        if (reviewModal && reviewModal.classList.contains('show')) {
            if (event.key === 'Escape') {
                closeModal('reviewModal');
            }
        }
    });
}

// Funciones de animación
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll('.info-card, .review-item, .amenity-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Función para actualizar horarios dinámicamente
function updateAvailableSlots() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    // Simular actualización de disponibilidad cada 30 segundos
    setInterval(() => {
        timeSlots.forEach(slot => {
            if (!slot.classList.contains('selected') && Math.random() < 0.1) {
                // 10% de probabilidad de cambiar estado
                if (slot.classList.contains('occupied')) {
                    slot.classList.remove('occupied');
                } else if (Math.random() < 0.3) {
                    slot.classList.add('occupied');
                }
            }
        });
    }, 30000);
}

// Función para cargar reseñas de forma dinámica
function loadMoreReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Cargar más reseñas';
    loadMoreBtn.className = 'btn btn-secondary';
    loadMoreBtn.style.margin = '20px auto';
    loadMoreBtn.style.display = 'block';
    
    loadMoreBtn.addEventListener('click', function() {
        // Simular carga de más reseñas
        const additionalReviews = [
            {
                name: 'Ana G.',
                rating: 5,
                date: 'Hace 3 semanas',
                text: 'Perfecta para jugar con amigos. La superficie está en excelentes condiciones y el personal muy amable.'
            },
            {
                name: 'Roberto F.',
                rating: 4,
                date: 'Hace 1 mes',
                text: 'Buena cancha, aunque a veces hay mucho ruido de la calle. En general, recomendable.'
            }
        ];
        
        additionalReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.style.opacity = '0';
            reviewElement.style.transform = 'translateY(20px)';
            reviewElement.style.transition = 'all 0.6s ease';
            
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <div>
                        <span class="stars">${stars}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
            `;
            
            reviewsList.appendChild(reviewElement);
            
            // Animar entrada
            setTimeout(() => {
                reviewElement.style.opacity = '1';
                reviewElement.style.transform = 'translateY(0)';
            }, 100);
        });
        
        this.remove();
    });
    
    reviewsList.appendChild(loadMoreBtn);
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de cancha cargada');
    
    // Cargar tema guardado
    loadSavedTheme();
    
    // Configurar navegación por teclado
    setupKeyboardNavigation();
    
    // Configurar animaciones
    animateOnScroll();
    
    // Actualizar horarios disponibles
    updateAvailableSlots();
    
    // Cargar botón de más reseñas
    setTimeout(loadMoreReviews, 2000);
    
    // Event listeners para cerrar modales al hacer clic fuera
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Configurar estrellas de rating interactivas
    const starInputs = document.querySelectorAll('.star-input');
    starInputs.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            starInputs.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = '#ffa726';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            updateStarRating();
        });
    });
    
    // Precargar imágenes de la galería para mejor rendimiento
    galleryImages.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
    
    // Mostrar mensaje de bienvenida
    console.log('🎉 ¡Bienvenido a Turnero!');
    console.log('💡 Tip: Puedes navegar por la galería con las flechas del teclado');
});