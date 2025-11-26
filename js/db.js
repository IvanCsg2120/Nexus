// js/db.js - Versión para InfinityFree (LocalStorage)
class LocalDB {
    constructor() {
        this.storagePrefix = 'FreelancerDB_';
        this.ready = true;
    }

    // OPERACIONES CRUD
    getAll(table) {
        const data = localStorage.getItem(`${this.storagePrefix}${table}`);
        return data ? JSON.parse(data) : [];
    }

    addItem(table, item) {
        const items = this.getAll(table);
        item.id = item.id || Date.now();
        items.push(item);
        localStorage.setItem(`${this.storagePrefix}${table}`, JSON.stringify(items));
        return item.id;
    }

    updateItem(table, id, updates) {
        const items = this.getAll(table);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            localStorage.setItem(`${this.storagePrefix}${table}`, JSON.stringify(items));
            return id;
        }
        return null;
    }

    deleteItem(table, id) {
        const items = this.getAll(table).filter(item => item.id !== id);
        localStorage.setItem(`${this.storagePrefix}${table}`, JSON.stringify(items));
        return true;
    }

    getItem(table, id) {
        const items = this.getAll(table);
        return items.find(item => item.id === id) || null;
    }
}

// CREAR INSTANCIA GLOBAL
const db = new LocalDB();

// FUNCIONES GLOBALES
window.openDB = () => Promise.resolve();
window.ensureDBReady = () => Promise.resolve(true);
window.getAll = (table) => db.getAll(table);
window.addItem = (table, item) => db.addItem(table, item);
window.updateItem = (table, id, updates) => db.updateItem(table, id, updates);
window.deleteItem = (table, id) => db.deleteItem(table, id);
window.getItem = (table, id) => db.getItem(table, id);

// FUNCIONES DE AUTH (simuladas)
window.supabaseRegister = async (userData) => {
    // Simular registro
    const users = db.getAll('users');
    if (users.find(u => u.cedula === userData.cedula)) {
        return { success: false, error: 'Usuario ya existe' };
    }
    
    const newUser = {
        id: Date.now(),
        nombre: userData.nombre,
        cedula: userData.cedula,
        email: userData.email,
        created_at: new Date().toISOString()
    };
    
    db.addItem('users', newUser);
    return { success: true, user: newUser };
};

window.supabaseLogin = async (cedula, nombre) => {
    // Simular login
    const users = db.getAll('users');
    const user = users.find(u => 
        u.cedula === cedula && u.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    
    if (user) {
        return { success: true, user };
    }
    return { success: false, error: 'Credenciales incorrectas' };
};

console.log('✅ Local DB cargada para InfinityFree');
