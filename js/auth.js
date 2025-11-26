// js/auth.js - Versión para InfinityFree
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

    const userData = {
        nombre: `${nombre} ${apellido}`,
        cedula: cedula,
        email: email
    };

    const result = await window.supabaseRegister(userData);

    if (result.success) {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        showLogin();
    } else {
        alert(`❌ Error: ${result.error}`);
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

    const result = await window.supabaseLogin(cedula, nombreInput);

    if (result.success) {
        // Guardar sesión
        const session = {
            id: result.user.id,
            nombre: result.user.nombre,
            cedula: cedula,
            inicio: new Date().toISOString()
        };

        localStorage.setItem("sessionUser", JSON.stringify(session));
        alert(`¡Bienvenido ${result.user.nombre}!`);
        location.href = "dashboard.html";
    } else {
        alert(`❌ Error: ${result.error}`);
    }

    return false;
}

// Funciones de transición entre login/register
function showRegister() {
    document.getElementById("loginCard").style.display = "none";
    document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
    document.getElementById("registerCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";
}
