import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';
import { useAuthSession } from '@/lib/auth-session';
import { getUserNotifications, clearUserNotifications, dismissUserNotification, type AppNotification } from '@/lib/user-repository';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const { language } = useLanguage();
  const { firebaseUser } = useAuthSession();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');

  const [dbNotifications, setDbNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (firebaseUser) {
      getUserNotifications(firebaseUser.uid).then(setDbNotifications);
    }
  }, [firebaseUser]);

  const notifications = useMemo(() => {
    return dbNotifications.map(n => ({
      id: n.id,
      title: language === 'vi' ? n.titleVi : language === 'km' ? n.titleKm : n.titleEn,
      description: language === 'vi' ? n.descriptionVi : language === 'km' ? n.descriptionKm : n.descriptionEn,
      time: language === 'vi' ? n.timeVi : language === 'km' ? n.timeKm : n.timeEn,
      icon: n.icon as any,
      color: n.color,
      isNew: n.isNew,
    }));

  }, [dbNotifications, language]);

  const clearNotifications = () => {
    Alert.alert(
      language === 'vi' ? 'Xóa thông báo' : language === 'km' ? 'លុបការជូនដំណឹង' : 'Delete Notifications',
      language === 'vi' ? 'Bạn muốn xóa tất cả thông báo?' : language === 'km' ? 'តើអ្នកចង់លុបការជូនដំណឹងទាំងអស់ទេ?' : 'Do you want to delete all notifications?',
      [
        { text: language === 'vi' ? 'Hủy' : language === 'km' ? 'បោះបង់' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'vi' ? 'Xóa tất cả' : language === 'km' ? 'លុបទាំងអស់' : 'Delete All', 
          style: 'destructive', 
          onPress: async () => {
            if (firebaseUser) {
              await clearUserNotifications(firebaseUser.uid);
            }
            setDbNotifications([]);
          } 
        },
      ]
    );
  };

  const dismissNotification = async (notifId: string) => {
    if (firebaseUser) {
      await dismissUserNotification(firebaseUser.uid, notifId);
    }
    setDbNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const newCount = notifications.filter(n => n.isNew).length;

  return (
    <View style={styles.screen}>
      {/* Curved Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextBox}>
            <ThemedText style={styles.headerTitle}>
              {language === 'vi' ? 'Thông báo' : language === 'km' ? 'ការជូនដំណឹង' : 'Notifications'}
            </ThemedText>
            <ThemedText style={styles.headerSub}>
              {newCount > 0 
                ? (language === 'vi' 
                    ? `${newCount} thông báo chưa đọc` 
                    : language === 'km' 
                      ? `${newCount} ការជូនដំណឹងមិនទាន់អាន` 
                      : `${newCount} unread notifications`)
                : (language === 'vi' 
                    ? 'Không có thông báo mới' 
                    : language === 'km' 
                      ? 'គ្មានការជូនដំណឹងថ្មីទេ' 
                      : 'No new notifications')}
            </ThemedText>
          </View>
          {notifications.length > 0 && (
            <Pressable
              onPress={clearNotifications}
              style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.7 }]}
            >
              <IconSymbol name="trash.fill" size={16} color={C.primary} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <IconSymbol name="bell.slash.fill" size={36} color={C.textTertiary} />
            </View>
            <ThemedText style={styles.emptyTitle}>
              {language === 'vi' ? 'Không có thông báo' : language === 'km' ? 'គ្មានការជូនដំណឹង' : 'No Notifications'}
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {language === 'vi' 
                ? 'Bạn đã xem tất cả thông báo. Chúng tôi sẽ thông báo khi có nội dung mới!' 
                : language === 'km' 
                  ? 'អ្នកបានមើលការជូនដំណឹងទាំងអស់ហើយ។ យើងនឹងជូនដំណឹងនៅពេលមានមាតិកាថ្មី!' 
                  : 'You have viewed all notifications. We will notify you when there is new content!'}
            </ThemedText>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <View style={styles.listCard}>
              {notifications.map((notification, index) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notifRow,
                    index !== notifications.length - 1 && styles.rowBorder,
                  ]}
                >
                  <View style={styles.notifContent}>
                    <View style={[styles.notifIcon, { backgroundColor: `${notification.color}15` }]}>
                      <IconSymbol name={notification.icon} size={20} color={notification.color} />
                    </View>
                    <View style={styles.notifText}>
                      <View style={styles.notifTitleRow}>
                        <ThemedText style={styles.notifTitle} numberOfLines={1}>
                          {notification.title}
                        </ThemedText>
                        {notification.isNew && (
                          <View style={[styles.newBadge, { backgroundColor: `${notification.color}25` }]}>
                            <ThemedText style={[styles.newBadgeText, { color: notification.color }]}>
                              {language === 'vi' ? 'Mới' : language === 'km' ? 'ថ្មី' : 'New'}
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText style={styles.notifDescription} numberOfLines={2}>
                        {notification.description}
                      </ThemedText>
                      <View style={styles.notifFooter}>
                        <IconSymbol name="clock" size={11} color={C.textTertiary} />
                        <ThemedText style={styles.notifTime}>
                          {notification.time}
                        </ThemedText>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => dismissNotification(String(notification.id))}
                      style={({ pressed }) => [styles.dismissBtn, pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }]}
                    >
                      <IconSymbol name="xmark" size={12} color={C.textTertiary} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.containerMargin,
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  headerTextBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FontFamily.playfairBold,
    color: C.primary,
  },
  headerSub: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    marginTop: 2,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${C.primary}15`,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    paddingBottom: 60,
  },
  listContainer: {
    gap: Spacing.sm,
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
  notifRow: {
    padding: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  notifContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: `${C.border}40`,
    flexShrink: 0,
  },
  notifText: {
    flex: 1,
    gap: 4,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  notifTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
    flex: 1,
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  notifDescription: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    lineHeight: 18,
  },
  notifFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  notifTime: {
    ...Typography.labelSmall,
    color: C.textTertiary,
    fontSize: 11,
  },
  dismissBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: C.backgroundTertiary,
    borderWidth: 0.5,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
});
