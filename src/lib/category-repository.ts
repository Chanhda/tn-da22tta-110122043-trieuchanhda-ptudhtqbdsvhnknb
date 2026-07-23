import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

import { firestoreSeed } from '@/data/firestore-seed';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type CategoryDocument = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

const collectionName = 'categories';

function mapCategoryDoc(id: string, data: Record<string, unknown>): CategoryDocument {
  return {
    id,
    name: String(data.name ?? ''),
    slug: String(data.slug ?? ''),
    icon: String(data.icon ?? ''),
  };
}

export async function fetchCategories(): Promise<CategoryDocument[]> {
  if (isDemoDataEnabled()) {
    return firestoreSeed.categories;
  }

  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const db = getFirestoreDb();
    const categoriesQuery = query(collection(db, collectionName), orderBy('name', 'asc'), limit(20));
    const snapshot = await getDocs(categoriesQuery);

    return snapshot.docs.map((categoryDoc) => mapCategoryDoc(categoryDoc.id, categoryDoc.data()));
  } catch {
    return [];
  }
}