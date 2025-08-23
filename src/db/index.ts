import { MockDb } from './mockDb';
import type { Db } from './types';

// Swap this line later to use IndexedDbDb or HttpDb, same interface.
export const db: Db = new MockDb();
