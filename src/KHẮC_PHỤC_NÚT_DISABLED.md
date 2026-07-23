# Khắc Phục Nút "Đăng nhập" và "Tạo tài khoản mới" Bị Disabled

## 🔍 Nguyên Nhân

Các nút bị disabled vì điều kiện: `disabled={loading || !canUseFirebase}`

Có thể:
1. Firebase chưa được cấu hình đúng
2. App chưa load được biến môi trường từ file `.env`
3. Dev server cần restart để load lại `.env`

## ✅ Giải Pháp

### Bước 1: Kiểm Tra File .env
Mở file `.env` và đảm bảo có đầy đủ các dòng sau:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCDDQukO7dNV7pVmvlwaOwsOxd5G5WV1Bg
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=khmerapp-9895c.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=khmerapp-9895c
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=khmerapp-9895c.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=116301043057
EXPO_PUBLIC_FIREBASE_APP_ID=1:116301043057:web:04f03a6716880a9b7552d0
```

### Bước 2: Restart Dev Server

**QUAN TRỌNG**: Sau khi thay đổi file `.env`, bạn PHẢI restart lại dev server!

1. Vào terminal đang chạy `npm start` hoặc `npx expo start`
2. Nhấn `Ctrl + C` để dừng server
3. Chạy lại lệnh:
   ```bash
   npx expo start --clear
   ```
   hoặc
   ```bash
   npm start -- --clear
   ```

### Bước 3: Clear Cache và Reload

1. Sau khi dev server khởi động lại
2. Vào trình duyệt (localhost:8081)
3. Nhấn `Ctrl + Shift + R` (hard reload) hoặc `Ctrl + F5`
4. Hoặc mở DevTools (F12) > Right-click nút Reload > chọn "Empty Cache and Hard Reload"

### Bước 4: Kiểm Tra Lại

1. Vào trang đăng nhập (`/auth`)
2. Kiểm tra xem có thông báo "Firebase chưa sẵn sàng" không
3. Nếu KHÔNG có thông báo đó, các nút sẽ hoạt động
4. Nếu VẪN có thông báo, làm theo Bước 5

### Bước 5: Debug (Nếu Vẫn Không Được)

Mở DevTools (F12) > Console tab, chạy lệnh sau:

```javascript
console.log({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
})
```

Nếu tất cả đều `undefined`, nghĩa là biến môi trường chưa được load.

## 🚀 Lệnh Nhanh

```bash
# Dừng server hiện tại (Ctrl + C)
# Sau đó chạy:
npx expo start --clear
```

## 📝 Lưu Ý

- File `.env` phải nằm ở thư mục gốc của project (cùng cấp với `package.json`)
- Tên biến PHẢI bắt đầu bằng `EXPO_PUBLIC_` để Expo có thể load
- Sau khi thay đổi `.env`, LUÔN LUÔN phải restart dev server
- Không cần restart nếu chỉ thay đổi code, chỉ cần restart khi thay đổi `.env`

## ✅ Sau Khi Sửa Xong

Bạn sẽ thấy:
- ✅ Nút "Đăng nhập" có thể bấm được (màu xanh đậm)
- ✅ Nút "Tạo tài khoản mới" có thể bấm được (màu trắng viền)
- ✅ KHÔNG có thông báo "Firebase chưa sẵn sàng"
- ✅ Có thể nhập email và mật khẩu, sau đó bấm nút để đăng nhập/đăng ký
