import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { readProfileStorage, writeProfileStorage } from '@/lib/profile-storage';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const { t, language } = useLanguage();
  const { preferredColorScheme, setPreferredColorScheme } = useColorSchemePreference();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const styles = getStyles(C, colorScheme ?? 'dark');

  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      const savedSettings = await readProfileStorage('khmerapp.profile.settings', {
        notifications: true,
        privateProfile: false,
      });

      if (!isMounted) return;
      setNotifications(savedSettings.notifications);
      setPrivateProfile(savedSettings.privateProfile);
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    writeProfileStorage('khmerapp.profile.settings', {
      notifications,
      privateProfile,
    });
  }, [notifications, privateProfile]);

  const openLink = async (url: string, title: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return;
      }
      Alert.alert(title, url);
    } catch {
      Alert.alert(title, language === 'vi' ? 'Không thể mở liên kết này.' : language === 'km' ? 'មិនអាចបើកតំណនេះបានទេ។' : 'Cannot open this link.');
    }
  };

  const settings = [
    {
      id: 'notifications',
      title: t.profile.menu.notifications,
      description: language === 'vi' ? 'Nhận thông báo đẩy từ ứng dụng' : language === 'km' ? 'ទទួលการជូនដំណឹង từកម្មវិធី' : 'Receive push notifications from the app',
      value: notifications,
      onToggle: setNotifications,
      icon: 'bell.fill' as const,
      color: C.accent,
    },
    {
      id: 'darkMode',
      title: language === 'vi' ? 'Chế độ tối' : language === 'km' ? 'របៀបងងឹត' : 'Dark Mode',
      description: language === 'vi' ? 'Chuyển đổi giữa giao diện sáng và tối' : language === 'km' ? 'ប្តូររវាងស្បែកភ្លឺនិងងងឹត' : 'Switch between light and dark themes',
      value: preferredColorScheme === 'dark',
      onToggle: (val: boolean) => setPreferredColorScheme(val ? 'dark' : 'light'),
      icon: 'moon.fill' as const,
      color: C.primary,
      disabled: false,
    },
    {
      id: 'private',
      title: language === 'vi' ? 'Hồ sơ riêng tư' : language === 'km' ? 'ប្រវត្តិរូបឯកជន' : 'Private Profile',
      description: language === 'vi' ? 'Ẩn hồ sơ khỏi người dùng khác' : language === 'km' ? 'លាក់ប្រវត្តិរូបពីអ្នកប្រើប្រាស់ផ្សេងទៀត' : 'Hide profile from other users',
      value: privateProfile,
      onToggle: setPrivateProfile,
      icon: 'lock.fill' as const,
      color: C.secondary,
    },
  ];

  const links = [
    {
      id: 'privacy',
      label: language === 'vi' ? 'Chính sách bảo mật' : language === 'km' ? 'គោលការណ៍ឯកជនភាព' : 'Privacy Policy',
      icon: 'shield.fill' as const,
      url: 'https://khmerheritage.com/privacy',
      color: C.accent,
    },
    {
      id: 'terms',
      label: language === 'vi' ? 'Điều khoản dịch vụ' : language === 'km' ? 'លក្ខខណ្ឌប្រើប្រាស់' : 'Terms of Service',
      icon: 'doc.fill' as const,
      url: 'https://khmerheritage.com/terms',
      color: C.primary,
    },
    {
      id: 'support',
      label: language === 'vi' ? 'Liên hệ hỗ trợ' : language === 'km' ? 'ទាក់ទងផ្នែកគាំទ្រ' : 'Contact Support',
      icon: 'envelope.fill' as const,
      url: 'mailto:support@khmerheritage.com',
      color: C.secondary,
    },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Toggle Settings */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="slider.horizontal.3" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Tùy chọn chung' : language === 'km' ? 'ជម្រើសទូទៅ' : 'General Options'}
            </ThemedText>
          </View>
          <View style={styles.listCard}>
            {settings.map((setting, index) => (
              <View
                key={setting.id}
                style={[
                  styles.settingRow,
                  index !== settings.length - 1 && styles.rowBorder,
                ]}
              >
                <View style={[styles.settingIconBg, { backgroundColor: `${setting.color}15` }]}>
                  <IconSymbol name={setting.icon} size={18} color={setting.color} />
                </View>
                <View style={styles.settingTextBox}>
                  <View style={styles.settingHeaderRow}>
                    <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
                    <Pressable
                      onPress={() => !setting.disabled && setting.onToggle(!setting.value)}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: setting.value ? setting.color : (colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                        padding: 2.5,
                        justifyContent: 'center',
                        borderWidth: 0.5,
                        borderColor: setting.value ? setting.color : C.border,
                      }}
                    >
                      <Animated.View
                        style={{
                          width: 17,
                          height: 17,
                          borderRadius: 8.5,
                          backgroundColor: '#FFFFFF',
                          alignSelf: setting.value ? 'flex-end' : 'flex-start',
                          shadowColor: '#000000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.5,
                          elevation: 2,
                        }}
                      />
                    </Pressable>
                  </View>
                  <ThemedText style={styles.settingDesc}>{setting.description}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* App Info */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Thông tin ứng dụng' : language === 'km' ? 'ព័ត៌មានកម្មវិធី' : 'App Information'}
            </ThemedText>
          </View>
          <View style={styles.infoCard}>
            {[
              { 
                label: language === 'vi' ? 'Phiên bản ứng dụng' : language === 'km' ? 'កំណែកម្មវិធី' : 'App Version', 
                value: 'v1.0.0', 
                icon: 'app.fill' as const 
              },
              { 
                label: language === 'vi' ? 'Lần cập nhật cuối' : language === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ' : 'Last Updated', 
                value: '26/05/2026', 
                icon: 'calendar' as const 
              },
              { 
                label: language === 'vi' ? 'Bộ nhớ đã dùng' : language === 'km' ? 'អង្គចងចាំដែលបានប្រើ' : 'Storage Used', 
                value: '2.5 MB', 
                icon: 'internaldrive.fill' as const 
              },
            ].map((info, idx, arr) => (
              <View key={info.label}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBg}>
                    <IconSymbol name={info.icon} size={12} color={C.textSecondary} />
                  </View>
                  <ThemedText style={styles.infoLabel}>{info.label}</ThemedText>
                  <ThemedText style={styles.infoValue}>{info.value}</ThemedText>
                </View>
                {idx < arr.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* External Links */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="link" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Pháp lý & Liên hệ' : language === 'km' ? 'ច្បាប់ និងទំនាក់ទំនង' : 'Legal & Contact'}
            </ThemedText>
          </View>
          <View style={styles.listCard}>
            {links.map((link, index) => (
              <Pressable
                key={link.id}
                onPress={() => openLink(link.url, link.label)}
                style={({ pressed }) => [
                  { width: '100%' },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View
                  style={[
                    styles.linkRow,
                    index !== links.length - 1 && styles.rowBorder,
                  ]}
                >
                  <View style={styles.linkLeftGroup}>
                    <View style={[styles.linkIconBg, { backgroundColor: `${link.color}14` }]}>
                      <IconSymbol name={link.icon} size={15} color={link.color} />
                    </View>
                    <ThemedText style={styles.linkLabel}>{link.label}</ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={12} color={C.textTertiary} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    paddingBottom: 60,
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.labelSmall,
    color: C.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  listCard: {
    backgroundColor: scheme === 'light' ? 'rgba(255, 254, 250, 0.95)' : 'rgba(28, 28, 28, 0.8)',
    borderWidth: 1,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.16)' : 'rgba(212, 175, 55, 0.15)',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      default: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  settingIconBg: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: `${C.border}40`,
    flexShrink: 0,
  },
  settingTextBox: {
    flex: 1,
    gap: 2,
  },
  settingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  settingTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  settingDesc: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: scheme === 'light' ? 'rgba(255, 254, 250, 0.95)' : 'rgba(28, 28, 28, 0.8)',
    borderWidth: 1,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.16)' : 'rgba(212, 175, 55, 0.15)',
    borderRadius: 16,
    padding: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      default: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  infoIconBg: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.sm,
    backgroundColor: C.backgroundTertiary,
    borderWidth: 0.5,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
    ...Typography.bodyMedium,
    color: C.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    ...Typography.labelMedium,
    color: C.text,
    fontWeight: '700',
  },
  divider: {
    height: 0.5,
    backgroundColor: `${C.border}60`,
    marginVertical: 2,
  },
  linkRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  linkLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  linkIconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  linkLabel: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    color: C.text,
  },
});
