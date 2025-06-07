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
    db.createObjectStore("documents", { autoIncrement: true, keyPath: "id" });
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

export default {ListDocuments, CreateDocument, ReadyCallBack, GetSettings, SaveDocument, RenameDocument};