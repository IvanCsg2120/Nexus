// js/auth.js
// Login / logout / control de sesión (usando users en IndexedDB)

async function login(e) {
  if (e && e.preventDefault) e.preventDefault();
  const cedulaField = document.getElementById("cedula");
  const nombreField = document.getElementById("nombre");
  const cedula = cedulaField ? cedulaField.value.trim() : "";
  const nombre = nombreField ? nombreField.value.trim() : "";

  if (!cedula || !nombre) {
    alert("Completa cédula y nombre.");
    return false;
  }

  await ensureDBReady();
  const users = await getAll("users");
  
  // Buscar usuario por cédula y nombre (case insensitive)
  const u = users.find(x => 
    x.cedula === cedula && 
    x.nombre.toLowerCase() === nombre.toLowerCase()
  );
  
  if (!u) {
    alert("Cédula o nombre incorrectos.");
    return false;
  }

  // crear sesión simple
  const session = { 
    id: u.id, 
    cedula: u.cedula, 
    nombre: u.nombre, 
    email: u.email || '',
    inicio: new Date().toISOString() 
  };
  localStorage.setItem("sessionUser", JSON.stringify(session));
  location.href = "dashboard.html";
  return false;
}

async function register(e) {
  if (e && e.preventDefault) e.preventDefault();
  
  const nombre = document.getElementById("regNombre").value.trim();
  const apellido = document.getElementById("regApellido").value.trim();
  const cedula = document.getElementById("regCedula").value.trim();
  const email = document.getElementById("regEmail").value.trim();

  if (!nombre || !apellido || !cedula || !email) {
    alert("Todos los campos son obligatorios.");
    return false;
  }

  await ensureDBReady();
  const users = await getAll("users");
  
  // Verificar si ya existe la cédula
  if (users.some(x => x.cedula === cedula)) {
    alert("Ya existe un usuario con esta cédula.");
    return false;
  }

  // Verificar si ya existe el email
  if (users.some(x => x.email === email)) {
    alert("Ya existe un usuario con este email.");
    return false;
  }

  try {
    // Crear nuevo usuario (sin password)
    const nuevoUsuario = {
      nombre: `${nombre} ${apellido}`,
      cedula: cedula,
      email: email,
      fechaRegistro: new Date().toISOString().slice(0,10)
    };
    
    await addItem("users", nuevoUsuario);
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    showLogin();
    
  } catch (err) {
    console.error("Error en registro:", err);
    alert("Error en el registro.");
  }
  
  return false;
}

function logout() {
  localStorage.removeItem("sessionUser");
  location.href = "index.html";
}

function ensureAuthenticated() {
  const s = localStorage.getItem("sessionUser");
  if (!s) {
    location.href = "index.html";
    return null;
  }
  return JSON.parse(s);
}

// Protege páginas: si la página está en la lista, exige sesión
(function protectRoutes() {
  const protectedPages = ["dashboard.html", "clientes.html", "servicios.html", "cotizaciones.html", "reporte.html"];
  const path = location.pathname.split("/").pop();
  if (protectedPages.includes(path)) {
    const s = localStorage.getItem("sessionUser");
    if (!s) location.href = "index.html";
  }
})();

window.login = login;
window.logout = logout;
window.register = register;
window.ensureAuthenticated = ensureAuthenticated;
