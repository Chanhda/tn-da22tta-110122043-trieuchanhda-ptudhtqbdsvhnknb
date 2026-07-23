import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  increment,
} from 'firebase/firestore';

import { articleItems, type ArticleItem } from '@/constants/articles';
import { getCustomArticles } from '@/lib/custom-article-store';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type ArticleStatus = 'pending' | 'published' | 'rejected';

export type ArticleDocument = ArticleItem & {
  coverImage?: string;
  gallery?: string[];
  createdAt?: string;
  views?: number;
  likes?: number;
  /** published = đã xuất bản, pending = chờ admin duyệt, rejected = bị từ chối */
  published?: boolean;
  status?: ArticleStatus;
  /** UID của người gửi bài */
  authorId?: string;
  /** Lý do từ chối (nếu có) */
  rejectReason?: string;
  /** ID template bài viết (dùng bởi form người dùng) */
  templateId?: string;
};

const collectionName = 'articles';

function mapArticleDoc(id: string, data: Record<string, unknown>): ArticleDocument {
  return {
    id,
    title: String(data.title ?? ''),
    category: String(data.category ?? ''),
    summary: String(data.summary ?? ''),
    content: String(data.content ?? ''),
    author: String(data.author ?? ''),
    date: String(data.date ?? ''),
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
    gallery: Array.isArray(data.gallery) ? data.gallery.map((item) => String(item)) : undefined,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : undefined,
    views: typeof data.views === 'number' ? data.views : 0,
    likes: typeof data.likes === 'number' ? data.likes : 0,
    published: typeof data.published === 'boolean' ? data.published : false,
    status: (data.status as ArticleStatus) ?? (data.published ? 'published' : 'pending'),
    authorId: typeof data.authorId === 'string' ? data.authorId : undefined,
    rejectReason: typeof data.rejectReason === 'string' ? data.rejectReason : undefined,
  };
}

// ──────────────────────────────────────────────────────────
// Fetch danh sách bài viết ĐÃ XUẤT BẢN (cho người dùng thường)
// ──────────────────────────────────────────────────────────
export async function fetchArticles(): Promise<ArticleDocument[]> {
  const customArticles = await getCustomArticles();

  if (isDemoDataEnabled()) {
    return [...customArticles, ...articleItems];
  }

  if (!isFirebaseConfigured()) {
    return [...customArticles, ...articleItems];
  }

  try {
    const db = getFirestoreDb();
    // Chỉ lấy bài đã published hoặc status == 'published'
    const articlesQuery = query(
      collection(db, collectionName),
      where('published', '==', true),
      limit(100),
    );
    const snapshot = await getDocs(articlesQuery);
    const firestoreArticles = snapshot.docs.map((d) => mapArticleDoc(d.id, d.data()));

    // Sắp xếp theo ngày tạo giảm dần trong bộ nhớ
    firestoreArticles.sort((a, b) => {
      const da = a.createdAt || '';
      const db = b.createdAt || '';
      return db.localeCompare(da);
    });

    if (firestoreArticles.length > 0) {
      return [...customArticles, ...firestoreArticles];
    }
    return [...customArticles, ...articleItems];
  } catch {
    return [...customArticles, ...articleItems];
  }
}

// ──────────────────────────────────────────────────────────
// Fetch TẤT CẢ bài viết (cho admin) — bao gồm pending/rejected
// ──────────────────────────────────────────────────────────
export async function fetchAllArticlesAdmin(): Promise<ArticleDocument[]> {
  if (!isFirebaseConfigured()) {
    return articleItems;
  }

  try {
    const db = getFirestoreDb();
    const articlesQuery = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'),
      limit(100),
    );
    const snapshot = await getDocs(articlesQuery);
    return snapshot.docs.map((d) => mapArticleDoc(d.id, d.data()));
  } catch {
    return articleItems;
  }
}

// ──────────────────────────────────────────────────────────
// Fetch bài viết ĐANG CHỜ DUYỆT (cho admin)
// ──────────────────────────────────────────────────────────
export async function fetchPendingArticles(): Promise<ArticleDocument[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const db = getFirestoreDb();
    const q = query(
      collection(db, collectionName),
      where('status', '==', 'pending'),
      limit(100),
    );
    const snapshot = await getDocs(q);
    const pendingArticles = snapshot.docs.map((d) => mapArticleDoc(d.id, d.data()));

    // Sắp xếp theo ngày tạo giảm dần trong bộ nhớ
    pendingArticles.sort((a, b) => {
      const da = a.createdAt || '';
      const db = b.createdAt || '';
      return db.localeCompare(da);
    });

    return pendingArticles;
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────────────────
// Fetch bài theo ID
// ──────────────────────────────────────────────────────────
export async function fetchArticleById(id: string): Promise<ArticleDocument | undefined> {
  const customArticles = await getCustomArticles();

  const localMatch =
    customArticles.find((item) => item.id === id) ??
    articleItems.find((item) => item.id === id);

  if (isDemoDataEnabled()) return localMatch;
  if (!isFirebaseConfigured()) return localMatch;

  try {
    const db = getFirestoreDb();
    const snapshot = await getDoc(doc(db, collectionName, id));
    if (snapshot.exists()) return mapArticleDoc(snapshot.id, snapshot.data());
    return localMatch;
  } catch {
    return localMatch;
  }
}

// ──────────────────────────────────────────────────────────
// Người dùng GỬI bài viết (status: pending, chờ admin duyệt)
// ──────────────────────────────────────────────────────────
export async function submitArticle(
  article: Omit<ArticleDocument, 'id'> & { authorId: string }
): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase chưa được cấu hình');
  }

  const db = getFirestoreDb();
  const newDocRef = doc(collection(db, collectionName));

  await setDoc(newDocRef, {
    ...article,
    published: false,
    status: 'pending' as ArticleStatus,
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return newDocRef.id;
}

// ──────────────────────────────────────────────────────────
// Admin: DUYỆT bài viết
// ──────────────────────────────────────────────────────────
export async function approveArticle(id: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase chưa được cấu hình');
  const db = getFirestoreDb();
  await updateDoc(doc(db, collectionName, id), {
    published: true,
    status: 'published' as ArticleStatus,
    rejectReason: null,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// ──────────────────────────────────────────────────────────
// Admin: TỪ CHỐI bài viết
// ──────────────────────────────────────────────────────────
export async function rejectArticle(id: string, reason?: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase chưa được cấu hình');
  const db = getFirestoreDb();
  await updateDoc(doc(db, collectionName, id), {
    published: false,
    status: 'rejected' as ArticleStatus,
    rejectReason: reason ?? 'Không phù hợp với tiêu chí đăng tải',
    updatedAt: new Date().toISOString(),
  });
}

// ──────────────────────────────────────────────────────────
// Admin: XÓA bài
// ──────────────────────────────────────────────────────────
export async function deleteArticle(id: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase chưa được cấu hình');
  const db = getFirestoreDb();
  await deleteDoc(doc(db, collectionName, id));
}

// ──────────────────────────────────────────────────────────
// Admin: TẠO mới bài (admin tự viết, auto published)
// ──────────────────────────────────────────────────────────
export async function createArticle(article: Omit<ArticleDocument, 'id'>): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('Firebase chưa được cấu hình');

  const db = getFirestoreDb();
  const newDocRef = doc(collection(db, collectionName));

  await setDoc(newDocRef, {
    ...article,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: article.views ?? 0,
    likes: article.likes ?? 0,
    published: article.published ?? true,
    status: 'published' as ArticleStatus,
  });

  return newDocRef.id;
}

// ──────────────────────────────────────────────────────────
// Admin: CẬP NHẬT bài
// ──────────────────────────────────────────────────────────
export async function updateArticle(id: string, article: Partial<ArticleDocument>): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase chưa được cấu hình');
  const db = getFirestoreDb();
  await updateDoc(doc(db, collectionName, id), {
    ...article,
    updatedAt: new Date().toISOString(),
  });
}

// ──────────────────────────────────────────────────────────
// Fetch bài viết theo authorId (cho người dùng xem bài họ đã gửi)
// ──────────────────────────────────────────────────────────
export async function fetchArticlesByAuthor(authorId: string): Promise<ArticleDocument[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const db = getFirestoreDb();
    const q = query(
      collection(db, collectionName),
      where('authorId', '==', authorId),
      limit(100)
    );
    const snapshot = await getDocs(q);
    const userArticles = snapshot.docs.map((d) => mapArticleDoc(d.id, d.data()));

    // Sắp xếp theo ngày tạo giảm dần
    userArticles.sort((a, b) => {
      const da = a.createdAt || '';
      const db = b.createdAt || '';
      return db.localeCompare(da);
    });

    return userArticles;
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────────────────
// Lượt xem & Lượt thích thực tế (Real views & likes tracking)
// ──────────────────────────────────────────────────────────
import { Platform } from 'react-native';
import { trackViewedItemLocally } from './views-repository';

const LIKED_ARTICLES_KEY = 'khmerapp.liked-articles';

async function getAsyncStorage() {
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    return mod.default;
  } catch {
    return null;
  }
}

export async function isArticleLikedLocally(id: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LIKED_ARTICLES_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) && ids.includes(id);
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(LIKED_ARTICLES_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        return Array.isArray(ids) && ids.includes(id);
      }
    }
  } catch {}
  return false;
}

export async function setArticleLikedLocally(id: string, liked: boolean): Promise<void> {
  try {
    let ids: string[] = [];
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LIKED_ARTICLES_KEY);
      ids = raw ? JSON.parse(raw) : [];
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(LIKED_ARTICLES_KEY);
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
      localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(ids));
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        await storage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(ids));
      }
    }
  } catch {}
}

export async function fetchLikedArticlesLocally(): Promise<string[]> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LIKED_ARTICLES_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) ? ids : [];
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const raw = await storage.getItem(LIKED_ARTICLES_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        return Array.isArray(ids) ? ids : [];
      }
    }
  } catch {}
  return [];
}

export async function incrementArticleViews(id: string): Promise<void> {
  await trackViewedItemLocally(id);
  if (!isFirebaseConfigured() || isDemoDataEnabled()) return;
  try {
    const db = getFirestoreDb();
    await updateDoc(doc(db, collectionName, id), {
      views: increment(1)
    });
  } catch (err) {
    console.error('Error incrementing article views:', err);
  }
}

export async function toggleArticleLike(id: string, willLike: boolean): Promise<void> {
  await setArticleLikedLocally(id, willLike);

  if (!isFirebaseConfigured() || isDemoDataEnabled()) return;
  try {
    const db = getFirestoreDb();
    await updateDoc(doc(db, collectionName, id), {
      likes: increment(willLike ? 1 : -1)
    });
  } catch (err) {
    console.error('Error toggling article like:', err);
  }
}

