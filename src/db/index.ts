import type { Db } from './types'
import { MockDb } from './mockDb'

// Swap this line later to use IndexedDbDb or HttpDb, same interface.
export const db: Db = new MockDb()
