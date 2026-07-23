/**
 * Script upload bài viết chi tiết lên Firebase Firestore
 * Chạy: node scripts/upload-articles.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, writeBatch, doc } = require('firebase/firestore');
const { extendedArticles } = require('../data/articles-extended');
require('dotenv').config();

// Firebase config từ .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

async function uploadArticles() {
  console.log('📝 Bắt đầu upload bài viết lên Firebase Firestore...\n');

  // Kiểm tra config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Lỗi: Thiếu Firebase config trong file .env');
    process.exit(1);
  }

  try {
    // Khởi tạo Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log(`✅ Đã kết nối Firebase Project: ${firebaseConfig.projectId}\n`);

    // Upload Articles
    console.log('📝 Đang upload các bài viết chi tiết...\n');
    let batch = writeBatch(db);
    let count = 0;
    
    for (const article of extendedArticles) {
      console.log(`   ➤ Đang upload: "${article.title}"`);
      
      const docRef = doc(db, 'articles', article.id);
      batch.set(docRef, {
        ...article,
        createdAt: new Date(article.date.split('/').reverse().join('-')).toISOString(),
        updatedAt: new Date().toISOString(),
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 200) + 20,
        published: true,
      });
      count++;
      
      if (count % 500 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    await batch.commit();
    
    console.log(`\n✅ Đã upload thành công ${extendedArticles.length} bài viết!\n`);

    console.log('📊 Danh sách bài viết đã upload:');
    extendedArticles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
      console.log(`      - Danh mục: ${article.category}`);
      console.log(`      - Thời gian đọc: ${article.readTime}`);
      console.log(`      - Tags: ${article.tags.join(', ')}\n`);
    });

    console.log('✨ Kiểm tra dữ liệu tại:');
    console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data/articles\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi upload:', error.message);
    process.exit(1);
  }
}

// Chạy script
uploadArticles();
