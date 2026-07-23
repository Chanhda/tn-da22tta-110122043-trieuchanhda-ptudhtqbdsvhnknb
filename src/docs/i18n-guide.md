# 🌍 Hướng Dẫn Đa Ngôn Ngữ (i18n)

## Tổng Quan

Ứng dụng Khmer Heritage hỗ trợ 3 ngôn ngữ:
- 🇻🇳 **Tiếng Việt** (vi) - Mặc định
- 🇰🇭 **ភាសាខ្មែរ** (km) - Khmer
- 🇬🇧 **English** (en) - Tiếng Anh

---

## 📁 Cấu Trúc Files

```
khmerApp/
├── constants/
│   └── languages.ts          # Định nghĩa ngôn ngữ và translations
├── contexts/
│   └── language-context.tsx  # Context và Provider cho ngôn ngữ
└── app/
    └── _layout.tsx           # Wrap app với LanguageProvider
```

---

## 🔧 Cách Sử Dụng

### 1. Trong Component

```tsx
import { useLanguage } from '@/contexts/language-context';

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View>
      <Text>{t.home.title}</Text>
      <Button onPress={() => setLanguage('km')}>
        Switch to Khmer
      </Button>
    </View>
  );
}
```

### 2. Truy Cập Translations

```tsx
// Ngôn ngữ hiện tại
const { language } = useLanguage(); // 'vi' | 'km' | 'en'

// Đổi ngôn ngữ
const { setLanguage } = useLanguage();
await setLanguage('km'); // Lưu vào AsyncStorage

// Lấy translations
const { t } = useLanguage();
console.log(t.home.title); // "Văn hoá Khmer\nNam Bộ"
```

---

## 📝 Thêm Translations Mới

### Bước 1: Cập nhật Interface

Mở `constants/languages.ts` và thêm vào interface `Translations`:

```typescript
export interface Translations {
  // ... existing translations
  
  newSection: {
    title: string;
    description: string;
  };
}
```

### Bước 2: Thêm Translations cho Mỗi Ngôn Ngữ

```typescript
export const translations: Record<Language, Translations> = {
  vi: {
    // ... existing translations
    newSection: {
      title: 'Tiêu đề mới',
      description: 'Mô tả mới',
    },
  },
  km: {
    // ... existing translations
    newSection: {
      title: 'ចំណងជើងថ្មី',
      description: 'ការពិពណ៌នាថ្មី',
    },
  },
  en: {
    // ... existing translations
    newSection: {
      title: 'New Title',
      description: 'New Description',
    },
  },
};
```

### Bước 3: Sử Dụng trong Component

```tsx
const { t } = useLanguage();

<Text>{t.newSection.title}</Text>
<Text>{t.newSection.description}</Text>
```

---

## 🎯 Translations Có Sẵn

### Common
```typescript
t.common.loading          // "Đang tải..."
t.common.error            // "Có lỗi xảy ra"
t.common.noResults        // "Không tìm thấy kết quả"
t.common.seeAll           // "Xem tất cả"
t.common.search           // "Tìm kiếm"
```

### Home Screen
```typescript
t.home.title              // "Văn hoá Khmer\nNam Bộ"
t.home.subtitle           // "Hành trình khám phá..."
t.home.badge              // "✨ Khám phá di sản"
t.home.stats.heritage     // "Di sản"
t.home.stats.articles     // "Bài viết"
t.home.categories.all     // "Tất cả"
t.home.quickActions.map   // "Bản đồ"
```

### Heritage Screen
```typescript
t.heritage.title          // "Di Sản Văn Hóa"
t.heritage.subtitle       // "di sản Khmer Nam Bộ"
t.heritage.stats.locations // "Địa điểm"
t.heritage.viewDetail     // "Xem chi tiết"
```

### Explore Screen
```typescript
t.explore.title           // "Khám Phá"
t.explore.collections.new // "Mới nhất"
t.explore.categories.temple // "Chùa"
t.explore.featured.title  // "Nổi bật"
```

### Profile Screen
```typescript
t.profile.title           // "Hồ Sơ"
t.profile.guest           // "Người dùng"
t.profile.stats.viewed    // "Đã xem"
t.profile.language.title  // "Ngôn ngữ"
t.profile.menu.settings   // "Cài đặt"
t.profile.signOut         // "Đăng xuất"
```

### Map Screen
```typescript
t.map.title               // "Bản Đồ Di Sản"
t.map.mapTitle            // "Bản đồ tương tác"
t.map.comingSoon          // "Sắp ra mắt"
t.map.destinations        // "Điểm đến"
```

### Messages
```typescript
t.messages.loadingData    // "Đang tải dữ liệu..."
t.messages.errorOccurred  // "Có lỗi xảy ra"
t.messages.noResultsFound // "Không tìm thấy kết quả"
```

---

## 🔄 Đổi Ngôn Ngữ

### Trong Profile Screen

Người dùng có thể đổi ngôn ngữ bằng cách:
1. Vào tab **Profile**
2. Chọn ngôn ngữ mong muốn (🇻🇳 🇰🇭 🇬🇧)
3. Ngôn ngữ được lưu tự động vào AsyncStorage

### Programmatically

```tsx
const { setLanguage } = useLanguage();

// Đổi sang Khmer
await setLanguage('km');

// Đổi sang English
await setLanguage('en');

// Đổi sang Tiếng Việt
await setLanguage('vi');
```

---

## 💾 Lưu Trữ

Ngôn ngữ được lưu trong AsyncStorage với key:
```
@khmer_heritage_language
```

Khi app khởi động, ngôn ngữ được load tự động từ AsyncStorage.

---

## 🎨 Best Practices

### 1. Luôn Sử Dụng Translations
❌ **Không nên:**
```tsx
<Text>Văn hoá Khmer</Text>
```

✅ **Nên:**
```tsx
const { t } = useLanguage();
<Text>{t.home.title}</Text>
```

### 2. Tránh Hard-code Text
❌ **Không nên:**
```tsx
<Button>Xem chi tiết</Button>
```

✅ **Nên:**
```tsx
const { t } = useLanguage();
<Button>{t.heritage.viewDetail}</Button>
```

### 3. Sử Dụng TypeScript
TypeScript sẽ giúp bạn:
- Autocomplete translations
- Phát hiện lỗi typo
- Đảm bảo tất cả ngôn ngữ có đủ keys

```typescript
// TypeScript sẽ báo lỗi nếu key không tồn tại
t.home.nonExistentKey // ❌ Error

// Autocomplete sẽ gợi ý các keys có sẵn
t.home. // ✅ Autocomplete: title, subtitle, badge, ...
```

### 4. Nhóm Translations Theo Màn Hình
```typescript
// ✅ Tốt - Dễ quản lý
t.home.title
t.heritage.title
t.profile.title

// ❌ Không tốt - Khó quản lý
t.homeTitle
t.heritageTitle
t.profileTitle
```

---

## 🌐 Thêm Ngôn Ngữ Mới

### Bước 1: Thêm Language Type

```typescript
// constants/languages.ts
export type Language = 'vi' | 'km' | 'en' | 'th'; // Thêm 'th' cho Thai
```

### Bước 2: Thêm Translations

```typescript
export const translations: Record<Language, Translations> = {
  // ... existing languages
  th: {
    common: {
      loading: 'กำลังโหลด...',
      error: 'เกิดข้อผิดพลาด',
      // ... all other translations
    },
    // ... all sections
  },
};
```

### Bước 3: Thêm vào Profile Screen

```typescript
const languages: Array<{ code: Language; label: string; flag: string }> = [
  { code: 'vi', label: t.profile.language.vietnamese, flag: '🇻🇳' },
  { code: 'km', label: t.profile.language.khmer, flag: '🇰🇭' },
  { code: 'en', label: t.profile.language.english, flag: '🇬🇧' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' }, // Thêm Thai
];
```

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find name 'useLanguage'"
**Giải pháp:** Đảm bảo đã import:
```tsx
import { useLanguage } from '@/contexts/language-context';
```

### Lỗi: "useLanguage must be used within a LanguageProvider"
**Giải pháp:** Đảm bảo app được wrap với LanguageProvider trong `_layout.tsx`:
```tsx
<LanguageProvider>
  <AuthProvider>
    {/* ... */}
  </AuthProvider>
</LanguageProvider>
```

### Ngôn ngữ không được lưu
**Giải pháp:** Kiểm tra AsyncStorage permissions và đảm bảo `@react-native-async-storage/async-storage` đã được cài đặt.

---

## 📊 Statistics

- **Tổng số translations**: ~150+ keys
- **Ngôn ngữ hỗ trợ**: 3 (vi, km, en)
- **Màn hình đã i18n**: 5/5 (100%)
- **Components đã i18n**: 100%

---

## 🎯 Roadmap

- [ ] Thêm ngôn ngữ Thai (ไทย)
- [ ] Thêm ngôn ngữ Lào (ລາວ)
- [ ] Pluralization support
- [ ] Date/Time formatting theo locale
- [ ] Number formatting theo locale
- [ ] RTL support (nếu cần)

---

**Cập nhật:** 16/05/2026  
**Version:** 1.0.0
