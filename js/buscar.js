// Variables globales
let filtrosActivos = [];
let todasLasCanchas = [];

// Base de datos de ubicaciones
const ubicaciones = [
    'Villa Crespo, CABA', 'Palermo, CABA', 'Belgrano, CABA', 'Recoleta, CABA',
    'San Telmo, CABA', 'Barracas, CABA', 'Puerto Madero, CABA', 'Caballito, CABA',
    'Flores, CABA', 'Almagro, CABA', 'Boedo, CABA', 'San Cristóbal, CABA',
    'La Boca, CABA', 'Constitución, CABA', 'Monserrat, CABA', 'Retiro, CABA',
    'Vicente López, GBA', 'San Isidro, GBA', 'Tigre, GBA', 'Olivos, GBA'
];

// Filtros por deporte
const filtrosPorDeporte = {
    '': ['Todos', 'Vestuarios', 'Estacionamiento', 'Techada', 'Iluminación', 'Bar/Buffet', 'WiFi', 'Seguridad'],
    'futbol5': ['Todos', 'Césped sintético', 'Césped natural', 'Vestuarios', 'Parrilla', 'Estacionamiento', 'Iluminación LED', 'Arcos reglamentarios'],
    'futbol7': ['Todos', 'Césped sintético', 'Césped natural', 'Vestuarios', 'Tribunas', 'Estacionamiento', 'Iluminación', 'Arcos reglamentarios'],
    'futbol11': ['Todos', 'Césped natural', 'Césped sintético', 'Vestuarios', 'Tribunas', 'Estacionamiento', 'Iluminación', 'VAR'],
    'padel': ['Todos', 'Cristal templado', 'Profesores', 'Climatizada', 'Iluminación LED', 'Vestuarios', 'Alquiler paletas', 'Torneos'],
    'tenis': ['Todos', 'Polvo de ladrillo', 'Césped', 'Hard court', 'Profesores', 'Iluminación', 'Vestuarios', 'Alquiler raquetas', 'Torneos'],
    'basquet': ['Todos', 'Tableros NBA', 'Aire acondicionado', 'Vestuarios', 'Tribuna', 'Marcador electrónico', 'Piso parquet'],
    'voley': ['Todos', 'Red reglamentaria', 'Piso de goma', 'Aire acondicionado', 'Vestuarios', 'Iluminación LED', 'Tribuna']
};

// Funciones principales
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

// Autocompletado de ubicaciones
function setupUbicacionAutocomplete() {
    const input = document.getElementById('ubicacionInput');
    const sugerencias = document.getElementById('ubicacionSugerencias');
    
    input.addEventListener('input', function() {
        const valor = this.value.toLowerCase();
        
        if (valor.length < 2) {
            sugerencias.classList.remove('show');
            return;
        }
        
        const coincidencias = ubicaciones.filter(ubicacion => 
            ubicacion.toLowerCase().includes(valor)
        );
        
        if (coincidencias.length > 0) {
            sugerencias.innerHTML = coincidencias
                .slice(0, 5)
                .map(ubicacion => `<div class="suggestion-item" onclick="seleccionarUbicacion('${ubicacion}')">${ubicacion}</div>`)
                .join('');
            sugerencias.classList.add('show');
        } else {
            sugerencias.classList.remove('show');
        }
    });
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !sugerencias.contains(e.target)) {
            sugerencias.classList.remove('show');
        }
    });
}

function seleccionarUbicacion(ubicacion) {
    document.getElementById('ubicacionInput').value = ubicacion;
    document.getElementById('ubicacionSugerencias').classList.remove('show');
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
    
    if (filtrosActivos.length > 1 || (filtrosActivos.length === 1 && !filtrosActivos.includes('Todos'))) {
        filtrosHTML += '<button class="clear-filters" onclick="limpiarFiltros()">Limpiar filtros</button>';
    }
    
    filtrosContainer.innerHTML = filtrosHTML;
}

function toggleFiltro(filtro) {
    if (filtro === 'Todos') {
        filtrosActivos = ['Todos'];
    } else {
        const index = filtrosActivos.indexOf(filtro);
        if (index > -1) {
            filtrosActivos.splice(index, 1);
        } else {
            filtrosActivos.push(filtro);
        }
        
        // Remover "Todos" si se selecciona otro filtro
        const todosIndex = filtrosActivos.indexOf('Todos');
        if (todosIndex > -1 && filtrosActivos.length > 1) {
            filtrosActivos.splice(todosIndex, 1);
        }
        
        // Si no hay filtros, volver a "Todos"
        if (filtrosActivos.length === 0) {
            filtrosActivos = ['Todos'];
        }
    }
    
    actualizarFiltros();
    aplicarFiltros();
}

function limpiarFiltros() {
    filtrosActivos = ['Todos'];
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
        
        // Filtros específicos (solo si no es "Todos")
        if (!filtrosActivos.includes('Todos') && filtrosActivos.length > 0) {
            const caracteristicasCancha = Array.from(cancha.querySelectorAll('.feature-tag')).map(tag => tag.textContent);
            const tieneCaracteristicas = filtrosActivos.some(filtro => 
                caracteristicasCancha.some(caracteristica => 
                    caracteristica.toLowerCase().includes(filtro.toLowerCase()) ||
                    filtro.toLowerCase().includes(caracteristica.toLowerCase())
                )
            );
            
            if (!tieneCaracteristicas) {
                mostrar = false;
            }
        }
        
        cancha.style.display = mostrar ? 'block' : 'none';
        if (mostrar) canchasVisibles++;
    });
    
    // Mostrar/ocultar mensaje de sin resultados
    mostrarSinResultados(canchasVisibles === 0);
}

function mostrarSinResultados(mostrar) {
    const noResults = document.getElementById('noResults');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (mostrar) {
        noResults.style.display = 'block';
        resultsContainer.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        resultsContainer.style.display = 'grid';
    }
}

// Ordenar resultados
function ordenarResultados(criterio) {
    const container = document.getElementById('resultsContainer');
    const canchas = Array.from(container.querySelectorAll('.cancha-card:not([style*="display: none"])'));
    
    canchas.sort((a, b) => {
        switch(criterio) {
            case 'precio-menor':
                return parseInt(a.dataset.precio) - parseInt(b.dataset.precio);
            case 'precio-mayor':
                return parseInt(b.dataset.precio) - parseInt(a.dataset.precio);
            case 'rating':
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            case 'distancia':
                // Simulación de distancia (en una app real sería geolocalización)
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });
    
    // Reordenar en el DOM
    canchas.forEach(cancha => container.appendChild(cancha));
}

function verDetalles(canchaId) {
    window.location.href = `cancha-${canchaId}.html`;
}

// Configurar fecha mínima (hoy)
function configurarFecha() {
    const fechaInput = document.getElementById('fechaInput');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
    fechaInput.value = hoy;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de búsqueda cargada');
    loadSavedTheme();
    setupUbicacionAutocomplete();
    actualizarFiltros();
    configurarFecha();
    
    // Inicializar filtros
    filtrosActivos = ['Todos'];
    
    // Guardar referencia a todas las canchas para filtrado
    todasLasCanchas = Array.from(document.querySelectorAll('.cancha-card'));
});