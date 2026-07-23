import fs from 'node:fs';
import path from 'node:path';

import { applicationDefault, cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { firestoreSeed } from '../data/firestore-seed';

type SeedCollectionName = keyof typeof firestoreSeed;

type SeedDocument = {
  id: string;
  [key: string]: unknown;
};

function loadServiceAccount(): ServiceAccount | undefined {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!serviceAccountPath) {
    const defaultPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');
    if (fs.existsSync(defaultPath)) {
      serviceAccountPath = defaultPath;
    }
  }

  if (serviceAccountPath) {
    const resolvedPath = path.resolve(serviceAccountPath);
    return JSON.parse(fs.readFileSync(resolvedPath, 'utf8')) as ServiceAccount;
  }

  return undefined;
}

function sanitizeValue(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item))
      .filter((item) => item !== undefined);
  }

  if (typeof value === 'object') {
    const entryList = Object.entries(value as Record<string, unknown>);
    const normalizedEntries = entryList
      .map(([key, item]) => [key, sanitizeValue(item)] as const)
      .filter(([, item]) => item !== undefined);

    return Object.fromEntries(normalizedEntries);
  }

  return value;
}

async function deleteCollection(collectionName: string) {
  const db = getFirestore();
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) {
    console.log(`Collection "${collectionName}" is already empty.`);
    return;
  }

  console.log(`Deleting ${snapshot.size} documents from "${collectionName}"...`);
  const docs = snapshot.docs;
  const batchSize = 400;

  for (let index = 0; index < docs.length; index += batchSize) {
    const chunk = docs.slice(index, index + batchSize);
    const batch = db.batch();
    for (const doc of chunk) {
      batch.delete(doc.ref);
    }
    await batch.commit();
  }
  console.log(`✅ Collection "${collectionName}" cleared.`);
}

function seedCollections() {
  return [
    ['categories', firestoreSeed.categories],
    ['articles', firestoreSeed.articles],
    ['heritages', firestoreSeed.heritages],
    ['media', firestoreSeed.media],
    ['users', firestoreSeed.users],
  ] as const;
}

async function writeCollection(collectionName: SeedCollectionName, documents: SeedDocument[]) {
  const db = getFirestore();
  const batchSize = 400;

  for (let index = 0; index < documents.length; index += batchSize) {
    const chunk = documents.slice(index, index + batchSize);
    const batch = db.batch();
    let writeCount = 0;

    for (const document of chunk) {
      const { id, ...data } = document;
      const normalizedData = sanitizeValue(data) as Record<string, unknown>;
      const docRef = db.collection(collectionName).doc(id);
      
      // Kiểm tra nếu tài liệu đã tồn tại thì không ghi đè để bảo vệ dữ liệu người dùng tự chỉnh sửa
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        batch.set(docRef, normalizedData);
        writeCount++;
      }
    }

    if (writeCount > 0) {
      await batch.commit();
      console.log(`Uploaded ${writeCount} new documents to ${collectionName}`);
    } else {
      console.log(`No new documents to upload to ${collectionName}`);
    }
  }
}

async function main() {
  const serviceAccount = loadServiceAccount();

  if (getApps().length === 0) {
    if (serviceAccount) {
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp({ credential: applicationDefault() });
    }
  }

  // BỎ LỆNH XÓA ĐỂ BẢO VỆ DỮ LIỆU CŨ
  console.log('ℹ️ Skipping clearing collections to protect existing user data.');
  console.log('🌱 Seeding new data into Firestore (only adding missing documents)...');
  for (const [collectionName, documents] of seedCollections()) {
    await writeCollection(collectionName, documents as SeedDocument[]);
  }

  console.log('Firestore seed upload completed.');
}

main().catch((error) => {
  console.error('Failed to seed Firestore.');
  console.error(error);
  process.exitCode = 1;
});