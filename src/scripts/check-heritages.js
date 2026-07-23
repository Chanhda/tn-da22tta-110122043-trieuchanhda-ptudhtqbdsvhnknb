const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: 'khmerapp-9895c',
});

const db = admin.firestore();

async function checkHeritages() {
  console.log('🔍 Checking collection "heritages" in Firestore...\n');

  const snapshot = await db.collection('heritages').get();

  if (snapshot.empty) {
    console.log('❌ Collection "heritages" is EMPTY!');
    process.exit(1);
  }

  console.log(`✅ Found ${snapshot.size} heritages:\n`);
  snapshot.forEach((doc, idx) => {
    const data = doc.data();
    console.log(`  ${idx + 1}. [${doc.id}]`);
    console.log(`     Title: "${data.title}"`);
    console.log(`     Province: "${data.province}"`);
    console.log(`     Category: "${data.category}"`);
    console.log(`     Type: "${data.type}"`);
    console.log(`     CoverImage: "${data.coverImage}"`);
    console.log(`     CreatedAt: "${data.createdAt}"\n`);
  });

  process.exit(0);
}

checkHeritages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
