import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

import { firestoreSeed } from '@/data/firestore-seed';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type MediaDocument = {
  id: string;
  type: string;
  title: string;
  url: string;
  relatedId: string;
};

const collectionName = 'media';

function mapMediaDoc(id: string, data: Record<string, unknown>): MediaDocument {
  return {
    id,
    type: String(data.type ?? ''),
    title: String(data.title ?? ''),
    url: String(data.url ?? ''),
    relatedId: String(data.relatedId ?? ''),
  };
}

export async function fetchMedia(): Promise<MediaDocument[]> {
  if (isDemoDataEnabled()) {
    return firestoreSeed.media;
  }

  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const db = getFirestoreDb();
    const mediaQuery = query(collection(db, collectionName), orderBy('title', 'asc'), limit(20));
    const snapshot = await getDocs(mediaQuery);

    return snapshot.docs.map((mediaDoc) => mapMediaDoc(mediaDoc.id, mediaDoc.data()));
  } catch {
    return [];
  }
}