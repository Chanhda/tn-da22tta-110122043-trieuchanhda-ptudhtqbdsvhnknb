# 🚀 Quick Start - Giao Diện Mới

## Chạy Ứng Dụng

```bash
npm start
```

Sau đó chọn platform:
- `a` - Android
- `i` - iOS
- `w` - Web

## 🎨 Sử Dụng UI Components

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="medium">
  Click me
</Button>
```

### Card
```tsx
import { Card } from '@/components/ui/card';

<Card variant="elevated" padding="md">
  <Text>Content</Text>
</Card>
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="success" size="small">
  New
</Badge>
```

## 🎭 Animations

```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(200).duration(600)}>
  <Card>...</Card>
</Animated.View>
```

## 🎨 Theme Colors

```tsx
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];

<View style={{ backgroundColor: colors.primary }}>
  ...
</View>
```

## 📏 Spacing

```tsx
import { Spacing } from '@/constants/theme';

<View style={{ padding: Spacing.md, gap: Spacing.sm }}>
  ...
</View>
```

## 📖 Tài Liệu Đầy Đủ

Xem `docs/design-system.md` để biết thêm chi tiết!
