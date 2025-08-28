const STORAGE_NAME = '__Skribble_Space__';
const STORAGE_VERSION = 1;
const META_STORE = "metadata_store";
const DATA_STORE = "data_store";
const SETTINGS_STORE = "settings_store";
const DOCUMENT_STORE = "documents_store";

let db = null;
let callback = null;
const request = window.indexedDB.open(STORAGE_NAME, STORAGE_VERSION);
request.onsuccess = () => {
    db = request.result;
    if (callback)
        callback();
}
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore(DOCUMENT_STORE, { autoIncrement: true, keyPath: "id" });
    db.createObjectStore(SETTINGS_STORE, { autoIncrement: false });
    db.createObjectStore(META_STORE, {keyPath: "id" });
    db.createObjectStore(DATA_STORE, {keyPath: "id" });
    if (callback)
        callback();
};

if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then((persistent) => {
        if (persistent) {
            console.log("Storage will not be cleared except by explicit user action");
        } else {
            console.log("Storage may be cleared by the UA under storage pressure.");
        }
    });
}

function ReadyCallBack(cb) {
    callback = cb;
}
function ListDocuments() {
    const t = db.transaction("documents", "readonly");
    const os = t.objectStore("documents");
    return os.getAll();
}

/**
 * Gets all the settings from the database
 * @param key
 * @returns {Promise<unknown>}
 * @constructor
 */
function GetSetting(key) {
    const t = db.transaction(SETTINGS_STORE, "readonly");
    const os = t.objectStore(SETTINGS_STORE);
    return new Promise((resolve, reject) => {
        const req = os.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * Gets all the settings from the database
 * @param key
 * @param value
 * @returns {Promise<unknown>}
 * @constructor
 */
function SaveSetting(key, value) {
    const t = db.transaction(SETTINGS_STORE, "readwrite");
    const os = t.objectStore(SETTINGS_STORE);
    return new Promise((resolve, reject) => {
        const req = os.put(value, key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function CreateDocument() {
    const t = db.transaction("documents", "readwrite");
    const os = t.objectStore("documents");
    return os.put({
        "name": "New Skribble",
        "created": Date.now(),
        "updated": Date.now(),
        "content": "",
    })
}
function SaveDocument(id, newContent) {
    return new Promise((resolve, reject) => {
        const t = db.transaction("documents", "readwrite");
        const os = t.objectStore("documents");

        const getReq = os.get(id);

        getReq.onsuccess = () => {
            const doc = getReq.result;
            if (!doc) {
                const newDoc = {
                    "name": "New Skribble",
                    "created": Date.now(),
                    "updated": Date.now(),
                    content: newContent,
                    id: id
                };
                const putReq = os.put(newDoc);
                putReq.onsuccess = () => resolve(putReq.result);
                putReq.onerror = () => reject(putReq.error);
                return;
            }

            doc.updated = Date.now();
            doc.content = newContent;
            doc.id = id;

            const putReq = os.put(doc);
            putReq.onsuccess = () => resolve(putReq.result);
            putReq.onerror = () => reject(putReq.error);
        };

        getReq.onerror = () => reject(getReq.error);
    });
}
function RenameDocument(id, name) {
    return new Promise((resolve, reject) => {
        const t = db.transaction("documents", "readwrite");
        const os = t.objectStore("documents");

        const getReq = os.get(id);

        getReq.onsuccess = () => {
            const doc = getReq.result;
            if (!doc) {
                reject(new Error("Document not found"));
                return;
            }

            doc.updated = Date.now();
            doc.name = name;
            doc.id = id;

            const putReq = os.put(doc);
            putReq.onsuccess = () => resolve(putReq.result);
            putReq.onerror = () => reject(putReq.error);
        };

        getReq.onerror = () => reject(getReq.error);
    });
}

/**
 * Gets all the metadata for all stored mindmaps
 * @returns {*}
 * @constructor
 */
function GetAllMindmapsMetadata() {
    const t = db.transaction(META_STORE, "readonly");
    const os = t.objectStore(META_STORE);
    return new Promise((resolve, reject) => {
        const req = os.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * This saves all mindmap data, e.g, paths etc
 * @param data
 * @returns {*}
 * @constructor
 */
function SaveMindmapData(data) {
    const t = db.transaction(DATA_STORE, "readwrite");
    const os = t.objectStore(DATA_STORE);
    return new Promise((resolve, reject) => {
        const req = os.put(data);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * This saves all metadata, things like names, etc
 * @param data
 * @returns {*}
 * @constructor
 */
function SaveMindmapMetadata(meta) {
    const t = db.transaction(META_STORE, "readwrite");
    const os = t.objectStore(META_STORE);
    return new Promise((resolve, reject) => {
        const req = os.put(meta);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * Get Mindmap Data by ID
 * @param id
 * @returns {Promise<unknown>}
 * @constructor
 */
async function GetMindmapData(id) {
    const t = db.transaction(DATA_STORE, "readwrite");
    const os = t.objectStore(DATA_STORE);
    return new Promise((resolve, reject) => {
        const req = os.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export default {ListDocuments, CreateDocument, ReadyCallBack, GetSetting, SaveSetting, SaveDocument, RenameDocument, GetAllMindmapsMetadata,SaveMindmapData,SaveMindmapMetadata,GetMindmapData};