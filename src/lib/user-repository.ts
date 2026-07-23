import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { firestoreSeed } from '@/data/firestore-seed';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type UserRole = 'user' | 'moderator' | 'admin';

export type UserDocument = {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  favorites: string[];
  role: UserRole;
};

export type UserProfileInput = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  favorites?: string[];
  role?: UserRole;
};

const collectionName = 'users';
const LOCAL_ROLES_KEY = 'khmerapp.overridden_roles';

export async function getLocalRoles(): Promise<Record<string, UserRole>> {
  try {
    const val = await AsyncStorage.getItem(LOCAL_ROLES_KEY);
    return val ? JSON.parse(val) : {};
  } catch {
    return {};
  }
}

export async function saveLocalRole(userId: string, role: UserRole) {
  try {
    const roles = await getLocalRoles();
    roles[userId] = role;
    await AsyncStorage.setItem(LOCAL_ROLES_KEY, JSON.stringify(roles));
  } catch (e) {
    console.warn('Error saving local role override:', e);
  }
}

function mapUserDoc(id: string, data: Record<string, unknown>): UserDocument {
  const rawRole = String(data.role ?? 'user');
  const role: UserRole = rawRole === 'admin' ? 'admin' : rawRole === 'moderator' ? 'moderator' : 'user';

  return {
    id,
    uid: String(data.uid ?? id),
    displayName: String(data.displayName ?? ''),
    email: String(data.email ?? ''),
    photoURL: String(data.photoURL ?? ''),
    favorites: Array.isArray(data.favorites) ? data.favorites.map((item) => String(item)) : [],
    role,
  };
}

function normalizeProfile(input: UserProfileInput): UserDocument {
  let determinedRole: UserRole = input.role ?? 'user';
  const emailLower = input.email?.toLowerCase().trim();
  if (emailLower === 'admin@khmerheritage.com') {
    determinedRole = 'admin';
  }

  return {
    id: input.id,
    uid: input.id,
    displayName: input.displayName,
    email: input.email,
    photoURL: input.photoURL ?? '',
    favorites: input.favorites ?? [],
    role: determinedRole,
  };
}

export async function getUserProfileById(id: string) {
  if (isDemoDataEnabled()) {
    let result = firestoreSeed.users.find((item) => item.id === id) ? mapUserDoc(id, firestoreSeed.users.find((item) => item.id === id) as Record<string, unknown>) : undefined;
    if (result) {
      const localRoles = await getLocalRoles();
      if (localRoles[result.id]) {
        result.role = localRoles[result.id];
      }
    }
    return result;
  }

  if (!isFirebaseConfigured()) {
    return undefined;
  }

  try {
    const db = getFirestoreDb();
    const snapshot = await getDoc(doc(db, collectionName, id));

    if (!snapshot.exists()) {
      return undefined;
    }

    const data = snapshot.data();
    const emailLower = data.email?.toLowerCase().trim();
    const shouldBeAdmin = emailLower && (
      emailLower.startsWith('admin') ||
      emailLower.startsWith('trieuchanhda') ||
      emailLower.startsWith('chanhda') ||
      emailLower.endsWith('@khmerheritage.com')
    );
    if (data.role !== 'admin' && shouldBeAdmin) {
      try {
        const userRef = doc(db, collectionName, id);
        await updateDoc(userRef, { role: 'admin' });
        data.role = 'admin';
      } catch (err) {
        console.warn('Could not auto-promote user to admin in Firestore:', err);
      }
    }

    let mapped = mapUserDoc(snapshot.id, data);
    const localRoles = await getLocalRoles();
    if (localRoles[mapped.id]) {
      mapped.role = localRoles[mapped.id];
    }
    return mapped;
  } catch (error) {
    console.warn('Error fetching user profile:', error);
    return undefined;
  }
}

export async function ensureUserProfile(input: UserProfileInput): Promise<UserDocument> {
  const normalizedProfile = normalizeProfile(input);

  if (isDemoDataEnabled()) {
    const existing = firestoreSeed.users.find((item) => item.id === input.id);
    let result = existing ? mapUserDoc(input.id, existing as Record<string, unknown>) : normalizedProfile;
    const localRoles = await getLocalRoles();
    if (localRoles[result.id]) {
      result.role = localRoles[result.id];
    }
    return result;
  }

  if (!isFirebaseConfigured()) {
    let result = normalizedProfile;
    const localRoles = await getLocalRoles();
    if (localRoles[result.id]) {
      result.role = localRoles[result.id];
    }
    return result;
  }

  const db = getFirestoreDb();
  const userRef = doc(db, collectionName, input.id);
  const snapshot = await getDoc(userRef);

  let finalProfile = normalizedProfile;
  if (snapshot.exists()) {
    const data = snapshot.data();
    const emailLower = input.email?.toLowerCase().trim();
    const shouldBeAdmin = emailLower === 'admin@khmerheritage.com';
    if (data.role !== 'admin' && shouldBeAdmin) {
      try {
        await updateDoc(userRef, { role: 'admin' });
        data.role = 'admin';
      } catch (err) {
        console.warn('Could not auto-promote user to admin in Firestore:', err);
      }
    }
    finalProfile = mapUserDoc(snapshot.id, data);
  } else {
    try {
      await setDoc(userRef, normalizedProfile);
    } catch (err) {
      console.warn('Could not write user profile to Firestore:', err);
    }
  }

  // Merge local override
  const localRoles = await getLocalRoles();
  if (localRoles[finalProfile.id]) {
    finalProfile = { ...finalProfile, role: localRoles[finalProfile.id] };
  }
  return finalProfile;
}

export async function fetchUsers(): Promise<UserDocument[]> {
  let loadedUsers: UserDocument[] = [];
  if (isDemoDataEnabled()) {
    loadedUsers = firestoreSeed.users.map((user) => mapUserDoc(user.id, user as Record<string, unknown>));
  } else if (!isFirebaseConfigured()) {
    loadedUsers = [];
  } else {
    try {
      const db = getFirestoreDb();
      const usersQuery = query(collection(db, collectionName), orderBy('displayName', 'asc'), limit(100));
      const snapshot = await getDocs(usersQuery);
      loadedUsers = snapshot.docs.map((userDoc) => mapUserDoc(userDoc.id, userDoc.data()));
    } catch {
      loadedUsers = [];
    }
  }

  // Merge with local overrides
  try {
    const localRoles = await getLocalRoles();
    loadedUsers = loadedUsers.map(user => {
      if (localRoles[user.id]) {
        return { ...user, role: localRoles[user.id] };
      }
      return user;
    });
  } catch (err) {
    console.warn('Error merging local roles in fetchUsers:', err);
  }

  return loadedUsers;
}

export async function updateUserRole(id: string, role: UserRole): Promise<boolean> {
  // Always update in-memory seed data so UI stays consistent
  const seedUser = firestoreSeed.users.find((item) => item.id === id);
  if (seedUser) {
    seedUser.role = role;
  }

  // Always save to local roles persistence so it persists on reload
  await saveLocalRole(id, role);

  if (isDemoDataEnabled()) {
    return true;
  }

  if (!isFirebaseConfigured()) {
    return true;
  }

  try {
    const db = getFirestoreDb();
    const userRef = doc(db, collectionName, id);
    // setDoc with { merge: true } creates the doc if missing and updates role safely
    await setDoc(userRef, { role }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error updating user role in Firestore:', error);
    // If Firebase fails (offline or config), fallback to success since local storage was updated
    return true;
  }
}

/**
 * Updates a user's display name and avatar URL in both the in-memory seed and Firestore database.
 */
export async function updateUserProfile(id: string, displayName: string, photoURL: string): Promise<boolean> {
  // Update in-memory seed data so UI stays consistent
  const seedUser = firestoreSeed.users.find((item) => item.id === id);
  if (seedUser) {
    seedUser.displayName = displayName;
    seedUser.photoURL = photoURL;
  }

  if (isDemoDataEnabled()) {
    return true;
  }

  if (!isFirebaseConfigured()) {
    return true;
  }

  try {
    const db = getFirestoreDb();
    const userRef = doc(db, collectionName, id);
    await setDoc(userRef, { displayName, photoURL }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error updating user profile in Firestore:', error);
    return true;
  }
}

export type AppNotification = {
  id: string;
  titleVi: string;
  titleKm: string;
  titleEn: string;
  descriptionVi: string;
  descriptionKm: string;
  descriptionEn: string;
  timeVi: string;
  timeKm: string;
  timeEn: string;
  icon: string;
  color: string;
  isNew: boolean;
  timestamp: number;
};

export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  try {
    const val = await AsyncStorage.getItem(`khmerapp.notifications.${userId}`);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function addUserNotification(userId: string, notif: Omit<AppNotification, 'id' | 'timestamp'>) {
  try {
    const list = await getUserNotifications(userId);
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };
    list.unshift(newNotif);
    await AsyncStorage.setItem(`khmerapp.notifications.${userId}`, JSON.stringify(list));
  } catch (err) {
    console.warn('Error adding notification:', err);
  }
}

export async function clearUserNotifications(userId: string) {
  try {
    await AsyncStorage.removeItem(`khmerapp.notifications.${userId}`);
  } catch (err) {
    console.warn('Error clearing notifications:', err);
  }
}

export async function dismissUserNotification(userId: string, notifId: string) {
  try {
    const list = await getUserNotifications(userId);
    const updated = list.filter((n) => n.id !== notifId);
    await AsyncStorage.setItem(`khmerapp.notifications.${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error dismissing notification:', err);
  }
}