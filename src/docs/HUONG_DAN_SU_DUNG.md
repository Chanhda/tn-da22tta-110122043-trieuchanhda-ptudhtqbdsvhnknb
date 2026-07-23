# HƯỚNG DẪN SỬ DỤNG VÀ CHẠY DEMO ĐỒ ÁN TỐT NGHIỆP

**Đề tài:** Phát triển ứng dụng di động hỗ trợ quảng bá di sản văn hóa người Khmer Nam Bộ  
**Sinh viên thực hiện:** Triệu Chanh Đa  
**MSSV:** 110122043  
**Lớp:** DA22TTA - Khóa 2022-2026  
**Giảng viên hướng dẫn:** TS. Thạch Kọng Saoane  

---

## 1. YÊU CẦU MÔI TRƯỜNG & CÀI ĐẶT

### 1.1 Môi trường cần thiết
- **Node.js:** Phiên bản `>= 18.x` (Khuyến nghị Node.js v20 hoặc LTS mới nhất).
- **Trình quản lý gói:** `npm` (đi kèm Node.js).
- **Expo CLI:** Đã được tích hợp sẵn qua `npx expo`.
- **Thiết bị chạy:**
  - **Mobile:** Điện thoại thật cài ứng dụng **Expo Go** (Android / iOS) hoặc Trình giả lập (Android Emulator / iOS Simulator).
  - **Trình duyệt Web:** Google Chrome, Microsoft Edge hoặc Safari.

---

## 2. HƯỚNG DẪN KHỞI CHẠY CHƯƠNG TRÌNH (DEMO)

### Bước 1: Cài đặt các thư viện phụ thuộc (Dependencies)
Mở cửa sổ Terminal tại thư mục mã nguồn gốc và chạy lệnh:
```bash
npm install
```

### Bước 2: Định cấu hình Biến môi trường (`.env`)
Tạo tệp tin `.env` tại thư mục gốc dự án với nội dung cấu hình kết nối Firebase và Cloudinary:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCDDQukO7dNV7pVmvlwaOwsOxd5G5WV1Bg
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=khmerapp-9895c.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=khmerapp-9895c
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=khmerapp-9895c.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=116301043057
EXPO_PUBLIC_FIREBASE_APP_ID=1:116301043057:web:04f03a6716880a9b7552d0

EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dijsvql6w
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=khmerapp_preset

EXPO_PUBLIC_USE_DEMO_DATA=false
```

### Bước 3: Đồng bộ và Nạp dữ liệu mẫu lên Cloud Firestore (Option)
Để làm sạch và khởi tạo dữ liệu mẫu di sản, bài viết và lễ hội lên Firebase, chạy lệnh:
```bash
npm run seed:firestore
```

### Bước 4: Khởi động máy chủ Expo Metro Bundler
Chạy lệnh khởi động với tính năng xóa cache sạch sẽ:
```bash
npx expo start --clear
```

### Bước 5: Trải nghiệm ứng dụng trên các nền tảng
- **Mở trên Trình duyệt Web:** Nhấn phím `w` trên Terminal.
- **Mở trên Thiết bị di động Android:** Nhấn phím `a` (nếu đang bật Android Emulator) hoặc dùng ứng dụng **Expo Go** trên điện thoại quét mã QR code hiển thị tại Terminal.

---

## 3. HƯỚNG DẪN CÁC KỊCH BẢN TRẢI NGHIỆM CHỨC NĂNG (DEMO SCENARIOS)

### 3.1 Phân hệ Người dùng (Client Side)
1. **Trang chủ (Home Screen):** Xem các chỉ số tổng quan di sản, banner đếm ngược thời gian thực Lễ hội Ók Om Bók / Chôl Chnăm Thmây.
2. **Khám phá & Tìm kiếm (Explore):** Lọc bài viết văn hóa theo danh mục (Ẩm thực, Nghệ thuật, Kiến trúc, Lễ hội) và chuyển đổi ngôn ngữ Việt - Khmer - Anh.
3. **Bản đồ Di sản (Interactive Map):** Định vị các công trình di sản (Chùa Som Rông, Chùa Dơi...) và trực quan hóa tọa độ tránh trùng lấp Marker.
4. **Bình luận & Ngoại tuyến:** Trải nghiệm viết bình luận và xem dữ liệu dự phòng khi thiết bị mất kết nối mạng.

### 3.2 Phân hệ Quản trị viên (Admin Dashboard)
1. **Đăng nhập Admin:** Sử dụng tài khoản `admin@khmerheritage.com` hoặc `demo@example.com`.
2. **Bảng điều khiển (Dashboard):** Truy cập nút `"Bảng Quản Trị Viên PRO"` trên trang chủ để xem Thống kê thời gian thực, duyệt/từ chối bài viết từ người dùng gửi lên.
3. **Quản lý Lễ hội & Di sản:** Thao tác Thêm/Sửa/Xóa di sản và lễ hội, tải ảnh trực tiếp lên Cloudinary CDN.
4. **Quản lý Tài khoản:** Xem danh sách người dùng và thực hiện chức năng **Bổ nhiệm Phó Quản trị viên**.
