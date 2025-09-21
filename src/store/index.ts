import { create } from 'zustand';

// Minimal Zustand store setup for future use
// Currently, components use controllers directly for data management

export interface AppStore {
  // Add future global state here
}

export const useAppStore = create<AppStore>()(() => ({}));