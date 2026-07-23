import { Platform } from 'react-native';

let AsyncStorage: any = null;

async function getAsyncStorage() {
  if (AsyncStorage === null && Platform.OS !== 'web') {
    try {
      const mod = await import('@react-native-async-storage/async-storage');
      AsyncStorage = mod.default;
    } catch {
      AsyncStorage = undefined;
    }
  }

  return AsyncStorage;
}

export async function readProfileStorage<T>(key: string, fallback: T): Promise<T> {
  try {
    let rawValue: string | null = null;

    if (Platform.OS === 'web') {
      rawValue = localStorage.getItem(key);
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        rawValue = await storage.getItem(key);
      }
    }

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export async function writeProfileStorage<T>(key: string, value: T) {
  try {
    const serialized = JSON.stringify(value);

    if (Platform.OS === 'web') {
      localStorage.setItem(key, serialized);
      return;
    }

    const storage = await getAsyncStorage();
    if (storage) {
      await storage.setItem(key, serialized);
    }
  } catch {
    return;
  }
}
