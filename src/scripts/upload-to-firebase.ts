/**
 * Script để upload dữ liệu mẫu lên Firebase Firestore
 * 
 * Cách chạy:
 * npx ts-node scripts/upload-to-firebase.ts
 */

import { initializeApp } from 'firebase/app';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import { firestoreSeed } from '../data/firestore-seed';

// Firebase config - Lấy từ file .env hoặc Firebase Console
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadData() {
  console.log('🚀 Bắt đầu upload dữ liệu lên Firebase Firestore...\n');

  try {
    // 1. Upload Categories
    console.log('📁 Đang upload Categories...');
    const categoriesBatch = writeBatch(db);
    firestoreSeed.categories.forEach((category) => {
      const docRef = doc(db, 'categories', category.id);
      categoriesBatch.set(docRef, {
        ...category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
    await categoriesBatch.commit();
    console.log(`✅ Đã upload ${firestoreSeed.categories.length} categories\n`);

    // 2. Upload Articles
    console.log('📝 Đang upload Articles...');
    const articlesBatch = writeBatch(db);
    firestoreSeed.articles.forEach((article) => {
      const docRef = doc(db, 'articles', article.id);
      articlesBatch.set(docRef, {
        ...article,
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        published: true,
      });
    });
    await articlesBatch.commit();
    console.log(`✅ Đã upload ${firestoreSeed.articles.length} articles\n`);

    // 3. Upload Heritages
    console.log('🏛️ Đang upload Heritages...');
    const heritagesBatch = writeBatch(db);
    firestoreSeed.heritages.forEach((heritage) => {
      const docRef = doc(db, 'heritages', heritage.id);
      heritagesBatch.set(docRef, {
        ...heritage,
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        published: true,
      });
    });
    await heritagesBatch.commit();
    console.log(`✅ Đã upload ${firestoreSeed.heritages.length} heritages\n`);

    // 4. Upload Media
    console.log('🖼️ Đang upload Media...');
    const mediaBatch = writeBatch(db);
    firestoreSeed.media.forEach((media) => {
      const docRef = doc(db, 'media', media.id);
      mediaBatch.set(docRef, {
        ...media,
        createdAt: new Date().toISOString(),
      });
    });
    await mediaBatch.commit();
    console.log(`✅ Đã upload ${firestoreSeed.media.length} media items\n`);

    // 5. Upload Users (optional - chỉ để demo)
    console.log('👤 Đang upload Users...');
    const usersBatch = writeBatch(db);
    firestoreSeed.users.forEach((user) => {
      const docRef = doc(db, 'users', user.id);
      usersBatch.set(docRef, {
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
    await usersBatch.commit();
    console.log(`✅ Đã upload ${firestoreSeed.users.length} users\n`);

    console.log('🎉 HOÀN THÀNH! Tất cả dữ liệu đã được upload lên Firebase Firestore.');
    console.log('\n📊 Tổng kết:');
    console.log(`   - Categories: ${firestoreSeed.categories.length}`);
    console.log(`   - Articles: ${firestoreSeed.articles.length}`);
    console.log(`   - Heritages: ${firestoreSeed.heritages.length}`);
    console.log(`   - Media: ${firestoreSeed.media.length}`);
    console.log(`   - Users: ${firestoreSeed.users.length}`);
    console.log('\n✨ Bạn có thể kiểm tra dữ liệu tại Firebase Console:');
    console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);

  } catch (error) {
    console.error('❌ Lỗi khi upload dữ liệu:', error);
    process.exit(1);
  }
}

// Chạy script
uploadData()
  .then(() => {
    console.log('\n✅ Script hoàn thành!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script thất bại:', error);
    process.exit(1);
  });
