import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    View,
    type PressableProps,
    type ViewStyle,
    type StyleProp,
} from 'react-native';

interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof Spacing;
  style?: StyleProp<ViewStyle>;
  pressable?: boolean;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
  pressable = false,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          ...Platform.select({
            ios: Shadows.medium,
            web: Shadows.medium,
            default: {
              borderWidth: 0.5,
              borderColor: colorScheme === 'light' ? 'rgba(182, 139, 30, 0.15)' : 'rgba(242, 202, 80, 0.15)',
            },
          }),
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.backgroundSecondary,
        };
    }
  };

  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    variant === 'elevated' && { overflow: 'visible' as const },
    getVariantStyles(),
    { padding: Spacing[padding] },
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
