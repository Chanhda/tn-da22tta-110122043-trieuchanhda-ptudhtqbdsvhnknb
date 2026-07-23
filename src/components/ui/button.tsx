import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    type PressableProps,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  style,
  textStyle,
  children,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          borderWidth: 0,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.full,
        };
      case 'medium':
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          borderRadius: BorderRadius.full,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.lg,
          borderRadius: BorderRadius.full,
        };
    }
  };

  const getTextColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return colors.primary;
    }
    // For primary and secondary, use white for better contrast
    if (variant === 'danger') {
      return '#FFFFFF';
    }
    // Default white text for better visibility
    return '#FFFFFF';
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { ...Typography.labelMedium, fontWeight: '700' };
      case 'medium':
        return { ...Typography.labelLarge, fontWeight: '700' };
      case 'large':
        return { ...Typography.titleSmall, fontWeight: '700' };
    }
  };

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        variant !== 'ghost' && Platform.select({
          ios: Shadows.medium,
          web: Shadows.medium,
          default: {},
        }),
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <Text
              style={[
                styles.text,
                getTextSize(),
                { color: getTextColor() },
                textStyle,
              ]}
            >
              {children}
            </Text>
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
