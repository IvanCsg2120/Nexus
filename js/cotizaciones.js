// js/cotizaciones.js

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const TAX_RATE = 0.08; 
let itemsTemp = [];

async function cargarFormCotizacion() {
    await openDB();

    const clientes = await getAll("clientes");
    const servicios = await getAll("servicios");

    const selCliente = document.getElementById("cot_cliente");
    const selServicio = document.getElementById("cot_servicio");

    if (selCliente) {
        selCliente.innerHTML = '<option value="">-- Seleccione cliente --</option>';
        clientes.forEach(c =>
            selCliente.innerHTML += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`
        );
    }

    if (selServicio) {
        selServicio.innerHTML = '<option value="">-- Seleccione servicio --</option>';
        servicios.forEach(s =>
            selServicio.innerHTML += `<option value="${s.id}" data-precio="${s.precio}">
                ${escapeHtml(s.nombre)} - $${Number(s.precio).toFixed(2)}
            </option>`
        );
    }

    listarCotizaciones();
}

function agregarItem() {
    const sel = document.getElementById("cot_servicio");
    const id = sel.value;
    const precio = Number(sel.selectedOptions[0].dataset.precio);
    const nombre = sel.selectedOptions[0].text.split(" - $")[0];
    const cant = Number(document.getElementById("cot_cantidad").value) || 1;

    itemsTemp.push({ servicioId: Number(id), nombre, precio, cantidad: cant });
    renderItemsTemp();
}

function renderItemsTemp() {
    const ul = document.getElementById("cot_items");
    ul.innerHTML = "";

    itemsTemp.forEach((it, idx) => {
        ul.innerHTML += `
            <li>
                ${escapeHtml(it.nombre)} × ${it.cantidad} = $${(it.cantidad * it.precio).toFixed(2)}
                <button onclick="quitarItem(${idx})" class="btn secondary">Quitar</button>
            </li>`;
    });

    actualizarResumen();
}

function quitarItem(i) {
    itemsTemp.splice(i, 1);
    renderItemsTemp();
}

function actualizarResumen() {
    const subtotal = itemsTemp.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const impuesto = subtotal * TAX_RATE;
    const total = subtotal + impuesto;

    document.getElementById("resumenCot").innerHTML =
        `Subtotal: $${subtotal.toFixed(2)} — Impuesto: $${impuesto.toFixed(2)} — Total: $${total.toFixed(2)}`;
}

async function guardarCotizacion() {
    const idCliente = Number(document.getElementById("cot_cliente").value);
    if (!idCliente) return alert("Debe seleccionar cliente.");
    if (!itemsTemp.length) return alert("Debe agregar items.");

    const subtotal = itemsTemp.reduce((a, i) => a + i.precio * i.cantidad, 0);
    const impuesto = subtotal * TAX_RATE;
    const total = subtotal + impuesto;

    await addItem("cotizaciones", {
        clienteId: idCliente,
        fecha: new Date().toISOString().split("T")[0],
        items: itemsTemp,
        subtotal,
        impuesto,
        total
    });

    alert("Cotización guardada.");
    itemsTemp = [];
    renderItemsTemp();
    listarCotizaciones();
}

async function listarCotizaciones() {
    const datos = await getAll("cotizaciones");
    const clientes = await getAll("clientes");
    const div = document.getElementById("tblCotizaciones");

    if (datos.length === 0) {
        div.innerHTML = "<p>No hay cotizaciones.</p>";
        return;
    }

    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Fecha</th><th>#</th><th>Cliente</th>
                    <th>Subtotal</th><th>Impuesto</th><th>Total</th>
                </tr>
            </thead>
            <tbody>`;

    datos.forEach(c => {
        const cli = clientes.find(x => x.id === c.clienteId);
        html += `
            <tr>
                <td>${c.fecha}</td>
                <td>${c.id}</td>
                <td>${escapeHtml(cli?.nombre || "N/E")}</td>
                <td>$${c.subtotal.toFixed(2)}</td>
                <td>$${c.impuesto.toFixed(2)}</td>
                <td>$${c.total.toFixed(2)}</td>
            </tr>`;
    });

    div.innerHTML = html + "</tbody></table>";
}

(async () => {
    if (location.pathname.includes("cotizaciones.html")) cargarFormCotizacion();
})();


