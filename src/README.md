# ĐỒ ÁN TỐT NGHIỆP: PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG HỖ TRỢ QUẢNG BÁ DI SẢN VĂN HÓA NGƯỜI KHMER NAM BỘ

**Tên Repository:** `tn-da22tta-110122043-trieuchanhda-appkhmer`  
**Trường:** Đại học Trà Vinh - Trường Kỹ thuật và Công nghệ  
**Chuyên ngành:** Công nghệ Thông tin  
**Sinh viên thực hiện:** Triệu Chanh Đa  
**Mã số sinh viên:** 110122043  
**Lớp:** DA22TTA (Khóa 2022 - 2026)  
**Giảng viên hướng dẫn:** TS. Thạch Kọng Saoane  

---

## 📌 1. GIỚI THIỆU & MỤC TIÊU ĐỒ ÁN

### 1.1 Bối cảnh đề tài
Đồng bằng sông Cửu Long là địa bàn sinh sống lâu đời của đồng bào dân tộc Khmer với kho tàng di sản văn hóa phong phú (chùa chiền cổ kính, lễ hội Ok Om Bok, Chôl Chnăm Thmây, nghệ thuật Rô-băm, Dù-kê, nhạc Ngũ âm...). Việc ứng dụng công nghệ di động hiện đại để số hóa, lưu trữ và quảng bá các giá trị văn hóa này đến cộng đồng trong và ngoài nước là vô cùng cấp thiết.

### 1.2 Mục tiêu đề tài
- **Số hóa di sản:** Xây dựng cơ sở dữ liệu số hóa có cấu trúc về các di sản văn hóa vật thể và phi vật thể của người Khmer Nam Bộ.
- **Trải nghiệm đa nền tảng:** Phát triển ứng dụng chạy đồng thời trên cả iOS, Android và Web với giao diện trực quan, mang đậm bản sắc văn hóa Khmer.
- **Tính năng tương tác thông minh:** Tích hợp Bản đồ số định vị tọa độ di sản, Hệ thống bộ đếm ngược thời gian thực cho các sự kiện lễ hội, Hỗ trợ đa ngôn ngữ (Việt - Khmer - Anh) và Cơ chế hoạt động ngoại tuyến (Offline-First).
- **Hệ thống Quản trị phân quyền (Admin Dashboard):** Xây dựng trang điều hành cho phép kiểm duyệt bài viết cộng đồng đóng góp, quản lý di sản, lễ hội và bổ nhiệm vai trò phó quản trị viên.

---

## 🏗️ 2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ CỐT LÕI (TECH STACK)

Hệ thống được xây dựng theo mô hình **Serverless** kết hợp với kiến trúc **Repository Pattern** phía Client nhằm tách biệt tầng truy cập dữ liệu với giao diện người dùng.

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
│   │   (Article, Heritage, Festival, Comment Repositories)   │   │
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

### Các công nghệ sử dụng:
* **Frontend Mobile/Web:** React Native, Expo SDK 54 (Kích hoạt React Compiler & New Architecture), Expo Router v6 (File-based Routing).
* **Styling & Animation:** NativeWind v4 (TailwindCSS), React Native Reanimated v4.
* **Cloud Backend (Serverless):** Google Firebase (Cloud Firestore & Firebase Authentication).
* **CDN & Storage:** Cloudinary API (Tải và tối ưu hóa hình ảnh di sản).
* **Map Engine:** Leaflet (Web) & React Native Maps (Native).

---

## 📂 3. CẤU TRÚC THƯ MỤC REPOSITORY (FOLDER STRUCTURE)

Cấu trúc lưu trữ được tổ chức chuẩn hóa theo yêu cầu nộp đồ án tốt nghiệp:

```
tn-da22tta-110122043-trieuchanhda-appkhmer/
├── docs/                                  # Chứa toàn bộ tài liệu văn bản đồ án
│   ├── Báo cáo khóa luận tốt nghiệp - Triệu Chanh Đa.docx
│   ├── Báo cáo khóa luận tốt nghiệp - Triệu Chanh Đa.pdf
│   ├── Slide_Bao_Ve_Do_An_TrieuChanhDa.pptx
│   ├── Poster_Do_An_TrieuChanhDa.pdf
│   └── HUONG_DAN_SU_DUNG.md               # Hướng dẫn sử dụng & chạy demo chi tiết
├── src/                                   # Mã nguồn và tài nguyên đồ án
│   ├── database/                          # Tệp cấu hình & quy tắc cơ sở dữ liệu
│   │   ├── firestore.rules
│   │   ├── firestore.indexes.json
│   │   └── firebase.json
│   ├── media/                             # Hình ảnh, âm thanh, tài nguyên đồ họa
│   └── demo_video/                        # Video chạy demo chương trình
├── app/                                   # Điều hướng ứng dụng (Expo Router)
│   ├── (tabs)/                            # Màn hình Tab bar (Trang chủ, Khám phá, Bản đồ, Hồ sơ)
│   ├── admin/                             # Phân hệ Bảng điều khiển Quản trị viên
│   ├── articles/                          # Chi tiết & Gửi bài viết
│   └── heritage/                          # Chi tiết di sản văn hóa
├── components/                            # Các component UI tái sử dụng
├── constants/                             # Hằng số thiết kế, từ điển đa ngôn ngữ & dữ liệu mẫu
├── contexts/                              # Quản lý trạng thái toàn cục (Auth, Language, Theme)
├── lib/                                   # Tầng xử lý nghiệp vụ & Repository Pattern
├── package.json                           # Các thư viện phụ thuộc và scripts khởi chạy
└── README.md                              # Tệp giới thiệu tổng quan đồ án
```

---

## 💻 4. PHẦN MỀM CẦN THIẾT VÀ CÁCH THỨC CHẠY CHƯƠNG TRÌNH

### 4.1 Phần mềm & Môi trường yêu cầu
1. **Node.js:** Phiên bản `>= 18.0.0` (Khuyên dùng v20.x LTS).
2. **Git:** Để quản lý mã nguồn.
3. **Expo Go (Mobile App):** Cài đặt trên Android/iOS để chạy ứng dụng trực tiếp trên điện thoại thật.

### 4.2 Cài đặt và Khởi chạy

#### Bước 1: Clone Repository
```bash
git clone https://github.com/Chanhda/Appkhmer.git
cd Appkhmer
```

#### Bước 2: Cài đặt thư viện (Dependencies)
```bash
npm install
```

#### Bước 3: Cấu hình biến môi trường (`.env`)
Tạo tệp `.env` tại thư mục gốc với các thông số cấu hình Firebase & Cloudinary (Tham khảo tệp `.env.example`).

#### Bước 4: Chạy máy chủ Metro Bundler
```bash
npx expo start --clear
```
- Nhấn phím **`w`** để mở ứng dụng trên Trình duyệt Web.
- Quét mã QR bằng ứng dụng **Expo Go** để trải nghiệm trên điện thoại Android / iOS.

---

## 📞 THÔNG TIN LIÊN HỆ
* **Sinh viên thực hiện:** Triệu Chanh Đa
* **Email:** `chanhda.dev@gmail.com` | `110122043@st.tvu.edu.vn`
* **Trường:** Kỹ thuật và Công nghệ - Đại học Trà Vinh
