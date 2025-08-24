import type { Db, Table } from './types';

class IndexedDbTable<T> implements Table<T> {
  private tableName: string;
  private dbManager: IndexedDbManager;

  constructor(tableName: string, dbManager: IndexedDbManager) {
    this.tableName = tableName;
    this.dbManager = dbManager;
  }

  private async getDb(): Promise<IDBDatabase> {
    return this.dbManager.getDb();
  }

  async list(): Promise<T[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tableName], 'readonly');
        const store = transaction.objectStore(this.tableName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.error(`Error listing ${this.tableName}:`, error);
      throw error;
    }
  }

  async get(id: string): Promise<T | undefined> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tableName], 'readonly');
        const store = transaction.objectStore(this.tableName);
        const request = store.get(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.error(`Error getting ${this.tableName} with id ${id}:`, error);
      throw error;
    }
  }

  async put(item: T): Promise<T> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tableName], 'readwrite');
        const store = transaction.objectStore(this.tableName);
        const request = store.put(item);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(item);
      });
    } catch (error) {
      console.error(`Error putting ${this.tableName}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.tableName], 'readwrite');
        const store = transaction.objectStore(this.tableName);
        const request = store.delete(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error(`Error removing ${this.tableName} with id ${id}:`, error);
      throw error;
    }
  }
}

class IndexedDbManager {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, version: number = 2) {
    this.dbName = dbName;
    this.version = version;
  }

  async getDb(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully. Available object stores:', this.db.objectStoreNames);
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed, creating object stores...');
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create all required object stores
        if (!db.objectStoreNames.contains('exercises')) {
          console.log('Creating exercises object store...');
          db.createObjectStore('exercises', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('trainings')) {
          console.log('Creating trainings object store...');
          db.createObjectStore('trainings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('workouts')) {
          console.log('Creating workouts object store...');
          db.createObjectStore('workouts', { keyPath: 'id' });
        }
        
        console.log('Database upgrade completed. Object stores:', db.objectStoreNames);
      };
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  isReady(): boolean {
    return this.db !== null;
  }

  async resetDatabase(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);
      
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onsuccess = () => {
        console.log('Database deleted successfully, will recreate on next access');
        resolve();
      };
    });
  }
}

export class IndexedDbDb implements Db {
  exercises: Table<any>;
  trainings: Table<any>;
  workouts: Table<any>;
  private dbManager: IndexedDbManager;

  constructor() {
    this.dbManager = new IndexedDbManager('TrainingLog', 2);
    this.exercises = new IndexedDbTable('exercises', this.dbManager);
    this.trainings = new IndexedDbTable('trainings', this.dbManager);
    this.workouts = new IndexedDbTable('workouts', this.dbManager);
  }

  async resetDatabase(): Promise<void> {
    await this.dbManager.resetDatabase();
  }
}
