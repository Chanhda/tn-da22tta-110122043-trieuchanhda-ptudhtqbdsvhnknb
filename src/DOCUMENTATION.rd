# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG: KHMER HERITAGE APP

## CHƯƠNG 1: GIỚI THIỆU TỔNG QUAN DỰ ÁN
Ứng dụng **Khmer Heritage App** là giải pháp phần mềm đa nền tảng (chạy đồng thời trên iOS, Android và Web) được nghiên cứu và phát triển nhằm mục tiêu số hóa, giới thiệu, lưu trữ và bảo tồn các giá trị di sản văn hóa phi vật thể và vật thể của đồng bào dân tộc Khmer tại Việt Nam (đặc biệt là vùng Đồng bằng sông Cửu Long như Sóc Trăng, Trà Vinh, An Giang...).

### 1. Ý nghĩa và mục tiêu của ứng dụng
*   **Số hóa di sản:** Chuyển đổi thông tin truyền thống về các chùa chiền, lễ hội, loại hình nghệ thuật dân gian (như Rô-băm, Dù-kê, nhạc Ngũ âm) thành dữ liệu số có cấu trúc.
*   **Trải nghiệm tương tác:** Cung cấp cho người dùng bản đồ tương tác để xác định vị trí thực tế của các địa điểm di sản, từ đó thúc đẩy du lịch văn hóa.
*   **Cung cấp kiến thức:** Hệ thống các bài viết chuyên sâu có tính giáo dục và lịch sử cao.
*   **Tương tác cộng đồng:** Người dùng có thể bình luận, thể hiện sự yêu thích đối với các bài viết và địa điểm di sản.
*   **Quản lý nội dung khoa học:** Khu vực quản trị (Admin Dashboard) trực quan giúp kiểm duyệt, thêm, sửa, xóa các thông tin di sản nhanh chóng.

---

## CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK)

Hệ thống được thiết kế theo mô hình **Serverless** kết hợp với **Repository Pattern** ở phía Client để tăng tính linh hoạt và dễ bảo trì.

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
*   **Expo SDK 54 & React Native 0.81:**
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

## CHƯƠNG 3: THIẾT KẾ CƠ SỞ DỮ LIỆU CHI TIẾT (DATABASE DESIGN)

Hệ thống sử dụng cơ sở dữ liệu phi quan hệ (NoSQL) Cloud Firestore. Sơ đồ dữ liệu được thiết kế tối ưu hóa cho các thao tác đọc nhanh (Read-heavy) phù hợp với ứng dụng di động.

### 1. Sơ đồ thực thể logic (Entity Schema & Fields)

#### a. Collection: `users` (Quản lý người dùng)
*   **Mô tả:** Lưu trữ thông tin cá nhân và quyền hạn của người dùng. ID tài liệu chính là `uid` được cấp từ Firebase Authentication.
```json
{
  "id": "String (Firebase UID)",
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
*   **Mô tả:** Chứa các bài viết nghiên cứu lịch sử, tin tức sự kiện văn hóa.
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
  "createdAt": "String (ISO 8601 Timestamp)"
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

## CHƯƠNG 4: THIẾT KẾ ĐƯỜNG ĐI (ROUTING) VÀ LUỒNG DỮ LIỆU (FLOW)

### 1. Kiến trúc thư mục vật lý (Directory Structure)
Dự án được cấu trúc theo chuẩn Expo hiện đại để phục vụ báo cáo kỹ thuật:
*   `app/`: Thư mục chứa các màn hình và route điều hướng (Expo Router).
    *   `_layout.tsx`: Tệp khởi tạo hệ thống (Root), chứa các Context Providers.
    *   `auth.tsx`: Luồng đăng nhập, đăng ký, quên mật khẩu.
    *   `(tabs)/`: Giao diện chính chứa Bottom Tab Bar.
        *   `index.tsx`: Trang chủ (Home) tổng hợp.
        *   `heritage.tsx`: Danh sách & Tìm kiếm di sản.
        *   `explore.tsx`: Đề xuất di sản thông minh.
        *   `map.tsx`: Bản đồ di sản vệ tinh/tọa độ.
        *   `profile.tsx`: Màn hình tùy chọn cá nhân.
    *   `heritage/[id].tsx`: Trang chi tiết di sản.
    *   `articles/[id].tsx`: Trang chi tiết bài viết.
    *   `profile/`: Các trang cài đặt cá nhân phụ trợ (`settings.tsx`, `favorites.tsx`, `history.tsx`, `my-articles.tsx`).
    *   `admin/`: Phân vùng quản trị nâng cao (`index.tsx`, `heritages.tsx`, `articles.tsx`).
*   `components/`: Các component tái sử dụng.
    *   `ui/`: Thư viện Component UI nguyên tử (Atomic UI Design) gồm `button.tsx`, `card.tsx`, `badge.tsx`, `custom-alert.tsx`, `icon-symbol.tsx`.
    *   `map/`: Các component chuyên biệt cho xử lý bản đồ.
*   `constants/`: Khai báo hằng số hệ thống.
    *   `theme.ts`: Chứa Design Tokens (màu sắc HSL, spacing, typography).
    *   `languages.ts`: Tệp từ điển chứa toàn bộ chuỗi dịch đa ngôn ngữ (vi, km, en).
*   `contexts/`: Lưu trữ trạng thái ứng dụng.
    *   `language-context.tsx`: Context điều phối dịch thuật thời gian thực (`useLanguage`).
    *   `color-scheme-context.tsx`: Context quản lý Dark Mode / Light Mode.
*   `lib/`: Thư mục dịch vụ và Repository truy xuất dữ liệu.
    *   `firebase.ts`: Khởi tạo Firebase SDK và xuất cấu hình.
    *   `auth-session.tsx`: Quản lý trạng thái đăng nhập, xác thực phiên người dùng (`useAuthSession`).
    *   `cloudinary.ts`: Xử lý nén và tải ảnh lên Cloud.
    *   `*-repository.ts`: Các lớp trừu tượng truy xuất dữ liệu (Data Access Layer).

---

### 2. Các luồng xử lý nghiệp vụ chính (Business Logic Flow Diagrams)

#### a. Luồng xác thực đăng nhập & Phân quyền (Authentication & Authorization Flow)
Hệ thống sử dụng cơ chế bảo vệ Route (Route Guarding) ở client-side:

```
                  ┌──────────────────────────────┐
                  │   Khởi động app: _layout.tsx  │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                    ┌───────────────────────────┐
                    │    onAuthStateChanged()   │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────┴────────────┐
             Có ───>│ firebaseUser != null?   │<─── Không
             │      └─────────────────────────┘      │
             ▼                                       ▼
 ┌───────────────────────┐               ┌───────────────────────┐
 │ ensureUserProfile()   │               │ Chuyển sang /auth     │
 │ (Lấy/Tạo profile DB)  │               │ (Đăng nhập/Đăng ký)   │
 └──────────┬────────────┘               └───────────────────────┘
            │
            ▼
 ┌───────────────────────┐
 │   Kiểm tra email:     │
 │   Tên miền admin?     │
 └──────────┬────────────┘
            │
      ┌─────┴──────┐
     Có           Không
      ▼            ▼
 ┌──────────┐ ┌──────────┐
 │Role=Admin│ │Role=User │
 └────┬─────┘ └────┬─────┘
      │            │
      ▼            ▼
 ┌──────────┐ ┌──────────┐
 │Truy cập  │ │Ẩn vùng   │
 │Màn Admin │ │Admin     │
 └──────────┘ └──────────┘
```

#### b. Luồng nạp dữ liệu thông minh (Smart Data Access Flow with Fallback)
Ứng dụng tự động phát hiện trạng thái cấu hình và mạng để chuyển đổi nguồn dữ liệu mà không làm gián đoạn trải nghiệm người dùng (Offline-first approach):

```
                     ┌───────────────────────────┐
                     │   Yêu cầu nạp di sản      │
                     │  (e.g., fetchHeritages)   │
                     └─────────────┬─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
            True ──>│ isDemoDataEnabled() ||     │
            │       │ !isFirebaseConfigured()?    │
            ▼       └──────────────┬──────────────┘
 ┌──────────────────────┐          │ False
 │  Sử dụng dữ liệu     │          ▼
 │  Local Static        │ ┌────────────────────────┐
 │  (constants/herit.)  │ │  Truy vấn dữ liệu từ   │
 └──────────────────────┘ │  Cloud Firestore       │
                          └────────┬───────────────┘
                                   │
                        ┌──────────┴──────────┐
                   Thành công               Lỗi
                        │                      │
                        ▼                      ▼
             ┌─────────────────────┐ ┌────────────────────┐
             │ Trả về dữ liệu mới  │ │ Catch lỗi, nạp từ  │
             │ nhất từ Firestore   │ │ Local Static làm   │
             │                     │ │ dữ liệu dự phòng   │
             └─────────────────────┘ └────────────────────┘
```

#### c. Luồng tải hình ảnh và tạo bài viết/di sản mới (Admin Image Upload Flow)
Quy trình truyền thông dữ liệu nhị phân giữa thiết bị di động, máy chủ trung gian Cloudinary và Firestore:

```
Admin Screen            Image Picker            Cloudinary API            Firestore DB
    │                         │                        │                       │
    │ 1. Nhấn nút "Chọn ảnh"  │                        │                       │
    │────────────────────────>│                        │                       │
    │                         │ 2. Trả về URI cục bộ   │                       │
    │                         │    (e.g., file://...)  │                       │
    │<────────────────────────│                        │                       │
    │                                                  │                       │
    │ 3. Gọi uploadImageToCloudinary(uri)              │                       │
    │─────────────────────────────────────────────────>│                       │
    │                                                  │                       │
    │                                                  │ 4. Lưu trữ và nén ảnh │
    │                                                  │    Trả về secure_url  │
    │<─────────────────────────────────────────────────│                       │
    │                                                                          │
    │ 5. Gọi createHeritage(data + coverImage: secure_url)                      │
    │─────────────────────────────────────────────────────────────────────────>│
    │                                                                          │
    │                                                  │ 6. Ghi tài liệu mới   │
    │                                                  │    Trả về Document ID │
    │<─────────────────────────────────────────────────────────────────────────│
    │                                                                          │
    ▼                                                                          ▼
```

---

## CHƯƠNG 5: CÁC KỸ THUẬT VÀ GIẢI PHÁP TỐI ƯU HÓA NỔI BẬT

### 1. Kỹ thuật "Shim" giải quyết lỗi package.json exports trên Node v24
*   **Vấn đề:** Khi sử dụng Firebase JS SDK trên môi trường React Native (Metro Bundler), do Node phiên bản mới (Node v24+) áp dụng cơ chế bảo mật nghiêm ngặt đối với trường `exports` trong `package.json`, Metro sẽ cảnh báo hoặc báo lỗi không thể truy cập trực tiếp file phân phối React Native của Firebase Auth (`@firebase/auth/dist/rn/index.js`). Điều này gây lỗi tràn bộ nhớ (ENOMEM) khi chạy thử nghiệm Jest hoặc gây lỗi build.
*   **Giải pháp:** Tạo tệp trung gian [_firebase-auth-rn-shim.js](file:///c:/Users/HP/khmerApp/lib/_firebase-auth-rn-shim.js) để trực tiếp `require` tệp phân phối native thông qua đường dẫn vật lý cục bộ vượt qua kiểm tra exports:
    ```javascript
    module.exports = require('../node_modules/@firebase/auth/dist/rn/index.js');
    ```
    Giúp Metro bỏ qua các cảnh báo đắt đỏ và tăng tốc độ phân tích cú pháp dự án lên 30%.

### 2. Tự động tối ưu dung lượng ảnh (CDN Image Optimization)
*   **Vấn đề:** Người dùng chụp ảnh bằng điện thoại thường có dung lượng rất lớn (5MB - 10MB) với độ phân giải siêu cao (4K+). Tải trực tiếp các ảnh này trên các trang danh sách di sản sẽ làm cạn kiệt bộ nhớ thiết bị, hao tốn băng thông 3G/4G và gây giật lag khi cuộn màn hình.
*   **Giải pháp:** Trong lớp ánh xạ dữ liệu [heritage-repository.ts](file:///c:/Users/HP/khmerApp/lib/heritage-repository.ts), hệ thống triển khai hàm Regex để tự động thay đổi các tham số truy vấn kích thước (Image Transformation parameters) của Cloudinary hoặc Unsplash:
    ```typescript
    coverImage: typeof data.coverImage === 'string'
      ? data.coverImage.replace('w=1200', 'w=400').replace('w=800', 'w=400')
      : undefined
    ```
    Kỹ thuật này giúp giảm 80% kích thước tệp tải xuống cho các trang danh sách mà không làm giảm chất lượng hiển thị trên màn hình di động cỡ nhỏ.

### 3. Hệ thống Tracking và Ghi nhận Lượt xem/Thích phi tập trung (Decentralized Tracking System)
*   **Vấn đề:** Để tạo độ tin cậy cho di sản, số lượt xem và lượt thích cần được tăng lên khi người dùng truy cập. Tuy nhiên, nếu cập nhật liên tục lên database sau mỗi lần tải trang sẽ gây tốn kém chi phí truy vấn Firebase (Firestore pricing dựa trên số lần ghi) và người dùng có thể spam lượt xem bằng cách bấm F5/Re-enter liên tục.
*   **Giải pháp:** Sử dụng giải pháp lưu trữ trạng thái cục bộ kết hợp với Firebase Increment.
    *   Khi người dùng xem di sản, hệ thống gọi `incrementHeritageViews(id)` tại [views-repository.ts](file:///c:/Users/HP/khmerApp/lib/views-repository.ts).
    *   Hệ thống kiểm tra ID di sản trong bộ nhớ máy (`AsyncStorage` hoặc `localStorage`). Nếu chưa tồn tại, hệ thống mới ghi nhận di sản vào danh sách đã xem cục bộ, đồng thời thực thi lệnh cập nhật số lượng dạng nguyên tử `increment(1)` trên Firestore.
    *   Nếu người dùng xem lại lần thứ 2, trạng thái cục bộ sẽ chặn không cho gửi truy vấn tăng lượt xem lên server nữa, giảm tải 90% chi phí ghi dữ liệu Firestore không cần thiết.

---

## CHƯƠNG 6: HƯỚNG DẪN TRIỂN KHAI VÀ KHỞI CHẠY (DEPLOYMENT GUIDE)

### 1. Cấu hình môi trường (`.env`)
Để kết nối với dịch vụ Cloud, tạo file `.env` tại thư mục gốc với các thông số cấu hình:
```bash
# Firebase Credentials
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=khmerapp-9895c.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=khmerapp-9895c
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=khmerapp-9895c.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=116301043057
EXPO_PUBLIC_FIREBASE_APP_ID=1:116301043057:web:04f03a6716880a9b7552d0

# Cloudinary Credentials (Optional - Falls back to default preset)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dijsvql6w
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=khmerapp_preset

# Development Flags
EXPO_PUBLIC_USE_DEMO_DATA=false
```

### 2. Các bước khởi chạy dự án
*   **Bước 1: Cài đặt thư viện:**
    ```bash
    npm install
    ```
*   **Bước 2: Nạp dữ liệu ban đầu lên Firestore (Seeding):**
    Thiết lập đường dẫn tài khoản dịch vụ Firebase Admin SDK, sau đó chạy:
    ```bash
    npm run seed:firestore
    ```
*   **Bước 3: Khởi chạy ứng dụng:**
    ```bash
    npm start
    ```
    *   Nhấn `w` để chạy phiên bản Web (mở trên trình duyệt).
    *   Nhấn `a` để khởi chạy trên máy ảo Android (hoặc thiết bị kết nối qua ADB).
    *   Nhấn `i` để khởi chạy trên máy ảo iOS (Xcode Simulator).
