// js/clientes.js
// CRUD completo para clientes con validaciones simples

async function guardarCliente(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nombre = (document.getElementById("c_nombre") || {}).value?.trim();
  const email = (document.getElementById("c_email") || {}).value?.trim();
  const telefono = (document.getElementById("c_tel") || {}).value?.trim();
  const idField = document.getElementById("c_id"); // opcional

  if (!nombre || !email) {
    alert("Nombre y email son obligatorios.");
    return false;
  }

  await ensureDBReady();

  try {
    if (idField && idField.value) {
      const id = Number(idField.value);
      await updateItem("clientes", { id, nombre, email, telefono });
      alert("Cliente actualizado.");
    } else {
      await addItem("clientes", { nombre, email, telefono });
      alert("Cliente guardado.");
    }
    listarClientes();
    if (idField) idField.value = "";
    document.getElementById("formCliente")?.reset();
  } catch (err) {
    console.error(err);
    alert("Error guardando cliente.");
  }
  return false;
}

async function listarClientes() {
  await ensureDBReady();
  const datos = await getAll("clientes");
  const div = document.getElementById("tblClientes");
  if (!div) return;
  if (!datos.length) {
    div.innerHTML = "<p class='small'>No hay clientes registrados.</p>";
    return;
  }
  let html = `<table class="table"><thead><tr><th>Nombre</th><th>Email</th><th>Tel</th><th>Acciones</th></tr></thead><tbody>`;
  datos.forEach(d => {
    html += `<tr>
      <td>${escapeHtml(d.nombre)}</td>
      <td>${escapeHtml(d.email)}</td>
      <td>${escapeHtml(d.telefono || "")}</td>
      <td>
        <button class="btn" onclick="editarCliente(${d.id})">Editar</button>
        <button class="btn secondary" onclick="borrarCliente(${d.id})">Borrar</button>
      </td>
    </tr>`;
  });
  html += `</tbody></table>`;
  div.innerHTML = html;
}

async function editarCliente(id) {
  await ensureDBReady();
  const c = await getItem("clientes", id);
  if (!c) return alert("Cliente no encontrado.");
  document.getElementById("c_id").value = c.id || "";
  document.getElementById("c_nombre").value = c.nombre || "";
  document.getElementById("c_email").value = c.email || "";
  document.getElementById("c_tel").value = c.telefono || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function borrarCliente(id) {
  if (!confirm("¿Eliminar cliente?")) return;
  await deleteItem("clientes", id);
  listarClientes();
}

// util
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// init
(async function initClientes() {
  const path = location.pathname.split("/").pop();
  if (path !== "clientes.html") return;
  await openDB();
  listarClientes();
  // ensure form exists
  const form = document.getElementById("formCliente");
  if (form) form.addEventListener("submit", guardarCliente);
})();
