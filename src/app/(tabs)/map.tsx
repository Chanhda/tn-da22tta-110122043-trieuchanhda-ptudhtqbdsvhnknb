import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import MapComponent from '@/components/map/map-view';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography, Shadows, FontFamily, Glass } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { type HeritageDocument, fetchHeritages } from '@/lib/heritage-repository';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');
  const insets = useSafeAreaInsets();
  const [heritages, setHeritages] = useState<HeritageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Lấy danh sách các tỉnh có di sản vật thể (tangible) thực tế đang có trong dữ liệu
  const activeProvinces = Array.from(
    new Set(
      heritages
        .filter((h) => h.type === 'tangible' && h.province)
        .map((h) => h.province)
    )
  ).sort();

  const filters = [
    { id: 'all', label: t.home.categories.all, icon: 'square.grid.2x2' as const },
    ...activeProvinces.map((province) => ({
      id: province,
      label: province === 'TP. Hồ Chí Minh' ? 'TP. HCM' : province,
      icon: 'mappin.circle.fill' as const,
    })),
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchHeritages();
        if (isMounted) {
          setHeritages(result);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredHeritages = heritages.filter((h) => {
    // Only display tangible heritages on the map/journey screen
    if (h.type !== 'tangible') return false;

    if (selectedFilter === 'all') return true;
    return h.province === selectedFilter;
  });

  return (
    <View style={styles.screen}>
      {/* Sticky Header */}
      <Animated.View entering={FadeIn.duration(400)} style={[styles.stickyHeader, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerInner}>
          <ThemedText style={styles.headerTitle}>{t.map.title}</ThemedText>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Section */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.mapSection}
        >
          <MapComponent 
            heritages={filteredHeritages} 
            onPressHeritage={(id) => router.push(`/heritage/${id}`)}
            colorScheme={colorScheme ?? 'dark'}
          />
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${C.primary}12` }]}>
              <IconSymbol name="mappin.circle.fill" size={20} color={C.primary} />
            </View>
            <ThemedText style={styles.statValue}>
              {heritages.filter(h => h.type === 'tangible').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t.map.stats.markers}</ThemedText>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${C.accent}12` }]}>
              <IconSymbol name="location.fill" size={20} color={C.accent} />
            </View>
            <ThemedText style={styles.statValue}>
              {new Set(heritages.filter(h => h.type === 'tangible').map(h => h.province).filter(Boolean)).size}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t.map.stats.areas}</ThemedText>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${C.secondary}12` }]}>
              <IconSymbol name="arrow.up.arrow.down" size={20} color={C.secondary} />
            </View>
            <ThemedText style={styles.statValue}>
              {heritages.filter(h => h.type === 'tangible').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              {language === 'vi' ? 'Điểm đến' : language === 'km' ? 'គោលដៅ' : 'Destinations'}
            </ThemedText>
          </View>
        </Animated.View>

        {/* Filter Section */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.filterSection}
        >
          <ThemedText style={styles.sectionTitle}>{t.map.filter}</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.filterChipActive
                ]}
              >
                <IconSymbol 
                  name={filter.icon} 
                  size={16} 
                  color={selectedFilter === filter.id ? '#131313' : C.textSecondary} 
                />
                <ThemedText 
                  style={[
                    styles.filterLabel,
                    selectedFilter === filter.id && styles.filterLabelActive
                  ]}
                >
                  {filter.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Heritage List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <ThemedText style={styles.sectionTitle}>{t.map.destinations}</ThemedText>
            <View style={styles.countBadge}>
              <ThemedText style={styles.countBadgeText}>{filteredHeritages.length}</ThemedText>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color={C.primary} />
              <ThemedText style={styles.loadingText}>{t.messages.loadingData}</ThemedText>
            </View>
          ) : filteredHeritages.length > 0 ? (
            <View style={styles.listContainer}>
              {filteredHeritages.map((heritage, index) => (
                <Animated.View
                  key={heritage.id}
                  entering={FadeInDown.delay(400 + index * 50).duration(600)}
                >
                  <Pressable 
                    onPress={() => router.push(`/heritage/${heritage.id}`)}
                    style={({ pressed }) => [styles.listItemCard, pressed && { backgroundColor: C.backgroundTertiary }]}
                  >
                    <View style={styles.listItem}>
                      <View style={styles.itemIcon}>
                        <IconSymbol name="mappin.circle.fill" size={20} color={C.primary} />
                      </View>
                      <View style={styles.itemContent}>
                        <ThemedText style={styles.itemTitle} numberOfLines={1}>
                          {heritage.title}
                        </ThemedText>
                        <View style={styles.itemMeta}>
                          <IconSymbol name="location.fill" size={11} color={C.textTertiary} />
                          <ThemedText style={styles.itemMetaText}>
                            {heritage.province}
                          </ThemedText>
                          <ThemedText style={styles.metaDivider}>•</ThemedText>
                          <IconSymbol name="tag.fill" size={11} color={C.primary} />
                          <ThemedText style={styles.itemMetaText}>
                            {heritage.category}
                          </ThemedText>
                        </View>
                      </View>
                      <IconSymbol name="chevron.right" size={14} color={C.textTertiary} />
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <IconSymbol name="magnifyingglass" size={36} color={C.textTertiary} />
              <ThemedText style={styles.emptyTitle}>{t.messages.noResultsFound}</ThemedText>
              <ThemedText style={styles.emptyText}>
                {t.messages.tryDifferentCategory}
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stickyHeader: {
    paddingBottom: 12,
    backgroundColor: scheme === 'light' ? 'rgba(249, 246, 240, 0.95)' : 'rgba(19,19,19,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}40`,
    zIndex: 100,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    gap: Spacing.sm,
  },
  headerBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: `${C.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
  },
  headerTitle: {
    ...Typography.headlineMedium,
    color: C.primary,
    fontFamily: FontFamily.playfairBold,
    flex: 1,
  },
  mapSection: {
    paddingHorizontal: Spacing.containerMargin,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  mapCard: {
    overflow: 'hidden',
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.5)' : 'rgba(30, 30, 30, 0.5)',
    borderWidth: 0.5,
    borderColor: `${C.primary}20`,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  mapPlaceholder: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
  },
  mapIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${C.primary}12`,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.goldGlow,
  },
  mapTitle: {
    ...Typography.titleMedium,
    color: C.text,
    fontWeight: '700',
  },
  mapSubtext: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    textAlign: 'center',
  },
  mapBadge: {
    marginTop: Spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.4)' : 'rgba(30, 30, 30, 0.4)',
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    alignSelf: 'center',
  },
  statValue: {
    ...Typography.headlineSmall,
    color: C.primary,
    fontFamily: FontFamily.playfairBold,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    fontSize: 11,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: C.text,
    fontFamily: FontFamily.playfairMedium,
    marginBottom: Spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Spacing.containerMargin,
    gap: Spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.6)' : 'rgba(30,30,30,0.5)',
  },
  filterChipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
    ...Shadows.goldGlow,
  },
  filterLabel: {
    ...Typography.labelSmall,
    color: C.textSecondary,
  },
  filterLabelActive: {
    color: '#131313',
    fontWeight: '800',
  },
  listSection: {
    paddingHorizontal: Spacing.containerMargin,
    marginTop: Spacing.xs,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    backgroundColor: `${C.primary}18`,
    borderWidth: 0.5,
    borderColor: `${C.primary}45`,
  },
  countBadgeText: {
    ...Typography.labelSmall,
    color: C.primary,
    fontWeight: '700',
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.4)' : 'rgba(30,30,30,0.4)',
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: C.textSecondary,
  },
  listContainer: {
    gap: 0,
  },
  listItemCard: {
    paddingHorizontal: Spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}30`,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: `${C.primary}12`,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  itemContent: {
    flex: 1,
    gap: 4,
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
  metaDivider: {
    color: C.textTertiary,
    fontSize: 10,
    marginHorizontal: 2,
  },
  itemMetaText: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.4)' : 'rgba(30,30,30,0.4)',
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  emptyTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: C.textSecondary,
    textAlign: 'center',
  },
});
