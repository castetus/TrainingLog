import { IndexedDbDb } from './indexedDb';
import { MockDb } from './mockDb';
import type { Db } from './types';

// Use IndexedDB with fallback to MockDb
let dbInstance: Db;

try {
  // Check if IndexedDB is available
  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    dbInstance = new IndexedDbDb();
  } else {
    throw new Error('IndexedDB not available');
  }
} catch (error) {
  console.warn('Falling back to MockDb:', error);
  dbInstance = new MockDb();
}

export const db: Db = dbInstance;
