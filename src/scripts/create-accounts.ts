import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps, type ServiceAccount, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function loadServiceAccount(): ServiceAccount | undefined {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    const resolvedPath = path.resolve(serviceAccountPath);
    return JSON.parse(fs.readFileSync(resolvedPath, 'utf8')) as ServiceAccount;
  }

  return undefined;
}

// Load .env variables manually in Node
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.replace(/\\n/gm, '\n');
        }
        process.env[key] = value.replace(/(^['"]|['"]$)/g, '').trim();
      }
    });
  }
} catch (e) {
  console.log('Error loading .env file:', e);
}

const serviceAccount = loadServiceAccount();

if (getApps().length === 0) {
  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({ credential: applicationDefault() });
  }
}

const auth = getAuth();
const db = getFirestore();

async function registerOrGet(email: string, password: string, displayName: string) {
  try {
    const user = await auth.createUser({
      email,
      password,
      displayName,
    });
    console.log(`Registered user: ${email} with uid: ${user.uid}`);
    return user.uid;
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      const user = await auth.getUserByEmail(email);
      console.log(`Existing user found: ${email} with uid: ${user.uid}`);
      // Update password of the existing user to match the one in the script
      await auth.updateUser(user.uid, { password });
      console.log(`Successfully updated password for: ${email}`);
      return user.uid;
    } else {
      throw error;
    }
  }
}

async function createProfile(uid: string, email: string, displayName: string, role: 'admin' | 'user') {
  const userRef = db.collection('users').doc(uid);
  await userRef.set({
    uid,
    email,
    displayName,
    role,
    favorites: [],
    photoURL: '',
  });
  console.log(`Successfully created/updated profile for ${email} with role: ${role}`);
}

async function run() {
  console.log('Starting account creation via Firebase Admin SDK...');
  
  // 1. Admin Account
  const adminEmail = 'admin@khmerheritage.com';
  const adminPassword = '123456';
  try {
    const adminUid = await registerOrGet(adminEmail, adminPassword, 'Admin Heritage');
    await createProfile(adminUid, adminEmail, 'Admin Heritage', 'admin');
  } catch (err) {
    console.error('Error creating admin:', err);
  }

  // 2. User Account
  const userEmail = 'user@khmerheritage.com';
  const userPassword = 'UserPassword123';
  try {
    const userUid = await registerOrGet(userEmail, userPassword, 'Gia Đình Khmer');
    await createProfile(userUid, userEmail, 'Gia Đình Khmer', 'user');
  } catch (err) {
    console.error('Error creating user:', err);
  }

  console.log('Account creation process completed.');
}

run().catch(console.error);
