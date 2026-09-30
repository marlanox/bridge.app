// Persisted voice messages (FIXES-v5 §7). The native spec calls for
// `Application Support/Relationships/<relationshipId>/voice/<author>-<date>.m4a` —
// there's no filesystem-folder equivalent on the web, so this is IndexedDB instead:
// same shape (one row per note, tagged by relationship + author, deletable together),
// just a browser-appropriate store rather than a literal folder. Recorded audio used
// to live only in an in-memory Blob/createObjectURL — gone the moment the couple
// navigated away or reloaded — so every note is written here as soon as it's saved.
const DB_NAME = "bridge-voice";
const DB_VERSION = 1;
const STORE = "notes";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("byRelationship", "relationshipId");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Saves one recording. `role` is "partnerA" | "partnerB" (mirrors the spec's
 * `by: owner | partner`). Returns the note's id. */
export async function saveVoiceNote(relationshipId, role, blob) {
  const db = await openDb();
  const id = `${relationshipId}-${role}-${Date.now()}`;
  const note = { id, relationshipId, role, blob, createdAt: Date.now() };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(note);
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
}

/** Lists every saved note for one relationship, newest first. */
export async function listVoiceNotes(relationshipId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const idx = tx.objectStore(STORE).index("byRelationship");
    const req = idx.getAll(IDBKeyRange.only(relationshipId));
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.createdAt - a.createdAt));
    req.onerror = () => reject(req.error);
  });
}

/** Deletes every note belonging to a relationship — paired with "Удалить данные этих
 * отношений" in Settings, same as the spec's "удаляются вместе с..." rule. */
export async function deleteVoiceNotesForRelationship(relationshipId) {
  const db = await openDb();
  const notes = await listVoiceNotes(relationshipId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const note of notes) store.delete(note.id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
