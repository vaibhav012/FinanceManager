// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum STORAGE_KEYS {
  TRANSACTIONS='@transactions',
  MESSAGES='@messages', // Added @ prefix for consistency
  CATEGORIES='@categories',
  ACCOUNTS='@accounts',
}

export type STORAGE_KEY_VALUES = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Type-safe storage helpers
export const storage = {
  async get<T>(key: STORAGE_KEYS): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: STORAGE_KEYS, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  },

  async remove(key: STORAGE_KEYS): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },
};
