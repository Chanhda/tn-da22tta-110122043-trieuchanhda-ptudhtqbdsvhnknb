# TÀI LIỆU HƯỚNG DẪN THIẾT KẾ WIREFRAME VÀ GIAO DIỆN FIGMA
## DỰ ÁN: KHMER HERITAGE APP (ỨNG DỤNG DI SẢN KHMER)

Tài liệu này mô tả chi tiết bố cục cấu trúc, các thành phần UI (User Interface) và luồng hoạt động của tất cả các màn hình trong ứng dụng **Khmer Heritage App**. Nội dung được thiết kế theo dạng khung xương (Wireframe Layout) đơn giản, trực quan giúp bạn dễ dàng vẽ phác thảo (Mockup) trên Figma để chèn vào báo cáo đồ án.

---

## MỤC LỤC
1. [QUY ƯỚC CHUNG VỀ KHUNG THIẾT KẾ (FIGMA SETTINGS)](#quy-ước-chung-về-khung-thiết-kế-figma-settings)
2. [CÁC MÀN HÌNH CHÍNH (5 TABS ĐIỀU HƯỚNG DƯỚI CÙNG)](#chương-i-các-màn-hình-chính-5-tabs-điều-hướng-dưới-cùng)
   * [1. Màn hình Trang Chủ (Home Screen)](#1-màn-hình-trang-chủ-home-screen)
   * [2. Màn hình Danh Sách Di Sản & Bộ Lọc (Heritage Search Screen)](#2-màn-hình-danh-sách-di-sản-bộ-lọc-heritage-search-screen)
   * [3. Màn hình Khám Phá Bài Viết (Explore Screen)](#3-màn-hình-khám-phá-bài-viết-explore-screen)
   * [4. Màn hình Bản Đồ Tương Tác (Map Screen)](#4-màn-hình-bản-đồ-tương-tác-map-screen)
   * [5. Màn hình Hồ Sơ Cá Nhân (Profile Screen)](#5-màn-hình-hồ-sơ-cá-nhân-profile-screen)
3. [CÁC MÀN HÌNH CHI TIẾT & TƯƠNG TÁC](#chương-ii-các-màn-hình-chi-tiết-tương-tác)
   * [6. Màn hình Chi Tiết Di Sản (Heritage Detail Screen)](#6-màn-hình-chi-tiết-di-sản-heritage-detail-screen)
   * [7. Màn hình Chi Tiết Bài Viết & Bình Luận (Article Detail Screen)](#7-màn-hình-chi-tiết-bài-viết-bình-luận-article-detail-screen)
   * [8. Màn hình Gửi Bài Viết Đóng Góp Mới (Create Article Screen)](#8-màn-hình-gửi-bài-viết-đóng-góp-mới-create-article-screen)
   * [9. Màn hình Đăng Nhập / Đăng Ký (Auth Screen)](#9-màn-hình-đăng-nhập-đăng-ký-auth-screen)
4. [PHÂN HỆ DÀNH CHO QUẢN TRỊ VIÊN (ADMIN DASHBOARD)](#chương-iii-phân-hệ-dành-cho-quản-trị-viên-admin-dashboard)
   * [10. Màn hình Dashboard & Duyệt bài (Admin Dashboard)](#10-màn-hình-dashboard-duyệt-bài-admin-dashboard)
   * [11. Màn hình Quản Lý Di Sản (Manage Heritages)](#11-màn-hình-quản-lý-di-sản-manage-heritages)

---

## QUY ƯỚC CHUNG VỀ KHUNG THIẾT KẾ (FIGMA SETTINGS)
* **Kích thước khung hình (Frame Size):** Chọn dòng điện thoại thông dụng trên Figma: **iPhone 14 & 15 Pro** (393 x 852 px) hoặc **Android Large** (360 x 800 px).
* **Thanh điều hướng dưới cùng (Bottom Tab Bar):** Cố định ở đáy của 5 màn hình chính, gồm 5 Icons thẳng hàng: 
  * 🏠 Trang Chủ | 🏛️ Di Sản | 📰 Khám Phá | 🗺️ Bản Đồ | 👤 Hồ Sơ.
* **Hệ thống màu sắc (Color Palette):**
  * Màu chủ đạo (Primary Gold/Orange): `#d4af37` (Vàng hoàng gia Khmer) hoặc `#e67e22` (Cam đất ấm áp).
  * Màu nền (Background): `#ffffff` (Chế độ sáng) và `#121212` (Chế độ tối).
  * Bo góc thành phần (Border Radius): 12px đến 16px (tạo cảm giác bo mềm mại hiện đại).

---

## CHƯƠNG I: CÁC MÀN HÌNH CHÍNH (5 TABS ĐIỀU HƯỚNG DƯỚI CÙNG)

### 1. Màn hình Trang Chủ (Home Screen)
* **Mô tả:** Nơi chào đón người dùng, hiển thị tiêu điểm di sản và các bài viết mới nhất.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Header (Thanh tiêu đề):** 
     * Bên trái: Dòng chữ `"Khmer Heritage"` (Font đậm, màu vàng chủ đạo).
     * Bên phải: Nút Đổi ngôn ngữ (i18n) hiển thị icon quả địa cầu `🌐` hoặc lá cờ và nút chuông Thông báo `🔔`.
  2. **Banner tiêu điểm (Featured Carousel):**
     * Một thẻ hình chữ nhật lớn (tỷ lệ 16:9), bo góc 16px. Có ảnh nền chùa cổ, phủ một lớp gradient đen mờ ở dưới, hiển thị tiêu đề trắng đè lên: *"Chùa Dơi Sóc Trăng - Di tích nghệ thuật cấp quốc gia"*.
  3. **Lưới danh mục nhanh (Categories Grid):**
     * Tiêu đề mục: *"Khám phá danh mục"*.
     * 4 ô tròn xếp ngang hàng chứa Icon và Text bên dưới:
       * 🏛️ *Chùa cổ* | 🎭 *Lễ hội* | 🎵 *Nghệ thuật* | 📜 *Lịch sử*.
  4. **Danh sách bài viết mới (Articles Feed Section):**
     * Tiêu đề mục: *"Bài viết mới nhất"*.
     * 2-3 thẻ bài viết xếp dọc. Mỗi thẻ gồm: Ảnh thu nhỏ (Thumbnail) ở bên trái (1:1 bo góc), bên phải là tiêu đề bài viết, tên tác giả, lượt thích `❤️` và lượt xem `👁️`.
  5. **Đáy màn hình:** Cố định **Bottom Tab Bar**.

---

### 2. Màn hình Danh Sách Di Sản & Bộ Lọc (Heritage Search Screen)
* **Mô tả:** Màn hình tìm kiếm, phân loại và lọc các địa điểm di sản theo tỉnh thành và loại hình.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Header & Thanh tìm kiếm (Search Bar):**
     * Một ô tìm kiếm bo góc 12px chạy ngang màn hình, có icon kính lúp `🔍` và placeholder ghi: *"Tìm kiếm chùa cổ, lễ hội..."*.
  2. **Bộ lọc nhanh (Horizontal Filter Chips):**
     * Một thanh cuộn ngang chứa các nút bấm hình elip (Chips):
       * `[Tất cả]` (được chọn - tô màu vàng) | `[Vật thể]` | `[Phi vật thể]` | `[Sóc Trăng]` | `[Trà Vinh]`.
  3. **Danh sách kết quả (Heritage List Grid):**
     * Hiển thị dạng danh sách lưới 2 cột (2-Column Grid Card).
     * Mỗi Card gồm: 
       * Ảnh chụp di sản (chiếm nửa trên Card).
       * Tên di sản (Chùa Chén Kiểu, Chùa Ông Met...).
       * Nhãn tỉnh thành màu vàng nhỏ (Badge) ở góc: ví dụ `Sóc Trăng` hoặc `Trà Vinh`.
       * Dòng phụ: Số lượt xem `👁️ 1.2k` và lượt yêu thích `❤️ 350`.
  4. **Đáy màn hình:** Cố định **Bottom Tab Bar**.

---

### 3. Màn hình Khám Phá Bài Viết (Explore Screen)
* **Mô tả:** Nơi tập hợp các bài viết nghiên cứu sâu sắc về văn hóa Khmer từ Admin và cộng đồng.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Header:** Tiêu đề lớn `"Khám Phá Văn Hóa"`.
  2. **Thanh phân loại tab (Sub-Tabs navigation):**
     * Thanh ngang chia đôi: `[Bài viết phổ biến]` | `[Đóng góp từ thành viên]`.
  3. **Danh sách bài viết (Vertical Card List):**
     * Các Card bài viết lớn xếp dọc (tỷ lệ 16:9 cho ảnh bìa).
     * Phía trên: Tên tác giả và thời gian đăng bài (ví dụ: *Thạch Thanh - 2 giờ trước*).
     * Ở giữa: Ảnh bìa bài viết lớn, bo góc.
     * Phía dưới: Tiêu đề bài viết đậm, mô tả ngắn tóm tắt bài viết.
     * Thanh tương tác đáy card: Nút Thích `❤️ (likes)`, Bình luận `💬 (comments)` và Chia sẻ `🔗`.
  4. **Nút "Viết bài" nổi (Floating Action Button - FAB):**
     * Một nút tròn màu vàng nổi ở góc dưới bên phải màn hình (ngay trên tab bar), chứa icon cây bút `✏️` hoặc dấu cộng `+` để dẫn sang màn hình gửi bài mới.
  5. **Đáy màn hình:** Cố định **Bottom Tab Bar**.

---

### 4. Màn hình Bản Đồ Tương Tác (Map Screen)
* **Mô tả:** Bản đồ định vị toàn bộ các địa danh di sản để người dùng dễ dàng lên lịch trình tham quan.
* **Bố cục khung:**
  1. **Khung bản đồ nền (Map View Background):** 
     * Chiếm 100% diện tích màn hình. Vẽ các nét mô phỏng đường sá, sông ngòi (dùng map màu tối/sáng của Leaflet/Google Maps).
  2. **Các điểm ghim (Markers):**
     * Vẽ các chấm tròn màu vàng có viền trắng ghim rải rác trên bản đồ đại diện cho các ngôi chùa, lễ hội.
  3. **Thanh tìm kiếm đè lên bản đồ (Floating Search Bar):**
     * Ô tìm kiếm bo góc nằm nổi ở sát mép trên màn hình.
  4. **Thẻ thông tin nổi (Floating Info Card Popup):**
     * Nằm đè lên bản đồ ở sát mép dưới (ngay trên Tab Bar). Thẻ này xuất hiện khi người dùng click vào một Marker bất kỳ:
       * Gồm ảnh chụp nhỏ bên trái, tên chùa ở bên phải, nút bấm `[Xem chi tiết]` màu vàng để mở trang di sản.
  5. **Đáy màn hình:** Cố định **Bottom Tab Bar**.

---

### 5. Màn hình Hồ Sơ Cá Nhân (Profile Screen)
* **Mô tả:** Thông tin cá nhân, các bài viết đã gửi, danh sách yêu thích và cài đặt ứng dụng.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Thông tin cá nhân (User Header Info):**
     * Ảnh đại diện hình tròn lớn nằm giữa.
     * Dưới ảnh là tên người dùng (*Thạch Sô Phê*) và email đăng ký.
     * Nhãn vai trò (Role Badge): Hiển thị chữ `Thành viên` hoặc `Quản trị viên` (tô màu cam nổi bật).
  2. **Nhóm menu chức năng (Vertical Menu List):**
     * Danh sách các hàng ngang chứa Icon ở đầu và mũi tên `>` ở cuối:
       * 📁 *Bài viết của tôi* (My Articles)
       * ❤️ *Di sản đã yêu thích* (Favorites)
       * 🕒 *Lịch sử địa điểm đã xem* (History)
       * ⚙️ *Thiết lập hiển thị & Ngôn ngữ* (Settings)
       * ℹ️ *Giới thiệu Khmer Heritage* (About)
  3. **Nút Đăng xuất (Logout Button):**
     * Nút bấm màu đỏ nhạt nằm ở cuối menu: `🚪 Đăng xuất`.
  4. **Đáy màn hình:** Cố định **Bottom Tab Bar**.

---

## CHƯƠNG II: CÁC MÀN HÌNH CHI TIẾT & TƯƠNG TÁC

### 6. Màn hình Chi Tiết Di Sản (Heritage Detail Screen)
* **Mô tả:** Hiển thị toàn bộ thông tin lịch sử, ảnh chi tiết, tọa độ và bình luận của một địa danh di sản.
* **Bố cục khung (Cuộn dọc toàn trang):**
  1. **Ảnh bìa lớn ở trên cùng (Hero Image):** Ảnh tỷ lệ lớn, có nút mũi tên quay lại `<` nổi ở góc trái trên và nút tim `❤️` yêu thích ở góc phải trên.
  2. **Tiêu đề di sản:** Tên di sản cỡ chữ lớn (ví dụ: **CHÙA SOM RÔNG**), nhãn danh mục (Chùa cổ) và tỉnh thành (Sóc Trăng).
  3. **Bảng thông số nhanh (Info Table):** 
     * Gồm các ô chia cột: 📅 *Năm xây dựng: 1785* | 👁️ *Lượt xem: 2,400* | ❤️ *Lượt thích: 890*.
  4. **Khối tóm tắt nhanh (Highlights):** Các dòng gạch đầu dòng ngắn gọn về đặc điểm nổi bật nhất của di sản.
  5. **Nội dung lịch sử & Kiến trúc (Description Body):** Dòng văn bản dài giới thiệu chi tiết về di sản cổ kính.
  6. **Bộ sưu tập ảnh (Gallery Grid):** Lưới các ảnh nhỏ chụp chi tiết các góc của di sản để người dùng xem thêm.
  7. **Vị trí bản đồ nhỏ (Mini Map Preview):** Một ô bản đồ nhỏ hình chữ nhật hiển thị tọa độ của di sản kèm nút `[Định vị trên bản đồ]`.
  8. **Mục bình luận (Comments Section):** 
     * Ô nhập bình luận bo góc có nút `[Gửi]`.
     * Danh sách các bình luận cũ xếp dọc (ảnh đại diện tròn, tên, nội dung bình luận và thời gian tương đối).

---

### 7. Màn hình Chi Tiết Bài Viết & Bình Luận (Article Detail Screen)
* **Mô tả:** Xem nội dung bài viết văn hóa chi tiết, hỗ trợ bình luận thảo luận.
* **Bố cục tương tự màn hình Chi Tiết Di Sản nhưng có các điểm khác:**
  * **Header tác giả:** Hiển thị avatar tròn, tên tác giả bài viết và thời gian xuất bản ở ngay dưới tiêu đề bài viết.
  * **Thanh tương tác nổi ở đáy (Sticky Action Bar):** Nằm cố định ở đáy màn hình (không bị Tab Bar đè lên), gồm nút Thích bài viết, số lượng bình luận và nút Chia sẻ nhanh.

---

### 8. Màn hình Gửi Bài Viết Đóng Góp Mới (Create Article Screen)
* **Mô tả:** Màn hình cho phép thành viên soạn thảo nội dung và tải ảnh để gửi bài kiểm duyệt.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Header:** Nút hủy quay lại `X` bên trái, tiêu đề ở giữa `"Đóng góp bài viết mới"`, nút gửi bài `[Gửi]` màu vàng nổi bật ở bên phải.
  2. **Ô chọn ảnh bìa (Image Uploader Card):** 
     * Một khung chữ nhật nét đứt màu xám bo góc, ở giữa có icon máy ảnh `📷` và dòng chữ *"Chọn ảnh bìa bài viết"*. Khi đã chọn ảnh, hiển thị preview ảnh đó tại đây.
  3. **Nhập tiêu đề (Title Input):** Ô nhập văn bản 1 dòng, placeholder ghi: *"Nhập tiêu đề bài viết của bạn..."*.
  4. **Chọn danh mục (Dropdown Selector):** Ô bấm để mở danh mục bài viết (Lịch sử, Lễ hội, Ẩm thực...).
  5. **Nhập tóm tắt (Summary Input):** Ô nhập văn bản nhiều dòng ngắn, placeholder ghi: *"Mô tả ngắn gọn nội dung bài viết..."*.
  6. **Soạn nội dung chi tiết (Rich Content Textarea):** Ô nhập văn bản lớn chiếm phần còn lại của màn hình để người dùng gõ nội dung chi tiết.

---

### 9. Màn hình Đăng Nhập / Đăng Ký (Auth Screen)
* **Mô tả:** Màn hình xác thực tài khoản để kích hoạt các tính năng tương tác.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Logo & Tiêu đề:**
     * Logo của ứng dụng Khmer Heritage nằm ở giữa trên cùng.
     * Dòng chữ chào mừng: *"Khám phá Di sản Khmer"*.
  2. **Thanh chuyển đổi tab đăng nhập/đăng ký:** 
     * `[Đăng Nhập]` (được chọn) | `[Đăng Ký]`.
  3. **Các ô nhập thông tin (Inputs):**
     * Ô nhập Email (có icon email `✉️` ở đầu).
     * Ô nhập Mật khẩu (có icon ổ khóa `🔒` ở đầu và icon con mắt ẩn/hiện mật khẩu ở cuối).
     * *(Nếu chọn tab Đăng ký: Có thêm ô nhập Tên hiển thị).*
  4. **Nút quên mật khẩu:** Dòng chữ nhỏ nghiêng lệch phải *"Quên mật khẩu?"*.
  5. **Nút xác thực chính:** Một nút bấm lớn bo góc tô màu vàng nổi bật chạy ngang: `ĐĂNG NHẬP`.
  6. **Đăng nhập nhanh (Social Login Options):**
     * Dòng chữ ngăn cách: *"Hoặc đăng nhập bằng"*.
     * Nút đăng nhập Google lớn hình chữ nhật bo góc viền xám, có logo Google ở giữa.

---

## CHƯƠNG III: PHÂN HỆ DÀNH CHO QUẢN TRỊ VIÊN (ADMIN DASHBOARD)

### 10. Màn hình Dashboard & Duyệt bài (Admin Dashboard)
* **Mô tả:** Màn hình chính của Admin chứa các số liệu thống kê tổng quát và danh sách bài viết chờ duyệt.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Header:** Tiêu đề `"Hệ Thống Quản Trị"`, nút đăng xuất an toàn.
  2. **Các thẻ số liệu thống kê nhanh (Dashboard Cards):**
     * 3 thẻ hình chữ nhật bo góc đặt cạnh nhau (hoặc xếp lưới):
       * 🏛️ *Di sản: 45 địa điểm* | 👁️ *Lượt xem: 25.4k* | 📝 *Bài viết chờ duyệt: 8 bài*.
  3. **Danh sách hàng chờ kiểm duyệt (Pending Articles Queue):**
     * Tiêu đề: *"Yêu cầu duyệt bài viết mới"*.
     * Danh sách các hàng ngang xếp dọc. Mỗi hàng gồm: Tên bài viết đóng góp, tên tác giả, ngày gửi.
     * Đặc biệt: Có 2 nút bấm nhỏ đặt cạnh nhau ở cuối mỗi hàng để thao tác nhanh:
       * Nút **`[Duyệt]`** (Màu xanh lá)
       * Nút **`[Từ chối]`** (Màu đỏ)
  4. **Hộp thoại Từ chối (Modal Reject Reason Popup):**
     * Xuất hiện đè lên màn hình khi Admin click nút `[Từ chối]`:
       * Gồm ô nhập văn bản nhiều dòng để Admin ghi *"Lý do từ chối bài viết"* và 2 nút bấm: `[Xác nhận]` (Đỏ) và `[Hủy]` (Xám).

---

### 11. Màn hình Quản Lý Di Sản (Manage Heritages)
* **Mô tả:** Màn hình CRUD (Thêm/Sửa/Xóa) danh sách di sản văn hóa của hệ thống.
* **Bố cục khung (Từ trên xuống dưới):**
  1. **Header:** Tiêu đề `"Quản Lý Di Sản"`, nút thêm mới dấu cộng `+` ở góc trên bên phải.
  2. **Thanh tìm kiếm nhanh di sản:** Ô tìm kiếm để Admin lọc nhanh địa điểm cần sửa hoặc xóa.
  3. **Danh sách di sản quản lý:**
     * Danh sách các hàng dọc, mỗi hàng gồm: ảnh thu nhỏ di sản bên trái, tên di sản ở giữa, bên phải gồm 2 icon hành động:
       * Icon hình cái bút `✏️` (Sửa di sản)
       * Icon hình thùng rác `🗑️` (Xóa di sản)
  4. **Form Thêm/Sửa Di Sản (Modal/Sub-screen Form):**
     * Gồm toàn bộ các ô nhập dữ liệu: Tên di sản, mô tả phụ, vị trí kinh độ (lat) / vĩ độ (lng), chọn ảnh bìa và tải ảnh chi tiết (nối trực tiếp với API Cloudinary), nút `[Lưu dữ liệu]` ở dưới cùng.
