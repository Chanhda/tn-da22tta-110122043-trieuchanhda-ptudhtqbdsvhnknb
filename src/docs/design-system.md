# Hệ Thống Thiết Kế - Khmer Heritage App

## Tổng Quan

Ứng dụng Khmer Heritage đã được thiết kế lại với một hệ thống thiết kế hiện đại, nhất quán và dễ bảo trì. Hệ thống này bao gồm màu sắc, typography, spacing, và các component UI có thể tái sử dụng.

## 🎨 Màu Sắc

### Màu Chính (Primary)
- **Gold (#D4AF37)**: Đại diện cho di sản và truyền thống
- Sử dụng cho: Buttons chính, highlights, icons quan trọng

### Màu Phụ (Secondary)
- **Saddle Brown (#8B4513)**: Màu đất ấm áp
- Sử dụng cho: Buttons phụ, accents

### Màu Nhấn (Accent)
- **Coral Red (#FF6B6B)**: Năng động và thu hút
- **Turquoise (#4ECDC4)**: Tươi mới và hiện đại
- **Purple (#9B59B6)**: Sang trọng và thanh lịch

### Màu Trung Tính
- Text: #2C2C2C (chính), #6B6B6B (phụ), #9E9E9E (tertiary)
- Background: #FFFFFF (chính), #F8F9FA (phụ), #F0F2F5 (tertiary)

### Màu Ngữ Nghĩa
- Success: #10B981 (xanh lá)
- Warning: #F59E0B (cam)
- Error: #EF4444 (đỏ)
- Info: #3B82F6 (xanh dương)

## 📝 Typography

### Hệ Thống Font
Sử dụng system fonts để đảm bảo hiệu suất tốt nhất:
- iOS: San Francisco
- Android: Roboto
- Web: System UI

### Quy Mô Typography

#### Display (Tiêu đề lớn)
- Large: 57px / 64px line-height
- Medium: 45px / 52px line-height
- Small: 36px / 44px line-height

#### Headline (Tiêu đề)
- Large: 32px / 40px line-height
- Medium: 28px / 36px line-height
- Small: 24px / 32px line-height

#### Title (Tiêu đề nhỏ)
- Large: 22px / 28px line-height
- Medium: 18px / 24px line-height
- Small: 16px / 22px line-height

#### Body (Nội dung)
- Large: 16px / 24px line-height
- Medium: 14px / 20px line-height
- Small: 12px / 16px line-height

#### Label (Nhãn)
- Large: 14px / 20px line-height (600 weight)
- Medium: 12px / 16px line-height (600 weight)
- Small: 11px / 16px line-height (600 weight)

## 📏 Spacing

Hệ thống spacing dựa trên đơn vị 8px:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px
- xxxl: 64px

## 🔲 Border Radius

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px
- full: 9999px (tròn hoàn toàn)

## 🌑 Shadows

### Small
- Cho các elements nhỏ như chips, tags
- shadowOpacity: 0.05, shadowRadius: 2

### Medium
- Cho cards, buttons
- shadowOpacity: 0.1, shadowRadius: 8

### Large
- Cho modals, dialogs
- shadowOpacity: 0.15, shadowRadius: 16

### XLarge
- Cho floating elements
- shadowOpacity: 0.2, shadowRadius: 24

## 🧩 Components

### Button
Các biến thể:
- **primary**: Màu gold, cho actions chính
- **secondary**: Màu brown, cho actions phụ
- **outline**: Viền, background trong suốt
- **ghost**: Không viền, không background
- **danger**: Màu đỏ, cho actions nguy hiểm

Kích thước:
- small, medium, large

```tsx
<Button variant="primary" size="medium">
  Xem chi tiết
</Button>
```

### Card
Các biến thể:
- **elevated**: Có shadow (mặc định)
- **outlined**: Có viền
- **filled**: Background màu

```tsx
<Card variant="elevated" padding="md">
  <Text>Nội dung card</Text>
</Card>
```

### Badge
Các biến thể:
- primary, secondary, success, warning, error, info

Kích thước:
- small, medium, large

```tsx
<Badge variant="primary" size="small">
  Nổi bật
</Badge>
```

## 🎭 Animations

Thời gian animation:
- fast: 150ms - Cho micro-interactions
- normal: 250ms - Cho hầu hết animations
- slow: 350ms - Cho transitions phức tạp
- verySlow: 500ms - Cho page transitions

Sử dụng react-native-reanimated cho animations mượt mà:

```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(200).duration(600)}>
  <Card>...</Card>
</Animated.View>
```

## 🌓 Dark Mode

Tất cả components đều hỗ trợ dark mode tự động thông qua `useColorScheme` hook.

```tsx
const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];
```

## 📱 Responsive Design

- Sử dụng flexbox cho layouts linh hoạt
- Tránh hard-code dimensions
- Sử dụng percentages và flex cho responsive
- Test trên nhiều kích thước màn hình

## ♿ Accessibility

- Tất cả interactive elements có minimum touch target 44x44px
- Contrast ratio đạt WCAG AA standard
- Hỗ trợ screen readers
- Keyboard navigation (web)

## 🚀 Best Practices

1. **Sử dụng theme constants**: Luôn import từ `@/constants/theme`
2. **Tái sử dụng components**: Sử dụng UI components có sẵn
3. **Consistent spacing**: Sử dụng Spacing system
4. **Semantic colors**: Dùng màu ngữ nghĩa cho states
5. **Performance**: Tối ưu images, lazy load khi cần

## 📚 Tài Liệu Tham Khảo

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Material Design 3](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
