// js/reporte.js
// Generación de reportes por cliente/rango y export CSV (reutiliza getAll())

async function cargarClientesReporte() {
  await openDB();
  const clientes = await getAll("clientes");
  const sel = document.getElementById("repCliente") || document.getElementById("r_cliente") || null;
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Todos --</option>';
  clientes.forEach(c => sel.innerHTML += `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`);
}

async function generarReporte() {
  const clienteId = Number(document.getElementById("repCliente").value || 0);
  const desde = document.getElementById("repDesde").value;
  const hasta = document.getElementById("repHasta").value;
  let datos = await getAll("cotizaciones");
  if (clienteId) datos = datos.filter(d => d.clienteId === clienteId);
  if (desde) datos = datos.filter(d => d.fecha >= desde);
  if (hasta) datos = datos.filter(d => d.fecha <= hasta);

  const cont = document.getElementById("reporteArea") || document.getElementById("reporteArea");
  if (!cont) return;
  if (!datos.length) { cont.innerHTML = "<p class='small'>No hay resultados.</p>"; return; }

  const clientes = await getAll("clientes");
  let totalSub = 0, totalImp = 0, totalAll = 0;
  let html = `<table class="table"><thead><tr><th>Fecha</th><th>Id</th><th>Cliente</th><th>Subtotal</th><th>Impuesto</th><th>Total</th></tr></thead><tbody>`;
  datos.forEach(d => {
    const cliente = clientes.find(c => c.id === d.clienteId) || { nombre: "" };
    html += `<tr>
      <td>${d.fecha}</td>
      <td>${d.id}</td>
      <td>${escapeHtml(cliente.nombre)}</td>
      <td>$${Number(d.subtotal).toFixed(2)}</td>
      <td>$${Number(d.impuesto).toFixed(2)}</td>
      <td>$${Number(d.total).toFixed(2)}</td>
    </tr>`;
    totalSub += Number(d.subtotal);
    totalImp += Number(d.impuesto);
    totalAll += Number(d.total);
  });
  html += `</tbody></table>
    <div style="margin-top:8px"><b>Totales:</b> Subtotal $${roundToTwo(totalSub).toFixed(2)} - Impuesto $${roundToTwo(totalImp).toFixed(2)} - Total $${roundToTwo(totalAll).toFixed(2)}</div>`;
  cont.innerHTML = html;
}

async function exportarReporteCSV() {
  const clienteId = Number(document.getElementById("repCliente").value || 0);
  const desde = document.getElementById("repDesde").value;
  const hasta = document.getElementById("repHasta").value;
  let datos = await getAll("cotizaciones");
  if (clienteId) datos = datos.filter(d => d.clienteId === clienteId);
  if (desde) datos = datos.filter(d => d.fecha >= desde);
  if (hasta) datos = datos.filter(d => d.fecha <= hasta);

  if (!datos.length) return alert("No hay datos para exportar.");
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
  a.download = `reporte_cotizaciones_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// helpers
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function roundToTwo(num) { return Math.round((num + Number.EPSILON) * 100) / 100; }

// init on reporte page
(async function initRep() {
  const path = location.pathname.split("/").pop();
  if (path !== "reporte.html") return;
  await cargarClientesReporte();
})();
