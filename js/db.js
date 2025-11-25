// js/auth.js - Versión actualizada
// ===============================
// FUNCIONES AUXILIARES
// ===============================
function clean(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ===============================
// INICIAR SESIÓN
// ===============================
async function login(e) {
  if (e) e.preventDefault();

  const cedula = document.getElementById("cedula").value.trim();
  const nombreInput = document.getElementById("nombre").value.trim();

  if (!cedula || !nombreInput) {
    alert("Completa cédula y nombre.");
    return false;
  }

  await ensureDBReady();
  const users = await getAll("users");

  console.log("Usuarios en DB:", users); // Para debug
  console.log("Buscando:", { cedula, nombreInput }); // Para debug

  const matchingUser = users.find(u => {
    const cedulaMatch = u.cedula === cedula;
    const nombreMatch = clean(u.nombre) === clean(nombreInput);
    console.log(`Usuario: ${u.nombre}, cédula: ${u.cedula}, match: ${cedulaMatch && nombreMatch}`); // Debug
    return cedulaMatch && nombreMatch;
  });

  if (!matchingUser) {
    alert("Cédula o nombre incorrectos. Usa: Cédula: 123456789, Nombre: Admin Demo");
    return false;
  }

  const session = {
    id: matchingUser.id,
    nombre: matchingUser.nombre,
    cedula: matchingUser.cedula,
    email: matchingUser.email,
    inicio: new Date().toISOString()
  };

  localStorage.setItem("sessionUser", JSON.stringify(session));
  alert(`¡Bienvenido ${matchingUser.nombre}!`);
  location.href = "dashboard.html";
  return false;
}

// ===============================
// REGISTRO DE USUARIO
// ===============================
async function register(e) {
  if (e) e.preventDefault();

  const nombre = document.getElementById("regNombre").value.trim();
  const apellido = document.getElementById("regApellido").value.trim();
  const cedula = document.getElementById("regCedula").value.trim();
  const email = document.getElementById("regEmail").value.trim();

  if (!nombre || !apellido || !cedula || !email) {
    alert("Todos los campos son obligatorios.");
    return false;
  }

  // Validar formato de cédula (solo números)
  if (!/^\d+$/.test(cedula)) {
    alert("La cédula debe contener solo números.");
    return false;
  }

  // Validar formato de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Por favor ingresa un email válido.");
    return false;
  }

  await ensureDBReady();
  const users = await getAll("users");

  if (users.some(u => u.cedula === cedula)) {
    alert("Ya existe un usuario con esta cédula.");
    return false;
  }

  if (users.some(u => u.email === email)) {
    alert("Ya existe un usuario con este email.");
    return false;
  }

  const newUser = {
    nombre: `${nombre} ${apellido}`.trim(),
    cedula,
    email,
    fechaRegistro: new Date().toISOString().slice(0, 10)
  };

  try {
    await addItem("users", newUser);
    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
    
    // Limpiar formulario
    document.getElementById("registerForm").reset();
    
    // Volver al login
    showLogin();
    return false;
  } catch (error) {
    alert("❌ Error en el registro: " + error.message);
    return false;
  }
}

// ===============================
// CONTROL DE SESIÓN
// ===============================
function logout() {
  localStorage.removeItem("sessionUser");
  alert("Sesión cerrada correctamente.");
  location.href = "index.html";
}

function ensureAuthenticated() {
  const session = localStorage.getItem("sessionUser");
  if (!session) {
    location.href = "index.html";
    return null;
  }
  return JSON.parse(session);
}

// ===============================
// VERIFICACIÓN DE DATOS DEMO
// ===============================
async function checkDemoData() {
  try {
    await ensureDBReady();
    const users = await getAll("users");
    console.log("Usuarios disponibles:", users);
    
    if (users.length === 0) {
      console.warn("No hay usuarios en la base de datos");
    }
    
    return users;
  } catch (error) {
    console.error("Error verificando datos demo:", error);
    return [];
  }
}

// ===============================
// EXPORT FUNCTIONS
// ===============================
window.login = login;
window.register = register;
window.logout = logout;
window.ensureAuthenticated = ensureAuthenticated;
window.checkDemoData = checkDemoData;

// Verificar datos al cargar
window.addEventListener('load', function() {
  setTimeout(() => {
    checkDemoData();
  }, 1000);
});
