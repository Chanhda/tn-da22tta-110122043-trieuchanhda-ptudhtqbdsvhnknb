import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, increment } from 'firebase/firestore';

import { heritageItems, type HeritageItem } from '@/constants/heritages';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type HeritageDocument = HeritageItem & {
  coverImage?: string;
  createdAt?: string;
  location?: {
    lat?: number;
    lng?: number;
  } | null;
  views?: number;
  likes?: number;
  /** Short summary for detail page */
  summary?: string;
  /** Approximate construction year for display */
  builtYear?: string | number;
};

const collectionName = 'heritages';

function mapHeritageDoc(id: string, data: Record<string, unknown>): HeritageDocument {
  const location = data.location && typeof data.location === 'object' ? (data.location as { lat?: number; lng?: number }) : undefined;
  const rawType = String(data.type ?? 'tangible');
  const type = (rawType === 'intangible' ? 'intangible' : 'tangible') as 'tangible' | 'intangible';

  return {
    id,
    title: String(data.title ?? ''),
    province: String(data.province ?? ''),
    category: String(data.category ?? ''),
    type,
    subtitle: String(data.subtitle ?? ''),
    body: String(data.body ?? ''),
    tag: String(data.tag ?? ''),
    description: String(data.description ?? ''),
    highlights: Array.isArray(data.highlights) ? data.highlights.map((item) => String(item)) : [],
    coverImage: typeof data.coverImage === 'string'
      ? data.coverImage.replace('w=1200', 'w=400').replace('w=800', 'w=400')
      : undefined,
    gallery: Array.isArray(data.gallery) ? data.gallery.map((item) => String(item)) : undefined,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : undefined,
    location,
    views: typeof data.views === 'number' ? data.views : 0,
    likes: typeof data.likes === 'number' ? data.likes : 0,
  };
}

export async function fetchHeritages(): Promise<HeritageDocument[]> {
  if (isDemoDataEnabled()) {
    return heritageItems;
  }

  if (!isFirebaseConfigured()) {
    // No Firebase → use local demo data so app still works
    return heritageItems;
  }

  try {
    const db = getFirestoreDb();
    const heritagesQuery = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(heritagesQuery);
    const firestoreHeritages = snapshot.docs.map((heritageDoc) => mapHeritageDoc(heritageDoc.id, heritageDoc.data()));

    if (firestoreHeritages.length > 0) {
      return firestoreHeritages;
    }
    return heritageItems;
  } catch {
    // Firebase error → fall back to local demo data
    return heritageItems;
  }
}

export async function fetchHeritageById(id: string): Promise<HeritageDocument | undefined> {
  // Always check local data first as a fast path / fallback
  const localMatch = heritageItems.find((item) => item.id === id);

  if (isDemoDataEnabled()) {
    return localMatch;
  }

  if (!isFirebaseConfigured()) {
    return localMatch;
  }

  try {
    const db = getFirestoreDb();
    const snapshot = await getDoc(doc(db, collectionName, id));

    if (snapshot.exists()) {
      return mapHeritageDoc(snapshot.id, snapshot.data());
    }

    // Not in Firestore → fall back to local static data
    return localMatch;
  } catch {
    return localMatch;
  }
}

/**
 * Delete a heritage (Admin only)
 */
export async function deleteHeritage(id: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }

  const db = getFirestoreDb();
  await deleteDoc(doc(db, collectionName, id));
}

/**
 * Create a new heritage (Admin only)
 */
export async function createHeritage(heritage: Omit<HeritageDocument, 'id'>): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }

  const db = getFirestoreDb();
  const newDocRef = doc(collection(db, collectionName));
  
  await setDoc(newDocRef, {
    ...heritage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return newDocRef.id;
}

/**
 * Update an existing heritage (Admin only)
 */
export async function updateHeritage(id: string, heritage: Partial<HeritageDocument>): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }

  const db = getFirestoreDb();
  await updateDoc(doc(db, collectionName, id), {
    ...heritage,
    updatedAt: new Date().toISOString(),
  });
}

// ──────────────────────────────────────────────────────────
// Lượt xem & Lượt thích thực tế (Real views & likes tracking)
// ──────────────────────────────────────────────────────────
import { Platform } from 'react-native';
import { trackViewedItemLocally } from './views-repository';

const LIKED_HERITAGES_KEY = 'khmerapp.liked-heritages';

async function getAsyncStorage() {
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    return mod.default;
  } catch {
    return null;
  }
}

export async function isHeritageLikedLocally(id: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LIKED_HERITAGES_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) && ids.includes(id);
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(LIKED_HERITAGES_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        return Array.isArray(ids) && ids.includes(id);
      }
    }
  } catch {}
  return false;
}

export async function setHeritageLikedLocally(id: string, liked: boolean): Promise<void> {
  try {
    let ids: string[] = [];
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LIKED_HERITAGES_KEY);
      ids = raw ? JSON.parse(raw) : [];
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(LIKED_HERITAGES_KEY);
        ids = raw ? JSON.parse(raw) : [];
      }
    }
    if (!Array.isArray(ids)) ids = [];
    if (liked) {
      if (!ids.includes(id)) ids.push(id);
    } else {
      ids = ids.filter(x => x !== id);
    }

    if (Platform.OS === 'web') {
      localStorage.setItem(LIKED_HERITAGES_KEY, JSON.stringify(ids));
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        await storage.setItem(LIKED_HERITAGES_KEY, JSON.stringify(ids));
      }
    }
  } catch {}
}

export async function fetchLikedHeritagesLocally(): Promise<string[]> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LIKED_HERITAGES_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) ? ids : [];
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(LIKED_HERITAGES_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        return Array.isArray(ids) ? ids : [];
      }
    }
  } catch {}
  return [];
}

export async function incrementHeritageViews(id: string): Promise<void> {
  await trackViewedItemLocally(id);
  if (!isFirebaseConfigured() || isDemoDataEnabled()) return;
  try {
    const db = getFirestoreDb();
    await updateDoc(doc(db, collectionName, id), {
      views: increment(1)
    });
  } catch (err) {
    console.error('Error incrementing heritage views:', err);
  }
}

export async function toggleHeritageLike(id: string, willLike: boolean): Promise<void> {
  await setHeritageLikedLocally(id, willLike);

  if (!isFirebaseConfigured() || isDemoDataEnabled()) return;
  try {
    const db = getFirestoreDb();
    await updateDoc(doc(db, collectionName, id), {
      likes: increment(willLike ? 1 : -1)
    });
  } catch (err) {
    console.error('Error toggling heritage like:', err);
  }
}