import { getApps, initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

let AsyncStoragePersistence: any = null;

// Load AsyncStorage persistence only on native platforms.
// Uses a local shim (_firebase-auth-rn-shim.js) that imports via a relative
// file path, bypassing @firebase/auth's package.json `exports` enforcement.
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getReactNativePersistence } = require('./_firebase-auth-rn-shim');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStoragePersistence = getReactNativePersistence(ReactNativeAsyncStorage);
  } catch (e) {
    console.warn('AsyncStorage persistence not available, using inMemoryPersistence:', e);
  }
}


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCDDQukO7dNV7pVmvlwaOwsOxd5G5WV1Bg',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'khmerapp-9895c.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'khmerapp-9895c',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'khmerapp-9895c.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '116301043057',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:116301043057:web:04f03a6716880a9b7552d0',
};

export function isDemoDataEnabled() {
  return process.env.EXPO_PUBLIC_USE_DEMO_DATA === 'true';
}

export function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every(Boolean);
}

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Fill the EXPO_PUBLIC_FIREBASE_* variables in your .env file.'
    );
  }

  return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
}

let authInstance: ReturnType<typeof getAuth> | undefined;

export function getFirebaseAuth() {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();

  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
    return authInstance;
  }

  // On native: use AsyncStorage persistence if loaded, otherwise inMemoryPersistence
  try {
    authInstance = initializeAuth(app, {
      persistence: AsyncStoragePersistence ?? inMemoryPersistence,
    });
  } catch {
    // Already initialized (e.g. hot reload) — retrieve the existing instance
    authInstance = getAuth(app);
  }

  return authInstance;
}

let dbInstance: any = null;

export function getFirestoreDb() {
  if (dbInstance) {
    return dbInstance;
  }
  const app = getFirebaseApp();
  try {
    dbInstance = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch (e) {
    dbInstance = getFirestore(app);
  }
  return dbInstance;
}

export function getStorageBucket() {
  return getStorage(getFirebaseApp());
}