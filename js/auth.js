// js/auth.js - Versión InfinityFree
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

    // Verificar si ya existe
    const users = getAll('users');
    if (users.find(u => u.cedula === cedula)) {
        alert("❌ Ya existe un usuario con esta cédula.");
        return false;
    }

    // Crear usuario
    const userData = {
        nombre: `${nombre} ${apellido}`,
        cedula: cedula,
        email: email,
        rol: 'usuario'
    };

    try {
        await addItem('users', userData);
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        showLogin();
    } catch (error) {
        alert("❌ Error en el registro.");
    }

    return false;
}

async function login(e) {
    if (e) e.preventDefault();

    const cedula = document.getElementById("cedula").value.trim();
    const nombreInput = document.getElementById("nombre").value.trim();

    if (!cedula || !nombreInput) {
        alert("Completa cédula y nombre.");
        return false;
    }

    // Buscar usuario
    const users = getAll('users');
    const user = users.find(u => 
        u.cedula === cedula && u.nombre.toLowerCase().includes(nombreInput.toLowerCase())
    );

    if (user) {
        // Guardar sesión
        const session = {
            id: user.id,
            nombre: user.nombre,
            cedula: cedula,
            email: user.email,
            rol: user.rol,
            inicio: new Date().toISOString()
        };

        localStorage.setItem("sessionUser", JSON.stringify(session));
        alert(`¡Bienvenido ${user.nombre}!`);
        location.href = "dashboard.html";
    } else {
        alert("❌ Cédula o nombre incorrectos.");
    }

    return false;
}

function showRegister() {
    document.getElementById("loginCard").style.display = "none";
    document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
    document.getElementById("registerCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";
}

function logout() {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
        localStorage.removeItem("sessionUser");
        location.href = "index.html";
    }
}
