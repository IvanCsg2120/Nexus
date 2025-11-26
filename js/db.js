// js/db.js - Versión InfinityFree (LocalStorage)
class LocalDB {
    constructor() {
        this.storagePrefix = 'FreelancerDB_';
        this.ready = true;
        this.initDemoData();
    }

    // OPERACIONES CRUD
    getAll(table) {
        const data = localStorage.getItem(`${this.storagePrefix}${table}`);
        return data ? JSON.parse(data) : [];
    }

    addItem(table, item) {
        const items = this.getAll(table);
        item.id = item.id || Date.now();
        item.created_at = new Date().toISOString();
        items.push(item);
        localStorage.setItem(`${this.storagePrefix}${table}`, JSON.stringify(items));
        return item.id;
    }

    updateItem(table, id, updates) {
        const items = this.getAll(table);
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            localStorage.setItem(`${this.storagePrefix}${table}`, JSON.stringify(items));
            return id;
        }
        return null;
    }

    deleteItem(table, id) {
        const items = this.getAll(table).filter(item => item.id != id);
        localStorage.setItem(`${this.storagePrefix}${table}`, JSON.stringify(items));
        return true;
    }

    getItem(table, id) {
        const items = this.getAll(table);
        return items.find(item => item.id == id) || null;
    }

    // DATOS DE DEMO
    initDemoData() {
        // Usuarios demo
        const users = this.getAll('users');
        if (users.length === 0) {
            this.addItem('users', {
                id: 1,
                nombre: 'Admin Demo',
                cedula: '123456789',
                email: 'admin@demo.com',
                rol: 'administrador'
            });
        }

        // Servicios demo
        const servicios = this.getAll('servicios');
        if (servicios.length === 0) {
            const demoServicios = [
                { id: 1, nombre: 'Mantenimiento Preventivo PC', precio: 35, categoria: 'Hardware', descripcion: 'Limpieza y optimización completa' },
                { id: 2, nombre: 'Formateo e Instalación SO', precio: 50, categoria: 'Software', descripcion: 'Instalación de sistema operativo y drivers' },
                { id: 3, nombre: 'Remoción de Malware', precio: 45, categoria: 'Seguridad', descripcion: 'Limpieza de virus y malware' },
                { id: 4, nombre: 'Soporte Remoto (1 hora)', precio: 25, categoria: 'Soporte', descripcion: 'Asistencia técnica remota' }
            ];
            
            demoServicios.forEach(serv => this.addItem('servicios', serv));
        }

        // Clientes demo
        const clientes = this.getAll('clientes');
        if (clientes.length === 0) {
            this.addItem('clientes', {
                id: 1,
                nombre: 'Empresa ABC SA',
                email: 'contacto@empresaabc.com',
                telefono: '2222-0000',
                fecha_registro: new Date().toISOString().split('T')[0]
            });
        }
    }
}

// INSTANCIA GLOBAL
const db = new LocalDB();

// FUNCIONES GLOBALES
window.openDB = () => Promise.resolve();
window.ensureDBReady = () => Promise.resolve(true);
window.getAll = (table) => db.getAll(table);
window.addItem = (table, item) => db.addItem(table, item);
window.updateItem = (table, id, updates) => db.updateItem(table, id, updates);
window.deleteItem = (table, id) => db.deleteItem(table, id);
window.getItem = (table, id) => db.getItem(table, id);

console.log('✅ Local DB cargada para InfinityFree');
