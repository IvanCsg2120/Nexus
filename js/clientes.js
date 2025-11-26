// js/clientes.js - Versión InfinityFree
const TAX_RATE = 0.08; // 8%

async function cargarFormCotizacion() {
    await openDB();
    
    // Llenar select clientes y servicios
    const clientes = await getAll("clientes");
    const servicios = await getAll("servicios");

    const selCliente = document.getElementById("cot_cliente");
    const selServicio = document.getElementById("cot_servicio");
    const filtroCliente = document.getElementById("filtroCliente");

    if (selCliente) {
        selCliente.innerHTML = '<option value="">-- Seleccione cliente --</option>';
        clientes.forEach(c => {
            selCliente.innerHTML += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`;
        });
    }

    if (filtroCliente) {
        filtroCliente.innerHTML = '<option value="">-- Todos --</option>';
        clientes.forEach(c => {
            filtroCliente.innerHTML += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`;
        });
    }

    if (selServicio) {
        selServicio.innerHTML = '<option value="">-- Seleccione servicio --</option>';
        servicios.forEach(s => {
            selServicio.innerHTML += `<option value="${s.id}" data-precio="${s.precio}">${escapeHtml(s.nombre)} - $${s.precio}</option>`;
        });
    }

    // Items preseleccionados desde servicios
    const preSeleccion = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");
    if (preSeleccion.length) {
        preSeleccion.forEach(item => agregarItemDesdeSeleccion(item));
        localStorage.removeItem("serviciosSeleccionados");
    }

    listarCotizaciones();
}

let itemsTemp = [];

function agregarItemDesdeSeleccion(item) {
    const found = itemsTemp.find(i => i.servicioId === item.servicioId);
    if (found) {
        found.cantidad += item.cantidad || 1;
    } else {
        itemsTemp.push({
            servicioId: item.servicioId,
            nombre: item.nombre,
            precio: Number(item.precio),
            cantidad: Number(item.cantidad) || 1
        });
    }
    renderItemsTemp();
}

function agregarItem() {
    const sel = document.getElementById("cot_servicio");
    const servicioId = sel ? sel.value : "";
    const cantidad = Number(document.getElementById("cot_cantidad").value) || 1;
    
    if (!servicioId) return alert("Selecciona un servicio.");
    if (cantidad < 1) return alert("Cantidad mínima es 1.");

    const nombre = sel.selectedOptions[0].text.split(" - $")[0];
    const precio = Number(sel.selectedOptions[0].dataset.precio);
    
    itemsTemp.push({
        servicioId: Number(servicioId),
        nombre: nombre,
        precio: precio,
        cantidad: cantidad
    });
    
    renderItemsTemp();
}

function renderItemsTemp() {
    const ul = document.getElementById("cot_items");
    if (!ul) return;
    
    ul.innerHTML = "";
    itemsTemp.forEach((it, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${escapeHtml(it.nombre)} × ${it.cantidad} = $${(it.cantidad * it.precio).toFixed(2)}
            <button class="btn secondary" onclick="quitarItem(${idx})">Quitar</button>
        `;
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
    const impuesto = subtotal * TAX_RATE;
    const total = subtotal + impuesto;
    
    const cont = document.getElementById("resumenCot");
    if (cont) {
        cont.innerHTML = `
            Subtotal: $${subtotal.toFixed(2)} — 
            Impuesto (${(TAX_RATE*100).toFixed(0)}%): $${impuesto.toFixed(2)} — 
            Total: $${total.toFixed(2)}
        `;
    }
}

async function guardarCotizacion() {
    const clienteId = Number(document.getElementById("cot_cliente").value || 0);
    if (!clienteId) return alert("Selecciona un cliente.");
    if (!itemsTemp.length) return alert("Agrega al menos un ítem.");

    const subtotal = itemsTemp.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    const impuesto = subtotal * TAX_RATE;
    const total = subtotal + impuesto;

    const cot = {
        fecha: new Date().toISOString().split('T')[0],
        clienteId: clienteId,
        items: itemsTemp.map(i => ({
            servicioId: i.servicioId,
            nombre: i.nombre,
            cantidad: i.cantidad,
            precio: i.precio
        })),
        subtotal: Number(subtotal.toFixed(2)),
        impuesto: Number(impuesto.toFixed(2)),
        total: Number(total.toFixed(2))
    };

    try {
        await addItem("cotizaciones", cot);
        alert("✅ Cotización guardada correctamente.");
        itemsTemp = [];
        renderItemsTemp();
        listarCotizaciones();
    } catch (err) {
        console.error(err);
        alert("❌ Error guardando cotización.");
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
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Subtotal</th>
                    <th>Impuesto</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    datos.forEach(d => {
        const cliente = clientes.find(c => c.id === d.clienteId) || { nombre: "N/E" };
        html += `
            <tr>
                <td>${d.fecha}</td>
                <td>${d.id}</td>
                <td>${escapeHtml(cliente.nombre)}</td>
                <td>$${d.subtotal.toFixed(2)}</td>
                <td>$${d.impuesto.toFixed(2)}</td>
                <td>$${d.total.toFixed(2)}</td>
                <td>
                    <button class="btn" onclick="verCot(${d.id})">Ver</button>
                    <button class="btn secondary" onclick="borrarCot(${d.id})">Borrar</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    div.innerHTML = html;
}

async function verCot(id) {
    const c = await getItem("cotizaciones", id);
    if (!c) return alert("Cotización no encontrada.");
    
    let txt = `Cotización #${c.id}\nFecha: ${c.fecha}\n\nItems:\n`;
    c.items.forEach(it => {
        txt += `- ${it.nombre} × ${it.cantidad} = $${(it.cantidad * it.precio).toFixed(2)}\n`;
    });
    txt += `\nSubtotal: $${c.subtotal.toFixed(2)}\nImpuesto: $${c.impuesto.toFixed(2)}\nTotal: $${c.total.toFixed(2)}`;
    
    alert(txt);
}

async function borrarCot(id) {
    if (!confirm("¿Eliminar cotización?")) return;
    await deleteItem("cotizaciones", id);
    listarCotizaciones();
}

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
    a.download = `cotizaciones_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Inicialización automática
(async function initCot() {
    const path = location.pathname.split("/").pop();
    if (path !== "cotizaciones.html") return;
    
    await cargarFormCotizacion();
    
    // Event listeners
    const btnAdd = document.querySelector('[onclick="agregarItem()"]');
    if (btnAdd) btnAdd.addEventListener("click", agregarItem);
    
    const btnSave = document.querySelector('[onclick="guardarCotizacion()"]');
    if (btnSave) btnSave.addEventListener("click", guardarCotizacion);
})();
