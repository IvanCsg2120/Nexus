// js/cotizaciones.js
// Crear cotizaciones, agregar items, cálculo de subtotal/impuesto/total y guardado en IndexedDB

const TAX_RATE = 0.08; // 8%

async function cargarFormCotizacion() {
  await openDB();
  // llenar select clientes y servicios
  const clientes = await getAll("clientes");
  const servicios = await getAll("servicios");

  const selCliente = document.getElementById("cot_cliente");
  const selServicio = document.getElementById("cot_servicio");
  const filtroCliente = document.getElementById("filtroCliente");

  if (selCliente) {
    selCliente.innerHTML = '<option value="">-- Seleccione cliente --</option>';
    clientes.forEach(c => selCliente.innerHTML += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`);
  }
  if (filtroCliente) {
    filtroCliente.innerHTML = '<option value="">-- Todos --</option>';
    clientes.forEach(c => filtroCliente.innerHTML += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`);
  }
  if (selServicio) {
    selServicio.innerHTML = '<option value="">-- Seleccione servicio --</option>';
    servicios.forEach(s => selServicio.innerHTML += `<option value="${s.id}" data-precio="${Number(s.precio).toFixed(2)}">${escapeHtml(s.nombre)} - $${Number(s.precio).toFixed(2)}</option>`);
  }

  // leer selecciones guardadas desde servicios.js (si vinieron de ahí)
  const preSeleccion = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
  if (preSeleccion.length) {
    // añadir ítems preseleccionados a la UI
    preSeleccion.forEach(item => agregarItemDesdeSeleccion(item));
    // limpiamos selección para next time
    localStorage.removeItem("serviciosSeleccionados");
  }

  listarCotizaciones();
}

let itemsTemp = []; // items temporales para la cotización actual

function agregarItemDesdeSeleccion(item) {
  // item: { servicioId, nombre, precio, cantidad }
  const found = itemsTemp.find(i => i.nombre === item.nombre && Number(i.precio) === Number(item.price || item.precio));
  if (found) found.cantidad = Number(found.cantidad) + (Number(item.cantidad) || 1);
  else itemsTemp.push({ servicioId: item.servicioId, nombre: item.nombre, precio: Number(item.precio), cantidad: Number(item.cantidad) || 1 });
  renderItemsTemp();
}

function agregarItem() {
  const sel = document.getElementById("cot_servicio");
  const cid = sel ? sel.value : "";
  const cantidad = Number(document.getElementById("cot_cantidad").value) || 1;
  if (!cid) return alert("Selecciona un servicio.");
  if (cantidad < 1) return alert("Cantidad mínima es 1.");

  const nombre = sel.selectedOptions[0].text.split(" - $")[0];
  const precio = Number(sel.selectedOptions[0].dataset.precio);
  itemsTemp.push({ servicioId: Number(cid), nombre: nombre, precio: precio, cantidad: cantidad });
  renderItemsTemp();
}

function renderItemsTemp() {
  const ul = document.getElementById("cot_items");
  if (!ul) return;
  ul.innerHTML = "";
  itemsTemp.forEach((it, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `${escapeHtml(it.nombre)} × ${it.cantidad} = $${(it.cantidad * it.precio).toFixed(2)} 
      <button class="btn secondary" onclick="quitarItem(${idx})">Quitar</button>`;
    ul.appendChild(li);
  });
  actualizarResumen();
}

function quitarItem(idx) {
  itemsTemp.splice(idx, 1);
  renderItemsTemp();
}

function actualizarResumen() {
  const subtotal = itemsTemp.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
  const impuesto = roundToTwo(subtotal * TAX_RATE);
  const total = roundToTwo(subtotal + impuesto);
  const cont = document.getElementById("resumenCot");
  if (cont) cont.innerHTML = `Subtotal: $${subtotal.toFixed(2)} — Impuesto (${(TAX_RATE*100).toFixed(0)}%): $${impuesto.toFixed(2)} — Total: $${total.toFixed(2)}`;
}

async function guardarCotizacion() {
  const clienteId = Number(document.getElementById("cot_cliente").value || 0);
  if (!clienteId) return alert("Selecciona un cliente (obligatorio).");
  if (!itemsTemp.length) return alert("Agrega al menos un ítem.");

  // cálculos (usar paso a paso para evitar errores)
  let subtotal = 0;
  for (const it of itemsTemp) {
    // sum digit-by-digit as required (but here numeric ops suffice)
    subtotal = subtotal + (Number(it.precio) * Number(it.cantidad));
  }
  subtotal = roundToTwo(subtotal);
  const impuesto = roundToTwo(subtotal * TAX_RATE);
  const total = roundToTwo(subtotal + impuesto);

  const cot = {
    fecha: new Date().toISOString().slice(0,10),
    clienteId,
    items: itemsTemp.map(i => ({ servicioId: i.servicioId, nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })),
    subtotal,
    impuesto,
    total
  };

  try {
    await addItem("cotizaciones", cot);
    alert("Cotización guardada correctamente.");
    itemsTemp = [];
    renderItemsTemp();
    listarCotizaciones();
  } catch (err) {
    console.error(err);
    alert("Error guardando cotización.");
  }
}

async function listarCotizaciones(arr) {
  const datos = arr || await getAll("cotizaciones");
  const div = document.getElementById("tblCotizaciones");
  if (!div) return;
  if (!datos || datos.length === 0) {
    div.innerHTML = "<p class='small'>No hay cotizaciones.</p>";
    return;
  }
  const clientes = await getAll("clientes");
  let html = `<table class="table"><thead><tr><th>Fecha</th><th>#</th><th>Cliente</th><th>Subtotal</th><th>Impuesto</th><th>Total</th><th>Acciones</th></tr></thead><tbody>`;
  datos.forEach(d => {
    const cliente = clientes.find(c => c.id === d.clienteId) || { nombre: "N/E" };
    html += `<tr>
      <td>${d.fecha}</td>
      <td>${d.id}</td>
      <td>${escapeHtml(cliente.nombre)}</td>
      <td>$${Number(d.subtotal).toFixed(2)}</td>
      <td>$${Number(d.impuesto).toFixed(2)}</td>
      <td>$${Number(d.total).toFixed(2)}</td>
      <td>
        <button class="btn" onclick="verCot(${d.id})">Ver</button>
        <button class="btn secondary" onclick="borrarCot(${d.id})">Borrar</button>
      </td>
    </tr>`;
  });
  html += `</tbody></table>`;
  div.innerHTML = html;
}

async function verCot(id) {
  const c = await getItem("cotizaciones", id);
  if (!c) return alert("Cotización no encontrada.");
  let txt = `Cotización #${c.id}\nFecha: ${c.fecha}\n\nItems:\n`;
  c.items.forEach(it => txt += `- ${it.nombre} × ${it.cantidad} = $${(it.cantidad * it.precio).toFixed(2)}\n`);
  txt += `\nSubtotal: $${Number(c.subtotal).toFixed(2)}\nImpuesto: $${Number(c.impuesto).toFixed(2)}\nTotal: $${Number(c.total).toFixed(2)}`;
  alert(txt);
}

async function borrarCot(id) {
  if (!confirm("¿Eliminar cotización?")) return;
  await deleteItem("cotizaciones", id);
  listarCotizaciones();
}

function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// filtrar por cliente/rango
async function filtrar() {
  const clienteId = Number(document.getElementById("filtroCliente").value || 0);
  const desde = document.getElementById("fdesde").value;
  const hasta = document.getElementById("fhasta").value;
  let datos = await getAll("cotizaciones");
  if (clienteId) datos = datos.filter(d => d.clienteId === clienteId);
  if (desde) datos = datos.filter(d => d.fecha >= desde);
  if (hasta) datos = datos.filter(d => d.fecha <= hasta);
  listarCotizaciones(datos);
}

// export CSV (simple)
async function exportarCSV() {
  const datos = await getAll("cotizaciones");
  if (!datos || datos.length === 0) return alert("No hay datos a exportar.");
  const clientes = await getAll("clientes");
  let csv = "Fecha,Id,Cliente,Subtotal,Impuesto,Total\n";
  datos.forEach(d => {
    const cliente = clientes.find(c => c.id === d.clienteId) || { nombre: "" };
    csv += `${d.fecha},${d.id},"${cliente.nombre}",${d.subtotal},${d.impuesto},${d.total}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cotizaciones_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// init for cotizaciones page
(async function initCot() {
  const path = location.pathname.split("/").pop();
  if (path !== "cotizaciones.html") return;
  await cargarFormCotizacion();
  // bind form buttons if exist
  const btnAdd = document.querySelector('[onclick="agregarItem()"]');
  if (btnAdd) btnAdd.addEventListener("click", agregarItem);
  const btnSave = document.querySelector('[onclick="guardarCotizacion()"]');
  if (btnSave) btnSave.addEventListener("click", guardarCotizacion);
})();
