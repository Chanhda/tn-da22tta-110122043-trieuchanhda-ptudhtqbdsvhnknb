# Hướng Dẫn Đăng Nhập và Phân Quyền

## 🔐 Cách Đăng Nhập

### Bước 1: Vào Trang Đăng Nhập
1. Mở ứng dụng
2. Vào tab **Hồ Sơ** (Profile) ở thanh điều hướng dưới cùng
3. Nếu chưa đăng nhập, bấm nút **"Đăng nhập"** màu xanh

### Bước 2: Tạo Tài Khoản Mới
1. Nhập **Email** (ví dụ: `admin@khmer.com`)
2. Nhập **Mật khẩu** (tối thiểu 6 ký tự, ví dụ: `123456`)
3. Bấm nút **"Tạo tài khoản mới"**
4. Đợi thông báo "Đăng ký Firebase thành công"

### Bước 3: Đăng Nhập (nếu đã có tài khoản)
1. Nhập **Email** 
2. Nhập **Mật khẩu**
3. Bấm nút **"Đăng nhập"**
4. Đợi thông báo "Đăng nhập Firebase thành công"

## 👤 Phân Quyền Người Dùng

Ứng dụng có 2 loại tài khoản:

### 1. Tài Khoản Khách (User)
- **Quyền hạn**: Chỉ xem bài viết, di sản
- **Mặc định**: Tất cả tài khoản mới đều là User

### 2. Tài Khoản Quản Trị Viên (Admin)
- **Quyền hạn**: 
  - Xem, thêm, sửa, xóa bài viết
  - Quản lý di sản
  - Xem thống kê
- **Cách cấp quyền**: Xem phần dưới

## 🔑 Cách Cấp Quyền Admin

### Bước 1: Vào Firebase Console
1. Mở trình duyệt, vào: https://console.firebase.google.com
2. Đăng nhập bằng tài khoản Google của bạn
3. Chọn project **khmerapp-9895c**

### Bước 2: Vào Firestore Database
1. Ở menu bên trái, chọn **Firestore Database**
2. Chọn tab **Data** (Dữ liệu)

### Bước 3: Tìm User Cần Cấp Quyền
1. Tìm collection **users** trong danh sách
2. Click vào collection **users**
3. Bạn sẽ thấy danh sách các user documents

### Bước 4: Đổi Role Thành Admin
1. Click vào document của user bạn muốn cấp quyền admin
2. Tìm field **role** (có giá trị là `user`)
3. Click vào giá trị `user`
4. Đổi thành `admin`
5. Bấm **Update** để lưu

### Bước 5: Đăng Nhập Lại
1. Quay lại ứng dụng
2. Nếu đang đăng nhập, bấm **Đăng xuất**
3. Đăng nhập lại bằng tài khoản vừa cấp quyền admin
4. Bạn sẽ thấy:
   - Badge vương miện 👑 trên avatar
   - Menu item **"Quản trị viên"** trong danh sách menu
   - Click vào để vào trang quản trị

## 📱 Các Tính Năng Sau Khi Đăng Nhập

### Tài Khoản User
- Xem thông tin cá nhân
- Đổi ngôn ngữ (Tiếng Việt, Khmer, English)
- Xem thống kê (đã xem, yêu thích, đánh giá)
- Đăng xuất

### Tài Khoản Admin
- **Tất cả tính năng của User** +
- **Menu "Quản trị viên"**: Click để vào trang admin
- **Trang Admin Dashboard**:
  - Xem thống kê tổng quan
  - Quản lý bài viết (thêm, sửa, xóa)
  - Xem danh sách người dùng
  - Xem số lượng di sản, danh mục, media

## 🚨 Lưu Ý Quan Trọng

1. **Mật khẩu phải có ít nhất 6 ký tự** (yêu cầu của Firebase)
2. **Email phải đúng định dạng** (có dấu @)
3. **Không thể tạo 2 tài khoản cùng email**
4. **Chỉ có thể cấp quyền admin từ Firebase Console**, không thể tự cấp trong app
5. **Đăng xuất và đăng nhập lại** sau khi đổi role để cập nhật quyền

## 🔧 Khắc Phục Sự Cố

### Không thấy nút "Tạo tài khoản mới"
- Kiểm tra file `.env` có đầy đủ thông tin Firebase không
- Khởi động lại ứng dụng

### Không đăng nhập được
- Kiểm tra email và mật khẩu
- Mật khẩu phải ít nhất 6 ký tự
- Kiểm tra kết nối internet

### Đã cấp quyền admin nhưng không thấy menu admin
- Đăng xuất và đăng nhập lại
- Kiểm tra lại field `role` trong Firestore có đúng là `admin` không (chữ thường)

### Không thấy email trong trang đăng nhập
- Email field luôn có sẵn ở trang `/auth`
- Nếu không thấy, thử reload lại trang

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console log trong trình duyệt (F12)
2. Chụp màn hình lỗi
3. Liên hệ với đội ngũ phát triển
