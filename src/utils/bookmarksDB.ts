import { openDB } from 'idb';

// --------------------------------------------------
// Initialize DB with migration support (v4)
// --------------------------------------------------
export const initDB = async () => {
  return await openDB('quranfi-db', 4, {
    upgrade(db, oldVersion, _newVersion, transaction) {
      // If store exists, possibly migrate it
      if (db.objectStoreNames.contains('bookmarks')) {
        const store = transaction.objectStore('bookmarks');

        // If the store keyPath is wrong, migrate it
        if (store.keyPath !== 'id') {
          console.log("🟡 Migrating 'bookmarks' object store…");

          const oldData: any[] = [];

          // Capture all current items
          store.openCursor().then(function iterate(cursor) {
            if (!cursor) return;
            oldData.push(cursor.value);
            cursor.continue().then(iterate);
          });

          // Delete old store
          db.deleteObjectStore('bookmarks');

          // Recreate store with correct keyPath
          db.createObjectStore('bookmarks', { keyPath: 'id' });

          // Reinsert data
          setTimeout(async () => {
            const newDB = await openDB('quranfi-db', 4);
            const tx = newDB.transaction('bookmarks', 'readwrite');
            const s = tx.objectStore('bookmarks');

            oldData.forEach(item => {
              if (!item.id && item.verse_id) item.id = item.verse_id;
              s.put(item);
            });

            await tx.done;
            console.log("✅ Migration complete.");
          }, 100);
        }

      } else {
        // First-time install
        db.createObjectStore('bookmarks', { keyPath: 'id' });
      }

      // v4: add pageBookmarks store
      if (oldVersion < 4) {
        if (!db.objectStoreNames.contains('pageBookmarks')) {
          db.createObjectStore('pageBookmarks', { keyPath: 'id' });
        }
      }
    }
  });
};

// --------------------------------------------------
// Add a bookmark
// --------------------------------------------------
export const addBookmark = async (bookmark: { id: string; verse_id: string; created_at: string }) => {
  const db = await initDB();
  return await db.put('bookmarks', bookmark);
};

// --------------------------------------------------
// Get all bookmarks
// --------------------------------------------------
export const getBookmarks = async () => {
  const db = await initDB();
  return await db.getAll('bookmarks');
};

// --------------------------------------------------
// Remove a bookmark by ID
// --------------------------------------------------
export const removeBookmark = async (id: string) => {
  const db = await initDB();
  return await db.delete('bookmarks', id);
};

// --------------------------------------------------
// Page bookmark types and CRUD (v4)
// --------------------------------------------------
export type PageBookmark = {
  id: string;          // "page:42"
  pageNumber: number;
  created_at: string;
};

export const addPageBookmark = async (pageNumber: number): Promise<void> => {
  const db = await initDB();
  await db.put('pageBookmarks', {
    id: `page:${pageNumber}`,
    pageNumber,
    created_at: new Date().toISOString(),
  });
};

export const removePageBookmark = async (pageNumber: number): Promise<void> => {
  const db = await initDB();
  await db.delete('pageBookmarks', `page:${pageNumber}`);
};

export const getPageBookmarks = async (): Promise<PageBookmark[]> => {
  const db = await initDB();
  return await db.getAll('pageBookmarks');
};

export const isPageBookmarked = async (pageNumber: number): Promise<boolean> => {
  const db = await initDB();
  const record = await db.get('pageBookmarks', `page:${pageNumber}`);
  return record !== undefined;
};
