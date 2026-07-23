import type { ArticleDocument } from '@/lib/article-repository';
import { Platform } from 'react-native';

const storageKey = 'khmerapp.custom-articles';

let AsyncStorage: any = null;

// Dynamically load AsyncStorage only for native platforms
async function getAsyncStorage() {
  if (AsyncStorage === null && Platform.OS !== 'web') {
    try {
      const mod = await import('@react-native-async-storage/async-storage');
      AsyncStorage = mod.default;
    } catch (e) {
      console.warn('AsyncStorage not available');
    }
  }
  return AsyncStorage;
}

export type CustomArticleDraft = ArticleDocument & {
  source: 'manual';
  templateId: string;
};

function createFallbackId() {
  return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readDrafts(): Promise<CustomArticleDraft[]> {
  try {
    let rawValue: string | null = null;
    
    if (Platform.OS === 'web') {
      rawValue = localStorage.getItem(storageKey);
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        rawValue = await storage.getItem(storageKey);
      }
    }

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as CustomArticleDraft[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

async function writeDrafts(drafts: CustomArticleDraft[]) {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(storageKey, JSON.stringify(drafts));
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        await storage.setItem(storageKey, JSON.stringify(drafts));
      }
    }
  } catch {
    return;
  }
}

export async function getCustomArticles() {
  return readDrafts();
}

export async function saveCustomArticle(
  article: Omit<CustomArticleDraft, 'id' | 'source'> & { id?: string }
) {
  const drafts = await readDrafts();
  const id = article.id ?? createFallbackId();
  const nextDrafts = [
    {
      ...article,
      id,
      source: 'manual' as const,
    },
    ...drafts.filter((draft) => draft.id !== id),
  ];

  await writeDrafts(nextDrafts);
  return id;
}

export async function deleteCustomArticle(id: string) {
  const drafts = await readDrafts();
  await writeDrafts(drafts.filter((draft) => draft.id !== id));
}