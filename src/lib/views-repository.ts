import { Platform } from 'react-native';

const VIEWED_ITEMS_KEY = 'khmerapp.viewed-items';

async function getAsyncStorage() {
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    return mod.default;
  } catch {
    return null;
  }
}

export async function trackViewedItemLocally(id: string): Promise<void> {
  try {
    let ids: string[] = [];
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(VIEWED_ITEMS_KEY);
      ids = raw ? JSON.parse(raw) : [];
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(VIEWED_ITEMS_KEY);
        ids = raw ? JSON.parse(raw) : [];
      }
    }
    if (!Array.isArray(ids)) ids = [];
    if (!ids.includes(id)) {
      ids.push(id);
      if (Platform.OS === 'web') {
        localStorage.setItem(VIEWED_ITEMS_KEY, JSON.stringify(ids));
      } else {
        const storage = await getAsyncStorage();
        if (storage) {
          await storage.setItem(VIEWED_ITEMS_KEY, JSON.stringify(ids));
        }
      }
    }
  } catch (err) {
    console.error('Error tracking viewed item locally:', err);
  }
}

export async function fetchViewedItemsCount(): Promise<number> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(VIEWED_ITEMS_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) ? ids.length : 0;
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(VIEWED_ITEMS_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        return Array.isArray(ids) ? ids.length : 0;
      }
    }
  } catch (err) {
    console.error('Error fetching viewed items count:', err);
  }
  return 0;
}
