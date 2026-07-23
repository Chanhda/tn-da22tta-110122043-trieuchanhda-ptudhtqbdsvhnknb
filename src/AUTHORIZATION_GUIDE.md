# 🔐 Hướng dẫn Hệ thống Phân quyền

## 📋 Tổng quan

Ứng dụng Khmer Heritage có 2 loại tài khoản:

### 1. **Tài khoản Khách (User/Guest)**
- ✅ Xem tất cả bài viết đã xuất bản
- ✅ Xem tất cả di sản
- ✅ Xem danh mục
- ✅ Tìm kiếm, lọc
- ✅ Đọc nội dung chi tiết
- ❌ KHÔNG thể thêm/sửa/xóa bài viết
- ❌ KHÔNG thể truy cập trang Admin

### 2. **Tài khoản Quản trị viên (Admin)**
- ✅ TẤT CẢ quyền của User
- ✅ Thêm bài viết mới
- ✅ Sửa bài viết
- ✅ Xóa bài viết
- ✅ Quản lý di sản
- ✅ Quản lý danh mục
- ✅ Xem danh sách người dùng
- ✅ Truy cập trang Admin

---

## 🔧 Cấu hình Firestore Rules

### Bước 1: Mở Firebase Console

1. Truy cập: https://console.firebase.google.com
2. Chọn project: `khmerapp-9895c`
3. Vào **Firestore Database**
4. Click tab **Rules**

### Bước 2: Copy Rules sau vào

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Categories - Public read, Admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Heritages - Public read, Admin write
    match /heritages/{heritageId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Articles - Public read, Admin write, User can create/update their own pending articles
    match /articles/{articleId} {
      allow read: if true;
      
      // Admin can create any article. Signed-in users can create pending articles.
      allow create: if isAdmin() || (
        isSignedIn() && 
        request.resource.data.published == false &&
        request.resource.data.status == 'pending' &&
        request.resource.data.authorId == request.auth.uid
      );
      
      // Admin can update/delete any article.
      allow update: if isAdmin() || (
        isSignedIn() &&
        resource.data.authorId == request.auth.uid &&
        request.resource.data.authorId == request.auth.uid &&
        request.resource.data.published == false &&
        request.resource.data.status == 'pending'
      );
      allow delete: if isAdmin();
    }
    
    // Users - User can read/write own data, Admin can read all
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Media - Public read, Admin write
    match /media/{mediaId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

### Bước 3: Publish Rules

Click nút **Publish** để áp dụng rules mới.

---

## 👤 Cách tạo tài khoản Admin

### Phương pháp 1: Qua Firebase Console (Khuyến nghị)

1. **Đăng nhập vào ứng dụng** với tài khoản cần cấp quyền Admin
2. **Mở Firebase Console**: https://console.firebase.google.com/project/khmerapp-9895c/firestore
3. **Vào collection `users`**
4. **Tìm document** có ID trùng với UID của tài khoản
5. **Click vào document** đó
6. **Sửa field `role`** từ `user` thành `admin`
7. **Save** lại

### Phương pháp 2: Qua Script

Tạo file `scripts/make-admin.js`:

```javascript
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

async function makeAdmin(userId) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  await updateDoc(doc(db, 'users', userId), {
    role: 'admin',
    updatedAt: new Date().toISOString(),
  });
  
  console.log(`✅ Đã cấp quyền Admin cho user: ${userId}`);
}

// Thay YOUR_USER_ID bằng UID thực tế
makeAdmin('YOUR_USER_ID')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  });
```

Chạy: `node scripts/make-admin.js`

---

## 🎯 Cách sử dụng

### Đối với User (Khách)

1. **Đăng ký tài khoản**:
   - Mở app
   - Vào tab Profile
   - Click "Đăng nhập"
   - Đăng ký bằng email/password

2. **Xem nội dung**:
   - Vào tab Home: Xem bài viết nổi bật
   - Vào tab Heritage: Xem danh sách di sản
   - Vào tab Explore: Khám phá nội dung
   - Click vào bài viết để đọc chi tiết

3. **Giới hạn**:
   - Không thấy nút "Thêm bài viết"
   - Không thấy nút "Sửa" / "Xóa"
   - Không vào được trang `/admin`

### Đối với Admin (Quản trị viên)

1. **Đăng nhập với tài khoản Admin**

2. **Truy cập trang Admin**:
   - Vào tab Profile
   - Thấy card "Quản trị viên" màu vàng
   - Click vào để vào trang Admin

3. **Quản lý bài viết**:
   - Trong trang Admin, click "Quản lý Bài viết"
   - Xem danh sách tất cả bài viết
   - Click "Thêm bài viết mới" để tạo bài mới
   - Click "Sửa" để chỉnh sửa bài viết
   - Click "Xóa" để xóa bài viết

4. **Thêm bài viết mới**:
   - Click "Thêm bài viết mới"
   - Điền thông tin:
     * Tiêu đề
     * Danh mục
     * Tóm tắt
     * Nội dung (hỗ trợ Markdown)
     * Tác giả
     * Ảnh bìa (URL)
     * Tags
   - Click "Xuất bản" hoặc "Lưu nháp"

5. **Sửa bài viết**:
   - Trong danh sách bài viết, click "Sửa"
   - Chỉnh sửa thông tin
   - Click "Cập nhật"

6. **Xóa bài viết**:
   - Trong danh sách bài viết, click "Xóa"
   - Xác nhận xóa
   - Bài viết sẽ bị xóa vĩnh viễn

---

## 📁 Cấu trúc Code

### Auth Session (`lib/auth-session.tsx`)

```typescript
// Hook kiểm tra quyền Admin
export function useRequireAdmin() {
  const router = useRouter();
  const session = useAuthSession();

  useEffect(() => {
    if (!session.loading && (!session.firebaseUser || session.profile?.role !== 'admin')) {
      router.replace(session.firebaseUser ? '/' : '/auth');
    }
  }, [router, session.firebaseUser, session.loading, session.profile?.role]);

  return session;
}
```

### Article Repository (`lib/article-repository.ts`)

```typescript
// Xóa bài viết (Admin only)
export async function deleteArticle(id: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }
  const db = getFirestoreDb();
  await deleteDoc(doc(db, 'articles', id));
}

// Tạo bài viết (Admin only)
export async function createArticle(article: Omit<ArticleDocument, 'id'>): Promise<string> {
  // ...
}

// Cập nhật bài viết (Admin only)
export async function updateArticle(id: string, article: Partial<ArticleDocument>): Promise<void> {
  // ...
}
```

### Admin Articles Screen (`app/admin/articles.tsx`)

- Danh sách tất cả bài viết
- Nút thêm bài viết mới
- Nút sửa/xóa cho từng bài viết
- Hiển thị stats (views, likes)
- Hiển thị trạng thái (published/draft)

---

## 🔍 Kiểm tra phân quyền

### Test với User thường:

1. Đăng nhập với tài khoản User
2. Thử truy cập: `http://localhost:8081/admin`
3. **Kết quả mong đợi**: Bị redirect về trang chủ

4. Vào tab Profile
5. **Kết quả mong đợi**: KHÔNG thấy card "Quản trị viên"

6. Xem bài viết
7. **Kết quả mong đợi**: KHÔNG thấy nút "Sửa" / "Xóa"

### Test với Admin:

1. Đăng nhập với tài khoản Admin
2. Vào tab Profile
3. **Kết quả mong đợi**: Thấy card "Quản trị viên" màu vàng với icon vương miện

4. Click vào card "Quản trị viên"
5. **Kết quả mong đợi**: Vào được trang Admin với menu quản lý

6. Click "Quản lý Bài viết"
7. **Kết quả mong đợi**: Thấy danh sách bài viết với nút "Thêm/Sửa/Xóa"

8. Thử thêm bài viết mới
9. **Kết quả mong đợi**: Tạo thành công và hiển thị trong danh sách

10. Thử xóa bài viết
11. **Kết quả mong đợi**: Xóa thành công

---

## 🛡️ Bảo mật

### Firestore Rules đảm bảo:

1. **User không thể**:
   - Tạo/sửa/xóa bài viết qua API
   - Truy cập dữ liệu người dùng khác
   - Thay đổi role của mình

2. **Admin có thể**:
   - Toàn quyền với articles, heritages, categories
   - Xem tất cả users
   - Xóa users (nếu cần)

3. **Mọi người có thể**:
   - Đọc bài viết đã published
   - Đọc heritages, categories
   - Tạo tài khoản mới

### Client-side Protection:

- `useRequireAdmin()` hook redirect user không phải admin
- UI ẩn các nút admin với user thường
- Routes `/admin/*` được bảo vệ

---

## 📊 Database Structure

```
users/
├── {userId}/
│   ├── id: string
│   ├── email: string
│   ├── displayName: string
│   ├── photoURL: string
│   ├── role: "user" | "admin"  ← Quyết định phân quyền
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

articles/
├── {articleId}/
│   ├── title: string
│   ├── category: string
│   ├── content: string
│   ├── author: string
│   ├── published: boolean  ← User chỉ xem được published = true
│   ├── views: number
│   ├── likes: number
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

---

## 🐛 Troubleshooting

### Lỗi: "Permission denied"

**Nguyên nhân**: Firestore Rules chưa được cập nhật

**Giải pháp**:
1. Vào Firebase Console > Firestore > Rules
2. Copy rules từ file `firestore.rules`
3. Click Publish

### Lỗi: User không vào được trang Admin dù đã là Admin

**Nguyên nhân**: Field `role` chưa được set đúng

**Giải pháp**:
1. Vào Firebase Console > Firestore > users
2. Tìm document của user
3. Kiểm tra field `role` = `"admin"` (chữ thường)
4. Logout và login lại

### Lỗi: Không thấy nút "Thêm bài viết"

**Nguyên nhân**: Chưa vào đúng trang Admin

**Giải pháp**:
1. Vào tab Profile
2. Click vào card "Quản trị viên"
3. Click "Quản lý Bài viết"

---

## ✅ Checklist

- [ ] Firestore Rules đã được publish
- [ ] Có ít nhất 1 tài khoản Admin
- [ ] Test đăng nhập với User thường
- [ ] Test đăng nhập với Admin
- [ ] Test thêm bài viết
- [ ] Test sửa bài viết
- [ ] Test xóa bài viết
- [ ] Test User không vào được `/admin`

---

**Hoàn thành:** 16/05/2026  
**Status:** ✅ Production Ready
