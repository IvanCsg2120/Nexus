// js/servicios.js - Versión Mejorada con Animaciones
// Configuración de servicios
const serviciosConfig = {
    iconos: {
        "Mantenimiento Preventivo PC": "fas fa-laptop-medical",
        "Formateo e Instalación SO": "fas fa-desktop", 
        "Remoción de Malware": "fas fa-shield-virus",
        "Soporte Remoto (por hora)": "fas fa-headset",
        "Reparación de Pantallas": "fas fa-tablet-alt",
        "Instalación de Redes": "fas fa-network-wired",
        "Recuperación de Datos": "fas fa-hdd",
        "Optimización de Sistema": "fas fa-tachometer-alt",
        "Backup y Cloud": "fas fa-cloud-upload-alt",
        "Consultoría IT": "fas fa-chart-line",
        "default": "fas fa-tools"
    },
    descripciones: {
        "Mantenimiento Preventivo PC": "Limpieza física interna completa, optimización de sistema y revisión de componentes para garantizar el máximo rendimiento y extender la vida útil del equipo.",
        "Formateo e Instalación SO": "Formateo completo e instalación limpia del sistema operativo con todos los controladores necesarios, actualizaciones y configuración básica para un rendimiento óptimo.",
        "Remoción de Malware": "Eliminación completa de virus, malware y recuperación del sistema afectado con medidas de protección adicional para prevenir futuras infecciones.",
        "Soporte Remoto (por hora)": "Asistencia técnica remota profesional para resolución inmediata de problemas desde la comodidad de su hogar u oficina.",
        "Reparación de Pantallas": "Servicio profesional de reemplazo de pantallas para laptops, tablets y monitores utilizando componentes de alta calidad con garantía.",
        "Instalación de Redes": "Planificación completa de red, instalación de equipos, configuración de seguridad y optimización de señal para entornos domésticos y empresariales.",
        "Recuperación de Datos": "Recuperación avanzada de datos desde unidades dañadas, eliminación accidental o corrupción del sistema con altas tasas de éxito.",
        "Optimización de Sistema": "Análisis completo del sistema y ajustes avanzados para mejorar significativamente el rendimiento y la velocidad.",
        "Backup y Cloud": "Soluciones de backup seguro y servicios de migración a la nube para proteger sus datos valiosos y garantizar la continuidad del negocio.",
        "Consultoría IT": "Consultoría estratégica de TI para optimizar su infraestructura tecnológica y alinearla con sus objetivos comerciales.",
        "default": "Servicio técnico profesional personalizado para sus necesidades y requisitos específicos."
    },
    caracteristicas: {
        "Mantenimiento Preventivo PC": ["Limpieza interna completa", "Optimización de sistema", "Revisión de componentes", "Diagnóstico completo", "Garantía 30 días"],
        "Formateo e Instalación SO": ["Formateo completo", "Instalación limpia de SO", "Todos los drivers", "Configuración básica", "Antivirus incluido"],
        "Remoción de Malware": ["Escaneo completo", "Eliminación de amenazas", "Restauración de sistema", "Protección adicional", "Informe detallado"],
        "Soporte Remoto (por hora)": ["Asistencia en tiempo real", "Solución de problemas", "Instalación de software", "Configuración de apps", "Seguimiento post-servicio"],
        "Reparación de Pantallas": ["Diagnóstico gratuito", "Pantallas de calidad", "Garantía 90 días", "Servicio rápido", "Presupuesto previo"],
        "Instalación de Redes": ["Planificación de red", "Equipos certificados", "Configuración seguridad", "Optimización señal", "Documentación técnica"],
        "Recuperación de Datos": ["Diagnóstico gratuito", "Múltiples métodos", "Alta tasa de éxito", "Confidencialidad", "Entrega segura"],
        "Optimización de Sistema": ["Análisis completo", "Ajustes avanzados", "Mejora velocidad", "Mantenimiento", "Reporte de mejoras"],
        "Backup y Cloud": ["Estrategia backup", "Soluciones cloud", "Encriptación datos", "Monitoreo 24/7", "Recuperación rápida"],
        "Consultoría IT": ["Auditoría completa", "Plan estratégico", "Optimización costos", "Roadmap tecnológico", "Soporte ejecutivo"],
        "default": ["Servicio personalizado", "Profesional certificado", "Garantía de calidad", "Soporte post-servicio"]
    }
};

// Datos de servicios
const servicios = [
    { id: 1, nombre: "Mantenimiento Preventivo PC", precio: 35.00, categoria: "hardware", duracion: "2-3 horas", popular: true, garantia: "30 días" },
    { id: 2, nombre: "Formateo e Instalación SO", precio: 50.00, categoria: "software", duracion: "3-4 horas", garantia: "60 días" },
    { id: 3, nombre: "Remoción de Malware", precio: 45.00, categoria: "seguridad", duracion: "1-2 horas", nuevo: true, garantia: "90 días" },
    { id: 4, nombre: "Soporte Remoto (por hora)", precio: 20.00, categoria: "soporte", duracion: "1 hora", popular: true, garantia: "Incluida" },
    { id: 5, nombre: "Reparación de Pantallas", precio: 80.00, categoria: "hardware", duracion: "1-2 días", garantia: "90 días" },
    { id: 6, nombre: "Instalación de Redes", precio: 65.00, categoria: "redes", duracion: "2-3 horas", garantia: "60 días" },
    { id: 7, nombre: "Recuperación de Datos", precio: 75.00, categoria: "software", duracion: "2-5 días", nuevo: true, garantia: "Servicio" },
    { id: 8, nombre: "Optimización de Sistema", precio: 30.00, categoria: "software", duracion: "1-2 horas", garantia: "30 días" },
    { id: 9, nombre: "Backup y Cloud", precio: 55.00, categoria: "software", duracion: "3-4 horas", oferta: true, garantia: "Continuo" },
    { id: 10, nombre: "Consultoría IT", precio: 90.00, categoria: "soporte", duracion: "Personalizado", garantia: "Seguimiento" }
];

let todosServicios = [];
let serviciosFiltrados = [...servicios];

// ==========================================
// FUNCIONES DE ANIMACIÓN Y NAVEGACIÓN
// ==========================================

// Función para navegar con animación
function navegarConAnimacion(url) {
    const mainContent = document.querySelector('.dashboard-content') || document.querySelector('.main-wrapper');
    
    if (mainContent) {
        // Mostrar loader
        mostrarLoader();
        
        // Agregar clase de animación de salida
        mainContent.classList.add('page-exit');
        
        // Esperar a que termine la animación de salida antes de navegar
        setTimeout(() => {
            document.body.classList.add('animating');
            window.location.href = url;
        }, 400); // Mismo tiempo que la duración de la animación
    } else {
        // Fallback: navegación normal sin animación
        window.location.href = url;
    }
}

// Función para mostrar loader
function mostrarLoader() {
    let loader = document.getElementById('pageLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <div class="loader-text">Cargando...</div>
        `;
        document.body.appendChild(loader);
    }
    
    setTimeout(() => {
        loader.classList.add('active');
    }, 10);
}

// Función para ir al inicio con animación
function irAlInicio() {
    navegarConAnimacion('dashboard.html'); // Cambia por tu página de inicio
    mostrarNotificacion('🏠 Redirigiendo al inicio...', 'success');
}

// Configurar navegación en el sidebar
function configurarNavegacionSidebar() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.href && !this.classList.contains('active')) {
                e.preventDefault();
                const url = this.href;
                
                // Agregar clase activa visualmente
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Navegar con animación
                navegarConAnimacion(url);
            }
        });
    });
}

// ==========================================
// UTILIDADES
// ==========================================

function escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatPrice(num) {
    return Number(num || 0).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ==========================================
// MODAL DE SERVICIOS
// ==========================================

function abrirModalServicio(servicio) {
    const modal = document.getElementById("modalServicio");
    if (!modal) {
        // Fallback simple
        const confirmar = confirm(`¿Agregar "${servicio.nombre}" a cotización por $${formatPrice(servicio.precio)}?`);
        if (confirmar) agregarACotizacion(servicio);
        return;
    }

    const caracteristicas = serviciosConfig.caracteristicas[servicio.nombre] || serviciosConfig.caracteristicas.default;
    const icono = serviciosConfig.iconos[servicio.nombre] || serviciosConfig.iconos.default;
    
    modal.innerHTML = `
        <div class="modal-contenido">
            <div class="modal-header">
                <h2><i class="${icono}" style="margin-right: 10px;"></i>${escapeHtml(servicio.nombre)}</h2>
                <button class="btn-cerrar-modal" onclick="cerrarModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 30px; margin-bottom: 25px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 280px;">
                        <div class="servicio-imagen">
                            <i class="${icono}"></i>
                        </div>
                    </div>
                    <div style="flex: 2; min-width: 320px;">
                        <div class="servicio-categoria">${servicio.categoria.charAt(0).toUpperCase() + servicio.categoria.slice(1)}</div>
                        <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">${escapeHtml(serviciosConfig.descripciones[servicio.nombre] || serviciosConfig.descripciones.default)}</p>
                        
                        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid var(--mountain-meadow);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                                <div>
                                    <strong style="color: var(--forest); font-size: 28px;">$${formatPrice(servicio.precio)}</strong>
                                    <span style="color: #666; margin-left: 10px; font-size: 14px;">${servicio.duracion}</span>
                                </div>
                                <div style="background: rgba(34, 202, 149, 0.1); padding: 8px 16px; border-radius: 20px; color: var(--forest); font-weight: 600; font-size: 14px;">
                                    <i class="fas fa-shield-alt"></i> Garantía: ${servicio.garantia || "30 días"}
                                </div>
                            </div>
                        </div>
                        
                        <h3 style="margin-bottom: 15px; color: var(--dark-green); font-size: 1.3rem;"><i class="fas fa-check-circle" style="color: var(--mountain-meadow);"></i> Características del servicio:</h3>
                        <div class="servicio-caracteristicas">
                            ${caracteristicas.map(c => `
                                <div class="servicio-caracteristica">
                                    <i class="fas fa-check" style="color: var(--pistachio);"></i>
                                    <span>${c}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 25px; flex-wrap: wrap;">
                    <button onclick="agregarACotizacion(${JSON.stringify(servicio).replace(/"/g, '&quot;')})" 
                            class="btn-contratar" style="padding: 14px 28px; font-size: 1.05rem;">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar a Cotización
                    </button>
                    <button onclick="cerrarModal()" 
                            class="btn-detalles" style="padding: 14px 28px; font-size: 1.05rem;">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Agregar animación de entrada
    setTimeout(() => {
        modal.querySelector('.modal-contenido').style.transform = 'translateY(0) scale(1)';
        modal.querySelector('.modal-contenido').style.opacity = '1';
    }, 10);
}

function cerrarModal() {
    const modal = document.getElementById("modalServicio");
    if (modal) {
        modal.querySelector('.modal-contenido').style.transform = 'translateY(20px) scale(0.95)';
        modal.querySelector('.modal-contenido').style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ==========================================
// GESTIÓN DE COTIZACIONES
// ==========================================

function agregarACotizacion(servicio) {
    const seleccionados = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
    
    // Verificar si el servicio ya está en la cotización
    const existe = seleccionados.find(s => s.servicioId === servicio.id);
    if (existe) {
        existe.cantidad += 1;
    } else {
        seleccionados.push({
            servicioId: servicio.id,
            nombre: servicio.nombre,
            precio: servicio.precio,
            cantidad: 1,
            categoria: servicio.categoria,
            garantia: servicio.garantia
        });
    }
    
    localStorage.setItem("serviciosSeleccionados", JSON.stringify(seleccionados));
    cerrarModal();
    
    // Mostrar notificación mejorada
    mostrarNotificacion(`✅ "${servicio.nombre}" agregado a cotización`, 'success');
    
    // Actualizar badge de cotizaciones
    actualizarBadgeCotizaciones();
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    const bgColor = tipo === 'success' ? 'var(--mountain-meadow)' : '#FF6B6B';
    
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1001;
        font-weight: 600;
        transition: all 0.4s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        transform: translateX(100px);
        opacity: 0;
    `;
    
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
        notificacion.style.opacity = '1';
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100px)';
        notificacion.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 400);
    }, 4000);
}

function actualizarBadgeCotizaciones() {
    const seleccionados = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
    const totalItems = seleccionados.reduce((sum, item) => sum + item.cantidad, 0);
    
    const badge = document.getElementById('navBadgeCotizaciones');
    if (badge) {
        badge.textContent = totalItems;
    }
}

// ==========================================
// RENDERIZADO DEL CATÁLOGO
// ==========================================

function renderizarCatalogo(servicios) {
    const contenedor = document.getElementById("catalogoServicios");
    if (!contenedor) return;
    
    if (!servicios || servicios.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 4rem; color: #cbd5e1; margin-bottom: 20px;"></i>
                <h3 style="color: #64748b; margin-bottom: 10px;">No se encontraron servicios</h3>
                <p style="color: #94a3b8;">Intenta ajustar los filtros o términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    servicios.forEach(servicio => {
        const descripcion = serviciosConfig.descripciones[servicio.nombre] || serviciosConfig.descripciones.default;
        const caracteristicas = serviciosConfig.caracteristicas[servicio.nombre] || serviciosConfig.caracteristicas.default;
        const icono = serviciosConfig.iconos[servicio.nombre] || serviciosConfig.iconos.default;
        
        html += `
            <div class="servicio-card">
                ${servicio.popular ? '<div class="servicio-badge popular">Popular</div>' : ''}
                ${servicio.nuevo ? '<div class="servicio-badge nuevo">Nuevo</div>' : ''}
                ${servicio.oferta ? '<div class="servicio-badge oferta">Oferta</div>' : ''}
                
                <div class="servicio-imagen">
                    <i class="${icono}"></i>
                </div>
                
                <div class="servicio-contenido">
                    <div class="servicio-categoria">${servicio.categoria.charAt(0).toUpperCase() + servicio.categoria.slice(1)}</div>
                    <h3 class="servicio-titulo">${escapeHtml(servicio.nombre)}</h3>
                    <p class="servicio-descripcion">${escapeHtml(descripcion)}</p>
                    
                    <div class="servicio-caracteristicas">
                        ${caracteristicas.slice(0, 3).map(c => `
                            <div class="servicio-caracteristica">
                                <i class="fas fa-check" style="color: var(--pistachio);"></i>
                                <span>${c}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="servicio-precio">
                        <div>
                            <span class="precio-actual">$${formatPrice(servicio.precio)}</span>
                        </div>
                        <div class="servicio-duracion">
                            <i class="far fa-clock"></i>
                            <span>${servicio.duracion}</span>
                        </div>
                    </div>
                    
                    <div class="servicio-acciones">
                        <button class="btn-servicio btn-contratar" onclick="abrirModalServicio(${JSON.stringify(servicio).replace(/"/g, '&quot;')})">
                            <i class="fas fa-shopping-cart"></i>
                            Solicitar
                        </button>
                        <button class="btn-servicio btn-detalles" onclick="abrirModalServicio(${JSON.stringify(servicio).replace(/"/g, '&quot;')})">
                            <i class="fas fa-info-circle"></i>
                            Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

// ==========================================
// FILTROS Y BÚSQUEDA
// ==========================================

function aplicarFiltros() {
    const busqueda = document.getElementById("searchInputServicios")?.value.toLowerCase() || "";
    const categoria = document.getElementById("categoriaFiltro")?.value || "todos";
    
    serviciosFiltrados = [...servicios];
    
    // Filtrar por categoría
    if (categoria !== "todos") {
        serviciosFiltrados = serviciosFiltrados.filter(s => 
            s.categoria?.toLowerCase() === categoria.toLowerCase()
        );
    }
    
    // Filtrar por búsqueda
    if (busqueda) {
        serviciosFiltrados = serviciosFiltrados.filter(s =>
            s.nombre.toLowerCase().includes(busqueda) ||
            (serviciosConfig.descripciones[s.nombre] || "").toLowerCase().includes(busqueda) ||
            s.categoria.toLowerCase().includes(busqueda)
        );
    }
    
    renderizarCatalogo(serviciosFiltrados);
}

// ==========================================
// SERVICIO PERSONALIZADO
// ==========================================

function solicitarServicioPersonalizado() {
    const servicioPersonalizado = prompt("Por favor, describe el servicio que necesitas. Incluye detalles como:\n\n• Tipo de equipo/problema\n• Síntomas específicos\n• Urgencia del servicio\n• Presupuesto aproximado\n\nNuestro equipo se contactará contigo en menos de 2 horas hábiles:");
    
    if (servicioPersonalizado && servicioPersonalizado.trim() !== "") {
        // Simular envío profesional
        mostrarNotificacion("📧 Tu solicitud ha sido enviada a nuestro equipo técnico. Te contactaremos pronto.", 'success');
        
        // En un entorno real, aquí se enviaría a un sistema de tickets
        setTimeout(() => {
            mostrarNotificacion("👨‍💻 Nuestro técnico asignado revisará tu solicitud y te contactará para coordinar una solución.", 'success');
        }, 2000);
    }
}

// ==========================================
// FUNCIONES DE LA BARRA LATERAL
// ==========================================

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    document.querySelector('.main-wrapper').classList.toggle('sidebar-collapsed');
}

function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem("sessionUser");
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("serviciosSeleccionados");
        window.location.href = "index.html";
    }
}

function toggleNotifications() {
    mostrarNotificacion("🔔 No hay nuevas notificaciones pendientes.", 'success');
}

function toggleMessages() {
    mostrarNotificacion("💬 Sistema de mensajes en desarrollo - Próximamente", 'success');
}

function openNewProjectModal() {
    mostrarNotificacion("🆕 Función de nuevo proyecto en desarrollo", 'success');
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

async function inicializarServicios() {
    try {
        // Verificar sesión
        const s = localStorage.getItem("sessionUser");
        if (!s) { 
            location.href = "index.html"; 
            return; 
        }

        const user = JSON.parse(s);
        
        // Actualizar información del usuario en sidebar
        document.getElementById("sidebarUserName").textContent = user.nombre || "Usuario";
        document.getElementById("sidebarUserRole").textContent = user.rol || "Administrador";

        // Configurar navegación del sidebar
        configurarNavegacionSidebar();
        
        // Inicializar badges
        actualizarBadgeCotizaciones();
        
        // Cargar servicios desde IndexedDB o usar datos demo
        await openDB();
        todosServicios = await getAll("servicios");
        
        // Si no hay servicios, crear algunos demo
        if (todosServicios.length === 0) {
            for (const servicio of servicios) {
                await addItem("servicios", servicio);
            }
            todosServicios = await getAll("servicios");
        }
        
        // Renderizar servicios con efecto de carga
        setTimeout(() => {
            renderizarCatalogo(todosServicios);
            serviciosFiltrados = [...todosServicios];
        }, 300);
        
        // Event listeners para filtros
        const searchInput = document.getElementById("searchInputServicios");
        const categoriaSelect = document.getElementById("categoriaFiltro");
        
        if (searchInput) {
            searchInput.addEventListener("input", aplicarFiltros);
        }
        
        if (categoriaSelect) {
            categoriaSelect.addEventListener("change", aplicarFiltros);
        }
        
        // Cerrar modal al hacer clic fuera o presionar ESC
        window.addEventListener("click", function(event) {
            const modal = document.getElementById("modalServicio");
            if (event.target === modal) {
                cerrarModal();
            }
        });
        
        window.addEventListener("keydown", function(event) {
            if (event.key === "Escape") {
                cerrarModal();
            }
        });
        
        // Efecto de carga inicial
        document.getElementById("catalogoServicios").innerHTML = `
            <div style="grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 2rem;">
                ${Array(6).fill(0).map(() => `
                    <div class="servicio-card" style="min-height: 450px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite;"></div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error("Error inicializando servicios:", error);
        // Fallback a datos locales
        renderizarCatalogo(servicios);
        serviciosFiltrados = [...servicios];
    }
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("servicios.html")) {
        inicializarServicios();
    }
});
