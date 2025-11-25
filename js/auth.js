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

  const matchingUser = users.find(u =>
    u.cedula === cedula &&
    clean(u.nombre) === clean(nombreInput)
  );

  if (!matchingUser) {
    alert("Cédula o nombre incorrectos.");
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
    nombre: `${nombre} ${apellido}`,
    cedula,
    email,
    fechaRegistro: new Date().toISOString().slice(0, 10)
  };

  await addItem("users", newUser);
  alert("Registro exitoso. Ahora puedes iniciar sesión.");
  showLogin();
  return false;
}


// ===============================
// CONTROL DE SESIÓN
// ===============================
function logout() {
  localStorage.removeItem("sessionUser");
  location.href = "index.html";
}

function ensureAuthenticated() {
  const session = localStorage.getItem("sessionUser");
  if (!session) location.href = "index.html";
  return JSON.parse(session);
}

window.login = login;
window.register = register;
window.logout = logout;
window.ensureAuthenticated = ensureAuthenticated;
