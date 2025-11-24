// js/db.js
// Manejo completo de IndexedDB (openDB, seed demo, utilidades CRUD)
// Referencia: enunciado original -> /mnt/data/Actividad PROYECTO FINAL v5.pdf

const DB_NAME = "FreelancerDB_V1";
const DB_VERSION = 1;
let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains("users")) {
        const s = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
        s.createIndex("email", "email", { unique: true });
      }
      if (!db.objectStoreNames.contains("clientes")) {
        db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("servicios")) {
        db.createObjectStore("servicios", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("cotizaciones")) {
        db.createObjectStore("cotizaciones", { keyPath: "id", autoIncrement: true });
      }
    };

    req.onsuccess = async (e) => {
      db = e.target.result;
      try {
        await seedDemoData();
        resolve(db);
      } catch (err) {
        console.error("Seed error:", err);
        resolve(db);
      }
    };

    req.onerror = (e) => {
      console.error("IndexedDB open error", e);
      reject(e);
    };
  });
}

async function seedDemoData() {
  // agrega datos demo si están vacíos
  const tx = db.transaction(["users", "servicios", "clientes"], "readwrite");
  const uStore = tx.objectStore("users");
  const sStore = tx.objectStore("servicios");
  const cStore = tx.objectStore("clientes");

  // users
  const users = await promisifyRequest(uStore.getAll());
  if (!users || users.length === 0) {
    uStore.add({ email: "admin@demo.com", password: "demo123", nombre: "Admin Demo" });
  }

  // servicios
  const srv = await promisifyRequest(sStore.getAll());
  if (!srv || srv.length === 0) {
    sStore.add({ nombre: "Mantenimiento Preventivo PC", precio: 35.00 });
    sStore.add({ nombre: "Formateo e Instalación SO", precio: 50.00 });
    sStore.add({ nombre: "Remoción de Malware", precio: 45.00 });
    sStore.add({ nombre: "Soporte Remoto (hora)", precio: 20.00 });
  }

  // clientes
  const cli = await promisifyRequest(cStore.getAll());
  if (!cli || cli.length === 0) {
    cStore.add({ nombre: "ACME, S.A.", email: "acme@ejemplo.com", telefono: "6000-0000" });
    cStore.add({ nombre: "Juan Pérez", email: "jperez@correo.com", telefono: "6123-4567" });
  }

  return promisifyRequest(tx.complete || tx);
}

function promisifyRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error || e);
  });
}

// CRUD genérico
function getAll(storeName) {
  return new Promise(async (res, rej) => {
    try {
      await openDB();
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = () => rej(req.error);
    } catch (e) {
      rej(e);
    }
  });
}

function getItem(storeName, id) {
  return new Promise(async (res, rej) => {
    try {
      await openDB();
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(Number(id));
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    } catch (e) {
      rej(e);
    }
  });
}

function addItem(storeName, item) {
  return new Promise(async (res, rej) => {
    try {
      await openDB();
      const tx = db.transaction(storeName, "readwrite");
      const req = tx.objectStore(storeName).add(item);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    } catch (e) {
      rej(e);
    }
  });
}

function updateItem(storeName, item) {
  return new Promise(async (res, rej) => {
    try {
      await openDB();
      const tx = db.transaction(storeName, "readwrite");
      const req = tx.objectStore(storeName).put(item);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    } catch (e) {
      rej(e);
    }
  });
}

function deleteItem(storeName, id) {
  return new Promise(async (res, rej) => {
    try {
      await openDB();
      const tx = db.transaction(storeName, "readwrite");
      const req = tx.objectStore(storeName).delete(Number(id));
      req.onsuccess = () => res();
      req.onerror = () => rej(req.error);
    } catch (e) {
      rej(e);
    }
  });
}

// Export functions globally (so other scripts can call them)
window.openDB = openDB;
window.getAll = getAll;
window.getItem = getItem;
window.addItem = addItem;
window.updateItem = updateItem;
window.deleteItem = deleteItem;
window.ensureDBReady = openDB; // alias

// initialize immediately
openDB().then(() => console.log("DB lista")).catch(e => console.error(e));
