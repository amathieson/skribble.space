const STORAGE_NAME = '__Skribble_Space_';
const STORAGE_VERSION = 1;
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
    db.createObjectStore("documents", { autoIncrement: true });
    db.createObjectStore("settings", { autoIncrement: false });
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
function GetSettings() {
    const t = db.transaction("settings", "readonly");
    const os = t.objectStore("settings");
    return os.getAll();
}

async function CreateDocument(document) {
    const t = db.transaction("documents", "readwrite");
    const os = t.objectStore("documents");
    return os.put({
        "name": "",
        "created": 0,
        "updated": 0,
        "content": ""
    })
}

export default {ListDocuments, CreateDocument, ReadyCallBack, GetSettings};