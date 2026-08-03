"use client";

const DATABASE_NAME = "soma-local-drafts";
const STORE_NAME = "post-media";

interface StoredDraftMedia {
  id: string;
  blob: Blob;
  name: string;
  type: string;
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function saveDraftMedia(id: string, file: File) {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put({
      id,
      blob: file,
      name: file.name,
      type: file.type,
    } satisfies StoredDraftMedia);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  database.close();
}

export async function getDraftMedia(id: string) {
  const database = await openDatabase();

  const stored = await new Promise<StoredDraftMedia | undefined>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result as StoredDraftMedia | undefined);
    request.onerror = () => reject(request.error);
  });

  database.close();

  return stored
    ? new File([stored.blob], stored.name, { type: stored.type })
    : null;
}

export async function deleteDraftMedia(id: string) {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  database.close();
}
