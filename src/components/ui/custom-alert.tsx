import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';
import { BorderRadius, Colors, Spacing, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface CustomAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  options?: {
    text: string;
    onPress: () => void;
    style?: 'cancel' | 'destructive' | 'default';
  }[];
}

export function CustomAlert({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Hủy',
  options,
}: CustomAlertProps) {
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  if (!visible) return null;

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark.circle.fill' as const,
          iconColor: isDark ? '#7FDEDD' : '#007073',
          badgeBg: isDark ? 'rgba(127, 222, 221, 0.15)' : 'rgba(0, 112, 115, 0.1)',
          accentColor: isDark ? '#7FDEDD' : '#007073',
          buttonTextCol: isDark ? '#131313' : '#FFFFFF',
        };
      case 'error':
        return {
          icon: 'exclamationmark.circle.fill' as const,
          iconColor: isDark ? '#FFB4AB' : '#BA1A1A',
          badgeBg: isDark ? 'rgba(255, 180, 171, 0.15)' : 'rgba(186, 26, 26, 0.1)',
          accentColor: isDark ? '#FFB4AB' : '#BA1A1A',
          buttonTextCol: isDark ? '#131313' : '#FFFFFF',
        };
      case 'warning':
      case 'info':
      default:
        return {
          icon: type === 'warning' ? 'exclamationmark.triangle.fill' as const : 'info.circle.fill' as const,
          iconColor: C.primary,
          badgeBg: `${C.primary}18`,
          accentColor: C.primary,
          buttonTextCol: '#131313', // Always dark text on gold background for high contrast
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop overlay */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Animated modal container */}
        <Animated.View
          entering={ZoomIn.duration(250)}
          style={[
            styles.alertCard,
            {
              backgroundColor: isDark ? '#1C1B1B' : '#FFFFFF',
              borderColor: isDark ? `${config.accentColor}70` : `${config.accentColor}50`,
              shadowColor: config.accentColor,
            },
          ]}
        >
          {/* Header Icon Badge */}
          <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
            <IconSymbol name={config.icon} size={28} color={config.iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1C1A17' }]}>
            {title}
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: isDark ? '#E5E2E1' : '#4E4334' }]}>
            {message}
          </Text>

          {/* Action buttons */}
          <View style={options ? styles.buttonColumn : styles.buttonRow}>
            {options ? (
              options.map((option, idx) => {
                const isCancel = option.style === 'cancel';
                const isDestructive = option.style === 'destructive';
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      isCancel ? styles.secondaryButton : styles.primaryButton,
                      { flex: 0, width: '100%' },
                      !isCancel && {
                        backgroundColor: isDestructive
                          ? (isDark ? '#FFB4AB' : '#BA1A1A')
                          : config.iconColor,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onClose();
                      option.onPress();
                    }}
                  >
                    <Text
                      style={[
                        isCancel ? styles.secondaryButtonText : styles.primaryButtonText,
                        {
                          color: isCancel
                            ? (isDark ? '#E5E2E1' : '#1C1A17')
                            : (isDestructive
                                ? (isDark ? '#131313' : '#FFFFFF')
                                : config.buttonTextCol),
                        },
                      ]}
                    >
                      {option.text}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : onConfirm ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    {
                      borderColor: isDark ? '#E5E2E1' : 'rgba(28, 26, 23, 0.4)',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={onClose}
                >
                  <Text style={[styles.secondaryButtonText, { color: isDark ? '#E5E2E1' : '#1C1A17' }]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: config.iconColor,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    onConfirm();
                  }}
                >
                  <Text style={[styles.primaryButtonText, { color: config.buttonTextCol }]}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: config.iconColor,
                  },
                ]}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: config.buttonTextCol }]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  alertCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.playfairBold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    fontFamily: FontFamily.inter,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonColumn: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '700',
  },
});
