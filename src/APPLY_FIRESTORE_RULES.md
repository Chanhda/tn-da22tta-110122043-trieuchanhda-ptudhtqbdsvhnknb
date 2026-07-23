# 🔥 Cách áp dụng Firestore Rules

## Bước 1: Copy Rules

Mở file `firestore.rules` trong project và copy toàn bộ nội dung.

## Bước 2: Mở Firebase Console

1. Truy cập: https://console.firebase.google.com
2. Chọn project: **khmerapp-9895c**
3. Từ menu bên trái, chọn **Firestore Database**
4. Click tab **Rules** (ở trên cùng)

## Bước 3: Paste Rules

1. Xóa toàn bộ rules hiện tại
2. Paste rules từ file `firestore.rules`
3. Click nút **Publish** (màu xanh)

## Bước 4: Tạo tài khoản Admin đầu tiên

### Cách 1: Qua Firebase Console

1. Đăng nhập vào app với email của bạn
2. Vào Firebase Console > Firestore Database
3. Mở collection **users**
4. Tìm document có ID = UID của bạn
5. Click vào document đó
6. Sửa field **role** từ `user` thành `admin`
7. Click **Update**

### Cách 2: Qua Firestore UI

1. Vào https://console.firebase.google.com/project/khmerapp-9895c/firestore/data/users
2. Click vào user document của bạn
3. Tìm field `role`
4. Đổi giá trị từ `user` thành `admin`
5. Save

## Bước 5: Test

1. Logout khỏi app
2. Login lại
3. Vào tab **Profile**
4. Bạn sẽ thấy card **"Quản trị viên"** màu vàng
5. Click vào để vào trang Admin

## ✅ Xong!

Bây giờ bạn đã có:
- ✅ Firestore Rules bảo mật
- ✅ Tài khoản Admin đầu tiên
- ✅ Quyền quản lý bài viết

## 🎯 Tiếp theo

Vào trang Admin và thử:
- Thêm bài viết mới
- Sửa bài viết
- Xóa bài viết
