# TÀI LIỆU MÔ TẢ VÀ THIẾT KẾ CÁC SƠ ĐỒ NGHIỆP VỤ: KHMER HERITAGE APP (BẢN TIẾNG VIỆT)

Tài liệu này mô tả chi tiết cấu trúc, mục đích, thành phần tham gia và luồng nghiệp vụ của toàn bộ các sơ đồ phân tích thiết kế hệ thống cho ứng dụng **Khmer Heritage App** bằng ngôn ngữ Tiếng Việt trực quan, dễ hiểu.

Các sơ đồ dưới đây hoàn toàn phù hợp và đủ tiêu chuẩn học thuật cho báo cáo khóa luận/đồ án của bạn. Bên cạnh 7 sơ đồ bạn đã đề xuất, tài liệu này bổ sung thêm **1 sơ đồ hoạt động (Activity Diagram) của Luồng gửi và duyệt bài viết** (đây là tính năng cốt lõi thể hiện tính hai chiều tương tác giữa người dùng và admin trong hệ thống của bạn).

Mỗi sơ đồ đi kèm với **mã nguồn Mermaid.js bản tiếng Việt**. Bạn chỉ cần sao chép mã nguồn Mermaid này và dán vào [Mermaid Live Editor (https://mermaid.live)](https://mermaid.live) hoặc các phần mềm hỗ trợ Markdown (như VS Code, GitHub) để xuất ra file ảnh chất lượng cao (PNG, SVG, PDF) chèn vào tài liệu Word của báo cáo.

---

## MỤC LỤC
1. [Sơ đồ Use Case tổng quát hệ thống phân quyền (3.1.1)](#1-sơ-đồ-use-case-tổng-quát-hệ-thống-phân-quyền-311)
2. [Sơ đồ Use Case chi tiết phân hệ Quản trị viên (3.1.2)](#2-sơ-đồ-use-case-chi-tiết-phân-hệ-quản-trị-viên-312)
3. [Sơ đồ quy trình nghiệp vụ dịch thuật đa ngôn ngữ i18n (3.1.3)](#3-sơ-đồ-quy-trình-nghiệp-vụ-dịch-thuật-đa-ngôn-ngữ-i18n-313)
4. [Sơ đồ tuần tự xử lý luồng bảo mật trang quản trị (3.2.1)](#4-sơ-đồ-tuần-tự-xử-lý-luồng-bảo-mật-trang-quản-trị-321)
5. [Sơ đồ tuần tự kết xuất bản đồ và dịch chuyển tọa độ Grid Offset (3.2.2)](#5-sơ-đồ-tuần-tự-kết-xuất-bản-đồ-và-dịch-chuyển-tọa-độ-grid-offset-322)
6. [Sơ đồ ánh xạ liên kết cơ sở dữ liệu NoSQL Firestore Schema (3.3.1)](#6-sơ-đồ-ánh-xạ-liên-kết-cơ-sở-dữ-liệu-nosql-firestore-schema-331)
7. [Sơ đồ cấu trúc cây điều hướng tệp tin File-Based Routing (3.3.2)](#7-sơ-đồ-cấu-trúc-cây-điều-hướng-tệp-tin-file-based-routing-332)
8. [Sơ đồ hoạt động (Activity) Luồng gửi và duyệt bài viết mới (Bổ sung thêm)](#8-sơ-đồ-hoạt-động-activity-luồng-gửi-và-duyệt-bài-viết-mới-bổ-sung-thêm)
9. [Sơ đồ kiến trúc tổng thể hệ thống (Bổ sung thêm)](#9-sơ-đồ-kiến-trúc-tổng-thể-hệ-thống-bổ-sung-thêm)

---

## 1. Sơ đồ Use Case tổng quát hệ thống phân quyền (3.1.1)

*   **Mục đích:** Khái quát hóa ranh giới tương tác hệ thống giữa hai nhóm tác nhân chính: Người dùng thường (Khách vãng lai, người dùng đã đăng nhập) và Quản trị viên cấp cao (Admin).
*   **Tác nhân (Actors):**
    *   **NguoiDung (Người dùng/Khách):** Học sinh, sinh viên, khách du lịch, người muốn tìm hiểu văn hóa.
    *   **QuanTriVien (Quản trị viên):** Ban quản lý nội dung di sản, biên tập viên văn hóa.
*   **Ca sử dụng chính (Use Cases):**
    *   Xem & Tìm kiếm di sản văn hóa.
    *   Xem bài viết nghiên cứu văn hóa.
    *   Xem bản đồ định vị địa lý.
    *   Bình luận đóng góp ý kiến (yêu cầu đăng nhập).
    *   Yêu thích bài viết/di sản (yêu cầu đăng nhập).
    *   Chuyển đổi ngôn ngữ giao diện (Việt, Khmer, Anh).
    *   Đăng ký / Đăng nhập tài khoản.
    *   Quản lý thông tin di sản (Chỉ Admin).
    *   Kiểm duyệt bài đóng góp của thành viên (Chỉ Admin).
    *   Theo dõi thống kê hệ thống (Chỉ Admin).

### Mã nguồn Mermaid:
```mermaid
graph LR
    NguoiDung["Người dùng / Khách"]
    QuanTriVien["Quản trị viên (Admin)"]

    subgraph Các ca sử dụng chung
        UC1((Xem di sản))
        UC2((Đọc bài viết))
        UC3((Xem bản đồ tương tác))
        UC4((Đổi ngôn ngữ i18n))
        UC5((Đăng nhập / Đăng ký))
    end

    subgraph Các ca sử dụng tương tác
        UC6((Gửi bình luận))
        UC7((Yêu thích bài viết))
        UC8((Gửi bài viết mới))
    end

    subgraph Các ca sử dụng quản trị
        UC9((Thêm/Sửa/Xóa di sản))
        UC10((Duyệt/Từ chối bài viết))
        UC11((Thống kê Dashboard))
    end

    %% Mối liên kết tác nhân người dùng
    NguoiDung --- UC1
    NguoiDung --- UC2
    NguoiDung --- UC3
    NguoiDung --- UC4
    NguoiDung --- UC5
    NguoiDung --- UC6
    NguoiDung --- UC7
    NguoiDung --- UC8

    %% Mối liên kết tác nhân quản trị
    QuanTriVien --- UC1
    QuanTriVien --- UC2
    QuanTriVien --- UC3
    QuanTriVien --- UC9
    QuanTriVien --- UC10
    QuanTriVien --- UC11

    classDef actor fill:#f9f,stroke:#333,stroke-width:2px;
    class NguoiDung,QuanTriVien actor;
```

---

## 2. Sơ đồ Use Case chi tiết phân hệ Quản trị viên (3.1.2)

*   **Mục đích:** Đặc tả các chức năng quản lý nội dung của Admin cùng mối quan hệ phụ thuộc (`<<include>>`), mở rộng (`<<extend>>`).
*   **Chi tiết nghiệp vụ:**
    *   Để thực hiện các tác vụ tạo mới di sản, phê duyệt bài viết, hoặc xem thống kê lượt xem, hệ thống yêu cầu Admin bắt buộc phải đi qua tiến trình Xác thực đăng nhập (`<<include>>`).
    *   Khi phê duyệt bài viết, Admin có thể lựa chọn từ chối kèm theo việc nhập lý do từ chối cụ thể (`<<extend>>`).

### Mã nguồn Mermaid:
```mermaid
graph TD
    QuanTriVien[Quản trị viên]
    UC_Auth((Xác thực Đăng nhập))

    subgraph Quản lý nội dung di sản
        UC_C_H((Thêm di sản))
        UC_U_H((Sửa di sản))
        UC_D_H((Xóa di sản))
        UC_Upload((Tải ảnh lên Cloudinary))
    end

    subgraph Quản lý bài viết & Thống kê
        UC_Dashboard((Xem thống kê lượt xem))
        UC_Approve((Phê duyệt bài viết))
        UC_Reject((Từ chối bài viết))
        UC_Reason((Nhập lý do từ chối))
    end

    QuanTriVien --> UC_C_H
    QuanTriVien --> UC_U_H
    QuanTriVien --> UC_D_H
    QuanTriVien --> UC_Approve
    QuanTriVien --> UC_Dashboard

    %% Mối quan hệ phụ thuộc (include)
    UC_C_H -.->|yêu cầu| UC_Auth
    UC_U_H -.->|yêu cầu| UC_Auth
    UC_D_H -.->|yêu cầu| UC_Auth
    UC_Approve -.->|yêu cầu| UC_Auth
    UC_Dashboard -.->|yêu cầu| UC_Auth

    UC_C_H -.->|yêu cầu| UC_Upload
    UC_U_H -.->|yêu cầu| UC_Upload

    %% Mối quan hệ mở rộng (extend)
    UC_Reject -.->|mở rộng| UC_Approve
    UC_Reason -.->|yêu cầu| UC_Reject

    style UC_Auth fill:#f96,stroke:#333,stroke-width:2px;
```

---

## 3. Sơ đồ quy trình nghiệp vụ dịch thuật đa ngôn ngữ i18n (3.1.3)

*   **Mục đích:** Trực quan hóa tiến trình lưu trữ và dịch thuật tự động (i18n) ngay khi ứng dụng khởi chạy và khi người dùng thực hiện chuyển đổi ngôn ngữ.
*   **Các bước xử lý:**
    1.  Đọc bộ nhớ cục bộ để kiểm tra khóa `@khmer_heritage_language`.
    2.  Gán ngôn ngữ ưa thích cũ hoặc mặc định là Tiếng Việt (`vi`).
    3.  Tải từ điển tương ứng và render ra UI.
    4.  Khi người dùng đổi ngôn ngữ, cập nhật trạng thái runtime và ghi đè xuống bộ nhớ thiết bị.

### Mã nguồn Mermaid:
```mermaid
flowchart TD
    BatDau([Khởi chạy ứng dụng]) --> DocBoNho[Đọc bộ nhớ cục bộ STORAGE_KEY]
    DocBoNho --> KiemTraNgonNgu{Có ngôn ngữ lưu cũ?}
    
    KiemTraNgonNgu -- Có --> GanNgonNguCu[Gán language = savedLang]
    KiemTraNgonNgu -- Không --> GanMacDinh[Gán language = 'vi']
    
    GanNgonNguCu --> NapTuDien[Tải từ điển translations[language]]
    GanMacDinh --> NapTuDien
    
    NapTuDien --> HienThiGiaoDien[Kết xuất giao diện qua hàm t]
    
    HienThiGiaoDien --> ChoNguoiDung{Người dùng đổi ngôn ngữ?}
    
    ChoNguoiDung -- Chọn ngôn ngữ mới --> LuuBoNho[Ghi đè ngôn ngữ mới xuống bộ nhớ máy]
    LuuBoNho --> CapNhatRuntime[Cập nhật trạng thái language runtime]
    CapNhatRuntime --> NapTuDien
    
    ChoNguoiDung -- Không đổi --> KetThuc([Duy trì ứng dụng])
```

---

## 4. Sơ đồ tuần tự xử lý luồng bảo mật trang quản trị (3.2.1)

*   **Mục đích:** Minh chứng kiến trúc bảo vệ an ninh định tuyến Client-side thông qua hook `useRequireAdmin()` kết hợp dữ liệu lưu trữ từ Firestore.
*   **Các thành phần (Participants):**
    *   **Người dùng:** Người thực hiện thao tác nhấp vào mục quản trị.
    *   **Bộ định tuyến Router:** Trình định hướng Expo Router.
    *   **Bộ kiểm tra `useRequireAdmin()`:** Bộ lọc bảo vệ luồng route.
    *   **Bộ quản lý AuthProvider:** Nơi quản lý phiên làm việc hiện tại của tài khoản.
    *   **Cơ sở dữ liệu Firestore:** Nơi lưu giữ thuộc tính vai trò `role` bảo mật.

### Mã nguồn Mermaid:
```mermaid
sequenceDiagram
    actor U as Người dùng (Quản trị/Thành viên)
    participant R as Bộ định tuyến Router (/admin)
    participant H as Bộ kiểm tra useRequireAdmin()
    participant C as Bộ quản lý AuthProvider
    participant F as Cơ sở dữ liệu Firestore

    U->>R: Nhấn truy cập vùng Quản trị
    R->>H: Kích hoạt lớp kiểm tra an toàn
    H->>C: Yêu cầu lấy thông tin hồ sơ
    
    alt Phiên đăng nhập đang tải (loading = true)
        C-->>H: Trả về trạng thái đang tải
        H-->>R: Hiển thị vòng xoay đang tải (ActivityIndicator)
    else Chưa đăng nhập (firebaseUser = null)
        C-->>H: Trả về trạng thái chưa đăng nhập
        H->>R: Chuyển hướng trang đăng nhập (/auth)
        R-->>U: Hiển thị màn hình Đăng nhập
    else Đã đăng nhập
        C->>F: Truy vấn hồ sơ người dùng theo UID
        F-->>C: Trả về tài liệu { role: 'user' | 'admin' }
        
        alt Quyền = Quản trị viên ('admin')
            C-->>H: Xác nhận có quyền quản trị
            H-->>R: Cho phép hiển thị trang quản trị
            R-->>U: Hiển thị bảng điều khiển Admin Dashboard
        else Quyền = Thành viên thường ('user')
            C-->>H: Cảnh báo quyền không hợp lệ
            H->>R: Chuyển hướng về trang chủ ('/')
            R-->>U: Đẩy người dùng về giao diện Trang chủ
        end
    end
```

---

## 5. Sơ đồ tuần tự kết xuất bản đồ và dịch chuyển tọa độ Grid Offset (3.2.2)

*   **Mục đích:** Mô tả chi tiết quy trình hiển thị bản đồ tương tác và cách thức vận hành của giải thuật bù đắp dịch chuyển tọa độ `getHeritageCoordinates()` tránh đè lấp Marker.
*   **Các thành phần (Participants):**
    *   **Màn hình Bản đồ:** Màn hình bản đồ giao diện chính.
    *   **Lớp dữ liệu Di sản:** Tầng truy xuất dữ liệu di sản (HeritageRepository).
    *   **Bộ tính tọa độ Grid Offset:** File thuật toán tính toán tọa độ dịch lệch (CoordinatesHelper).
    *   **Thành phần Bản đồ:** Thành phần kết xuất bản đồ (Leaflet trên Web hoặc Google Maps trên Native).

### Mã nguồn Mermaid:
```mermaid
sequenceDiagram
    participant S as Màn hình Bản đồ
    participant R as Lớp quản lý Di sản
    participant H as Bộ tính tọa độ Grid Offset
    participant M as Thành phần Bản đồ (Web/Native)

    S->>R: Yêu cầu danh sách địa danh di sản
    R-->>S: Trả về danh sách di sản (HeritageDocument[])
    
    loop Lặp qua từng di sản (heritage, index)
        S->>H: Yêu cầu tính toán tọa độ hiển thị
        
        alt Di sản có sẵn tọa độ kinh/vĩ độ
            H-->>S: Trả về tọa độ gốc
        else Chưa có tọa độ (dùng tọa độ trung tâm tỉnh)
            H->>H: Tính toán bù lệch lưới Grid Offset:<br/>row = index % 3 - 1<br/>col = floor(index/3) % 3 - 1
            H->>H: Tính tọa độ dịch lệch tương đối:<br/>lat = Tỉnh.lat + (row * 0.012)<br/>lng = Tỉnh.lng + (col * 0.012)
            H-->>S: Trả về tọa độ dịch lệch
        end
    end
    
    S->>M: Truyền danh sách tọa độ dịch lệch hiển thị
    
    alt Môi trường chạy: Trình duyệt Web
        M->>M: Nạp bản đồ Leaflet vào iframe (srcDoc)
        M->>M: Vẽ các điểm ghim tròn viền vàng
        M-->>S: Hiển thị bản đồ Leaflet Web
    else Môi trường chạy: Thiết bị di động
        M->>M: Khởi tạo bản đồ di động native maps
        M->>M: Áp dụng giao diện bản đồ tối (Dark Mode)
        M-->>S: Hiển thị bản đồ Google Maps / Apple Maps
    end
```

---

## 6. Sơ đồ ánh xạ liên kết cơ sở dữ liệu NoSQL Firestore Schema (3.3.1)

*   **Mục đích:** Trực quan hóa cấu trúc sơ đồ dữ liệu phi quan hệ (NoSQL) hướng tài liệu của dự án. Thay thế sơ đồ thực thể liên kết ERD truyền thống của SQL.
*   **Chú ý:** Các tên thực thể lớp và trường dữ liệu bắt buộc phải giữ nguyên như trong code để phục vụ việc kiểm duyệt mã nguồn, tuy nhiên các kiểu dữ liệu và mối quan hệ liên kết đã được mô tả chi tiết bằng Tiếng Việt.

### Mã nguồn Mermaid:
```mermaid
classDiagram
    class NguoiDung_users {
        +Chuỗi id (Firebase UID)
        +Chuỗi displayName
        +Chuỗi email
        +Chuỗi photoURL
        +Chuỗi role (user / admin)
        +Mảng favorites (Danh sách ID di sản thích)
    }

    class DiSan_heritages {
        +Chuỗi id (Auto ID)
        +Chuỗi title
        +Chuỗi subtitle
        +Chuỗi province
        +Chuỗi category
        +Chuỗi type (tangible / intangible)
        +Chuỗi summary
        +Chuỗi description
        +Chuỗi body (Lịch sử)
        +Chuỗi coverImage
        +Mảng gallery
        +Bảnđồ location (lat, lng)
        +Số views
        +Số likes
        +Chuỗi/Số builtYear
        +Mảng highlights
    }

    class BaiViet_articles {
        +Chuỗi id (Auto ID)
        +Chuỗi title
        +Chuỗi category
        +Chuỗi summary
        +Chuỗi content
        +Chuỗi author
        +Chuỗi coverImage
        +Boolean published
        +Chuỗi status (pending / published / rejected)
        +Chuỗi authorId (Liên kết users.id)
        +Chuỗi rejectReason
        +Số views
        +Số likes
        +Chuỗi createdAt
    }

    class BinhLuan_comments {
        +Chuỗi id (Auto ID)
        +Chuỗi articleId (Liên kết heritages.id hoặc articles.id)
        +Chuỗi userId (Liên kết users.id)
        +Chuỗi authorName
        +Chuỗi text
        +Chuỗi createdAt
    }

    class DanhMuc_categories {
        +Chuỗi name
        +Chuỗi slug
        +Chuỗi icon
    }

    %% Thiết lập quan hệ logic tiếng Việt
    NguoiDung_users "1" --> "nhiều" BinhLuan_comments : "Gửi bình luận"
    DiSan_heritages "1" --> "nhiều" BinhLuan_comments : "Có bình luận"
    BaiViet_articles "1" --> "nhiều" BinhLuan_comments : "Có bình luận"
    NguoiDung_users "1" --> "nhiều" BaiViet_articles : "Đóng góp bài viết"
    DiSan_heritages "nhiều" <-- "favorites" NguoiDung_users : "Được yêu thích"
```

---

## 7. Sơ đồ cấu trúc cây điều hướng tệp tin File-Based Routing (3.3.2)

*   **Mục đích:** Mô tả cơ chế tổ chức định tuyến (Routing) tự động của Expo Router thông qua sơ đồ cây phân nhánh các thư mục tệp tin trong thư mục `/app`.

### Mã nguồn Mermaid:
```mermaid
graph TD
    App["Thư mục app/ (Bộ định tuyến gốc)"] --> Layout["Tệp _layout.tsx (Cấu hình hệ thống & Khởi tạo Context)"]
    App --> Auth["Tệp auth.tsx (Đăng nhập / Đăng ký)"]
    
    App --> Tabs["Thư mục (tabs)/ (Thanh điều hướng dưới cùng)"]
    Tabs --> TLayout["Tệp _layout.tsx (Cấu hình 5 màn hình chính)"]
    Tabs --> THome["Tệp index.tsx (Trang chủ chính)"]
    Tabs --> THeritage["Tệp heritage.tsx (Danh sách di sản & Bộ lọc)"]
    Tabs --> TExplore["Tệp explore.tsx (Khám phá bài viết văn hóa)"]
    Tabs --> TMap["Tệp map.tsx (Bản đồ tương tác di sản)"]
    Tabs --> TProfile["Tệp profile.tsx (Hồ sơ người dùng)"]

    App --> DetailHeritage["Thư mục heritage/[id].tsx (Xem chi tiết Di sản)"]
    App --> DetailArticle["Thư mục articles/[id].tsx (Xem chi tiết Bài viết)"]
    App --> NewArticle["Tệp articles/new.tsx (Gửi bài đóng góp mới)"]

    App --> Admin["Thư mục admin/ (Phân vùng dành cho Admin)"]
    Admin --> ALayout["Tệp _layout.tsx (Kiểm soát quyền truy cập Admin)"]
    Admin --> AIndex["Tệp index.tsx (Bảng điều khiển & Phê duyệt bài)"]
    Admin --> AHeritage["Tệp heritages.tsx (Thêm/Sửa/Xóa di sản)"]
    Admin --> AArticle["Tệp articles.tsx (Xem/Sửa/Xóa bài viết)"]

    App --> ProfileSub["Thư mục profile/ (Các trang thiết lập cá nhân)"]
    ProfileSub --> PSetting["Tệp settings.tsx (Cài đặt hiển thị & giao diện)"]
    ProfileSub --> PFavorite["Tệp favorites.tsx (Danh sách đã yêu thích)"]
    ProfileSub --> PHistory["Tệp history.tsx (Lịch sử địa điểm đã xem)"]

    style Tabs fill:#d4af37,stroke:#333,stroke-width:2px;
    style Admin fill:#e74c3c,stroke:#333,stroke-width:2px;
```

---

## 8. Sơ đồ hoạt động (Activity) Luồng gửi và duyệt bài viết mới (Bổ dung thêm)

*   **Mục đích:** Bổ sung nghiệp vụ cốt lõi chứng minh tính tương tác 2 chiều và quy trình vận hành kiểm duyệt bài đóng góp của thành viên gửi lên ứng dụng.

### Mã nguồn Mermaid:
```mermaid
flowchart TD
    subgraph Thành viên đóng góp bài viết
        Start([Thành viên soạn bài viết]) --> PickImage[Chọn ảnh từ thư viện thiết bị]
        PickImage --> UploadImg[Tải ảnh lên Cloudinary lấy URL]
        UploadImg --> Submit[Gửi yêu cầu đóng góp bài viết]
        Submit --> SavePending[Lưu Firestore với trạng thái Chờ duyệt]
    end

    subgraph Hệ thống & Ban quản trị kiểm duyệt
        SavePending --> NotifyAdmin[Hiển thị ở mục chờ duyệt trên Admin Dashboard]
        NotifyAdmin --> AdminDecision{Quyết định của Admin?}
        
        AdminDecision -- Đồng ý (Duyệt) --> Approve[Duyệt bài viết]
        Approve --> SetPublished[Cập nhật trạng thái Đã xuất bản lên Firestore]
        SetPublished --> ShowPublic([Bài viết hiển thị công khai trên ứng dụng])
        
        AdminDecision -- Từ chối --> Reject[Từ chối bài viết]
        Reject --> InputReason[Nhập lý do từ chối gửi về tác giả]
        InputReason --> SetRejected[Cập nhật trạng thái Bị từ chối lên Firestore]
        SetRejected --> UserDashboard([Người gửi xem lý do từ chối ở Hồ sơ cá nhân])
    end

    style SavePending fill:#f1c40f,stroke:#333,stroke-width:1px;
    style SetPublished fill:#2ecc71,stroke:#333,stroke-width:2px;
    style SetRejected fill:#e74c3c,stroke:#333,stroke-width:2px;
```

---

## 9. Sơ đồ kiến trúc tổng thể hệ thống (Bổ sung thêm)

*   **Mục đích:** Khái quát hóa toàn bộ kiến trúc đa tầng (Multilayered Architecture) của hệ thống phần mềm, phân định ranh giới rõ rệt giữa mã nguồn ứng dụng chạy tại thiết bị khách (Client-side) và các tài nguyên, dịch vụ điện toán đám mây vận hành ở phía máy chủ (Cloud Backend-side).
*   **Các tầng kiến trúc cốt lõi (Client-side):**
    *   **Tầng giao diện (UI Layer):** Xây dựng bằng React Native kết hợp biên dịch NativeWind (TailwindCSS) sang StyleSheet gốc giúp tối ưu hóa phần cứng hiển thị.
    *   **Tầng quản lý trạng thái (State Layer):** Các bộ Context API runtime (Ngôn ngữ, Giao diện tối/sáng, Trạng thái tài khoản người dùng) hoạt động như một lớp phản chiếu dữ liệu toàn cục.
    *   **Tầng trừu tượng dữ liệu (Repository Pattern / DAL):** Lớp giao tiếp trung gian cách ly UI khỏi các truy vấn thô, tích hợp bộ lưu trữ đệm cục bộ (`AsyncStorage`/`localStorage`) để hỗ trợ chạy offline.
*   **Kiến trúc Backend & Dịch vụ Đám mây (Cloud Services):**
    *   **Firebase Authentication:** Quản lý tài khoản, mã hóa bảo mật phiên đăng nhập.
    *   **Cloud Firestore:** Lưu trữ cơ sở dữ liệu NoSQL phân tán dưới dạng tài liệu (Documents).
    *   **Cloudinary Image Server:** Lưu trữ hình ảnh và tự động nén, thay đổi kích thước bằng CDN.

### Sơ đồ kiến trúc Mermaid:
```mermaid
graph TD
    subgraph Client [THIẾT BỊ KHÁCH - CLIENT SIDE EXPO]
        direction TB
        subgraph GiaoDien [1. TẦNG GIAO DIỆN - UI LAYER]
            Screens["Màn hình /app/<br/>(Trang chủ, Bản đồ, Quản trị...)"]
            Components["Thành phần components/ui/<br/>(Nút bấm, Card, Badge...)"]
            Style["Định dạng TailwindCSS<br/>(NativeWind v4 Compiler)"]
            
            Screens --> Components
            Components --> Style
        end

        subgraph BoQuanLy [2. TẦNG TRẠNG THÁI - STATE LAYER]
            AuthSession["Bộ quản lý tài khoản<br/>(AuthProvider Context)"]
            LangContext["Bộ dịch ngôn ngữ<br/>(LanguageProvider Context)"]
            ThemeContext["Bộ quản lý giao diện<br/>(ColorSchemeProvider Context)"]
        end

        subgraph DataRepository [3. TẦNG DỮ LIỆU - REPOSITORY LAYER]
            HeritageRepo["Quản lý Di sản<br/>(HeritageRepository)"]
            ArticleRepo["Quản lý Bài viết<br/>(ArticleRepository)"]
            CommentRepo["Quản lý Bình luận<br/>(CommentRepository)"]
            UserRepo["Quản lý Người dùng<br/>(UserRepository)"]
            Cache["Lưu trữ cục bộ máy<br/>(AsyncStorage / localStorage)"]
            
            HeritageRepo -.-> Cache
            ArticleRepo -.-> Cache
            CommentRepo -.-> Cache
        end
        
        GiaoDien --> BoQuanLy
        BoQuanLy --> DataRepository
    end

    subgraph MayChu [DỊCH VỤ ĐÁM MÂY - CLOUD BACKEND SIDE]
        direction LR
        FirebaseAuth["Xác thực tài khoản<br/>(Firebase Auth)"]
        Firestore["Cơ sở dữ liệu NoSQL<br/>(Cloud Firestore)"]
        Cloudinary["Máy chủ phân phối ảnh<br/>(Cloudinary CDN)"]
    end

    %% Giao tiếp Client - Server
    AuthSession <==>|Giao thức HTTPS| FirebaseAuth
    UserRepo <==>|Giao thức WebChannel| Firestore
    HeritageRepo <==>|Giao thức WebChannel| Firestore
    ArticleRepo <==>|Giao thức WebChannel| Firestore
    CommentRepo <==>|Giao thức WebChannel| Firestore
    DataRepository ===>|Tải ảnh Base64 / FormData| Cloudinary

    style Client fill:#ebf5fb,stroke:#2980b9,stroke-width:2px;
    style MayChu fill:#fef9e7,stroke:#f1c40f,stroke-width:2px;
    style GiaoDien fill:#ffffff,stroke:#34495e,stroke-width:1px;
    style BoQuanLy fill:#ffffff,stroke:#34495e,stroke-width:1px;
    style DataRepository fill:#ffffff,stroke:#34495e,stroke-width:1px;
```

