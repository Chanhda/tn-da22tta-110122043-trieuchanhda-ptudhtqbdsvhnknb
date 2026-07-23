import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, updateDoc } from 'firebase/firestore';

import { festivalItems, type FestivalItem } from '@/constants/festivals';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

const collectionName = 'festivals';

// In-memory array for session modifications in fallback/demo mode
let localFestivalItems: FestivalItem[] = [...festivalItems];

function mapFestivalDoc(id: string, data: Record<string, unknown>): FestivalItem {
  const defaultItem = festivalItems.find((f) => f.id === id) || festivalItems[0];

  return {
    id,
    title: (data.title as FestivalItem['title']) || defaultItem.title,
    khmerTitle: String(data.khmerTitle ?? defaultItem.khmerTitle),
    subtitle: (data.subtitle as FestivalItem['subtitle']) || defaultItem.subtitle,
    targetDate: String(data.targetDate ?? defaultItem.targetDate),
    dateDisplay: (data.dateDisplay as FestivalItem['dateDisplay']) || defaultItem.dateDisplay,
    location: (data.location as FestivalItem['location']) || defaultItem.location,
    summary: (data.summary as FestivalItem['summary']) || defaultItem.summary,
    description: (data.description as FestivalItem['description']) || defaultItem.description,
    rituals: (data.rituals as FestivalItem['rituals']) || { vi: [], km: [], en: [] },
    foods: (data.foods as FestivalItem['foods']) || { vi: [], km: [], en: [] },
    highlights: (data.highlights as FestivalItem['highlights']) || { vi: [], km: [], en: [] },
    coverImage: String(data.coverImage ?? defaultItem.coverImage),
    featured: typeof data.featured === 'boolean' ? data.featured : defaultItem.featured,
  };
}

export async function fetchFestivals(): Promise<FestivalItem[]> {
  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    return localFestivalItems;
  }

  try {
    const db = getFirestoreDb();
    const q = query(collection(db, collectionName), limit(50));
    const snapshot = await getDocs(q);
    const firestoreFestivals = snapshot.docs.map((docSnap) => mapFestivalDoc(docSnap.id, docSnap.data()));

    if (firestoreFestivals.length > 0) {
      localFestivalItems = firestoreFestivals;
      return firestoreFestivals;
    }
    return localFestivalItems;
  } catch {
    // If Firestore permissions are missing or error occurs, fall back gracefully to local festivals data
    return localFestivalItems;
  }
}

export async function fetchFestivalById(id: string): Promise<FestivalItem | undefined> {
  const localMatch = localFestivalItems.find((item) => item.id === id);

  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    return localMatch;
  }

  try {
    const db = getFirestoreDb();
    const snapshot = await getDoc(doc(db, collectionName, id));
    if (snapshot.exists()) {
      return mapFestivalDoc(snapshot.id, snapshot.data());
    }
    return localMatch;
  } catch {
    return localMatch;
  }
}

export async function updateFestival(id: string, festival: Partial<FestivalItem>): Promise<boolean> {
  // Update in local memory first
  const index = localFestivalItems.findIndex((f) => f.id === id);
  if (index !== -1) {
    localFestivalItems[index] = { ...localFestivalItems[index], ...festival };
  }

  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    return true;
  }

  try {
    const db = getFirestoreDb();
    const festivalRef = doc(db, collectionName, id);
    await setDoc(festivalRef, { ...festival, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating festival in Firestore:', error);
    return true;
  }
}

export async function createFestival(festival: Omit<FestivalItem, 'id'> & { id?: string }): Promise<string> {
  const id = festival.id || `festival-${Date.now()}`;
  const newItem: FestivalItem = { ...festival, id };

  localFestivalItems.unshift(newItem);

  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    return id;
  }

  try {
    const db = getFirestoreDb();
    const festivalRef = doc(db, collectionName, id);
    await setDoc(festivalRef, { ...newItem, createdAt: new Date().toISOString() });
    return id;
  } catch (error) {
    console.error('Error creating festival in Firestore:', error);
    return id;
  }
}

export async function deleteFestival(id: string): Promise<boolean> {
  localFestivalItems = localFestivalItems.filter((f) => f.id !== id);

  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    return true;
  }

  try {
    const db = getFirestoreDb();
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error('Error deleting festival in Firestore:', error);
    return true;
  }
}
