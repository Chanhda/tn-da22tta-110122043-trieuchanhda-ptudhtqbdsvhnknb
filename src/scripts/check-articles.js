/**
 * Script kiểm tra nhanh dữ liệu articles trong Firestore
 * Chạy: node scripts/check-articles.js
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: 'khmerapp-9895c',
});

const db = admin.firestore();

async function checkArticles() {
  console.log('🔍 Đang kiểm tra collection "articles" trong Firestore...\n');

  const snapshot = await db.collection('articles').get();

  if (snapshot.empty) {
    console.log('❌ Collection "articles" TRỐNG hoàn toàn!');
    process.exit(1);
  }

  console.log(`\u2705 T\u00ecm th\u1ea5y ${snapshot.size} b\u00e0i vi\u1ebft:\n`);
  snapshot.forEach((doc, idx) => {
    const data = doc.data();
    console.log(`  ${idx + 1}. [${doc.id}]`);
    console.log(`     Ti\u00eau \u0111\u1ec1: ${data.title}`);
    console.log(`     Danh m\u1ee5c: ${data.category}`);
    console.log(`     Xu\u1ea5t b\u1ea3n: ${data.published}`);
    console.log(`     coverImage: ${data.coverImage}`);
    console.log(`     createdAt: ${data.createdAt}\n`);
  });

  process.exit(0);
}

checkArticles().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
