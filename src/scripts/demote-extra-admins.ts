/**
 * Script: Demote all admin accounts except admin@khmerheritage.com to 'user' role.
 * 
 * Usage: npx tsx scripts/demote-extra-admins.ts
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps, type ServiceAccount, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function loadServiceAccount(): ServiceAccount | undefined {
  // Try direct path to known service account file
  const knownPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');
  if (fs.existsSync(knownPath)) {
    return JSON.parse(fs.readFileSync(knownPath, 'utf8')) as ServiceAccount;
  }

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

// Load .env
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        process.env[key] = value.replace(/(^['"]|['"]$)/g, '').trim();
      }
    });
  }
} catch (e) {
  console.log('Error loading .env:', e);
}

const serviceAccount = loadServiceAccount();

if (getApps().length === 0) {
  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({ credential: applicationDefault() });
  }
}

const db = getFirestore();
const KEEP_ADMIN_EMAIL = 'admin@khmerheritage.com';

async function run() {
  console.log('🔍 Querying all users with role "admin"...');
  
  const snapshot = await db.collection('users').where('role', '==', 'admin').get();
  
  if (snapshot.empty) {
    console.log('No admin users found!');
    return;
  }

  console.log(`Found ${snapshot.size} admin account(s):\n`);

  const batch = db.batch();
  let demoteCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const email = data.email || '(no email)';
    const displayName = data.displayName || '(no name)';
    
    if (email === KEEP_ADMIN_EMAIL) {
      console.log(`  ✅ KEEP ADMIN: ${email} (${displayName})`);
    } else {
      console.log(`  🔻 DEMOTE TO USER: ${email} (${displayName})`);
      batch.update(doc.ref, { role: 'user' });
      demoteCount++;
    }
  }

  if (demoteCount === 0) {
    console.log('\nNo accounts need to be demoted. Only 1 admin exists.');
    return;
  }

  console.log(`\n⏳ Demoting ${demoteCount} account(s) to "user" role...`);
  await batch.commit();
  console.log(`✅ Done! ${demoteCount} account(s) demoted to "user".`);
  console.log(`\n📌 Only admin remaining: ${KEEP_ADMIN_EMAIL}`);
}

run().catch(console.error);
