# 🔥 Hướng dẫn Upload dữ liệu lên Firebase Firestore

## 📋 Yêu cầu

1. **Firebase Project đã được tạo**
2. **Firestore Database đã được kích hoạt**
3. **File `.env` đã có Firebase config**
4. **Node.js đã được cài đặt**

---

## 🚀 Cách 1: Upload bằng Script tự động (Khuyến nghị)

### Bước 1: Kiểm tra file .env

Mở file `.env` và đảm bảo có đầy đủ thông tin Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Bước 2: Cài đặt dependencies (nếu chưa có)

```bash
npm install firebase dotenv
```

### Bước 3: Chạy script upload

```bash
node scripts/upload-firebase.js
```

### Kết quả mong đợi:

```
🚀 Bắt đầu upload dữ liệu lên Firebase Firestore...

✅ Đã kết nối Firebase Project: your-project-id

📁 Đang upload Categories...
✅ Đã upload 4 categories

🏛️ Đang upload Heritages...
✅ Đã upload 5 heritages

📝 Đang upload Articles...
✅ Đã upload 5 articles

🎉 HOÀN THÀNH! Tất cả dữ liệu đã được upload lên Firebase Firestore.

📊 Tổng kết:
   - Categories: 4
   - Heritages: 5
   - Articles: 5

✨ Kiểm tra dữ liệu tại:
   https://console.firebase.google.com/project/your-project-id/firestore
```

---

## 🔧 Cách 2: Upload thủ công qua Firebase Console

### Bước 1: Mở Firebase Console

1. Truy cập: https://console.firebase.google.com
2. Chọn project của bạn
3. Vào **Firestore Database** từ menu bên trái

### Bước 2: Tạo Collections

Tạo 3 collections sau:

#### 1. Collection: `categories`

Thêm 4 documents:

**Document ID: `le-hoi`**
```json
{
  "id": "le-hoi",
  "name": "Lễ hội",
  "slug": "le-hoi",
  "icon": "calendar",
  "createdAt": "2026-05-16T00:00:00.000Z",
  "updatedAt": "2026-05-16T00:00:00.000Z"
}
```

**Document ID: `kien-truc`**
```json
{
  "id": "kien-truc",
  "name": "Kiến trúc",
  "slug": "kien-truc",
  "icon": "building",
  "createdAt": "2026-05-16T00:00:00.000Z",
  "updatedAt": "2026-05-16T00:00:00.000Z"
}
```

**Document ID: `am-thuc`**
```json
{
  "id": "am-thuc",
  "name": "Ẩm thực",
  "slug": "am-thuc",
  "icon": "restaurant",
  "createdAt": "2026-05-16T00:00:00.000Z",
  "updatedAt": "2026-05-16T00:00:00.000Z"
}
```

**Document ID: `nghe-thuat`**
```json
{
  "id": "nghe-thuat",
  "name": "Nghệ thuật",
  "slug": "nghe-thuat",
  "icon": "music-note",
  "createdAt": "2026-05-16T00:00:00.000Z",
  "updatedAt": "2026-05-16T00:00:00.000Z"
}
```

#### 2. Collection: `heritages`

Thêm 5 documents (xem file `data/firestore-seed.ts` để lấy dữ liệu đầy đủ)

**Document ID: `chua-chantarangsay`**
```json
{
  "id": "chua-chantarangsay",
  "title": "Chùa Chantarangsay",
  "province": "TP. Hồ Chí Minh",
  "category": "Kiến trúc tôn giáo",
  "subtitle": "Ngôi chùa Khmer tiêu biểu trong đô thị lớn",
  "body": "Không gian tham quan, kiến trúc và sinh hoạt cộng đồng",
  "tag": "Nổi bật",
  "description": "Chùa Chantarangsay là điểm tiêu biểu để giới thiệu kiến trúc chùa Khmer Nam Bộ",
  "highlights": ["Mái chùa nhiều tầng", "Không gian thờ tự đặc trưng", "Phù hợp cho ảnh và video"],
  "coverImage": "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
  "location": {
    "lat": 10.7769,
    "lng": 106.7009
  },
  "createdAt": "2026-05-05T08:30:00.000Z",
  "updatedAt": "2026-05-16T00:00:00.000Z",
  "views": 0,
  "likes": 0,
  "published": true
}
```

*(Làm tương tự cho 4 heritages còn lại)*

#### 3. Collection: `articles`

Thêm 5 documents (xem file `data/firestore-seed.ts` để lấy dữ liệu đầy đủ)

**Document ID: `chuong-trinh-le-hoi`**
```json
{
  "id": "chuong-trinh-le-hoi",
  "title": "Sắc màu lễ hội Khmer Nam Bộ",
  "category": "Lễ hội",
  "summary": "Giới thiệu không khí lễ hội, nghi thức truyền thống và hoạt động cộng đồng",
  "content": "Lễ hội Khmer Nam Bộ là dịp để cộng đồng sum họp...",
  "author": "Ban biên tập",
  "date": "05/05/2026",
  "coverImage": "https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=1200&q=80",
  "createdAt": "2026-05-05T08:00:00.000Z",
  "updatedAt": "2026-05-16T00:00:00.000Z",
  "views": 0,
  "likes": 0,
  "published": true
}
```

*(Làm tương tự cho 4 articles còn lại)*

---

## 🔐 Cấu hình Firestore Rules

Để ứng dụng có thể đọc dữ liệu, cần cấu hình Firestore Rules:

### Bước 1: Vào Firestore Rules

1. Mở Firebase Console
2. Vào **Firestore Database**
3. Click tab **Rules**

### Bước 2: Cập nhật Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Categories - Public read, Admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Heritages - Public read, Admin write
    match /heritages/{heritageId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Articles - Public read, Admin write
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users - User can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Media - Public read, Admin write
    match /media/{mediaId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Bước 3: Publish Rules

Click nút **Publish** để áp dụng rules mới.

---

## ✅ Kiểm tra dữ liệu đã upload

### Cách 1: Qua Firebase Console

1. Mở https://console.firebase.google.com
2. Chọn project
3. Vào **Firestore Database**
4. Kiểm tra các collections: `categories`, `heritages`, `articles`

### Cách 2: Qua ứng dụng

1. Chạy ứng dụng: `npx expo start`
2. Mở trên web hoặc mobile
3. Vào tab **Home** - Sẽ thấy danh sách heritages và articles
4. Vào tab **Heritage** - Sẽ thấy tất cả di sản
5. Vào tab **Explore** - Sẽ thấy collections và categories

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi 1: "Firebase config is missing"

**Nguyên nhân:** File `.env` thiếu hoặc sai config

**Giải pháp:**
1. Kiểm tra file `.env` có đầy đủ các biến
2. Restart dev server: `npx expo start --clear`

### Lỗi 2: "Permission denied"

**Nguyên nhân:** Firestore Rules chưa được cấu hình

**Giải pháp:**
1. Vào Firebase Console > Firestore > Rules
2. Cập nhật rules như hướng dẫn ở trên
3. Click **Publish**

### Lỗi 3: "Collection not found"

**Nguyên nhân:** Dữ liệu chưa được upload

**Giải pháp:**
1. Chạy lại script: `node scripts/upload-firebase.js`
2. Hoặc upload thủ công qua Firebase Console

### Lỗi 4: "Network error"

**Nguyên nhân:** Không kết nối được Firebase

**Giải pháp:**
1. Kiểm tra internet
2. Kiểm tra Firebase Project ID đúng chưa
3. Kiểm tra API Key còn hiệu lực không

---

## 📊 Cấu trúc Database

```
Firestore Database
├── categories/
│   ├── le-hoi
│   ├── kien-truc
│   ├── am-thuc
│   └── nghe-thuat
│
├── heritages/
│   ├── chua-chantarangsay
│   ├── le-hoi-ooc-om-bok
│   ├── ro-bam
│   ├── chua-doi
│   └── ghe-ngo
│
├── articles/
│   ├── chuong-trinh-le-hoi
│   ├── kien-truc-chua-khmer
│   ├── am-thuc-truyen-thong
│   ├── nghe-thuat-ro-bam
│   └── du-lich-cong-dong
│
└── users/
    └── (user documents)
```

---

## 🎯 Kết quả mong đợi

Sau khi upload thành công:

✅ **Home Screen:**
- Hiển thị 5 heritages trong phần "Di sản nổi bật"
- Hiển thị 5 articles trong phần "Bài viết mới nhất"
- Stats cards hiển thị số lượng chính xác

✅ **Heritage Screen:**
- Hiển thị tất cả 5 heritages
- Filter theo category hoạt động
- Search hoạt động

✅ **Explore Screen:**
- Collections hiển thị đầy đủ
- Categories grid hiển thị
- Featured heritages hiển thị

✅ **Map Screen:**
- Destinations list hiển thị tất cả heritages
- Filter hoạt động

---

## 📝 Ghi chú

- Dữ liệu mẫu sử dụng ảnh từ Unsplash (miễn phí)
- Có thể thay thế bằng ảnh thật sau
- Có thể thêm nhiều heritages và articles hơn
- Có thể tùy chỉnh fields theo nhu cầu

---

**Hoàn thành:** 16/05/2026  
**Status:** ✅ Ready to use
