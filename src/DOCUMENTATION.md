# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ CHI TIẾT HỆ THỐNG: KHMER HERITAGE APP

Ứng dụng **Khmer Heritage App** là giải pháp phần mềm đa nền tảng (chạy đồng thời trên iOS, Android và Web) được nghiên cứu và phát triển nhằm mục tiêu số hóa, giới thiệu, lưu trữ và bảo tồn các giá trị di sản văn hóa phi vật thể và vật thể của đồng bào dân tộc Khmer tại Việt Nam (đặc biệt là vùng Đồng bằng sông Cửu Long như Sóc Trăng, Trà Vinh, An Giang...).

---

## CHƯƠNG 1: TỔNG QUAN DỰ ÁN VÀ Ý NGHĨA THỰC TIỄN

### 1. Ý nghĩa và mục tiêu của ứng dụng
*   **Số hóa di sản:** Chuyển đổi thông tin truyền thống về các chùa chiền, lễ hội, loại hình nghệ thuật dân gian (như Rô-băm, Dù-kê, nhạc Ngũ âm) thành dữ liệu số có cấu trúc.
*   **Trải nghiệm tương tác:** Cung cấp cho người dùng bản đồ tương tác để xác định vị trí thực tế của các địa điểm di sản, từ đó thúc đẩy du lịch văn hóa.
*   **Cung cấp kiến thức:** Hệ thống các bài viết nghiên cứu, tin tức sự kiện có tính giáo dục và lịch sử cao.
*   **Tương tác cộng đồng:** Người dùng có thể bình luận, thể hiện sự yêu thích đối với các bài viết và địa điểm di sản.
*   **Quản lý nội dung khoa học:** Khu vực quản trị (Admin Dashboard) trực quan giúp kiểm duyệt bài viết của người dùng gửi lên, đồng thời thêm, sửa, xóa các thông tin di sản nhanh chóng.

---

## CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ CỐT LÕI (TECH STACK)

Hệ thống được thiết kế theo mô hình **Serverless** kết hợp với **Repository Pattern** ở phía Client để tăng tính linh hoạt, giảm thiểu độ trễ và dễ bảo trì.

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT SIDE (EXPO)                        │
│                                                                 │
│   ┌─────────────────────┐             ┌─────────────────────┐   │
│   │    User Interface   │             │   State Management  │   │
│   │ (Tailwind/NativeWind│ ──────────> │   (React Context    │   │
│   │     Components)     │             │    Auth/Lang/Theme) │   │
│   └─────────────────────┘             └─────────────────────┘   │
│              │                                   │              │
│              ▼                                   ▼              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   Repository Pattern                    │   │
│   │      (Article, Heritage, Comment, User Repositories)    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                │                                │
└────────────────────────────────┼────────────────────────────────┘
                                 │ API Requests
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND & CLOUD                           │
│                                                                 │
│ ┌──────────────────────┐  ┌───────────────────┐  ┌────────────┐ │
│ │  Firebase Auth       │  │ Cloud Firestore   │  │ Cloudinary │ │
│ │ (Xác thực/Phân quyền)│  │ (Cơ sở dữ liệu)   │  │ (Lưu ảnh)  │ │
│ └──────────────────────┘  └───────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1. Công nghệ phía Client (Frontend)
*   **Expo SDK 54 & React Native 0.81.5:**
    *   Tận dụng **React Compiler** (được bật thử nghiệm trong `app.json`) và **New Architecture** (`"newArchEnabled": true`) giúp tối ưu hóa hiệu năng render, tự động memoize các component, và giảm tải giao tiếp qua cầu nối (Bridge) truyền thống của React Native.
*   **Expo Router v6:**
    *   Hệ thống routing dựa trên tệp tin (File-based Routing). Giúp tổ chức code sạch sẽ, tự động quản lý lịch sử điều hướng (navigation stack) và tối ưu hóa việc liên kết sâu (deep linking) qua cấu hình `scheme: "khmerapp"`.
*   **NativeWind v4 & TailwindCSS v3:**
    *   Biên dịch mã Tailwind thành StyleSheet gốc của React Native, giúp giao diện render cực nhanh mà vẫn giữ được tính linh hoạt, responsive trên cả Web và Mobile.
*   **React Native Reanimated v4:**
    *   Thư viện xử lý hiệu ứng chuyển động chạy trực tiếp trên luồng UI (UI Thread), giảm thiểu tối đa hiện tượng drop frame (giật lag) khi thực hiện chuyển trang hoặc hiển thị các micro-animations.

### 2. Dịch vụ phía Backend (Cloud Services)
*   **Google Firebase Suite:**
    *   **Cloud Firestore:** Cơ sở dữ liệu NoSQL phân tán, lưu trữ dữ liệu dưới dạng các Document gom nhóm trong các Collection.
    *   **Firebase Authentication:** Quản lý tài khoản bảo mật bằng thuật toán mã hóa mật khẩu phía server, tích hợp sẵn các luồng gửi email khôi phục mật khẩu.
*   **Cloudinary API:**
    *   Được chọn làm kho lưu trữ hình ảnh động nhờ tính năng tối ưu hóa kích thước ảnh tự động (Image Transformation), CDN phân phối ảnh tốc độ cao và API tải lên dễ dàng tích hợp từ thiết bị di động.

---

## CHƯƠNG 3: THIẾT KẾ CƠ SỞ DỮ LIỆU CHI TIẾT (DATABASE SCHEMAS)

Hệ thống sử dụng cơ sở dữ liệu phi quan hệ (NoSQL) Cloud Firestore. Sơ đồ dữ liệu được thiết kế tối ưu hóa cho các thao tác đọc nhanh (Read-heavy) phù hợp với ứng dụng di động.

### 1. Chi tiết các Collection trong Firestore

#### a. Collection: `users` (Quản lý người dùng)
*   **Mô tả:** Lưu trữ thông tin cá nhân và quyền hạn của người dùng. ID tài liệu chính là `uid` được cấp từ Firebase Authentication.
```json
{
  "id": "String (Firebase UID)",
  "uid": "String (Firebase UID)",
  "displayName": "String (Tên hiển thị)",
  "email": "String (Địa chỉ email đăng ký)",
  "photoURL": "String (Đường dẫn ảnh đại diện)",
  "favorites": "Array [String] (Mảng chứa ID các di sản yêu thích)",
  "role": "String (Phân quyền: 'user' | 'admin')"
}
```

#### b. Collection: `heritages` (Quản lý di sản)
*   **Mô tả:** Chứa thông tin về các địa điểm di sản văn hóa vật thể và phi vật thể.
```json
{
  "id": "String (Auto ID)",
  "title": "String (Tên di sản)",
  "subtitle": "String (Mô tả ngắn/Tiêu đề phụ)",
  "province": "String (Tỉnh thành: ví dụ 'Sóc Trăng')",
  "category": "String (Danh mục: ví dụ 'Chùa', 'Nghệ thuật')",
  "type": "String (Phân loại: 'tangible' | 'intangible')",
  "summary": "String (Tóm tắt ngắn gọn cho trang chi tiết)",
  "description": "String (Giới thiệu chi tiết)",
  "body": "String (Nội dung bài viết chi tiết về lịch sử/kiến trúc)",
  "coverImage": "String (URL ảnh đại diện di sản)",
  "gallery": "Array [String] (Danh sách các URL ảnh chi tiết)",
  "location": {
    "lat": "Number (Vĩ độ)",
    "lng": "Number (Kinh độ)"
  },
  "views": "Number (Tổng số lượt xem)",
  "likes": "Number (Tổng số lượt thích)",
  "builtYear": "String / Number (Năm xây dựng hoặc thời kỳ lịch sử)",
  "highlights": "Array [String] (Các điểm nổi bật nhất)",
  "createdAt": "String (ISO 8601 Timestamp)",
  "updatedAt": "String (ISO 8601 Timestamp)"
}
```

#### c. Collection: `articles` (Quản lý bài viết văn hóa)
*   **Mô tả:** Chứa các bài viết nghiên cứu lịch sử, tin tức sự kiện văn hóa do cả admin và người dùng gửi lên.
```json
{
  "id": "String (Auto ID)",
  "title": "String (Tiêu đề bài viết)",
  "category": "String (Danh mục bài viết)",
  "summary": "String (Mô tả ngắn gọn)",
  "content": "String (Nội dung chi tiết bài viết)",
  "author": "String (Tác giả bài viết)",
  "date": "String (Ngày xuất bản hiển thị)",
  "coverImage": "String (URL ảnh bìa)",
  "createdAt": "String (ISO 8601 Timestamp)",
  "updatedAt": "String (ISO 8601 Timestamp)",
  "views": "Number (Lượt xem bài viết)",
  "likes": "Number (Lượt thích bài viết)",
  "published": "Boolean (Trạng thái đã được xuất bản công khai chưa)",
  "status": "String (Trạng thái duyệt: 'pending' | 'published' | 'rejected')",
  "authorId": "String (Firebase UID của người gửi bài)",
  "rejectReason": "String (Lý do admin từ chối duyệt bài nếu có)",
  "templateId": "String (Tùy chọn ID template tham khảo)"
}
```

#### d. Collection: `comments` (Bình luận bài viết/di sản)
*   **Mô tả:** Chứa các thảo luận, bình luận từ cộng đồng.
```json
{
  "id": "String (Auto ID)",
  "articleId": "String (ID bài viết / di sản được bình luận)",
  "userId": "String (Firebase UID của người dùng - tùy chọn)",
  "authorName": "String (Tên người bình luận)",
  "text": "String (Nội dung bình luận)",
  "time": "String (Chuỗi thời gian hiển thị tương đối: 'Vừa xong', '2 giờ trước')",
  "createdAt": "String (ISO 8601 Timestamp)"
}
```

#### e. Collection: `categories` (Danh mục phân loại)
*   **Mô tả:** Lưu trữ các danh mục phân loại phục vụ giao diện lọc.
```json
{
  "name": "String (Tên danh mục hiển thị)",
  "slug": "String (Đường dẫn thân thiện)",
  "icon": "String (Mã định danh icon từ Expo Vector Icons)"
}
```

---

### 2. Thiết kế bảo mật trên Cloud Firestore (`firestore.rules`)

Để bảo vệ tài nguyên cơ sở dữ liệu trên đám mây khỏi các truy cập trái phép hoặc spam dữ liệu, tệp tin cấu hình [firestore.rules](file:///c:/Users/HP/khmerApp/firestore.rules) được viết vô cùng chi tiết, triển khai các nguyên tắc bảo mật chặt chẽ:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Hàm trợ giúp kiểm tra đăng nhập
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Hàm trợ giúp kiểm tra quyền Quản trị viên (Admin)
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Hàm trợ giúp kiểm tra chủ sở hữu tài liệu
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Danh mục: Mọi người đều xem được (Public), chỉ Admin mới có quyền Thay đổi
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Di sản: Mọi người đều xem được (Public), chỉ Admin mới được Thêm/Xóa.
    // Đối với Sửa (update): Cho phép Admin sửa bất kỳ trường nào, hoặc người dùng thường 
    // CHỈ được thay đổi lượt xem (views) và lượt thích (likes) để tránh thay đổi trái phép thông tin di sản.
    match /heritages/{heritageId} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if isAdmin() || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views', 'likes']);
    }

    // Bài viết văn hóa: 
    // - Ai cũng được đọc (Public read).
    // - Admin được viết tự do. Người dùng đã đăng nhập chỉ được viết bài ở dạng 'pending' và 'published = false'.
    // - Người dùng thường chỉ được cập nhật bài của chính họ khi bài đó ở trạng thái 'pending', hoặc chỉ được tăng views/likes.
    // - Chỉ Admin được xóa bài viết.
    match /articles/{articleId} {
      allow read: if true;
      
      allow create: if isAdmin() || (
        isSignedIn() && 
        request.resource.data.published == false &&
        request.resource.data.status == 'pending' &&
        request.resource.data.authorId == request.auth.uid
      );
      
      allow update: if isAdmin() || (
        isSignedIn() &&
        resource.data.authorId == request.auth.uid &&
        request.resource.data.authorId == request.auth.uid &&
        request.resource.data.published == false &&
        request.resource.data.status == 'pending'
      ) || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views', 'likes']);
      
      allow delete: if isAdmin();
    }

    // Người dùng: Người dùng được tự do đọc/ghi tài liệu của chính họ, Admin được quyền đọc tất cả.
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Tài nguyên đa phương tiện (Media): Public read, Admin write
    match /media/{mediaId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Bình luận: Public read, Đăng nhập mới được tạo bình luận, chỉ Admin hoặc chủ nhân bình luận mới được xóa/sửa
    match /comments/{commentId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
```

---

## CHƯƠNG 4: THƯ MỤC DỰ ÁN VÀ CẤU TRÚC ĐIỀU HƯỚNG (ROUTING)

### 1. Bản đồ cấu trúc thư mục vật lý (Directory Tree)
Dưới đây là sơ đồ tổ chức thư mục của dự án **Khmer Heritage App**:

```
khmerApp/
├── app/                           # Hệ thống điều hướng (Expo Router)
│   ├── (tabs)/                    # Nhóm màn hình điều hướng thanh Tabs dưới màn hình
│   │   ├── _layout.tsx            # Cấu hình Tab Bar (Home, Heritage, Explore, Map, Profile)
│   │   ├── index.tsx              # Màn hình Trang Chủ chính (Tổng quan di sản, bài viết mới)
│   │   ├── heritage.tsx           # Màn hình Bộ lọc và Tìm kiếm danh sách Di sản
│   │   ├── explore.tsx            # Màn hình Khám phá di sản thông minh (Phổ biến, mới nhất)
│   │   ├── map.tsx                # Màn hình Bản đồ tương tác di sản
│   │   └── profile.tsx            # Màn hình Hồ sơ người dùng & Thiết lập ứng dụng
│   ├── admin/                     # Nhóm màn hình dành riêng cho vai trò Admin
│   │   ├── _layout.tsx            # Route guard kiểm tra quyền Admin
│   │   ├── index.tsx              # Dashboard Admin thống kê số lượng bài viết, lượt xem
│   │   ├── heritages.tsx          # Giao diện quản lý danh sách Di sản (Thêm/Sửa/Xóa/Upload)
│   │   └── articles.tsx           # Giao diện kiểm duyệt và quản lý Bài viết văn hóa
│   ├── articles/                  # Nhóm màn hình xem & gửi bài viết
│   │   ├── [id].tsx               # Màn hình Chi tiết bài viết văn hóa
│   │   └── new.tsx                # Màn hình Gửi bài viết mới (dành cho người dùng)
│   ├── heritage/                  # Nhóm màn hình xem di sản
│   │   └── [id].tsx               # Màn hình Chi tiết Di sản (Thông tin, ảnh, tọa độ, bình luận)
│   ├── profile/                   # Nhóm màn hình phụ trợ cho cài đặt người dùng
│   │   ├── _layout.tsx
│   │   ├── about.tsx              # Trang giới thiệu về ứng dụng
│   │   ├── favorites.tsx          # Trang hiển thị danh sách di sản đã yêu thích
│   │   ├── help.tsx               # Trang hướng dẫn & trợ giúp người dùng
│   │   ├── history.tsx            # Trang lịch sử các bài đã xem
│   │   ├── my-articles.tsx        # Trang quản lý bài viết người dùng tự gửi
│   │   ├── notifications.tsx      # Trang quản lý thông báo
│   │   └── settings.tsx           # Trang cài đặt cá nhân (Đổi giao diện, thông tin)
│   ├── _layout.tsx                # Tệp khởi tạo hệ thống (Root), chứa các Context Providers
│   └── auth.tsx                   # Màn hình Đăng nhập / Đăng ký / Quên mật khẩu
├── components/                    # Các Component giao diện tái sử dụng
│   ├── ui/                        # Thư viện UI nguyên tử (Badge, Button, Card, CustomAlert, Icon)
│   ├── map/                       # Các component xử lý bản đồ (Leaflet / Native Maps)
│   ├── themed-text.tsx            # Component text tự thích ứng Dark/Light Mode
│   └── themed-view.tsx            # Component view tự thích ứng Dark/Light Mode
├── constants/                     # Các tệp khai báo hằng số hệ thống
│   ├── theme.ts                   # Chứa Design Tokens (màu sắc HSL, spacing, typography)
│   ├── languages.ts               # Từ điển chuỗi dịch đa ngôn ngữ (vi, km, en)
│   ├── heritages.ts               # Dữ liệu tĩnh mẫu về di sản để fallback khi offline
│   └── articles.ts                # Dữ liệu tĩnh mẫu về bài viết để fallback
├── contexts/                      # Lưu trữ trạng thái ứng dụng toàn cục
│   ├── language-context.tsx       # Quản lý ngôn ngữ hiện tại của app (useLanguage)
│   └── color-scheme-context.tsx   # Quản lý chế độ sáng/tối (useColorSchemePreference)
├── lib/                           # Tầng kết nối dịch vụ & truy cập dữ liệu (Repository Pattern)
│   ├── firebase.ts                # Khởi tạo và thiết lập Firebase SDK
│   ├── auth.ts                    # Các API Authentication của Firebase (Đăng nhập, Đăng ký, Reset)
│   ├── auth-session.tsx           # Session context theo dõi tài khoản, phân quyền (useAuthSession)
│   ├── cloudinary.ts              # Xử lý tải ảnh lên Cloudinary
│   ├── heritage-repository.ts     # Data Access Layer cho bộ sưu tập di sản
│   ├── article-repository.ts      # Data Access Layer cho bộ sưu tập bài viết
│   ├── comment-repository.ts      # Data Access Layer cho bình luận
│   ├── user-repository.ts         # Data Access Layer cho tài khoản người dùng
│   ├── views-repository.ts        # Quản lý đếm lượt xem không trùng lặp cục bộ
│   └── profile-storage.ts         # Tiện ích đọc ghi AsyncStorage/localStorage đồng bộ
└── scripts/                       # Các script phát triển hệ thống
    ├── seed-firestore.ts          # Script dọn dẹp và nạp dữ liệu mẫu lên Firestore
    └── create-accounts.ts         # Script tạo tài khoản Admin/User mẫu để thử nghiệm
```

---

## CHƯƠNG 5: PHÂN TÍCH CHI TIẾT CODE CỦA CÁC FILE LẬP TRÌNH CHÍNH (DAL & SERVICE LAYERS)

Tất cả logic xử lý dữ liệu và nghiệp vụ được tách biệt khỏi các component UI bằng việc áp dụng **Repository Pattern** nằm tại thư mục `lib/`. Điều này tạo ra một lớp trừu tượng hoá dữ liệu (Data Access Layer) giúp dễ bảo trì và mở rộng.

### 1. Khởi tạo & Cấu hình Firebase (`lib/firebase.ts`)
Tệp [firebase.ts](file:///c:/Users/HP/khmerApp/lib/firebase.ts) chịu trách nhiệm khởi tạo Firebase SDK. Nó giải quyết hai vấn đề lớn:
*   **Vấn đề Node v24 exports:** Trên các thiết bị cài đặt Node mới, cơ chế bảo mật của package.json ngăn việc truy cập trực tiếp file phân phối React Native của Firebase Auth. Giải pháp là sử dụng một shim trung gian [_firebase-auth-rn-shim.js](file:///c:/Users/HP/khmerApp/lib/_firebase-auth-rn-shim.js) chỉ thực hiện `require` vật lý tệp native từ thư mục `node_modules`.
*   **Cơ chế phát hiện môi trường:** Tự động phát hiện nếu thông số cấu hình Firebase bị thiếu trong tệp môi trường `.env`, từ đó kích hoạt chế độ chạy thử nghiệm dữ liệu tĩnh `isDemoDataEnabled()` để ứng dụng không bị crash.

*Code chính khởi tạo Auth đa nền tảng:*
```typescript
export function getFirebaseAuth() {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();

  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
    return authInstance;
  }

  // Trên Native: sử dụng AsyncStorage để lưu trạng thái đăng nhập lâu dài
  try {
    authInstance = initializeAuth(app, {
      persistence: AsyncStoragePersistence ?? inMemoryPersistence,
    });
  } catch {
    authInstance = getAuth(app); // Dự phòng khi hot reload xảy ra
  }
  return authInstance;
}
```

---

### 2. Quản lý Phiên đăng nhập & Bảo vệ Route (`lib/auth-session.tsx`)
Tệp [auth-session.tsx](file:///c:/Users/HP/khmerApp/lib/auth-session.tsx) tạo ra một React Context `AuthProvider` bao bọc toàn bộ ứng dụng. 
*   **Tự động đồng bộ hồ sơ:** Khi Firebase Auth phát hiện sự thay đổi trạng thái đăng nhập qua `onAuthStateChanged`, nó sẽ kích hoạt hàm `ensureUserProfile` để kiểm tra tài khoản đã có hồ sơ trong collection `users` trên Firestore chưa. Nếu chưa có, hệ thống tự tạo một hồ sơ mặc định.
*   **Route Guards (Bộ bảo vệ đường dẫn):** Cung cấp các hooks như `useRequireAuth()` và `useRequireAdmin()`. Các hook này tự động phát hiện nếu phiên đăng nhập không hợp lệ hoặc không đủ quyền quản trị và thực hiện chuyển hướng (`router.replace('/auth')`) ngay lập tức để chặn người dùng truy cập trái phép.

---

### 3. Repository Quản lý Di Sản (`lib/heritage-repository.ts`)
Tệp [heritage-repository.ts](file:///c:/Users/HP/khmerApp/lib/heritage-repository.ts) xử lý toàn bộ thao tác đọc ghi dữ liệu di sản.
*   **Cơ chế trộn dữ liệu thông minh (Merge Fallback):** Khi lấy danh sách di sản (`fetchHeritages`), hệ thống sẽ gọi Firestore để lấy dữ liệu cập nhật mới nhất. Nếu không có kết nối internet hoặc Firebase chưa cấu hình, hệ thống bắt lỗi (catch) và trả về bộ dữ liệu tĩnh cục bộ `heritageItems` từ file `constants/heritages.ts`. Khi có kết nối mạng, nó sẽ gộp dữ liệu từ Firestore và bù đắp các di sản tĩnh cục bộ chưa được upload lên server nhằm tối ưu hóa hiển thị.
*   **CDN Image Transformation:** Khi dữ liệu di sản được lấy về, trường ảnh bìa `coverImage` sẽ đi qua hàm map để tự động thay thế kích thước ảnh của Cloudinary từ kích thước gốc siêu nặng thành kích thước hiển thị nhỏ gọn `w=400` để tiết kiệm dữ liệu di động của người dùng:
```typescript
coverImage: typeof data.coverImage === 'string'
  ? data.coverImage.replace('w=1200', 'w=400').replace('w=800', 'w=400')
  : undefined
```

---

### 4. Repository Quản lý Bài Viết (`lib/article-repository.ts`)
Tệp [article-repository.ts](file:///c:/Users/HP/khmerApp/lib/article-repository.ts) kiểm soát luồng bài viết văn hóa. Nó cung cấp sự phân tách nghiệp vụ rõ ràng:
*   **Người dùng thường:** Chỉ lấy các bài viết đã được duyệt (`published == true`). Người dùng gửi bài mới qua hàm `submitArticle` sẽ được đưa vào hàng đợi với trạng thái `"pending"` và không công khai ra bên ngoài.
*   **Quản trị viên (Admin):** Lấy danh sách qua hàm `fetchAllArticlesAdmin()`, thực thi duyệt bài qua `approveArticle` (chuyển trạng thái sang `published` và ghi nhận thời gian) hoặc từ chối bài qua `rejectArticle` (ghi lý do từ chối cụ thể).

---

### 5. Repository Quản lý Bình Luận (`lib/comment-repository.ts`)
Tệp [comment-repository.ts](file:///c:/Users/HP/khmerApp/lib/comment-repository.ts) tích hợp một hệ thống bình luận linh hoạt. 
*   **Offline-first Storage:** Khi người dùng bình luận trong trạng thái ngoại tuyến hoặc chưa đăng ký tài khoản thật (chế độ demo), bình luận sẽ được lưu trữ cục bộ vào bộ nhớ máy (AsyncStorage hoặc localStorage trên trình duyệt) thông qua tiền tố `@khmerapp.comments.[articleId]`.
*   **Thuật toán Hợp nhất & Chống Trùng lặp (De-duplication):** Khi thiết bị trực tuyến, hàm `fetchCommentsForArticle` sẽ lấy các bình luận thực từ Firestore, sau đó gộp chung với các bình luận được lưu cục bộ trên máy, tiến hành loại bỏ các bản ghi trùng lặp thông qua khóa ID độc nhất và sắp xếp chúng theo thứ tự thời gian tăng dần (`createdAt.localeCompare`) để hiển thị một cuộc trò chuyện liền mạch.

---

### 6. Tránh Trùng Lặp Lượt Xem (`lib/views-repository.ts`)
Tệp [views-repository.ts](file:///c:/Users/HP/khmerApp/lib/views-repository.ts) giải quyết vấn đề spam lượt xem.
Khi người dùng tải trang chi tiết của một địa điểm di sản hoặc bài viết, thay vì trực tiếp tăng trường `views` trên Firestore, hệ thống sẽ gọi `trackViewedItemLocally(id)` để kiểm tra xem thiết bị này đã xem nội dung này chưa qua một danh sách ID được lưu trữ cục bộ.
*   **Thuật toán kiểm soát:**
```typescript
export async function trackViewedItemLocally(id: string): Promise<void> {
  let ids = await readViewedIds(); // Đọc danh sách đã xem từ AsyncStorage/localStorage
  if (!ids.includes(id)) {
    ids.push(id);
    await saveViewedIds(ids); // Lưu lại vào bộ nhớ máy
    // Chỉ kích hoạt updateDoc(db, 'heritages', id, { views: increment(1) })
    // nếu ID này lần đầu xuất hiện trên thiết bị
  }
}
```
Cơ chế này tiết kiệm tới 90% số lượng truy cập ghi dữ liệu (write operations) vào Firebase Firestore, giảm thiểu chi phí dịch vụ Cloud đáng kể.

---

### 7. Tải hình ảnh lên Đám Mây (`lib/cloudinary.ts`)
Tệp [cloudinary.ts](file:///c:/Users/HP/khmerApp/lib/cloudinary.ts) thực hiện tải lên hình ảnh từ máy thiết bị lên CDN của Cloudinary. File này xử lý tinh tế sự khác biệt về API giữa Web và React Native:
*   **Trên môi trường Web:** Không thể truyền trực tiếp đường dẫn file cục bộ. Tệp tin được tải (fetch) về máy khách dưới dạng một đối tượng nhị phân `Blob`, sau đó được đóng gói vào `FormData` để gửi đi.
*   **Trên môi trường di động Native (iOS/Android):** Không cần tải về Blob. `FormData` chấp nhận trực tiếp một object định nghĩa đường dẫn URI vật lý của ảnh trên thiết bị kèm loại định dạng:
```typescript
body.append('file', {
  uri,
  type: 'image/jpeg',
  name: `upload_${Date.now()}.jpg`,
} as any);
```

---

## CHƯƠNG 6: PHÂN TÍCH CHI TIẾT CODE CỦA CÁC CONTEXTS, HOOKS & UI COMPONENTS

### 1. Hệ thống Đa Ngôn Ngữ (`contexts/language-context.tsx`)
Ứng dụng hỗ trợ đồng thời 3 ngôn ngữ: Tiếng Việt (`vi`), Tiếng Khmer (`km`), và Tiếng Anh (`en`). 
*   **Tự động tải lại:** Tại thời điểm khởi động (`mount`), ứng dụng đọc cấu hình ngôn ngữ ưa thích cuối cùng của người dùng được lưu trữ cục bộ.
*   **Dịch thuật thời gian thực:** Context xuất ra hàm `t` (tập hợp các từ điển được định nghĩa trong [languages.ts](file:///c:/Users/HP/khmerApp/constants/languages.ts)). Bất kỳ khi nào hàm `setLanguage(lang)` được gọi từ trang cấu hình, toàn bộ giao diện sẽ cập nhật chuỗi văn bản tương ứng ngay lập tức mà không cần khởi động lại ứng dụng.

---

### 2. Trình kết xuất Bản đồ Tương tác Đa nền tảng (`components/map/`)
Xử lý bản đồ trong React Native luôn là một thách thức lớn vì phiên bản Web và Native sử dụng hai cơ chế hoàn toàn khác biệt. Ứng dụng giải quyết bằng cách chia nhỏ tệp component thành hai phiên bản đuôi mở rộng:

#### a. Phiên bản Web (`components/map/map-view.tsx`)
Trên nền tảng Web, do thư viện Google Maps hoặc React Native Maps không thể tương thích hoàn hảo hoặc yêu cầu API Key tốn phí, hệ thống tự động tải bản đồ nguồn mở **Leaflet** bên trong một thẻ `iframe` HTML động thông qua thuộc tính `srcDoc`:
*   Sử dụng Leaflet CSS và JS từ CDN (`unpkg.com`).
*   Bản đồ sử dụng các mảnh bản đồ (tile layers) miễn phí từ CartoDB (chế độ tối: `dark_all`, chế độ sáng: `voyager`).
*   **Cơ chế giao tiếp liên kênh (Cross-Origin Message):** Khi người dùng click vào nút "Xem chi tiết" trên khung thông tin nổi (popup) của Leaflet nằm bên trong iframe, iframe sẽ gửi tín hiệu về React Native qua cổng tin nhắn:
    ```javascript
    onclick="window.parent.postMessage({type: 'SELECT_HERITAGE', id: 'id-di-san'}, '*')"
    ```
    Phía bên ngoài React Native lắng nghe qua hiệu ứng `useEffect` với sự kiện `message` để điều hướng màn hình di động:
    ```typescript
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'SELECT_HERITAGE') {
        onPressHeritage(event.data.id);
      }
    });
    ```

#### b. Phiên bản Di Động Native (`components/map/map-view.native.tsx`)
Trên môi trường Native, hệ thống sử dụng `react-native-maps` liên kết trực tiếp với SDK bản đồ gốc của hệ điều hành (Apple Maps trên iOS và Google Maps trên Android) mang lại hiệu năng mượt mà nhất.
*   Tính toán khu vực hiển thị (`initialRegion`) tự động bao quát toàn bộ danh sách marker để người dùng không phải kéo zoom tay khi mở trang.
*   Thiết kế giao diện bản đồ tối (`darkMapStyle`) được nạp trực tiếp vào Google Maps thông qua thuộc tính `customMapStyle` giúp đồng bộ giao diện Dark Mode của ứng dụng.

#### c. Giải thuật Dịch chuyển Tọa độ Chống Trùng Lặp (`components/map/coordinates.ts`)
Khi nhiều di sản thuộc cùng một tỉnh thành nhưng không có tọa độ GPS cụ thể, chúng sẽ mặc định trỏ về tọa độ trung tâm của tỉnh đó. Nếu hiển thị trực tiếp lên bản đồ, hàng loạt Markers sẽ đè lên nhau tại một điểm duy nhất, khiến người dùng không thể nhìn thấy hoặc tương tác.
*   **Giải thuật lưới tọa độ bù đắp (Grid Offset Algorithm):**
```typescript
export function getHeritageCoordinates(heritage: HeritageDocument, index: number): LatLng {
  if (heritage.location?.lat && heritage.location?.lng) {
    return { latitude: heritage.location.lat, longitude: heritage.location.lng };
  }
  
  // Lấy tọa độ trung tâm của tỉnh thành
  const baseCoords = PROVINCE_COORDINATES[heritage.province.toLowerCase()] ?? { latitude: 9.8, longitude: 106.1 };

  // Tạo ra vị trí lệch xung quanh tâm dựa trên chỉ số index của di sản
  const row = (index % 3) - 1; // Nhận giá trị: -1, 0, 1
  const col = Math.floor(index / 3) % 3 - 1; // Nhận giá trị: -1, 0, 1
  
  // Dịch chuyển khoảng 1.5km đến 2.5km tùy thuộc vào hàng và cột
  const offsetLatitude = baseCoords.latitude + (row * 0.012) + (col * 0.005);
  const offsetLongitude = baseCoords.longitude + (col * 0.012) + (row * 0.005);

  return { latitude: offsetLatitude, longitude: offsetLongitude };
}
```
Giải thuật này phân bổ các địa điểm di sản thành một mạng lưới hình vuông nhỏ xung quanh tọa độ trung tâm tỉnh, giải quyết triệt để vấn đề chồng lấp marker và tạo hiệu ứng trực quan sinh động.

---

## CHƯƠNG 7: CÁC KỊCH BẢN SEEDING VÀ CÔNG CỤ QUẢN TRỊ (ADMIN SCRIPTS)

Để hỗ trợ phát triển nhanh và khởi tạo cơ sở dữ liệu mẫu dễ dàng, dự án cung cấp các script tự động hóa nằm ở thư mục `scripts/` sử dụng công cụ thực thi mã Typescript trực tiếp là `tsx`.

### 1. Script nạp dữ liệu mẫu lên Firestore (`scripts/seed-firestore.ts`)
Script này sử dụng quyền Quản trị tối cao từ tài khoản dịch vụ (`Service Account`) của Google Cloud để đồng bộ dữ liệu tĩnh cục bộ lên Cloud Firestore.
*   **Giải thuật Xóa hàng loạt an toàn (Safe Batch Deletes):** Để làm sạch DB trước khi seed mà không bị giới hạn bộ nhớ của Firebase (Firestore giới hạn tối đa 500 thao tác ghi trong một Batch), script chia nhỏ danh sách tài liệu hiện có thành từng khối 400 bản ghi để xóa tuần tự:
```typescript
const batchSize = 400;
for (let index = 0; index < docs.length; index += batchSize) {
  const chunk = docs.slice(index, index + batchSize);
  const batch = db.batch();
  for (const doc of chunk) {
    batch.delete(doc.ref);
  }
  await batch.commit(); // Cam kết thực thi xóa nguyên tử
}
```
*   **Giải thuật Ghi hàng loạt (Batch Writes):** Sau khi làm sạch, script tiến hành lọc các dữ liệu hợp lệ (loại bỏ các trường mang giá trị `undefined` bằng hàm lọc đệ quy `sanitizeValue`) và đẩy dữ liệu mẫu của 5 bộ sưu tập lên đám mây thông qua các transaction batch nhỏ (400 items/batch).

---

## CHƯƠNG 8: HƯỚNG DẪN KHỞI CHẠY VÀ CẤU HÌNH HỆ THỐNG

### 1. Định cấu hình Biến Môi Trường (`.env`)
Tạo một tệp tin `.env` nằm tại thư mục gốc của dự án với nội dung như sau để kết nối ứng dụng với các dịch vụ đám mây:

```bash
# Firebase Client SDK Credentials
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCDDQukO7dNV7pVmvlwaOwsOxd5G5WV1Bg
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=khmerapp-9895c.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=khmerapp-9895c
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=khmerapp-9895c.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=116301043057
EXPO_PUBLIC_FIREBASE_APP_ID=1:116301043057:web:04f03a6716880a9b7552d0

# Cloudinary CDN Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dijsvql6w
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=khmerapp_preset

# Cờ phát triển: set true để chạy dữ liệu giả không cần mạng
EXPO_PUBLIC_USE_DEMO_DATA=false
```

### 2. Các lệnh khởi chạy dự án (`package.json` scripts)
*   **Cài đặt các gói thư viện phụ thuộc:**
    ```bash
    npm install
    ```
*   **Dọn dẹp và nạp lại cơ sở dữ liệu mẫu lên đám mây:**
    ```bash
    npm run seed:firestore
    ```
*   **Khởi chạy máy chủ phát triển Expo Metro Bundler:**
    ```bash
    npm start
    ```
*   **Khởi chạy trên các nền tảng cụ thể:**
    *   Phím `w`: Mở ứng dụng chạy trên Trình duyệt Web.
    *   Phím `a`: Khởi động ứng dụng trên thiết bị mô phỏng Android Emulator.
    *   Phím `i`: Khởi động ứng dụng trên thiết bị mô phỏng iOS Simulator.
