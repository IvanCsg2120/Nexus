// servicios.js
// Catálogo visual vertical — carga servicios desde IndexedDB y permite solicitar

// Mapea nombres a imágenes (coloca files en /img/ con esos nombres o ajusta rutas)
const imagenesServicios = {
  "Mantenimiento Preventivo PC": "img/serv1.jpg",
  "Formateo e Instalación SO": "img/serv2.jpg",
  "Remoción de Malware": "img/serv3.jpg",
  "Soporte Remoto (hora)": "img/serv4.jpg",
  "default": "img/serv_default.jpg"
};

// Descripciones cortas para cada servicio
const descripcionesServicios = {
  "Mantenimiento Preventivo PC": "Limpieza física interna, optimización de sistema, y revisión básica de hardware para mejorar rendimiento.",
  "Formateo e Instalación SO": "Formateo completo e instalación del sistema operativo, drivers y configuración inicial para dejar el equipo listo.",
  "Remoción de Malware": "Análisis profundo, eliminación de virus/troyanos/malware y restauración de configuraciones para recuperar estabilidad.",
  "Soporte Remoto (hora)": "Asistencia remota por sesión: resolución de problemas, configuraciones y tutorías puntuales por hora.",
  "default": "Servicio técnico profesional a solicitud del cliente."
};

// Asegura DB y carga catálogo
async function initCatalogo() {
  // Espera que la DB esté lista (openDB en js/db.js)
  if (typeof ensureDBReady === "function") await ensureDBReady();
  else if (typeof openDB === "function") await openDB();

  // Obtener servicios (si no hay, se habrán inicializado en seedDemoData)
  let servicios = [];
  try {
    servicios = await getAll("servicios");
  } catch (err) {
    console.error("Error leyendo servicios:", err);
    servicios = [];
  }

  // Si no hay servicios, crear demo localmente (fallback)
  if (!servicios || servicios.length === 0) {
    servicios = [
      { nombre: "Mantenimiento Preventivo PC", precio: 35 },
      { nombre: "Formateo e Instalación SO", precio: 50 },
      { nombre: "Remoción de Malware", precio: 45 },
      { nombre: "Soporte Remoto (hora)", precio: 20 }
    ];
    // opcional: guardarlos en la BD
    for (const s of servicios) {
      try { await addItem("servicios", s); } catch (e) { /* ignore si ya existen */ }
    }
    // reload desde BD para obtener ids
    servicios = await getAll("servicios");
  }

  renderCatalogo(servicios);
}

// Renderiza las cards dentro del contenedor
function renderCatalogo(servicios) {
  const cont = document.getElementById("catalogoServicios");
  cont.innerHTML = "";

  servicios.forEach(serv => {
    const imgSrc = imagenesServicios[serv.nombre] || imagenesServicios["default"];
    const desc = descripcionesServicios[serv.nombre] || descripcionesServicios["default"];
    const precio = (typeof serv.precio === "number") ? serv.precio.toFixed(2) : (serv.precio || "0.00");

    const item = document.createElement("div");
    item.className = "servicio-item";

    item.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(serv.nombre)}" loading="lazy" />
      <div class="servicio-info">
        <h3>${escapeHtml(serv.nombre)}</h3>
        <p class="desc">${escapeHtml(desc)}</p>
        <div class="meta-row">
          <div class="precio">$${precio}</div>
          <div style="margin-left:auto">
            <button class="btn-catalogo" onclick="solicitarServicio(${serv.id || 'null'}, '${escapeJs(serv.nombre)}', ${precio})">
              Solicitar servicio
            </button>
          </div>
        </div>
      </div>
    `;

    cont.appendChild(item);
  });
}

// Cuando el usuario solicita un servicio existente
// si servId == null hay que usar el nombre (caso fallback)
function solicitarServicio(servId, servNombre, precio) {
  // Confirmación simple
  const text = `Solicitar servicio:\n\n${servNombre}\nPrecio base: $${Number(precio).toFixed(2)}\n\n¿Deseas añadirlo a la cotización?`;
  if (!confirm(text)) return;

  // Guardar selección temporal en localStorage para que cotizaciones.html la lea
  const seleccionado = { servicioId: servId, nombre: servNombre, precio: Number(precio) };
  // Si ya hay lista de ítems temporales
  const lista = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
  lista.push(seleccionado);
  localStorage.setItem("serviciosSeleccionados", JSON.stringify(lista));

  // Redirigir a cotizaciones para que el usuario complete la cotización
  location.href = "cotizaciones.html";
}

// Servicio personalizado: abre modal simple (aquí usamos mailto para envío rápido)
function solicitarServicioPersonalizado() {
  const descripcion = prompt("Describe brevemente el servicio que necesitas (ej: 'Recuperación de datos SSD, 500GB'):");
  if (!descripcion) return alert("Solicitud cancelada.");

  // abrir cliente de correo con body prellenado
  const subject = encodeURIComponent("Solicitud de servicio personalizado");
  const body = encodeURIComponent("El cliente solicita el siguiente servicio:\n\n" + descripcion + "\n\nPor favor, contactar para cotizar.");
  // Cambia freelancer@soporte.com por tu email real
  const mailto = `mailto:freelancer@soporte.com?subject=${subject}&body=${body}`;
  window.location.href = mailto;
}

// Util: escapar HTML simple
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Util: escapar para usar dentro de JS en onclick (conservar comillas seguras)
function escapeJs(s) {
  if (!s) return "";
  return String(s).replace(/'/g, "\\'").replace(/"/g, '\\"')// servicios.js PREMIUM – genera tarjetas completas con carrusel automático

// Imágenes por servicio (puedes cambiarlas luego o poner reales)
const imagenesServicios = {
  "Mantenimiento Preventivo PC": [
    "img/mantenimiento1.jpg",
    "img/mantenimiento2.jpg",
    "img/mantenimiento3.jpg",
    "img/mantenimiento4.jpg",
  ],
  "Formateo e Instalación SO": [
    "img/formateo1.jpg",
    "img/formateo2.jpg",
    "img/formateo3.jpg",
    "img/formateo4.jpg",
  ],
  "Remoción de Malware": [
    "img/malware1.jpg",
    "img/malware2.jpg",
    "img/malware3.jpg",
    "img/malware4.jpg",
  ],
  "Soporte Remoto (hora)": [
    "img/remoto1.jpg",
    "img/remoto2.jpg",
    "img/remoto3.jpg",
    "img/remoto4.jpg",
  ],
  "default": [
    "img/default1.jpg",
    "img/default2.jpg",
    "img/default3.jpg",
    "img/default4.jpg",
  ]
};

// Descripciones premium
const descripcionesServicios = {
  "Mantenimiento Preventivo PC":
    "Incluye limpieza física interna, optimización avanzada del sistema, verificación de sectores, prueba de rendimiento y ajustes generalizados.",
  "Formateo e Instalación SO":
    "Formateo completo, instalación del sistema operativo, drivers originales, ajustes de rendimiento y configuración esencial.",
  "Remoción de Malware":
    "Análisis profundo, eliminación de virus y spyware, restauración de configuraciones críticas y blindaje preventivo.",
  "Soporte Remoto (hora)":
    "Asistencia remota profesional vía escritorio compartido. Solución de errores, optimización y configuración avanzada.",
  "default":
    "Servicio técnico profesional según solicitud del cliente."
};

// Inicializar catálogo
async function initCatalogo() {
  await ensureDBReady();
  const servicios = await getAll("servicios");
  renderServiciosPremium(servicios);
}

// Render de tarjetas premium con carrusel
function renderServiciosPremium(servicios) {
  const cont = document.getElementById("catalogoServicios");
  cont.innerHTML = "";

  servicios.forEach(serv => {

    const listaImgs = imagenesServicios[serv.nombre] || imagenesServicios["default"];
    const desc = descripcionesServicios[serv.nombre] || descripcionesServicios["default"];
    const precio = Number(serv.precio).toFixed(2);

    const card = document.createElement("div");
    card.className = "servicio-card";

    // HTML premium con carrusel
    card.innerHTML = `
      <div class="carrusel-container">
        <div class="carrusel">
          ${listaImgs.map(src => `<img src="${src}" alt="${serv.nombre}">`).join("")}
        </div>
      </div>

      <div class="servicio-info">
        <h3>${serv.nombre}</h3>
        <p>${desc}</p>
        <div class="precio">$${precio}</div>
        <button class="btn-servicio" onclick="solicitarServicio('${serv.nombre}', ${precio})">
          Solicitar Servicio
        </button>
      </div>
    `;

    cont.appendChild(card);
  });
}

// Redirección a cotizaciones o guardar selección
function solicitarServicio(nombre, precio) {
  const confirmar = confirm(
    `¿Deseas solicitar este servicio?\n\n${nombre}\nPrecio: $${precio}`
  );

  if (!confirmar) return;

  const seleccion = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
  seleccion.push({ nombre, precio });
  localStorage.setItem("serviciosSeleccionados", JSON.stringify(seleccion));

  location.href = "cotizaciones.html";
}

// Solicitar servicio personalizado
function solicitarServicioPersonalizado() {
  const descripcion = prompt("Describe el servicio que necesitas:");

  if (!descripcion) return;

  const mailto = `mailto:freelancer@soporte.com?subject=Solicitud de servicio personalizado&body=${encodeURIComponent(descripcion)}`;

  window.location.href = mailto;
}

setTimeout(() => initCatalogo(), 300);
;
}

// Inicializar catálogo al cargar (pequeño delay para que db.js abra la BD)
setTimeout(() => initCatalogo().catch(e => console.error(e)), 300);
