// js/servicios.js - Versión InfinityFree
// Configuración de servicios
const serviciosConfig = {
    imagenes: {
        "Mantenimiento Preventivo PC": "img/serv1.jpg",
        "Formateo e Instalación SO": "img/serv2.jpg", 
        "Remoción de Malware": "img/serv3.jpg",
        "Soporte Remoto (1 hora)": "img/serv4.jpg",
        "default": "img/serv_default.jpg"
    },
    descripciones: {
        "Mantenimiento Preventivo PC": "Limpieza física interna, optimización de sistema y revisión de componentes.",
        "Formateo e Instalación SO": "Formateo completo e instalación limpia del sistema operativo con todos los drivers.",
        "Remoción de Malware": "Eliminación completa de virus, malware y recuperación del sistema.",
        "Soporte Remoto (1 hora)": "Asistencia técnica remota para resolver problemas específicos.",
        "default": "Servicio técnico profesional personalizado."
    }
};

let todosServicios = [];

// Utilidades
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

// Modal de servicios
function abrirModalServicio(servicio) {
    const modal = document.getElementById("modalServicio");
    if (!modal) {
        // Fallback simple
        const confirmar = confirm(`¿Agregar "${servicio.nombre}" a cotización por $${formatPrice(servicio.precio)}?`);
        if (confirmar) agregarACotizacion(servicio);
        return;
    }

    modal.innerHTML = `
        <div class="modal-contenido" style="background:white;padding:20px;border-radius:8px;max-width:500px;margin:50px auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h3 style="margin:0;">${escapeHtml(servicio.nombre)}</h3>
                <button onclick="cerrarModal()" style="background:none;border:none;font-size:20px;cursor:pointer;">×</button>
            </div>
            
            <p style="color:#666;margin-bottom:15px;">${escapeHtml(servicio.descripcion)}</p>
            
            <div style="background:#f8f9fa;padding:15px;border-radius:5px;margin-bottom:15px;">
                <strong style="color:#27ae60;font-size:18px;">$${formatPrice(servicio.precio)}</strong>
            </div>
            
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button onclick="agregarACotizacion(${JSON.stringify(servicio).replace(/"/g, '&quot;')})" 
                        class="btn" style="padding:10px 20px;">
                    Agregar a Cotización
                </button>
                <button onclick="cerrarModal()" 
                        class="btn secondary" style="padding:10px 20px;">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.getElementById("modalServicio");
    if (modal) modal.style.display = 'none';
}

function agregarACotizacion(servicio) {
    const seleccionados = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
    
    seleccionados.push({
        servicioId: servicio.id,
        nombre: servicio.nombre,
        precio: servicio.precio,
        cantidad: 1
    });
    
    localStorage.setItem("serviciosSeleccionados", JSON.stringify(seleccionados));
    cerrarModal();
    
    alert(`✅ "${servicio.nombre}" agregado a cotización`);
    
    // Redirigir después de un momento
    setTimeout(() => {
        window.location.href = "cotizaciones.html";
    }, 1000);
}

// Renderizar catálogo
function renderizarCatalogo(servicios) {
    const contenedor = document.getElementById("catalogoServicios");
    if (!contenedor) return;
    
    if (!servicios || servicios.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center;padding:20px;color:#666;">No hay servicios disponibles.</p>';
        return;
    }
    
    let html = '';
    servicios.forEach(servicio => {
        const imagen = serviciosConfig.imagenes[servicio.nombre] || serviciosConfig.imagenes.default;
        const descripcion = serviciosConfig.descripciones[servicio.nombre] || serviciosConfig.descripciones.default;
        
        html += `
            <div class="servicio-card" style="border:1px solid #ddd;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                <div style="height:150px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:48px;color:#666;">🛠️</span>
                </div>
                <div style="padding:15px;">
                    <h4 style="margin:0 0 10px 0;">${escapeHtml(servicio.nombre)}</h4>
                    <p style="color:#666;font-size:14px;margin-bottom:10px;">${escapeHtml(descripcion)}</p>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <strong style="color:#27ae60;font-size:18px;">$${formatPrice(servicio.precio)}</strong>
                        <button onclick="abrirModalServicio(${JSON.stringify(servicio).replace(/"/g, '&quot;')})" 
                                class="btn" style="padding:8px 16px;">
                            Solicitar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

// Filtros y búsqueda
function aplicarFiltros() {
    const busqueda = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const categoria = document.getElementById("categoriaFiltro")?.value || "todos";
    
    let serviciosFiltrados = [...todosServicios];
    
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
            s.descripcion?.toLowerCase().includes(busqueda)
        );
    }
    
    renderizarCatalogo(serviciosFiltrados);
}

// Inicialización
async function inicializarServicios() {
    try {
        await openDB();
        todosServicios = await getAll("servicios");
        
        // Si no hay servicios, crear algunos demo
        if (todosServicios.length === 0) {
            const serviciosDemo = [
                { id: 1, nombre: "Mantenimiento Preventivo PC", precio: 35, categoria: "Hardware" },
                { id: 2, nombre: "Formateo e Instalación SO", precio: 50, categoria: "Software" },
                { id: 3, nombre: "Remoción de Malware", precio: 45, categoria: "Seguridad" },
                { id: 4, nombre: "Soporte Remoto (1 hora)", precio: 25, categoria: "Soporte" }
            ];
            
            for (const servicio of serviciosDemo) {
                await addItem("servicios", servicio);
            }
            
            todosServicios = await getAll("servicios");
        }
        
        renderizarCatalogo(todosServicios);
        
        // Event listeners para filtros
        const searchInput = document.getElementById("searchInput");
        const categoriaSelect = document.getElementById("categoriaFiltro");
        
        if (searchInput) {
            searchInput.addEventListener("input", aplicarFiltros);
        }
        
        if (categoriaSelect) {
            categoriaSelect.addEventListener("change", aplicarFiltros);
        }
        
    } catch (error) {
        console.error("Error inicializando servicios:", error);
        renderizarCatalogo([]);
    }
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("servicios.html")) {
        inicializarServicios();
    }
});
