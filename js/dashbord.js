/**
 * Dashboard de Propietario - Turnero
 * Sistema de gestión para complejos deportivos
 */

// Configuración global
const CONFIG = {
    dateFormat: 'es-AR',
    currency: 'ARS',
    refreshInterval: 30000, // 30 segundos
    animationDuration: 300
};

// Estado global de la aplicación
const AppState = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: null,
    isLoading: false,
    theme: localStorage.getItem('theme') || 'light'
};

// Datos simulados de la aplicación
const DATA = {
    kpis: {
        revenue: { current: 127500, previous: 113500, trend: 'up' },
        bookings: { current: 23, previous: 21, trend: 'up' },
        customers: { current: 156, previous: 135, trend: 'up' },
        rating: { current: 4.8, previous: 4.6, trend: 'up' }
    },
    
    reservations: [
        {
            id: 1,
            time: '08:00 - 09:00',
            customer: 'Carlos Martínez',
            phone: '+54 11 1234-5678',
            status: 'confirmed',
            amount: 8000
        },
        {
            id: 2,
            time: '10:00 - 11:00',
            customer: 'Ana García',
            phone: '+54 11 8765-4321',
            status: 'confirmed',
            amount: 8000
        },
        {
            id: 3,
            time: '14:00 - 15:00',
            customer: 'Roberto Silva',
            phone: '+54 11 5555-1234',
            status: 'pending',
            amount: 8000
        },
        {
            id: 4,
            time: '16:00 - 17:00',
            customer: 'María López',
            phone: '+54 11 9999-8888',
            status: 'confirmed',
            amount: 8000
        },
        {
            id: 5,
            time: '18:00 - 19:00',
            customer: 'Diego Fernández',
            phone: '+54 11 7777-3333',
            status: 'confirmed',
            amount: 8000
        },
        {
            id: 6,
            time: '20:00 - 21:00',
            customer: 'Laura Rodríguez',
            phone: '+54 11 4444-2222',
            status: 'pending',
            amount: 8000
        }
    ],
    
    activities: [
        {
            id: 1,
            type: 'booking',
            message: 'Nueva reserva confirmada por Carlos Martínez',
            amount: 8000,
            timestamp: new Date(Date.now() - 15 * 60000) // 15 min ago
        },
        {
            id: 2,
            type: 'review',
            message: 'Nueva reseña de 5 estrellas recibida',
            timestamp: new Date(Date.now() - 60 * 60000) // 1 hour ago
        },
        {
            id: 3,
            type: 'customer',
            message: 'Nuevo cliente registrado: Ana García',
            timestamp: new Date(Date.now() - 2 * 60 * 60000) // 2 hours ago
        },
        {
            id: 4,
            type: 'cancellation',
            message: 'Reserva cancelada: María José',
            amount: -8000,
            timestamp: new Date(Date.now() - 3 * 60 * 60000) // 3 hours ago
        },
        {
            id: 5,
            type: 'comment',
            message: 'Nuevo comentario en página de cancha',
            timestamp: new Date(Date.now() - 4 * 60 * 60000) // 4 hours ago
        }
    ],
    
    pricing: {
        weekday: 8000,
        weekend: 10000,
        multipleHoursDiscount: 10
    }
};

/**
 * Utilidades generales
 */
const Utils = {
    /**
     * Formatea un número como moneda
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    /**
     * Formatea una fecha de manera relativa
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Hace unos segundos';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days < 7) return `Hace ${days}d`;
        
        return date.toLocaleDateString('es-AR', {
            month: 'short',
            day: 'numeric'
        });
    },
    
    /**
     * Calcula el porcentaje de cambio entre dos valores
     */
    calculateChange(current, previous) {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    },
    
    /**
     * Anima un contador numérico
     */
    animateCounter(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const range = end - start;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (range * easeOut);
            
            element.textContent = Math.floor(current).toLocaleString('es-AR');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end.toLocaleString('es-AR');
            }
        }
        
        requestAnimationFrame(updateCounter);
    },
    
    /**
     * Debounce function para optimizar eventos
     */
    debounce(func, wait) {
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
};

/**
 * Gestión de temas
 */
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
        
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggle();
        });
    },
    
    setTheme(theme) {
        AppState.theme = theme;
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
    },
    
    toggle() {
        const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    updateToggleIcon() {
        const toggle = document.getElementById('themeToggle');
        const icon = AppState.theme === 'dark' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,18V6A6,6 0 0,1 18,12A6,6 0 0,1 12,18Z"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.4 6.35,17.41C9.37,20.43 14,20.54 17.33,17.97Z"/></svg>';
        toggle.innerHTML = icon;
    }
};

/**
 * Gestión del calendario
 */
const Calendar = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    
    dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    
    init() {
        this.render();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.calendar-day:not(.header)')) {
                const day = parseInt(e.target.textContent);
                if (day) {
                    this.selectDate(day);
                }
            }
        });
    },
    
    render() {
        const grid = document.getElementById('calendarGrid');
        const title = document.getElementById('calendarTitle');
        
        if (!grid || !title) return;
        
        title.textContent = `${this.monthNames[AppState.currentMonth]} ${AppState.currentYear}`;
        grid.innerHTML = '';
        
        // Headers de días
        this.dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            grid.appendChild(dayElement);
        });
        
        // Obtener datos del mes
        const firstDay = new Date(AppState.currentYear, AppState.currentMonth, 1).getDay();
        const daysInMonth = new Date(AppState.currentYear, AppState.currentMonth + 1, 0).getDate();
        const today = new Date();
        
        // Días vacíos al principio
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            grid.appendChild(emptyDay);
        }
        
        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Marcar día actual
            if (today.getDate() === day && 
                today.getMonth() === AppState.currentMonth && 
                today.getFullYear() === AppState.currentYear) {
                dayElement.classList.add('today');
            }
            
            // Simular días con reservas (en una app real vendría del backend)
            if (this.hasReservations(day)) {
                dayElement.classList.add('has-reservations');
            }
            
            grid.appendChild(dayElement);
        }
    },
    
    hasReservations(day) {
        // Simulación: algunos días tienen reservas
        const reservationDays = [8, 9, 15, 16, 22, 23, 24, 29, 30];
        return reservationDays.includes(day);
    },
    
    selectDate(day) {
        AppState.selectedDate = new Date(AppState.currentYear, AppState.currentMonth, day);
        
        // Aquí se cargarían las reservas del día seleccionado
        console.log(`Fecha seleccionada: ${AppState.selectedDate.toLocaleDateString('es-AR')}`);
        
        // Mostrar notificación (en una app real sería un modal o panel lateral)
        NotificationManager.show(`Viendo reservas para ${AppState.selectedDate.toLocaleDateString('es-AR')}`, 'info');
    },
    
    goToToday() {
        const today = new Date();
        AppState.currentMonth = today.getMonth();
        AppState.currentYear = today.getFullYear();
        this.render();
    },
    
    previousMonth() {
        AppState.currentMonth--;
        if (AppState.currentMonth < 0) {
            AppState.currentMonth = 11;
            AppState.currentYear--;
        }
        this.render();
    },
    
    nextMonth() {
        AppState.currentMonth++;
        if (AppState.currentMonth > 11) {
            AppState.currentMonth = 0;
            AppState.currentYear++;
        }
        this.render();
    }
};

/**
 * Gestión de KPIs y estadísticas
 */
const KPIManager = {
    init() {
        this.renderKPIs();
        this.startRealTimeUpdates();
    },
    
    renderKPIs() {
        const kpis = DATA.kpis;
        
        // Animar contadores
        this.animateKPI('ingresosMes', 0, kpis.revenue.current);
        this.animateKPI('reservasHoy', 0, kpis.bookings.current);
        this.animateKPI('clientesActivos', 0, kpis.customers.current);
        this.animateKPI('ratingPromedio', 0, kpis.rating.current, true);
    },
    
    animateKPI(elementId, start, end, isDecimal = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startTime = performance.now();
        const duration = 1500;
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + ((end - start) * easeOut);
            
            if (elementId === 'ingresosMes') {
                element.textContent = Utils.formatCurrency(Math.floor(current));
            } else if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current).toLocaleString('es-AR');
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    },
    
    updateKPI(type, newValue) {
        const kpi = DATA.kpis[type];
        if (!kpi) return;
        
        kpi.previous = kpi.current;
        kpi.current = newValue;
        
        // Actualizar en la UI
        const elementMap = {
            revenue: 'ingresosMes',
            bookings: 'reservasHoy',
            customers: 'clientesActivos',
            rating: 'ratingPromedio'
        };
        
        const elementId = elementMap[type];
        if (elementId) {
            this.animateKPI(elementId, kpi.previous, kpi.current, type === 'rating');
        }
    },
    
    startRealTimeUpdates() {
        setInterval(() => {
            // Simular actualizaciones en tiempo real
            if (Math.random() > 0.8) { // 20% probabilidad cada 30 segundos
                this.simulateUpdate();
            }
        }, CONFIG.refreshInterval);
    },
    
    simulateUpdate() {
        const updateTypes = ['bookings', 'customers'];
        const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
        const currentValue = DATA.kpis[randomType].current;
        const newValue = currentValue + (Math.random() > 0.5 ? 1 : -1);
        
        if (newValue >= 0) {
            this.updateKPI(randomType, newValue);
            
            // Agregar actividad
            ActivityManager.addActivity({
                type: randomType === 'bookings' ? 'booking' : 'customer',
                message: randomType === 'bookings' 
                    ? 'Nueva reserva recibida'
                    : 'Nuevo cliente registrado',
                timestamp: new Date()
            });
        }
    }
};

/**
 * Gestión de reservas
 */
const ReservationManager = {
    init() {
        this.renderReservations();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="confirm"]')) {
                const id = parseInt(e.target.closest('[data-action="confirm"]').dataset.id);
                this.confirmReservation(id);
            }
            
            if (e.target.closest('[data-action="cancel"]')) {
                const id = parseInt(e.target.closest('[data-action="cancel"]').dataset.id);
                this.cancelReservation(id);
            }
        });
    },
    
    renderReservations() {
        const tbody = document.getElementById('reservationsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        DATA.reservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = this.getReservationRowHTML(reservation);
            tbody.appendChild(row);
        });
    },
    
    getReservationRowHTML(reservation) {
        const statusConfig = {
            confirmed: { label: 'Confirmada', class: 'status-confirmed' },
            pending: { label: 'Pendiente', class: 'status-pending' },
            cancelled: { label: 'Cancelada', class: 'status-cancelled' }
        };
        
        const status = statusConfig[reservation.status];
        
        return `
            <td><strong>${reservation.time}</strong></td>
            <td>${reservation.customer}</td>
            <td>${reservation.phone}</td>
            <td><span class="status-badge ${status.class}">${status.label}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    ${reservation.status === 'pending' ? `
                        <button class="btn btn-text" data-action="confirm" data-id="${reservation.id}" style="color: var(--success-color);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9,20.42L2.79,14.21L5.21,11.79L9,15.58L18.79,5.79L21.21,8.21L9,20.42Z"/>
                            </svg>
                        </button>
                        <button class="btn btn-text" data-action="cancel" data-id="${reservation.id}" style="color: var(--error-color);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
    },
    
    confirmReservation(id) {
        const reservation = DATA.reservations.find(r => r.id === id);
        if (reservation) {
            reservation.status = 'confirmed';
            this.renderReservations();
            
            NotificationManager.show(`Reserva de ${reservation.customer} confirmada`, 'success');
            
            ActivityManager.addActivity({
                type: 'booking',
                message: `Reserva confirmada: ${reservation.customer}`,
                amount: reservation.amount,
                timestamp: new Date()
            });
        }
    },
    
    cancelReservation(id) {
        const reservation = DATA.reservations.find(r => r.id === id);
        if (reservation) {
            reservation.status = 'cancelled';
            this.renderReservations();
            
            NotificationManager.show(`Reserva de ${reservation.customer} cancelada`, 'warning');
            
            ActivityManager.addActivity({
                type: 'cancellation',
                message: `Reserva cancelada: ${reservation.customer}`,
                amount: -reservation.amount,
                timestamp: new Date()
            });
        }
    },
    
    refresh() {
        // En una app real, haría fetch al backend
        this.renderReservations();
        NotificationManager.show('Reservas actualizadas', 'info');
    }
};

/**
 * Gestión de actividades
 */
const ActivityManager = {
    init() {
        this.renderActivities();
    },
    
    renderActivities() {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;
        
        feed.innerHTML = '';
        
        DATA.activities.slice(0, 5).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = this.getActivityHTML(activity);
            feed.appendChild(item);
        });
    },
    
    getActivityHTML(activity) {
        const iconMap = {
            booking: '📅',
            review: '⭐',
            customer: '👤',
            cancellation: '❌',
            comment: '💬'
        };
        
        return `
            <div class="activity-icon">${iconMap[activity.type] || '📋'}</div>
            <div class="activity-content">
                <div class="activity-text">
                    ${activity.message}
                    ${activity.amount ? ` - ${Utils.formatCurrency(Math.abs(activity.amount))}` : ''}
                </div>
                <div class="activity-time">${Utils.formatRelativeTime(activity.timestamp)}</div>
            </div>
        `;
    },
    
    addActivity(activity) {
        activity.id = Date.now();
        DATA.activities.unshift(activity);
        
        // Mantener solo las últimas 20 actividades
        if (DATA.activities.length > 20) {
            DATA.activities = DATA.activities.slice(0, 20);
        }
        
        this.renderActivities();
    }
};

/**
 * Gestión de modales
 */
const ModalManager = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus en el primer input si existe
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },
    
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },
    
    init() {
        // Cerrar modal al hacer clic en el backdrop
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.close(modal.id);
                }
            }
        });
        
        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    this.close(openModal.id);
                }
            }
        });
    }
};

/**
 * Sistema de notificaciones
 */
const NotificationManager = {
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                </button>
            </div>
        `;
        
        this.addNotificationStyles();
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-cerrar
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    },
    
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                gap: 12px;
            }
            .notification-message {
                flex: 1;
                font-size: 14px;
                color: var(--text-primary);
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: var(--transition);
            }
            .notification-close:hover {
                background: var(--bg-tertiary);
                color: var(--text-primary);
            }
            .notification-success {
                border-left: 4px solid var(--success-color);
            }
            .notification-warning {
                border-left: 4px solid var(--warning-color);
            }
            .notification-error {
                border-left: 4px solid var(--error-color);
            }
            .notification-info {
                border-left: 4px solid var(--accent-color);
            }
        `;
        document.head.appendChild(style);
    }
};

/**
 * Funciones globales para el HTML
 */
window.toggleTheme = () => ThemeManager.toggle();
window.previousMonth = () => Calendar.previousMonth();
window.nextMonth = () => Calendar.nextMonth();
window.goToToday = () => Calendar.goToToday();
window.refreshReservations = () => ReservationManager.refresh();
window.openPriceModal = () => ModalManager.open('priceModal');
window.closeModal = (id) => ModalManager.close(id);
window.exportReport = () => NotificationManager.show('Función de exportación próximamente', 'info');
window.addReservation = () => NotificationManager.show('Función de nueva reserva próximamente', 'info');
window.openScheduleModal = () => NotificationManager.show('Gestión de horarios próximamente', 'info');
window.openReportsModal = () => NotificationManager.show('Reportes detallados próximamente', 'info');

window.savePrices = () => {
    const weekdayPrice = document.getElementById('precioSemana').value;
    const weekendPrice = document.getElementById('precioFinSemana').value;
    const discount = document.getElementById('descuentoMultiple').value;
    
    DATA.pricing.weekday = parseInt(weekdayPrice);
    DATA.pricing.weekend = parseInt(weekendPrice);
    DATA.pricing.multipleHoursDiscount = parseInt(discount);
    
    ModalManager.close('priceModal');
    NotificationManager.show('Precios actualizados correctamente', 'success');
    
    ActivityManager.addActivity({
        type: 'config',
        message: 'Configuración de precios actualizada',
        timestamp: new Date()
    });
};

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Dashboard Turnero...');
    
    // Inicializar módulos
    ThemeManager.init();
    ModalManager.init();
    Calendar.init();
    KPIManager.init();
    ReservationManager.init();
    ActivityManager.init();
    
    // Configurar actualizaciones automáticas
    setInterval(() => {
        ActivityManager.renderActivities();
    }, 60000); // Actualizar timestamps cada minuto
    
    console.log('✅ Dashboard cargado correctamente');
    console.log('💡 Tip: Haz clic en los días del calendario para ver reservas específicas');
});