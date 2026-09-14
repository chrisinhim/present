import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly DB_NAME = 'PresentationMediaDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'mediaStore';
  private dbPromise: Promise<IDBDatabase> | null = null;

  async requestPersistence(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        return isPersisted;
      } catch (e) {
        console.warn('Storage persistence request failed:', e);
      }
    }
    return false;
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.requestPersistence().catch(() => {});

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          this.dbPromise = null;
        };
        resolve(db);
      };
      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
      request.onblocked = () => {
        console.warn('IndexedDB upgrade blocked. Please close other tabs of this application.');
      };
    });

    return this.dbPromise;
  }

  async saveMedia(id: string, name: string, type: 'image' | 'video', blob: Blob): Promise<void> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const item = { id, name, type, blob, lastModified: Date.now() };
        // Support both modern stores with keyPath 'id' and legacy stores created with out-of-line keys
        const req = store.keyPath ? store.put(item) : store.put(item, id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save to IndexedDB', e);
    }
  }

  async getAllMedia(): Promise<{ id: string; name: string; type: 'image' | 'video'; blob: Blob }[]> {
    try {
      const db = await this.initDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const rawItems = req.result || [];
          const normalized = rawItems
            .map((item: any, index: number) => {
              if (!item) return null;
              // Handle legacy format where raw Blob/File was stored directly
              if (item instanceof Blob) {
                const isVideo = item.type?.startsWith('video');
                return {
                  id: (item as any).name ? `legacy_${(item as any).name}` : `legacy_media_${index}`,
                  name: (item as any).name || (isVideo ? 'Restored Video' : 'Restored Image'),
                  type: isVideo ? ('video' as const) : ('image' as const),
                  blob: item,
                };
              }
              // Standard format with { id, name, type, blob }
              if (item.blob instanceof Blob) {
                return {
                  id: item.id || `media_${index}`,
                  name: item.name || 'Untitled Media',
                  type: item.type === 'video' ? ('video' as const) : ('image' as const),
                  blob: item.blob,
                };
              }
              return null;
            })
            .filter((item): item is { id: string; name: string; type: 'image' | 'video'; blob: Blob } => item !== null);

          resolve(normalized);
        };
        req.onerror = () => reject(req.error);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to load from IndexedDB', e);
      return [];
    }
  }

  async deleteMedia(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to delete from IndexedDB', e);
    }
  }

  // LocalStorage Helpers
  getLocal<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  setLocal<T>(key: string, value: T): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }
}
