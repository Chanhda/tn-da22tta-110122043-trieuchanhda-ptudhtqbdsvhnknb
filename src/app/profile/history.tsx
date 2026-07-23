import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';
import { useTranslateMultiLang } from '@/lib/translation-helper';
import { TranslatedText } from '@/components/translated-text';

type ActionIconName = 
  | 'eye.fill' 
  | 'heart.fill' 
  | 'square.and.arrow.up.fill';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { language } = useLanguage();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');

  const getActionText = (action: string) => {
    if (action.includes('Đã xem') || action.includes('viewed')) {
      return language === 'vi' ? 'Đã xem' : language === 'km' ? 'បានមើល' : 'Viewed';
    }
    if (action.includes('yêu thích') || action.includes('favorite')) {
      return language === 'vi' ? 'Đã thêm yêu thích' : language === 'km' ? 'បានបន្ថែមទៅចំណូលចិត្ត' : 'Added to favorites';
    }
    if (action.includes('chia sẻ') || action.includes('share')) {
      return language === 'vi' ? 'Đã chia sẻ' : language === 'km' ? 'បានចែករំលែក' : 'Shared';
    }
    return action;
  };

  const getTimeText = (time: string) => {
    let result = time;
    if (result.includes('Hôm nay')) {
      return result.replace('Hôm nay', language === 'vi' ? 'Hôm nay' : language === 'km' ? 'ថ្ងៃនេះ' : 'Today');
    }
    if (result.includes('Hôm qua')) {
      return result.replace('Hôm qua', language === 'vi' ? 'Hôm qua' : language === 'km' ? 'ម្សិលមិញ' : 'Yesterday');
    }
    if (result.includes('ngày trước')) {
      return result.replace('ngày trước', language === 'vi' ? 'ngày trước' : language === 'km' ? 'ថ្ងៃមុន' : 'days ago');
    }
    return result;
  };

  const initialHistory = useMemo(() => ([
    {
      id: 1,
      title: 'Angkor Wat',
      action: 'Đã xem',
      time: 'Hôm nay, 14:30',
      icon: 'eye.fill' as ActionIconName,
      iconColor: C.accent,
      href: '/heritage/chua-chantarangsay' as Href,
    },
    {
      id: 2,
      title: 'Bayon Temple',
      action: 'Đã thêm yêu thích',
      time: 'Hôm nay, 13:15',
      icon: 'heart.fill' as ActionIconName,
      iconColor: C.secondary,
      href: '/heritage/chua-chantarangsay' as Href,
    },
    {
      id: 3,
      title: 'Ta Prohm',
      action: 'Đã xem',
      time: 'Hôm qua, 16:45',
      icon: 'eye.fill' as ActionIconName,
      iconColor: C.accent,
      href: '/heritage/ro-bam' as Href,
    },
    {
      id: 4,
      title: 'Phnom Penh National Museum',
      action: 'Đã chia sẻ',
      time: 'Hôm qua, 10:20',
      icon: 'square.and.arrow.up.fill' as ActionIconName,
      iconColor: C.primary,
      href: '/articles/chuong-trinh-le-hoi' as Href,
    },
    {
      id: 5,
      title: 'Preah Vihear Temple',
      action: 'Đã xem',
      time: '3 ngày trước, 09:00',
      icon: 'eye.fill' as ActionIconName,
      iconColor: C.accent,
      href: '/heritage/ghe-ngo' as Href,
    },
  ]), []);

  const [history, setHistory] = useState(initialHistory);

  const clearHistory = () => {
    Alert.alert(
      language === 'vi' ? 'Xóa lịch sử' : language === 'km' ? 'លុបប្រវត្តិ' : 'Clear History',
      language === 'vi' ? 'Bạn có muốn xóa toàn bộ lịch sử hoạt động?' : language === 'km' ? 'តើអ្នកចង់លុបប្រវត្តិសកម្មភាពទាំងអស់ទេ?' : 'Do you want to clear all activity history?',
      [
        { text: language === 'vi' ? 'Hủy' : language === 'km' ? 'បោះបង់' : 'Cancel', style: 'cancel' },
        { text: language === 'vi' ? 'Xóa toàn bộ' : language === 'km' ? 'លុប tất cả' : 'Clear All', style: 'destructive', onPress: () => setHistory([]) },
      ]
    );
  };

  const openHistoryItem = (href: Href) => {
    router.push(href);
  };

  return (
    <View style={styles.screen}>
      {/* Header Panel */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextBox}>
            <ThemedText style={styles.headerTitle}>
              {language === 'vi' ? 'Lịch sử hoạt động' : language === 'km' ? 'ប្រវត្តិសកម្មភាព' : 'Activity History'}
            </ThemedText>
            <ThemedText style={styles.headerSub}>
              {language === 'vi'
                ? `${history.length} hoạt động gần đây`
                : language === 'km'
                  ? `${history.length} សកម្មភាពថ្មីៗ`
                  : `${history.length} recent activities`}
            </ThemedText>
          </View>
          <Pressable
            onPress={clearHistory}
            disabled={history.length === 0}
            style={({ pressed }) => [
              styles.clearBtn,
              history.length === 0 && { opacity: 0.4 },
              pressed && history.length > 0 && { opacity: 0.7 }
            ]}
          >
            <IconSymbol name="trash.fill" size={16} color={C.primary} />
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {history.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <IconSymbol name="clock" size={36} color={C.textTertiary} />
            </View>
            <ThemedText style={styles.emptyTitle}>
              {language === 'vi' ? 'Chưa có lịch sử' : language === 'km' ? 'មិនទាន់មានប្រវត្តិ' : 'No History Yet'}
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {language === 'vi'
                ? 'Lịch sử hoạt động khám phá của bạn sẽ xuất hiện tại đây.'
                : language === 'km'
                  ? 'ប្រវត្តិសកម្មភាពស្វែងរករបស់អ្នកនឹងបង្ហាញនៅទីនេះ។'
                  : 'Your discovery activity history will appear here.'}
            </ThemedText>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <View style={styles.listCard}>
              {history.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => openHistoryItem(item.href)}
                  style={({ pressed }) => [
                    { width: '100%' },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View
                    style={[
                      styles.historyItem,
                      index !== history.length - 1 && styles.rowBorder,
                    ]}
                  >
                    <View style={[styles.itemIcon, { backgroundColor: `${item.iconColor}15` }]}>
                      <IconSymbol name={item.icon} size={18} color={item.iconColor} />
                    </View>
                    <View style={styles.itemContent}>
                      <TranslatedText style={styles.itemTitle} field={item.title} />
                      <View style={styles.itemMeta}>
                        <ThemedText style={[styles.itemAction, { color: item.iconColor }]}>
                          {getActionText(item.action)}
                        </ThemedText>
                        <ThemedText style={styles.itemDot}>•</ThemedText>
                        <ThemedText style={styles.itemTime}>
                          {getTimeText(item.time)}
                        </ThemedText>
                      </View>
                    </View>
                    <IconSymbol name="chevron.right" size={14} color={C.textTertiary} />
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        <ThemedText style={styles.hint}>
          {language === 'vi'
            ? 'Lịch sử được tự động lưu trữ trong 90 ngày qua'
            : language === 'km'
              ? 'ប្រវត្តិត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិកំឡុងពេល ៩០ ថ្ងៃកន្លងមក'
              : 'History is automatically stored for the last 90 days'}
        </ThemedText>
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
    gap: Spacing.md,
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
  historyItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: `${C.border}40`,
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemAction: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
  itemDot: {
    fontSize: 10,
    color: C.textTertiary,
  },
  itemTime: {
    ...Typography.labelSmall,
    color: C.textTertiary,
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
  },
  hint: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    textAlign: 'center',
    paddingTop: Spacing.sm,
  },
});
