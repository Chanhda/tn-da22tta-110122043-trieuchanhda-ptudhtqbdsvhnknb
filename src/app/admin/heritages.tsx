import { useRouter, type Href, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { CustomAlert } from '@/components/ui/custom-alert';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRequireAdmin } from '@/lib/auth-session';
import {
  deleteHeritage,
  fetchHeritages,
  type HeritageDocument,
} from '@/lib/heritage-repository';
import { getHeritageImageSource } from '@/constants/image-resolver';

const FILTER_TYPES = ['Tất cả', 'tangible', 'intangible'] as const;
const FILTER_CATEGORIES = ['Tất cả', 'Kiến trúc tôn giáo', 'Lễ hội truyền thống', 'Nghệ thuật biểu diễn', 'Ẩm thực', 'Khác'];

const categoryLabelMap: Record<string, Record<string, string>> = {
  vi: {
    'Tất cả': 'Tất cả',
    'Kiến trúc tôn giáo': 'Kiến trúc tôn giáo',
    'Lễ hội truyền thống': 'Lễ hội truyền thống',
    'Nghệ thuật biểu diễn': 'Nghệ thuật biểu diễn',
    'Ẩm thực': 'Ẩm thực',
    'Khác': 'Khác'
  },
  km: {
    'Tất cả': 'ទាំងអស់',
    'Kiến trúc tôn giáo': 'ស្ថាបត្យកម្មសាសនា',
    'Lễ hội truyền thống': 'ពិធីបុណ្យប្រពៃណី',
    'Nghệ thuật biểu diễn': 'សិល្បៈសម្តែង',
    'Ẩm thực': 'ម្ហូបអាហារ',
    'Khác': 'ផ្សេងៗ'
  },
  en: {
    'Tất cả': 'All',
    'Kiến trúc tôn giáo': 'Religious Architecture',
    'Lễ hội truyền thống': 'Traditional Festival',
    'Nghệ thuật biểu diễn': 'Performing Art',
    'Ẩm thực': 'Cuisine',
    'Khác': 'Other'
  }
};

const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring( cleanHex.length === 3 ? 2 : 4, cleanHex.length === 3 ? 3 : 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function AdminHeritagesScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();

  const btnStyles = {
    view: {
      bg: isDark ? 'rgba(127, 222, 221, 0.15)' : '#E0F2F1',
      border: isDark ? 'rgba(127, 222, 221, 0.3)' : '#B2DFDB',
      text: isDark ? '#7FDEDD' : '#007073',
    },
    edit: {
      bg: isDark ? 'rgba(242, 202, 80, 0.15)' : '#FEF3C7',
      border: isDark ? 'rgba(242, 202, 80, 0.3)' : '#FDE68A',
      text: isDark ? '#F2CA50' : '#B68B1E',
    },
    delete: {
      bg: isDark ? 'rgba(255, 180, 171, 0.15)' : '#FEE2E2',
      border: isDark ? 'rgba(255, 180, 171, 0.3)' : '#FCA5A5',
      text: isDark ? '#FFB4AB' : '#BA1A1A',
    },
  };

  const [heritages, setHeritages] = useState<HeritageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'Tất cả' | 'tangible' | 'intangible'>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    onConfirm?: () => void,
    confirmText?: string,
    cancelText?: string,
    onClose?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      onClose,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadHeritages();
    }, [])
  );

  const loadHeritages = async () => {
    try {
      setLoading(true);
      const data = await fetchHeritages();
      const sorted = [...data].sort((a, b) => {
        const da = a.createdAt || '';
        const db = b.createdAt || '';
        return db.localeCompare(da);
      });
      setHeritages(sorted);
    } catch (error) {
      console.error('Error loading heritages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    const doDelete = async () => {
      try {
        await deleteHeritage(id);
        setHeritages(prev => prev.filter(h => h.id !== id));
        if (Platform.OS === 'web') {
          alert(t.admin.alerts.deleteSuccess);
        } else {
          showAlert(t.admin.alerts.success, t.admin.alerts.deleteSuccess, 'success');
        }
      } catch {
        showAlert(t.admin.alerts.error, t.admin.alerts.deleteError, 'error');
      }
    };

    if (Platform.OS === 'web') {
      const confirmMsg = language === 'vi' ? `Xóa di sản "${title}"?`
        : language === 'km' ? `លុបបេតិកភណ្ឌ "${title}"?`
        : `Delete heritage "${title}"?`;
      if (confirm(confirmMsg)) doDelete();
    } else {
      showAlert(
        t.admin.alerts.confirmDeleteTitle,
        `${t.admin.alerts.confirmDeleteMsg} "${title}"?`,
        'warning',
        doDelete,
        t.admin.alerts.delete,
        t.admin.alerts.cancel
      );
    }
  };

  // ── Filter ──
  const filteredHeritages = heritages.filter(h => {
    const matchSearch =
      !searchQuery.trim() ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'Tất cả' || h.type === selectedType;
    const matchCat = selectedCategory === 'Tất cả' || h.category === selectedCategory;
    return matchSearch && matchType && matchCat;
  });

  // ── Stats ──
  const tangibleCount = heritages.filter(h => h.type === 'tangible').length;
  const intangibleCount = heritages.filter(h => h.type === 'intangible').length;

  if (authLoading || loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t.admin.loading}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Curved Header ── */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[
          styles.header, 
          { 
            backgroundColor: isDark ? '#1C1B1B' : colors.secondary, 
            borderBottomWidth: isDark ? 1 : 0,
            borderBottomColor: `${colors.primary}30`,
            paddingTop: Math.max(insets.top, 12) 
          }
        ]}
      >
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={20} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <ThemedText style={styles.headerTitle}>{t.admin.heritagesTitle}</ThemedText>
            <ThemedText style={styles.headerSub}>
              {t.admin.statsSubtitle
                .replace('{total}', heritages.length.toString())
                .replace('{tangible}', tangibleCount.toString())
                .replace('{intangible}', intangibleCount.toString())}
            </ThemedText>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: isDark ? 'rgba(242,202,80,0.15)' : 'rgba(255,255,255,0.2)' }]}>
            <IconSymbol name="building.2.fill" size={20} color={isDark ? colors.primary : '#FFFFFF'} />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(242, 202, 80, 0.08)' : 'rgba(255,255,255,0.16)' }]}>
            <ThemedText style={styles.statNum}>{heritages.length}</ThemedText>
            <ThemedText style={styles.statLabel}>{t.admin.statsTotal}</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(127, 222, 221, 0.08)' : 'rgba(255,255,255,0.16)' }]}>
            <ThemedText style={styles.statNum}>{tangibleCount}</ThemedText>
            <ThemedText style={styles.statLabel}>{t.admin.statsTangible}</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(255, 180, 168, 0.08)' : 'rgba(255,255,255,0.16)' }]}>
            <ThemedText style={styles.statNum}>{intangibleCount}</ThemedText>
            <ThemedText style={styles.statLabel}>{t.admin.statsIntangible}</ThemedText>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Add New Button ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/admin/heritages/new' as Href)}
            icon={<IconSymbol name="plus" size={16} color="#131313" />}
            iconPosition="left"
            style={{ backgroundColor: colors.primary }}
            textStyle={{ color: '#131313', fontWeight: '800' }}
          >
            {t.admin.addNewHeritage}
          </Button>
        </Animated.View>

        {/* ── Search Bar ── */}
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <View
            style={[
              styles.searchBar, 
              { 
                backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : '#FFFFFF', 
                borderColor: isDark ? 'rgba(242, 202, 80, 0.25)' : 'rgba(182, 139, 30, 0.3)' 
              }
            ]}
          >
            <IconSymbol name="magnifyingglass" size={15} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t.admin.searchPlaceholderHeritages}
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={15} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* ── Type Filter ── */}
        <Animated.View entering={FadeInDown.delay(140).duration(500)}>
          <View style={styles.typeRow}>
            {FILTER_TYPES.map(tp => {
              const active = tp === selectedType;
              let label = tp === 'Tất cả' ? t.admin.filterAll : tp === 'tangible' ? t.heritage.types.tangible : t.heritage.types.intangible;
              let color = active ? colors.primary : (isDark ? 'rgba(30,30,30,0.3)' : 'rgba(255,255,255,0.7)');
              return (
                <Pressable
                  key={tp}
                  onPress={() => setSelectedType(tp)}
                  style={[
                    styles.typeChip,
                    { 
                      backgroundColor: color, 
                      borderColor: active ? colors.primary : `${colors.border}30`,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.typeChipText, 
                      { 
                        color: active ? '#131313' : colors.textSecondary,
                        fontWeight: active ? '800' : '600'
                      }
                    ]}
                  >
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Category Filter ── */}
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_CATEGORIES.map(cat => {
              const active = cat === selectedCategory;
              return (
                <Pressable key={cat} onPress={() => setSelectedCategory(cat)}>
                  <Badge
                    variant={active ? 'warning' : 'secondary'}
                    size="medium"
                    style={active
                      ? { ...styles.filterChip, backgroundColor: colors.primary, borderColor: colors.primary }
                      : { ...styles.filterChip, backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : '#FFFFFF', borderColor: `${colors.border}30` }
                    }
                    textStyle={active ? { color: '#131313', fontWeight: '800' } : { color: colors.textSecondary }}
                  >
                    {categoryLabelMap[language][cat] || cat}
                  </Badge>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── Heritage List ── */}
        <View style={styles.listSection}>
          {/* Result row */}
          <View style={styles.resultRow}>
            <ThemedText style={[styles.resultCount, { color: colors.textSecondary }]}>
              {t.admin.resultCountHeritages.replace('{count}', filteredHeritages.length.toString())}
              {selectedType !== 'Tất cả' ? ` · ${selectedType === 'tangible' ? t.admin.statsTangible : t.admin.statsIntangible}` : ''}
            </ThemedText>
            <Pressable onPress={loadHeritages} style={styles.refreshBtn}>
              <IconSymbol name="arrow.clockwise" size={14} color={colors.secondary} />
              <ThemedText style={[styles.refreshText, { color: colors.secondary }]}>{t.admin.refresh}</ThemedText>
            </Pressable>
          </View>

          {filteredHeritages.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500)}>
              <Card variant="outlined" style={[styles.emptyCard, { borderColor: colors.borderLight }]}>
                <View style={[styles.emptyIconBg, { backgroundColor: colors.backgroundTertiary }]}>
                  <IconSymbol name="building.2" size={40} color={colors.textTertiary} />
                </View>
                <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                  {heritages.length === 0 
                    ? (language === 'vi' ? 'Chưa có di sản nào' : language === 'km' ? 'មិនទាន់មានបេតិកភណ្ឌទេ' : 'No heritage yet') 
                    : t.common.noResults}
                </ThemedText>
                <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {heritages.length === 0
                    ? (language === 'vi' ? 'Bấm nút "Thêm di sản mới" để tạo di sản đầu tiên' 
                       : language === 'km' ? 'ចុចប៊ូតុង "បន្ថែមបេតិកភណ្ឌថ្មី" ដើម្បីបង្កើតបេតិកភណ្ឌដំបូង' 
                       : 'Press "Add New Heritage" to create the first heritage')
                    : (language === 'vi' ? 'Thử thay đổi từ khóa hoặc bộ lọc' 
                       : language === 'km' ? 'សាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះ ឬតម្រង' 
                       : 'Try changing keywords or filters')}
                </ThemedText>
              </Card>
            </Animated.View>
          ) : (
            filteredHeritages.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(180 + index * 40).duration(450)}
              >
                <Card variant="elevated" style={styles.heritageCard}>
                  {/* ── Top Row ── */}
                  <View style={styles.cardTop}>
                    <Image source={getHeritageImageSource(item.id, item.coverImage, item.type)} style={styles.thumbnail} />

                    <View style={styles.cardInfo}>
                      <ThemedText style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                        {item.title}
                      </ThemedText>
                      <View style={styles.cardBadgeRow}>
                        <Badge
                          variant={item.type === 'tangible' ? 'success' : 'info'}
                          size="small"
                        >
                          {item.type === 'tangible' ? t.heritage.types.tangible : t.heritage.types.intangible}
                        </Badge>
                        <Badge variant="secondary" size="small">
                          {categoryLabelMap[language][item.category] || item.category}
                        </Badge>
                      </View>
                      <View style={styles.locationRow}>
                        <IconSymbol name="location.fill" size={12} color={colors.secondary} />
                        <ThemedText style={[styles.locationText, { color: colors.textSecondary }]}>
                          {item.province}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  {/* ── Subtitle ── */}
                  {item.subtitle ? (
                    <View style={[styles.subtitleRow, { borderTopColor: colors.borderLight }]}>
                      <ThemedText style={[styles.subtitleText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.subtitle}
                      </ThemedText>
                    </View>
                  ) : null}

                  {/* ── Stats ── */}
                  <View style={[styles.statsBar, { borderTopColor: colors.borderLight }]}>
                    <View style={styles.statItem}>
                      <IconSymbol name="eye.fill" size={13} color={colors.info} />
                      <ThemedText style={[styles.statVal, { color: colors.textSecondary }]}>
                        {(item.views ?? 0).toLocaleString()} {language === 'vi' ? 'lượt xem' : language === 'km' ? 'ការចូលមើល' : 'views'}
                      </ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <IconSymbol name="heart.fill" size={13} color={colors.accent} />
                      <ThemedText style={[styles.statVal, { color: colors.textSecondary }]}>
                        {(item.likes ?? 0).toLocaleString()} {language === 'vi' ? 'thích' : language === 'km' ? 'ចូលចិត្ត' : 'likes'}
                      </ThemedText>
                    </View>
                    {item.location?.lat && (
                      <View style={styles.statItem}>
                        <IconSymbol name="map.fill" size={13} color={colors.accentGreen} />
                        <ThemedText style={[styles.statVal, { color: colors.textSecondary }]}>
                          {language === 'vi' ? 'Có tọa độ' : language === 'km' ? 'មានកូអរដោនេ' : 'Has coordinates'}
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {/* ── Action Buttons ── */}
                  {/* ── Action Buttons ── */}
                   <View style={[styles.actionsRow, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => router.push(`/heritage/${item.id}` as Href)}
                    >
                      {({ pressed }) => (
                        <View
                          style={StyleSheet.flatten([
                            styles.actionBtn,
                            {
                              backgroundColor: pressed ? btnStyles.view.border : btnStyles.view.bg,
                              borderColor: btnStyles.view.border,
                              transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
                            }
                          ])}
                        >
                          <IconSymbol name="eye.fill" size={14} color={btnStyles.view.text} />
                          <ThemedText style={[styles.actionText, { color: btnStyles.view.text }]}>{t.admin.actionView}</ThemedText>
                        </View>
                      )}
                    </Pressable>

                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => router.push(`/admin/heritages/${item.id}/edit` as Href)}
                    >
                      {({ pressed }) => (
                        <View
                          style={StyleSheet.flatten([
                            styles.actionBtn,
                            {
                              backgroundColor: pressed ? btnStyles.edit.border : btnStyles.edit.bg,
                              borderColor: btnStyles.edit.border,
                              transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
                            }
                          ])}
                        >
                          <IconSymbol name="pencil" size={14} color={btnStyles.edit.text} />
                          <ThemedText style={[styles.actionText, { color: btnStyles.edit.text }]}>{t.admin.actionEdit}</ThemedText>
                        </View>
                      )}
                    </Pressable>

                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => handleDelete(item.id, item.title)}
                    >
                      {({ pressed }) => (
                        <View
                          style={StyleSheet.flatten([
                            styles.actionBtn,
                            {
                              backgroundColor: pressed ? btnStyles.delete.border : btnStyles.delete.bg,
                              borderColor: btnStyles.delete.border,
                              transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
                            }
                          ])}
                        >
                          <IconSymbol name="trash.fill" size={14} color={btnStyles.delete.text} />
                          <ThemedText style={[styles.actionText, { color: btnStyles.delete.text }]}>{t.admin.actionDelete}</ThemedText>
                        </View>
                      )}
                    </Pressable>
                  </View>
                </Card>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onClose={() => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          if (alertConfig.onClose) alertConfig.onClose();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 400,
  },
  loadingText: {
    ...Typography.bodyMedium,
  },

  // ── Header ──
  header: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    gap: Spacing.md,
    ...Shadows.large,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Outfit_700Bold',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Outfit_700Bold',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },

  // ── Scroll ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: 120,
  },

  // ── Search ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    ...Shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },

  // ── Type Filter ──
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Platform.select({
      ios: Shadows.small,
      web: Shadows.small,
      default: {},
    }),
  },
  typeChipText: {
    ...Typography.labelSmall,
    fontSize: 12,
  },

  // ── Category Filter ──
  filterRow: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  filterChip: {
    borderWidth: 0.5,
  },

  // ── List ──
  listSection: {
    gap: Spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCount: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },

  // ── Empty ──
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
  },
  emptyIconBg: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Heritage Card ──
  heritageCard: {
    padding: 0,
    gap: 0,
    borderRadius: BorderRadius.lg,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    ...Typography.bodySmall,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Subtitle ──
  subtitleRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  subtitleText: {
    ...Typography.bodySmall,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // ── Stats bar ──
  statsBar: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    ...Typography.bodySmall,
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Actions ──
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    ...Shadows.small,
  },
  actionText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
