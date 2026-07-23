# TÀI LIỆU ĐẶC TẢ CHI TIẾT CÁC THỰC THỂ CƠ SỞ DỮ LIỆU
## DỰ ÁN: KHMER HERITAGE APP (ỨNG DỤNG DI SẢN KHMER)

Tài liệu này đặc tả chi tiết cấu trúc dữ liệu của các bộ sưu tập (Collections) trong cơ sở dữ liệu NoSQL Cloud Firestore của ứng dụng **Khmer Heritage App**. Do hệ thống sử dụng cơ sở dữ liệu phi quan hệ hướng tài liệu, các thực thể dưới đây đại diện cho các tài liệu (Documents) và các liên kết logic (Logical References) giữa chúng.

---

## MỤC LỤC
1. [Thực thể: users (Bộ sưu tập Người dùng)](#1-thực-thể-users-bộ-sưu-tập-người-dùng)
2. [Thực thể: heritages (Bộ sưu tập Di sản văn hóa)](#2-thực-thể-heritages-bộ-sưu-tập-di-sản-văn-hóa)
3. [Thực thể: articles (Bộ sưu tập Bài viết đóng góp)](#3-thực-thể-articles-bộ-sưu-tập-bài-viết-đóng-góp)
4. [Thực thể: comments (Bộ sưu tập Bình luận)](#4-thực-thể-comments-bộ-sưu-tập-bình-luận)
5. [Thực thể: categories (Bộ sưu tập Danh mục di sản)](#5-thực-thể-categories-bộ-sưu-tập-danh-mục-di-sản)
6. [Bản đồ liên kết và quy ước kiểu dữ liệu](#6-bản-đồ-liên-kết-và-quy-ước-kiểu-dữ-liệu)

---

## 1. Thực thể: `users` (Bộ sưu tập Người dùng)
* **Mục đích:** Lưu trữ thông tin tài khoản, quyền hạn và danh sách yêu thích của người dùng.
* **Khóa chính (PK):** `uid` (Khớp với UID được cấp bởi Firebase Authentication).

| STT | Tên thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc / Ý nghĩa |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `uid` | String | **PK** | Bắt buộc. ID duy nhất đồng bộ từ Firebase Auth. |
| 2 | `displayName` | String | | Tên hiển thị của người dùng trên hệ thống. |
| 3 | `email` | String | | Bắt buộc. Email đăng ký tài khoản (Duy nhất). |
| 4 | `photoURL` | String | | URL ảnh đại diện của người dùng. |
| 5 | `role` | String | | Bắt buộc. Vai trò: `'user'` (mặc định) hoặc `'admin'`. |
| 6 | `favorites` | Array\<String\> | **FK** | Mảng chứa danh sách ID các di sản (`heritages.id`) đã thích. |

---

## 2. Thực thể: `heritages` (Bộ sưu tập Di sản văn hóa)
* **Mục đích:** Lưu trữ thông tin chi tiết về các địa điểm di sản văn hóa vật thể và phi vật thể.
* **Khóa chính (PK):** `id` (Tự động sinh bởi Firestore).

| STT | Tên thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc / Ý nghĩa |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `id` | String | **PK** | Bắt buộc. ID tài liệu tự động sinh ngẫu nhiên. |
| 2 | `title` | String | | Bắt buộc. Tên gọi chính thức của di sản. |
| 3 | `subtitle` | String | | Tên gọi khác hoặc mô tả phụ ngắn gọn. |
| 4 | `province` | String | | Tỉnh thành của di sản (Sóc Trăng, Trà Vinh, An Giang...). |
| 5 | `category` | String | | Tên danh mục hiển thị (Chùa, Lễ hội, Nghệ thuật...). |
| 6 | `categoryId` | String | **FK** | Liên kết với danh mục di sản (`categories.id`). |
| 7 | `type` | String | | Loại hình: `'tangible'` (vật thể) hoặc `'intangible'` (phi vật thể). |
| 8 | `summary` | String | | Tóm tắt ngắn hiển thị ở trang danh sách di sản. |
| 9 | `description` | String | | Bài viết giới thiệu tổng quan chi tiết về di sản. |
| 10 | `body` | String | | Nội dung lịch sử xây dựng, kiến trúc và giá trị văn hóa. |
| 11 | `coverImage` | String | | URL ảnh bìa chính của di sản (tải từ CDN Cloudinary). |
| 12 | `gallery` | Array\<String\> | | Mảng danh sách các URL ảnh chi tiết của di sản. |
| 13 | `location` | Map (Object) | | Bản đồ vị trí gồm kinh/vĩ độ: `{ lat: Number, lng: Number }`. |
| 14 | `views` | Number | | Tổng lượt xem di sản (mặc định: `0`). |
| 15 | `likes` | Number | | Tổng lượt thích di sản (mặc định: `0`). |
| 16 | `builtYear` | String \| Number| | Năm xây dựng hoặc thời kỳ xuất hiện lịch sử. |
| 17 | `highlights` | Array\<String\> | | Mảng danh sách các nét nổi bật tiêu biểu của di sản. |
| 18 | `createdAt` | String (ISO 8601)| | Thời gian tạo bản ghi trên hệ thống. |
| 19 | `updatedAt` | String (ISO 8601)| | Thời gian cập nhật bản ghi gần nhất. |

---

## 3. Thực thể: `articles` (Bộ sưu tập Bài viết đóng góp)
* **Mục đích:** Lưu trữ các bài viết chia sẻ, nghiên cứu văn hóa do quản trị viên viết hoặc thành viên gửi lên.
* **Khóa chính (PK):** `id` (Tự động sinh bởi Firestore).

| STT | Tên thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc / Ý nghĩa |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `id` | String | **PK** | Bắt buộc. ID tài liệu tự động sinh. |
| 2 | `title` | String | | Bắt buộc. Tiêu đề của bài viết văn hóa. |
| 3 | `category` | String | | Danh mục phân loại bài viết. |
| 4 | `summary` | String | | Mô tả ngắn gọn/Tóm tắt nội dung bài viết. |
| 5 | `content` | String | | Nội dung chi tiết bài viết (Hỗ trợ định dạng văn bản). |
| 6 | `author` | String | | Tên tác giả hiển thị. |
| 7 | `authorId` | String | **FK** | Bắt buộc. ID người viết, tham chiếu đến `users.uid`. |
| 8 | `heritageId` | String | **FK** | Tùy chọn. ID di sản liên kết, tham chiếu đến `heritages.id`. |
| 9 | `coverImage` | String | | URL ảnh bìa đại diện cho bài viết. |
| 10 | `views` | Number | | Lượt xem bài viết (mặc định: `0`). |
| 11 | `likes` | Number | | Lượt thích bài viết (mặc định: `0`). |
| 12 | `published` | Boolean | | Trạng thái hiển thị công khai: `true` hoặc `false`. |
| 13 | `status` | String | | Trạng thái duyệt: `'pending'` (chờ), `'published'` (đã duyệt), `'rejected'` (từ chối). |
| 14 | `rejectReason` | String | | Lý do từ chối duyệt bài (nếu trạng thái là `'rejected'`). |
| 15 | `createdAt` | String (ISO 8601)| | Thời gian tạo bài viết. |
| 16 | `updatedAt` | String (ISO 8601)| | Thời gian cập nhật bài viết gần nhất. |

---

## 4. Thực thể: `comments` (Bộ sưu tập Bình luận)
* **Mục đích:** Lưu trữ các thảo luận, đóng góp ý kiến của người dùng dưới các bài viết hoặc địa điểm di sản.
* **Khóa chính (PK):** `id` (Tự động sinh bởi Firestore).

| STT | Tên thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc / Ý nghĩa |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `id` | String | **PK** | Bắt buộc. ID tài liệu tự sinh. |
| 2 | `articleId` | String | **FK** | Bắt buộc. ID bài viết/di sản được bình luận, tham chiếu đến `articles.id` hoặc `heritages.id`. |
| 3 | `userId` | String | **FK** | Bắt buộc. ID người bình luận, tham chiếu đến `users.uid`. |
| 4 | `authorName` | String | | Tên hiển thị của người bình luận (dùng để render nhanh). |
| 5 | `text` | String | | Bắt buộc. Nội dung của bình luận. |
| 6 | `createdAt` | String (ISO 8601)| | Thời gian bình luận được tạo trên hệ thống. |

---

## 5. Thực thể: `categories` (Bộ sưu tập Danh mục di sản)
* **Mục đích:** Danh mục phân loại các di sản để phục vụ hiển thị bộ lọc trên giao diện.
* **Khóa chính (PK):** `id` (Thường sử dụng slug viết liền không dấu, ví dụ: `chua`, `le-hoi`...).

| STT | Tên thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc / Ý nghĩa |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `id` | String | **PK** | Bắt buộc. Mã danh mục (dùng slug để tối ưu tìm kiếm). |
| 2 | `name` | String | | Bắt buộc. Tên danh mục hiển thị (Chùa, Lễ hội, Nghệ thuật...). |
| 3 | `icon` | String | | Tên định danh của Icon lấy từ thư viện Expo Vector Icons. |

---

## 6. Bản đồ liên kết và quy ước kiểu dữ liệu
* **Mối quan hệ 1 - Nhiều (1..n):**
  * `categories` (1) ───> `heritages` (n) qua trường `categoryId` trong `heritages`.
  * `heritages` (1) ───> `articles` (n) qua trường `heritageId` trong `articles`.
  * `users` (1) ───> `articles` (n) qua trường `authorId` trong `articles`.
  * `users` (1) ───> `comments` (n) qua trường `userId` trong `comments`.
  * `articles` (1) ───> `comments` (n) qua trường `articleId` trong `comments`.
* **Mối quan hệ Nhiều - Nhiều (n..m):**
  * `users` (n) ───> `heritages` (m) thông qua việc lưu mảng chuỗi tham chiếu `favorites: Array<String>` trực tiếp trong tài liệu của `users` để tối ưu hóa truy vấn không liên kết (De-normalization) của NoSQL.
* **Quy ước múi giờ và thời gian:**
  * Toàn bộ các trường định dạng ngày tháng đều sử dụng chuỗi ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) hoặc kiểu dữ liệu `Timestamp` mặc định của Firestore để đảm bảo tính đồng bộ múi giờ quốc tế (+00:00 UTC).
