import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Platform } from 'react-native';

import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type CommentDocument = {
  id: string;
  articleId: string;
  authorName: string;
  text: string;
  time: string;
  createdAt: string;
  userId?: string;
  likes?: number;
  likedBy?: string[];
  parentId?: string;
  replyToAuthor?: string;
};

const storageKeyPrefix = 'khmerapp.comments.';

let AsyncStorage: any = null;
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

// Initial mock comments (Empty list as requested by user)
const defaultComments: Record<string, CommentDocument[]> = {};

export async function fetchCommentsForArticle(articleId: string): Promise<CommentDocument[]> {
  const localComments = await fetchLocalComments(articleId);

  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    const all = [...localComments];
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return all;
  }

  try {
    const db = getFirestoreDb();
    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId)
    );
    const snapshot = await getDocs(q);
    const firestoreComments: CommentDocument[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        articleId: String(data.articleId ?? ''),
        authorName: String(data.authorName ?? 'Người dùng'),
        text: String(data.text ?? ''),
        time: String(data.time ?? 'Vừa xong'),
        createdAt: String(data.createdAt ?? new Date().toISOString()),
        userId: data.userId ? String(data.userId) : undefined,
        likes: typeof data.likes === 'number' ? data.likes : 0,
        likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
        parentId: data.parentId ? String(data.parentId) : undefined,
        replyToAuthor: data.replyToAuthor ? String(data.replyToAuthor) : undefined,
      };
    });

    // Merge: Firestore comments and local comments
    const all = [...firestoreComments, ...localComments];
    // Filter duplicates based on ID
    const seen = new Set<string>();
    const unique = all.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    unique.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return unique;
  } catch (error) {
    console.error('Error fetching comments from firestore:', error);
    const all = [...localComments];
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return all;
  }
}

async function fetchLocalComments(articleId: string): Promise<CommentDocument[]> {
  try {
    const key = `${storageKeyPrefix}${articleId}`;
    let rawValue: string | null = null;
    
    if (Platform.OS === 'web') {
      rawValue = localStorage.getItem(key);
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        rawValue = await storage.getItem(key);
      }
    }

    if (!rawValue) return [];
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addCommentToArticle(
  articleId: string,
  text: string,
  authorName: string,
  userId?: string,
  parentId?: string,
  replyToAuthor?: string
): Promise<CommentDocument> {
  const newComment: CommentDocument = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    articleId,
    authorName,
    text,
    time: 'Vừa xong',
    createdAt: new Date().toISOString(),
    userId,
    likes: 0,
    likedBy: [],
    parentId,
    replyToAuthor,
  };

  // If user is logged in and Firebase is running, save to Firestore
  if (userId && isFirebaseConfigured() && !isDemoDataEnabled()) {
    try {
      const db = getFirestoreDb();
      const docRef = await addDoc(collection(db, 'comments'), {
        articleId,
        authorName,
        text,
        createdAt: newComment.createdAt,
        userId,
        likes: 0,
        likedBy: [],
        ...(parentId ? { parentId, replyToAuthor } : {}),
      });
      newComment.id = docRef.id;
      return newComment;
    } catch (error) {
      console.error('Failed to save comment to Firestore, falling back to local storage:', error);
    }
  }

  // Fallback to local storage for guests or offline mode
  try {
    const key = `${storageKeyPrefix}${articleId}`;
    const current = await fetchLocalComments(articleId);
    const updated = [...current, newComment];

    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(updated));
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        await storage.setItem(key, JSON.stringify(updated));
      }
    }
  } catch (error) {
    console.error('Error saving local comment:', error);
  }

  return newComment;
}

export async function toggleCommentLike(
  articleId: string,
  commentId: string,
  userId: string = 'guest-user'
): Promise<{ likes: number; likedBy: string[] }> {
  // Update local storage comments if present
  let updatedLikes = 0;
  let updatedLikedBy: string[] = [];

  try {
    const key = `${storageKeyPrefix}${articleId}`;
    const localComments = await fetchLocalComments(articleId);
    const commentIndex = localComments.findIndex((c) => c.id === commentId);

    if (commentIndex !== -1) {
      const comment = localComments[commentIndex];
      const likedBy = Array.isArray(comment.likedBy) ? [...comment.likedBy] : [];
      const hasLiked = likedBy.includes(userId);

      if (hasLiked) {
        updatedLikedBy = likedBy.filter((id) => id !== userId);
        updatedLikes = Math.max(0, (comment.likes || 1) - 1);
      } else {
        updatedLikedBy = [...likedBy, userId];
        updatedLikes = (comment.likes || 0) + 1;
      }

      localComments[commentIndex] = {
        ...comment,
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      };

      if (Platform.OS === 'web') {
        localStorage.setItem(key, JSON.stringify(localComments));
      } else {
        const storage = await getAsyncStorage();
        if (storage) {
          await storage.setItem(key, JSON.stringify(localComments));
        }
      }
    }
  } catch (e) {
    console.error('Error updating local comment like:', e);
  }

  if (isFirebaseConfigured() && !isDemoDataEnabled() && !commentId.startsWith('mock-') && !commentId.startsWith('local-')) {
    try {
      const db = getFirestoreDb();
      const commentRef = doc(db, 'comments', commentId);
      await setDoc(commentRef, { likes: updatedLikes, likedBy: updatedLikedBy }, { merge: true });
    } catch (error) {
      console.error('Error toggling comment like in Firestore:', error);
    }
  }

  return { likes: updatedLikes, likedBy: updatedLikedBy };
}

export async function deleteComment(articleId: string, commentId: string): Promise<boolean> {
  try {
    const key = `${storageKeyPrefix}${articleId}`;
    const localComments = await fetchLocalComments(articleId);
    const updated = localComments.filter((c) => c.id !== commentId);

    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(updated));
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        await storage.setItem(key, JSON.stringify(updated));
      }
    }
  } catch (e) {
    console.error('Error deleting local comment:', e);
  }

  if (isFirebaseConfigured() && !isDemoDataEnabled() && !commentId.startsWith('mock-') && !commentId.startsWith('local-')) {
    try {
      const db = getFirestoreDb();
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.error('Error deleting comment in Firestore:', error);
    }
  }

  return true;
}

export async function countUserComments(userId?: string): Promise<number> {
  let localCommentsList: CommentDocument[] = [];
  try {
    if (Platform.OS === 'web') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(storageKeyPrefix)) {
          const raw = localStorage.getItem(key);
          try {
            const comments = raw ? JSON.parse(raw) : [];
            if (Array.isArray(comments)) {
              localCommentsList = [...localCommentsList, ...comments.filter((c: CommentDocument) => !userId || c.userId === userId)];
            }
          } catch {}
        }
      }
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const allKeys: string[] = await storage.getAllKeys();
        const commentKeys = allKeys.filter((k: string) => k.startsWith(storageKeyPrefix));
        if (commentKeys.length > 0) {
          const pairs = await storage.multiGet(commentKeys);
          for (const [, rawValue] of pairs) {
            if (rawValue) {
              try {
                const comments = JSON.parse(rawValue);
                if (Array.isArray(comments)) {
                  localCommentsList = [...localCommentsList, ...comments.filter((c: CommentDocument) => !userId || c.userId === userId)];
                }
              } catch {}
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching local comments for counting:', err);
  }

  if (userId && isFirebaseConfigured() && !isDemoDataEnabled()) {
    try {
      const db = getFirestoreDb();
      const q = query(
        collection(db, 'comments'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const firestoreComments: CommentDocument[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          articleId: String(data.articleId ?? ''),
          authorName: String(data.authorName ?? 'Người dùng'),
          text: String(data.text ?? ''),
          time: String(data.time ?? 'Vừa xong'),
          createdAt: String(data.createdAt ?? new Date().toISOString()),
          userId: data.userId ? String(data.userId) : undefined,
        };
      });

      const all = [...firestoreComments, ...localCommentsList];
      const seen = new Set<string>();
      const unique = all.filter((c: CommentDocument) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
      return unique.length;
    } catch (error) {
      console.error('Error querying Firestore user comments count:', error);
    }
  }

  const seen = new Set<string>();
  const uniqueLocal = localCommentsList.filter((c: CommentDocument) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
  return uniqueLocal.length;
}
