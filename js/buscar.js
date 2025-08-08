// Variables globales
let filtrosActivos = [];
let todasLasCanchas = [];
let currentSearchTerm = '';

// Base de datos de ubicaciones
const ubicaciones = [
    'Villa Crespo, CABA', 'Palermo, CABA', 'Belgrano, CABA', 'Recoleta, CABA',
    'San Telmo, CABA', 'Barracas, CABA', 'Puerto Madero, CABA', 'Caballito, CABA',
    'Flores, CABA', 'Almagro, CABA', 'Boedo, CABA', 'San Cristóbal, CABA',
    'La Boca, CABA', 'Constitución, CABA', 'Monserrat, CABA', 'Retiro, CABA',
    'Vicente López, GBA', 'San Isidro, GBA', 'Tigre, GBA', 'Olivos, GBA',
    'Zona Norte, GBA', 'Zona Oeste, GBA', 'Zona Sur, GBA'
];

// Filtros por deporte
const filtrosPorDeporte = {
    '': ['Césped', 'Césped Natural', 'Climatizada', 'Cristal', 'Luz', 'Parking', 'Parrilla', 'Profesores', 'Techada', 'Vestuarios'],
    'futbol5': ['Césped', 'Parrilla', 'Vestuarios', 'Luz', 'Parking', 'Techada', 'Climatizada'],
    'futbol7': ['Césped', 'Césped Natural', 'Vestuarios', 'Parking', 'Luz', 'Techada'],
    'futbol11': ['Césped Natural', 'Vestuarios', 'Parking', 'Luz', 'Tribunas'],
    'padel': ['Techada', 'Parking', 'Césped Natural', 'Cristal', 'Profesores', 'Climatizada'],
    'tenis': ['Parking', 'Profesores', 'Climatizada', 'Cristal', 'Luz'],
    'basquet': ['Techada', 'Parking', 'Climatizada', 'Vestuarios', 'Luz'],
    'voley': ['Techada', 'Parking', 'Climatizada', 'Vestuarios', 'Luz']
};

// Funciones de tema
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        localStorage.setItem('theme', 'dark');
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    } else {
        themeToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    }
}

// Autocompletado de ubicaciones
function setupUbicacionAutocomplete() {
    const input = document.getElementById('ubicacionInput');
    const sugerencias = document.getElementById('ubicacionSugerencias');
    let selectedIndex = -1;
    
    input.addEventListener('input', function() {
        const valor = this.value.toLowerCase();
        selectedIndex = -1;
        
        if (valor.length < 2) {
            sugerencias.classList.remove('show');
            return;
        }
        
        const coincidencias = ubicaciones.filter(ubicacion => 
            ubicacion.toLowerCase().includes(valor)
        );
        
        if (coincidencias.length > 0) {
            sugerencias.innerHTML = coincidencias
                .slice(0, 6)
                .map((ubicacion, index) => 
                    `<div class="suggestion-item" data-index="${index}" onclick="seleccionarUbicacion('${ubicacion}')">${ubicacion}</div>`
                )
                .join('');
            sugerencias.classList.add('show');
        } else {
            sugerencias.classList.remove('show');
        }
    });
    
    // Navegación con teclado
    input.addEventListener('keydown', function(e) {
        const items = sugerencias.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSuggestionSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSuggestionSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const selectedItem = items[selectedIndex];
            if (selectedItem) {
                seleccionarUbicacion(selectedItem.textContent);
            }
        } else if (e.key === 'Escape') {
            sugerencias.classList.remove('show');
            selectedIndex = -1;
        }
    });
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !sugerencias.contains(e.target)) {
            sugerencias.classList.remove('show');
            selectedIndex = -1;
        }
    });
}

function updateSuggestionSelection(items) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function seleccionarUbicacion(ubicacion) {
    document.getElementById('ubicacionInput').value = ubicacion;
    document.getElementById('ubicacionSugerencias').classList.remove('show');
    // Aplicar filtros automáticamente
    aplicarFiltros();
}

// Actualizar filtros según deporte seleccionado
function actualizarFiltros() {
    const deporte = document.getElementById('deporteSelect').value;
    const filtrosContainer = document.getElementById('filtrosContainer');
    
    const filtrosDisponibles = filtrosPorDeporte[deporte] || filtrosPorDeporte[''];
    
    let filtrosHTML = '<span class="filters-label">Filtros:</span>';
    filtrosHTML += filtrosDisponibles.map(filtro => {
        const isActive = filtrosActivos.includes(filtro);
        return `<span class="filter-tag ${isActive ? 'active' : ''}" onclick="toggleFiltro('${filtro}')">${filtro}</span>`;
    }).join('');
    
    if (filtrosActivos.length > 0) {
        filtrosHTML += '<button class="clear-filters" onclick="limpiarFiltros()">Limpiar filtros</button>';
    }
    
    filtrosContainer.innerHTML = filtrosHTML;
}

function toggleFiltro(filtro) {
    const index = filtrosActivos.indexOf(filtro);
    if (index > -1) {
        filtrosActivos.splice(index, 1);
    } else {
        filtrosActivos.push(filtro);
    }
    
    actualizarFiltros();
    aplicarFiltros();
}

function limpiarFiltros() {
    filtrosActivos = [];
    actualizarFiltros();
    aplicarFiltros();
}

// Realizar búsqueda
function realizarBusqueda(event) {
    event.preventDefault();
    aplicarFiltros();
}

function aplicarFiltros() {
    const ubicacion = document.getElementById('ubicacionInput').value.toLowerCase();
    const fecha = document.getElementById('fechaInput').value;
    const deporte = document.getElementById('deporteSelect').value;
    
    currentSearchTerm = ubicacion;
    
    const canchas = document.querySelectorAll('.cancha-card');
    let canchasVisibles = 0;
    
    canchas.forEach(cancha => {
        let mostrar = true;
        
        // Filtro por ubicación
        if (ubicacion && !cancha.querySelector('.cancha-location').textContent.toLowerCase().includes(ubicacion)) {
            mostrar = false;
        }
        
        // Filtro por deporte
        if (deporte && cancha.dataset.deporte !== deporte) {
            mostrar = false;
        }
        
        // Filtros específicos
        if (filtrosActivos.length > 0) {
            const caracteristicasCancha = Array.from(cancha.querySelectorAll('.feature-tag')).map(tag => tag.textContent);
            const tieneCaracteristicas = filtrosActivos.every(filtro => 
                caracteristicasCancha.some(caracteristica => 
                    caracteristica.toLowerCase().includes(filtro.toLowerCase()) ||
                    filtro.toLowerCase().includes(caracteristica.toLowerCase())
                )
            );
            
            if (!tieneCaracteristicas) {
                mostrar = false;
            }
        }
        
        // Aplicar animación de entrada/salida
        if (mostrar !== (cancha.style.display !== 'none')) {
            if (mostrar) {
                cancha.style.display = 'block';
                cancha.style.opacity = '0';
                cancha.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    cancha.style.transition = 'all 0.3s ease';
                    cancha.style.opacity = '1';
                    cancha.style.transform = 'translateY(0)';
                }, 50);
            } else {
                cancha.style.transition = 'all 0.3s ease';
                cancha.style.opacity = '0';
                cancha.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    cancha.style.display = 'none';
                }, 300);
            }
        }
        
        if (mostrar) canchasVisibles++;
    });
    
    // Mostrar/ocultar mensaje de sin resultados
    mostrarSinResultados(canchasVisibles === 0);
    
    // Actualizar contador de resultados
    actualizarContadorResultados(canchasVisibles);
}

function mostrarSinResultados(mostrar) {
    const noResults = document.getElementById('noResults');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (mostrar) {
        noResults.style.display = 'block';
        resultsContainer.style.opacity = '0.3';
    } else {
        noResults.style.display = 'none';
        resultsContainer.style.opacity = '1';
    }
}

function actualizarContadorResultados(count) {
    const resultsTitle = document.querySelector('.results-title');
    if (!resultsTitle) {
        // Crear el título si no existe
        const header = document.querySelector('.results-header');
        const title = document.createElement('h2');
        title.className = 'results-title';
        header.insertBefore(title, header.firstChild);
    }
    
    const title = document.querySelector('.results-title');
    if (count === 0) {
        title.textContent = 'Resultados';
    } else if (count === 1) {
        title.textContent = '1 resultado encontrado';
    } else {
        title.textContent = `${count} resultados encontrados`;
    }
}

// Ordenar resultados
function ordenarResultados(criterio) {
    const container = document.getElementById('resultsContainer');
    const canchas = Array.from(container.querySelectorAll('.cancha-card')).filter(cancha => 
        cancha.style.display !== 'none'
    );
    
    canchas.sort((a, b) => {
        switch(criterio) {
            case 'precio-menor':
                return parseInt(a.dataset.precio) - parseInt(b.dataset.precio);
            case 'precio-mayor':
                return parseInt(b.dataset.precio) - parseInt(a.dataset.precio);
            case 'rating':
                return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
            case 'distancia': {
                // Simulación de distancia basada en orden alfabético de ubicación
                const locationA = a.querySelector('.cancha-location').textContent;
                const locationB = b.querySelector('.cancha-location').textContent;
                return locationA.localeCompare(locationB);
            }
            case 'relevancia':
            default: {
                // Ordenar por relevancia (combinando rating y coincidencia de búsqueda)
                const ratingA = parseFloat(a.dataset.rating || 0);
                const ratingB = parseFloat(b.dataset.rating || 0);
                
                // Bonus por coincidencia de ubicación
                const locationA = a.querySelector('.cancha-location').textContent.toLowerCase();
                const locationB = b.querySelector('.cancha-location').textContent.toLowerCase();
                const bonusA = currentSearchTerm && locationA.includes(currentSearchTerm) ? 1 : 0;
                const bonusB = currentSearchTerm && locationB.includes(currentSearchTerm) ? 1 : 0;
                
                const scoreA = ratingA + bonusA;
                const scoreB = ratingB + bonusB;
                
                return scoreB - scoreA;
            }
        }
    });
    
    // Reordenar en el DOM con animación
    canchas.forEach((cancha, index) => {
        setTimeout(() => {
            container.appendChild(cancha);
        }, index * 50);
    });
}

function verDetalles(canchaId) {
    // Agregar efecto de loading
    const card = event.currentTarget;
    card.style.transform = 'scale(0.98)';
    card.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = `cancha-${canchaId}.html`;
    }, 150);
}

// Configurar fecha mínima (hoy)
function configurarFecha() {
    const fechaInput = document.getElementById('fechaInput');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
    fechaInput.value = hoy;
}

// Función para detectar cambios en tiempo real
function setupRealTimeSearch() {
    const ubicacionInput = document.getElementById('ubicacionInput');
    const deporteSelect = document.getElementById('deporteSelect');
    
    let searchTimeout;
    
    ubicacionInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            aplicarFiltros();
        }, 300);
    });
    
    deporteSelect.addEventListener('change', function() {
        actualizarFiltros();
        aplicarFiltros();
    });
}

// Funciones de analytics y tracking
function trackSearch(filters) {
    console.log('Búsqueda realizada:', {
        ubicacion: document.getElementById('ubicacionInput').value,
        deporte: document.getElementById('deporteSelect').value,
        filtros: filtrosActivos,
        timestamp: new Date().toISOString()
    });
}

function trackCanchaClick(canchaId) {
    console.log('Cancha seleccionada:', {
        canchaId,
        searchContext: {
            ubicacion: document.getElementById('ubicacionInput').value,
            deporte: document.getElementById('deporteSelect').value,
            filtros: filtrosActivos
        },
        timestamp: new Date().toISOString()
    });
}

// Función para precargar datos
function preloadCanchaData() {
    // Simular precarga de datos adicionales
    todasLasCanchas = Array.from(document.querySelectorAll('.cancha-card'));
    
    // Agregar datos adicionales a cada cancha si no existen
    todasLasCanchas.forEach((cancha, index) => {
        if (!cancha.dataset.rating) {
            cancha.dataset.rating = (3.5 + Math.random() * 1.5).toFixed(1);
        }
        if (!cancha.dataset.precio) {
            const priceText = cancha.querySelector('.price').textContent;
            const precio = priceText.match(/\d+/);
            if (precio) {
                cancha.dataset.precio = precio[0];
            }
        }
    });
}

// Función para manejar errores de red
function handleNetworkError() {
    console.warn('Error de conexión detectado');
    // En una aplicación real, aquí se manejarían errores de API
}

// Setup de eventos globales
function setupGlobalEvents() {
    // Manejar cambio de tamaño de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reajustar layout si es necesario
            console.log('Layout reajustado para nueva resolución');
        }, 250);
    });
    
    // Manejar navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Cerrar cualquier dropdown abierto
            document.querySelectorAll('.suggestions-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    // Lazy loading para imágenes (si se agregan después)
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
    
    // Observar futuras imágenes
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Función de inicialización mejorada
function initializeApp() {
    console.log('Inicializando aplicación de búsqueda de canchas...');
    
    try {
        // Cargar configuraciones
        loadSavedTheme();
        configurarFecha();
        
        // Setup de funcionalidades
        setupUbicacionAutocomplete();
        setupRealTimeSearch();
        setupGlobalEvents();
        
        // Precargar datos
        preloadCanchaData();
        
        // Inicializar filtros
        filtrosActivos = [];
        actualizarFiltros();
        
        // Mostrar todos los resultados inicialmente
        aplicarFiltros();
        
        console.log('Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        handleNetworkError();
    }
}

// Funciones adicionales de UI
function addLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #10b981;
        animation: spin 1s ease-in-out infinite;
    `;
    
    element.style.position = 'relative';
    element.appendChild(spinner);
    
    // Agregar keyframes si no existen
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            @keyframes spin {
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        z-index: 9999;
        max-width: 400px;
        background: ${colors[type] || colors.info};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    return notification;
}

// Funciones mejoradas de interacción
function handleCanchaHover(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-6px)';
        this.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
    });
}

function setupAdvancedFiltering() {
    // Configurar filtrado por rango de precios
    const priceRange = document.createElement('div');
    priceRange.className = 'price-range-filter';
    priceRange.innerHTML = `
        <label class="form-label">Rango de precio</label>
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="number" id="precioMin" placeholder="Min" style="width: 80px; padding: 6px 8px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(255,255,255,0.1); color: white; font-size: 12px;">
            <span style="color: rgba(255,255,255,0.5);">-</span>
            <input type="number" id="precioMax" placeholder="Max" style="width: 80px; padding: 6px 8px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(255,255,255,0.1); color: white; font-size: 12px;">
        </div>
    `;
    
    // Agregar después de los filtros existentes
    const filtrosContainer = document.getElementById('filtrosContainer');
    if (filtrosContainer) {
        filtrosContainer.appendChild(priceRange);
        
        // Event listeners para filtro de precio
        document.getElementById('precioMin')?.addEventListener('input', debounce(aplicarFiltros, 500));
        document.getElementById('precioMax')?.addEventListener('input', debounce(aplicarFiltros, 500));
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función mejorada de aplicar filtros con rango de precio
function aplicarFiltrosAvanzados() {
    const ubicacion = document.getElementById('ubicacionInput').value.toLowerCase();
    const fecha = document.getElementById('fechaInput').value;
    const deporte = document.getElementById('deporteSelect').value;
    const precioMin = document.getElementById('precioMin')?.value;
    const precioMax = document.getElementById('precioMax')?.value;
    
    currentSearchTerm = ubicacion;
    
    const canchas = document.querySelectorAll('.cancha-card');
    let canchasVisibles = 0;
    
    canchas.forEach(cancha => {
        let mostrar = true;
        
        // Filtro por ubicación
        if (ubicacion && !cancha.querySelector('.cancha-location').textContent.toLowerCase().includes(ubicacion)) {
            mostrar = false;
        }
        
        // Filtro por deporte
        if (deporte && cancha.dataset.deporte !== deporte) {
            mostrar = false;
        }
        
        // Filtro por rango de precio
        const precio = parseInt(cancha.dataset.precio);
        if (precioMin && precio < parseInt(precioMin)) {
            mostrar = false;
        }
        if (precioMax && precio > parseInt(precioMax)) {
            mostrar = false;
        }
        
        // Filtros específicos
        if (filtrosActivos.length > 0) {
            const caracteristicasCancha = Array.from(cancha.querySelectorAll('.feature-tag')).map(tag => tag.textContent);
            const tieneCaracteristicas = filtrosActivos.every(filtro => 
                caracteristicasCancha.some(caracteristica => 
                    caracteristica.toLowerCase().includes(filtro.toLowerCase()) ||
                    filtro.toLowerCase().includes(caracteristica.toLowerCase())
                )
            );
            
            if (!tieneCaracteristicas) {
                mostrar = false;
            }
        }
        
        // Aplicar animación de entrada/salida
        if (mostrar !== (cancha.style.display !== 'none')) {
            if (mostrar) {
                cancha.style.display = 'block';
                cancha.style.opacity = '0';
                cancha.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    cancha.style.transition = 'all 0.3s ease';
                    cancha.style.opacity = '1';
                    cancha.style.transform = 'translateY(0)';
                }, 50);
            } else {
                cancha.style.transition = 'all 0.3s ease';
                cancha.style.opacity = '0';
                cancha.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    cancha.style.display = 'none';
                }, 300);
            }
        }
        
        if (mostrar) canchasVisibles++;
    });
    
    // Mostrar/ocultar mensaje de sin resultados
    mostrarSinResultados(canchasVisibles === 0);
    
    // Actualizar contador de resultados
    actualizarContadorResultados(canchasVisibles);
    
    // Track search analytics
    trackSearch({
        ubicacion,
        deporte,
        filtrosActivos,
        precioMin,
        precioMax,
        resultados: canchasVisibles
    });
}

// Función para guardar búsquedas recientes
function saveRecentSearch() {
    const ubicacion = document.getElementById('ubicacionInput').value;
    const deporte = document.getElementById('deporteSelect').value;
    
    if (ubicacion || deporte) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        const newSearch = {
            ubicacion,
            deporte,
            timestamp: Date.now()
        };
        
        // Evitar duplicados
        recentSearches = recentSearches.filter(search => 
            !(search.ubicacion === ubicacion && search.deporte === deporte)
        );
        
        recentSearches.unshift(newSearch);
        recentSearches = recentSearches.slice(0, 5); // Mantener solo 5 búsquedas recientes
        
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
}

// Función para cargar búsquedas recientes
function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    if (recentSearches.length > 0) {
        const searchSection = document.querySelector('.search-section');
        const recentContainer = document.createElement('div');
        recentContainer.className = 'recent-searches';
        recentContainer.innerHTML = `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 600;">Búsquedas recientes:</span>
                <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                    ${recentSearches.map(search => `
                        <button class="recent-search-btn" onclick="loadRecentSearch('${search.ubicacion}', '${search.deporte}')" 
                                style="padding: 6px 12px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 4px; color: #10b981; font-size: 12px; cursor: pointer; transition: all 0.2s ease;">
                            ${search.ubicacion || 'Todas las ubicaciones'} ${search.deporte ? `• ${search.deporte}` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        searchSection.appendChild(recentContainer);
    }
}

function loadRecentSearch(ubicacion, deporte) {
    document.getElementById('ubicacionInput').value = ubicacion || '';
    document.getElementById('deporteSelect').value = deporte || '';
    
    if (deporte) {
        actualizarFiltros();
    }
    
    aplicarFiltros();
    showNotification('Búsqueda cargada', 'success', 2000);
}

// Función de inicialización completa
function initializeApp() {
    console.log('Inicializando aplicación de búsqueda de canchas...');
    
    try {
        // Cargar configuraciones
        loadSavedTheme();
        configurarFecha();
        
        // Setup de funcionalidades
        setupUbicacionAutocomplete();
        setupRealTimeSearch();
        setupGlobalEvents();
        setupAdvancedFiltering();
        
        // Precargar datos
        preloadCanchaData();
        
        // Configurar efectos de hover para las tarjetas
        document.querySelectorAll('.cancha-card').forEach(handleCanchaHover);
        
        // Inicializar filtros
        filtrosActivos = [];
        actualizarFiltros();
        
        // Cargar búsquedas recientes
        loadRecentSearches();
        
        // Mostrar todos los resultados inicialmente
        aplicarFiltros();
        
        // Override aplicarFiltros con la versión avanzada
        window.aplicarFiltros = aplicarFiltrosAvanzados;
        
        console.log('Aplicación inicializada correctamente');
        showNotification('Sistema de búsqueda listo', 'success', 3000);
        
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showNotification('Error al cargar el sistema', 'error', 5000);
        handleNetworkError();
    }
}

// Función mejorada para ver detalles
function verDetalles(canchaId) {
    const card = event.currentTarget;
    
    // Agregar efecto de loading
    addLoadingState(card);
    
    // Guardar búsqueda reciente
    saveRecentSearch();
    
    // Track click
    trackCanchaClick(canchaId);
    
    // Mapear IDs a archivos HTML correctos
    const rutasCanchas = {
        'cancha1': 'cancha-detalle.html',
        'cancha2': 'cancha-cancha2.html',
        'cancha3': 'cancha-cancha3.html',
        'cancha4': 'cancha-cancha4.html',
        'cancha5': 'cancha-cancha5.html',
        'cancha6': 'cancha-cancha6.html',
        'cancha7': 'cancha-cancha7.html',
        'cancha8': 'cancha-cancha8.html',
        'cancha9': 'cancha-cancha9.html'
    };
    
    const rutaDestino = rutasCanchas[canchaId] || 'cancha-cancha1.html';
    
    // Simular carga y navegación
    setTimeout(() => {
        removeLoadingState(card);
        window.location.href = rutaDestino;
    }, 300);
}

// Event listener principal
document.addEventListener('DOMContentLoaded', initializeApp);

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error global capturado:', e.error);
    showNotification('Ha ocurrido un error inesperado', 'error', 5000);
});

// Exportar funciones para testing (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        aplicarFiltros: aplicarFiltrosAvanzados,
        ordenarResultados,
        toggleFiltro,
        limpiarFiltros,
        showNotification,
        saveRecentSearch,
        loadRecentSearch
    };
}