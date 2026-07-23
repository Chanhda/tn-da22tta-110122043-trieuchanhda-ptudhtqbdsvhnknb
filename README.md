# 🏛️ KHMER HERITAGE APP
### Ứng dụng Di động Hỗ trợ Quảng bá Di sản Văn hóa Người Khmer Nam Bộ

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54.0.35-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-12.12.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/NativeWind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## 👤 Thông tin Đồ án

| Thông tin | Chi tiết |
|-----------|----------|
| **Trường** | Đại học Trà Vinh – Trường Kỹ thuật và Công nghệ |
| **Chuyên ngành** | Công nghệ Thông tin |
| **Sinh viên thực hiện** | Triệu Chanh Đa |
| **Mã số sinh viên** | 110122043 |
| **Lớp** | DA22TTA (Khóa 2022 – 2026) |
| **Giảng viên hướng dẫn** | TS. Thạch Kọng Saoane |
| **Năm thực hiện** | 2025 – 2026 |

---

## 📌 Giới thiệu

**Khmer Heritage App** là ứng dụng di động đa nền tảng (iOS · Android · Web) được phát triển nhằm mục tiêu **số hóa, lưu trữ và quảng bá di sản văn hóa của đồng bào dân tộc Khmer vùng Đồng bằng sông Cửu Long** (Sóc Trăng, Trà Vinh, An Giang…).

Ứng dụng tích hợp bản đồ định vị tọa độ di sản thực tế, hệ thống bài viết cộng đồng, lễ hội với bộ đếm ngược thời gian thực, hỗ trợ đa ngôn ngữ Việt – Khmer – Anh và bảng quản trị phân quyền đầy đủ.

---

## ✨ Tính năng nổi bật

### 👥 Dành cho Người dùng
- 🏛️ **Khám phá Di sản** – Duyệt danh sách di sản văn hóa vật thể & phi vật thể với đầy đủ hình ảnh, mô tả, lịch sử
- 🗺️ **Bản đồ Tương tác** – Xem vị trí thực tế của các địa điểm di sản trên bản đồ tích hợp
- 🎉 **Lễ hội & Sự kiện** – Xem danh sách lễ hội Khmer với bộ đếm ngược thời gian thực
- 📰 **Bài viết Cộng đồng** – Đọc, bình luận, yêu thích bài viết; tự gửi bài đóng góp
- 🌐 **Đa ngôn ngữ** – Hỗ trợ 3 ngôn ngữ: Tiếng Việt, Tiếng Khmer, Tiếng Anh
- 📶 **Hoạt động Ngoại tuyến** – Lưu cache dữ liệu, trải nghiệm mượt mà khi không có mạng
- 👤 **Hồ sơ Cá nhân** – Quản lý tài khoản, cập nhật avatar, xem bài viết đã gửi

### 🔐 Dành cho Quản trị viên (Admin)
- 📋 **Bảng điều khiển** – Dashboard tổng quan thống kê dữ liệu
- ✅ **Kiểm duyệt Bài viết** – Duyệt / từ chối bài viết do cộng đồng gửi lên
- 🏛️ **Quản lý Di sản** – Thêm, sửa, xóa thông tin di sản văn hóa
- 🎊 **Quản lý Lễ hội** – Thêm, sửa, xóa sự kiện lễ hội
- 👮 **Phân quyền vai trò** – Bổ nhiệm / thu hồi vai trò Phó quản trị viên

---

## 🏗️ Kiến trúc Hệ thống

Hệ thống xây dựng theo mô hình **Serverless** kết hợp **Repository Pattern** phía Client:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT SIDE (EXPO)                     │
│                                                             │
│  ┌──────────────────────┐      ┌────────────────────────┐   │
│  │   User Interface     │      │   State Management     │   │
│  │  (NativeWind /       │ ──►  │   (React Context API)  │   │
│  │   TailwindCSS)       │      │  Auth / Lang / Theme   │   │
│  └──────────────────────┘      └────────────────────────┘   │
│               │                             │               │
│               ▼                             ▼               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Repository Pattern                  │    │
│  │  (Article · Heritage · Festival · Comment Repos)    │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND & CLOUD                         │
│                                                             │
│ ┌──────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│ │  Firebase Auth   │ │ Cloud Firestore │ │  Cloudinary   │  │
│ │ (Xác thực /      │ │ (Cơ sở dữ liệu) │ │  (CDN Ảnh)    │  │
│ │  Phân quyền)     │ │  NoSQL          │ │               │  │
│ └──────────────────┘ └─────────────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

### Frontend / Mobile
| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **React Native** | 0.81.5 | Framework phát triển ứng dụng di động |
| **Expo SDK** | 54.0.35 | Nền tảng & công cụ build (New Architecture + React Compiler) |
| **Expo Router** | v6 | File-based Routing, Deep Linking |
| **NativeWind** | v4 | TailwindCSS cho React Native |
| **React Native Reanimated** | v4 | Animation chạy trên UI Thread |
| **React Native Maps** | 1.20.1 | Bản đồ tích hợp (Native) |
| **TypeScript** | 5.9 | Kiểu tĩnh, an toàn code |

### Backend / Cloud (Serverless)
| Dịch vụ | Vai trò |
|---------|---------|
| **Firebase Authentication** | Xác thực tài khoản, phân quyền vai trò |
| **Cloud Firestore** | Cơ sở dữ liệu NoSQL real-time |
| **Cloudinary** | Lưu trữ & tối ưu hóa hình ảnh (CDN) |

---

## 📂 Cấu trúc Thư mục Repository

```
tn-da22tta-110122043-trieuchanhda-appkhmer/
│
├── docs/                              # Tài liệu đồ án
│   ├── Báo cáo khóa luận tốt nghiệp - Triệu Chanh Đa.pdf
│   ├── dcct_kltn_TrieuChanhDa.pdf     # Đề cương chi tiết
│   ├── Slide TN.pptx                  # Slide bảo vệ
│   └── Poster.pdf                     # Poster đồ án
│
└── src/                               # Toàn bộ mã nguồn ứng dụng
    ├── app/                           # Điều hướng (Expo Router – File-based)
    │   ├── (tabs)/                    # Tab bar: Trang chủ, Khám phá, Bản đồ, Hồ sơ
    │   ├── admin/                     # Bảng quản trị Admin Dashboard
    │   ├── articles/                  # Chi tiết & gửi bài viết
    │   ├── heritage/                  # Chi tiết di sản văn hóa
    │   ├── auth.tsx                   # Màn hình Đăng nhập / Đăng ký
    │   └── festivals.tsx              # Danh sách lễ hội
    │
    ├── components/                    # Components UI tái sử dụng
    ├── constants/                     # Hằng số, từ điển đa ngôn ngữ, dữ liệu mẫu
    ├── contexts/                      # Global State: Auth, Language, Theme
    ├── hooks/                         # Custom React Hooks
    ├── lib/                           # Repository Pattern & Firebase logic
    ├── assets/                        # Hình ảnh, icon, font chữ
    ├── data/                          # Dữ liệu seed tĩnh
    ├── scripts/                       # Script tiện ích (seed Firestore, v.v.)
    │
    ├── app.json                       # Cấu hình Expo app
    ├── package.json                   # Dependencies & npm scripts
    ├── firestore.rules                # Quy tắc bảo mật Firestore
    ├── tailwind.config.js             # Cấu hình TailwindCSS
    └── tsconfig.json                  # Cấu hình TypeScript
```

---

## 💻 Hướng dẫn Cài đặt & Chạy

### Yêu cầu hệ thống
- **Node.js** ≥ 18.0.0 (Khuyến nghị v20.x LTS)
- **npm** ≥ 9.x hoặc **yarn**
- **Expo Go** (cài trên Android / iOS để chạy trực tiếp)
- Tài khoản **Firebase** & **Cloudinary** (cho backend)

### Các bước thực hiện

#### Bước 1 – Clone Repository
```bash
git clone https://github.com/Chanhda/Appkhmer.git
cd Appkhmer/src
```

#### Bước 2 – Cài đặt thư viện
```bash
npm install
```

#### Bước 3 – Cấu hình biến môi trường
Tạo file `.env` tại thư mục `src/` theo mẫu `.env.example`:
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### Bước 4 – Khởi chạy ứng dụng
```bash
npx expo start --clear
```

| Phím / Hành động | Kết quả |
|------------------|---------|
| Nhấn `w` | Mở trên trình duyệt Web |
| Nhấn `a` | Mở trên Android Emulator |
| Nhấn `i` | Mở trên iOS Simulator |
| Quét mã QR bằng **Expo Go** | Chạy trực tiếp trên điện thoại |

---

## 📱 Các npm Scripts

```bash
npm run android       # Chạy trên Android
npm run ios           # Chạy trên iOS
npm run web           # Chạy trên Web
npm run seed:firestore  # Seed dữ liệu vào Firestore
npm run lint          # Kiểm tra lỗi code (ESLint)
```

---

## 🗃️ Cơ sở Dữ liệu (Firestore Collections)

```
firestore/
├── users/          # Thông tin & phân quyền tài khoản người dùng
├── heritages/      # Dữ liệu các điểm di sản văn hóa
├── festivals/      # Dữ liệu các lễ hội Khmer
├── articles/       # Bài viết cộng đồng (pending / approved / rejected)
└── comments/       # Bình luận của người dùng
```

---

## 📄 Tài liệu Đính kèm

| Tài liệu | Đường dẫn |
|----------|-----------|
| 📘 Báo cáo Khóa luận | `docs/Báo cáo khóa luận tốt nghiệp - Triệu Chanh Đa.pdf` |
| 📋 Đề cương Chi tiết | `docs/dcct_kltn_TrieuChanhDa.pdf` |
| 🖼️ Slide Bảo vệ | `docs/Slide TN.pptx` |
| 🎨 Poster Đồ án | `docs/Poster.pdf` |
| 🔒 Quy tắc Firestore | `src/APPLY_FIRESTORE_RULES.md` |
| 📖 Tài liệu kỹ thuật | `src/DOCUMENTATION.md` |
| 🛡️ Hướng dẫn Phân quyền | `src/AUTHORIZATION_GUIDE.md` |

---

## 📞 Thông tin Liên hệ

| | |
|---|---|
| **Sinh viên** | Triệu Chanh Đa |
| **Email cá nhân** | chanhda.dev@gmail.com |
| **Email trường** | 110122043@st.tvu.edu.vn |
| **Trường** | Kỹ thuật và Công nghệ – Đại học Trà Vinh |

---

<p align="center">
  © 2026 Triệu Chanh Đa – Đại học Trà Vinh &nbsp;|&nbsp; Đồ án Tốt nghiệp DA22TTA
</p>
