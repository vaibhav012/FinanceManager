// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  TRANSACTIONS: '@transactions',
  MESSAGES: '@messages', // Added @ prefix for consistency
  CATEGORIES: '@categories',
  ACCOUNTS: '@accounts',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

// Type-safe storage helpers
export const storage = {
  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS[key]);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: StorageKey, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  },

  async remove(key: StorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },
};
