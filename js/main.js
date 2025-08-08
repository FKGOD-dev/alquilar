// Variables globales
let isAnimating = false;

// Funciones de tema
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    body.classList.toggle('light-mode');

    const isLight = body.classList.contains('light-mode');

    if (themeToggle) {
        themeToggle.innerHTML = isLight
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        }
    } else if (themeToggle) {
        themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    }
}

// Animación de contadores
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Intersection Observer para animaciones
function setupIntersectionObserver() {
    const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                } else if (entry.target.classList.contains('stat-number')) {
                    animateStatNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });

    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

function animateFeatureCard(card) {
    card.style.transition = 'all 0.6s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
}

function animateStatNumber(element) {
    if (element.dataset.animated) return;
    const target = parseInt(element.dataset.target, 10) || 0;
    animateCounter(element, target);
    element.dataset.animated = 'true';
}

// Navegación con transición
function navigateWithTransition(url) {
    if (isAnimating) return;
    isAnimating = true;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; inset: 0;
        background: linear-gradient(135deg, #10b981, #059669);
        z-index: 9999; opacity: 0; transition: opacity 0.3s ease;
        display: grid; place-items: center; color: white;
        font-size: 1.2rem; font-weight: 600;
    `;
    overlay.innerHTML = `
        <div style="text-align:center;">
            <div style="width:40px;height:40px;border:3px solid rgba(255,255,255,0.3);border-radius:50%;border-top:3px solid white;animation: spin 1s linear infinite;margin:0 auto 16px;"></div>
            Cargando...
        </div>
    `;

    if (!document.querySelector('#transition-styles')) {
        const style = document.createElement('style');
        style.id = 'transition-styles';
        style.textContent = `@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        setTimeout(() => { window.location.href = url; }, 500);
    });
}

// Atajos
function mostrarBuscar() { navigateWithTransition('buscar.html'); }
function mostrarPropietario() { navigateWithTransition('propietarios.html'); }
function mostrarNosotros() { navigateWithTransition('nosotros.html'); }
function mostrarPublicar() { navigateWithTransition('publicar.html'); }
function mostrarContacto() { navigateWithTransition('contacto.html'); }

// Parallax suave
function setupParallaxEffect() {
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.hero-section').forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${-(scrolled * speed)}px)`;
        });
        ticking = false;
    }
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Hover de botones
function setupButtonEffects() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function(){ this.style.transform = 'translateY(-2px) scale(1.02)'; });
        button.addEventListener('mouseleave', function(){ this.style.transform = 'translateY(0) scale(1)'; });
        button.addEventListener('mousedown', function(){ this.style.transform = 'translateY(0) scale(0.98)'; });
        button.addEventListener('mouseup', function(){ this.style.transform = 'translateY(-2px) scale(1.02)'; });
    });
}

// Handlers de navegación
function setupNavigationHandlers() {
    document.querySelectorAll('a[href="buscar.html"]').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); mostrarBuscar(); });
    });
    document.querySelectorAll('a[href="#propietario"]').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); mostrarPropietario(); });
    });
    document.querySelectorAll('a[href="#nosotros"]').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); mostrarNosotros(); });
    });
    document.querySelectorAll('a[href="#contacto"]').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); mostrarContacto(); });
    });
    document.querySelectorAll('a[href="#publicar"]').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); mostrarPublicar(); });
    });
}

// Notificaciones
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    const colors = { info:'#3b82f6', success:'#10b981', warning:'#f59e0b', error:'#ef4444' };
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        padding: 16px 24px; border-radius: 8px; color: white;
        font-weight: 600; font-size: 14px; z-index: 9999; max-width: 400px;
        background: ${colors[type] || colors.info}; backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        transform: translateX(100%); transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    requestAnimationFrame(() => { notification.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => { notification.remove(); }, 300);
    }, duration);
    return notification;
}

// Capacidades del dispositivo
function detectDeviceCapabilities() {
    const capabilities = {
        touch: 'ontouchstart' in window,
        animation: 'animate' in document.createElement('div'),
        webp: false,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    const webpTest = new Image();
    webpTest.onload = webpTest.onerror = function () {
        capabilities.webp = (webpTest.height === 2);
    };
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    return capabilities;
}

// Analytics (demo)
function initializeAnalytics() {
    const pageData = {
        page: 'home',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        viewport: { width: window.innerWidth, height: window.innerHeight }
    };
    console.log('Page view tracked:', pageData);
    localStorage.setItem('lastPageView', JSON.stringify(pageData));
}

// Errores globales
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Error global capturado:', {
            message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno, error: e.error
        });
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            showNotification('Se detectó un error. Revisa la consola para más detalles.', 'error');
        }
    });
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise rechazada no manejada:', e.reason);
    });
}

// Init
function initializeApp() {
    try {
        console.log('Inicializando aplicación Turnero...');
        loadSavedTheme();
        setupIntersectionObserver();
        setupButtonEffects();
        setupNavigationHandlers();
        setupErrorHandling();

        const capabilities = detectDeviceCapabilities();
        console.log('Capacidades detectadas:', capabilities);

        if (!capabilities.reducedMotion && !capabilities.touch) {
            setupParallaxEffect();
        }

        initializeAnalytics();

        setTimeout(() => {
            showNotification('¡Bienvenido a Turnero! Explora nuestras canchas disponibles.', 'success', 5000);
        }, 1000);

        console.log('Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showNotification('Error al cargar la aplicación. Recarga la página.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Visibilidad
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Usuario regresó a la página');
    }
});

// Cleanup
window.addEventListener('beforeunload', function() {
    const sessionData = {
        theme: localStorage.getItem('theme'),
        lastVisit: Date.now()
    };
    sessionStorage.setItem('turneroSession', JSON.stringify(sessionData));
});

// Export para tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mostrarBuscar,
        mostrarPropietario,
        mostrarNosotros,
        mostrarPublicar,
        toggleTheme,
        showNotification
    };
}
