import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, type UserCredential } from 'firebase/auth';

import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { ensureUserProfile, type UserDocument } from '@/lib/user-repository';

export type AuthResult = {
  credential: UserCredential;
  profile: UserDocument;
};

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase chưa được cấu hình. Hãy điền EXPO_PUBLIC_FIREBASE_* trong .env.');
  }

  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  const profile = await ensureUserProfile({
    id: credential.user.uid,
    email: credential.user.email ?? email,
    displayName: credential.user.displayName ?? credential.user.email?.split('@')[0] ?? 'Người dùng',
    photoURL: credential.user.photoURL ?? '',
    role: 'user',
  });

  return { credential, profile };
}

export async function registerWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase chưa được cấu hình. Hãy điền EXPO_PUBLIC_FIREBASE_* trong .env.');
  }

  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  const profile = await ensureUserProfile({
    id: credential.user.uid,
    email: credential.user.email ?? email,
    displayName: credential.user.displayName ?? credential.user.email?.split('@')[0] ?? 'Người dùng',
    photoURL: credential.user.photoURL ?? '',
    role: 'user',
  });

  return { credential, profile };
}

export async function resetPasswordWithEmail(email: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase chưa được cấu hình. Hãy điền EXPO_PUBLIC_FIREBASE_* trong .env.');
  }

  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function logout() {
  if (!isFirebaseConfigured()) {
    return;
  }

  await signOut(getFirebaseAuth());
}