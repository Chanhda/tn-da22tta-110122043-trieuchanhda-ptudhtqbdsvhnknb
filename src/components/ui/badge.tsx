import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  style,
  textStyle,
}: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVariantStyles = (): ViewStyle => {
    const baseOpacity = colorScheme === 'dark' ? 0.2 : 0.15;
    
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: `${colors.primary}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')}`,
        };
      case 'secondary':
        return {
          backgroundColor: `${colors.secondary}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')}`,
        };
      case 'success':
        return {
          backgroundColor: `${colors.success}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')}`,
        };
      case 'warning':
        return {
          backgroundColor: `${colors.warning}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')}`,
        };
      case 'error':
        return {
          backgroundColor: `${colors.error}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')}`,
        };
      case 'info':
        return {
          backgroundColor: `${colors.info}${Math.round(baseOpacity * 255).toString(16).padStart(2, '0')}`,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
        };
      case 'medium':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        };
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return Typography.labelSmall;
      case 'medium':
        return Typography.labelMedium;
      case 'large':
        return Typography.labelLarge;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getVariantStyles(),
        getSizeStyles(),
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
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
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
