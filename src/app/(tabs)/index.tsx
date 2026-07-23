import { Link, useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontFamily, Glass, Shadows, Spacing, Typography } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { type ArticleDocument, fetchArticles } from '@/lib/article-repository';
import { useAuthSession } from '@/lib/auth-session';
import { type HeritageDocument, fetchHeritages } from '@/lib/heritage-repository';
import { getHeritageImageSource, getArticleImageSource } from '@/constants/image-resolver';

import { useTranslate } from '@/lib/translation-helper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = Math.min(SCREEN_HEIGHT * 0.52, 460);

// Category label colors
const CATEGORY_COLORS: Record<string, string> = {
  'Lễ hội': '#FFB4A8',
  'Kiến trúc': '#F2CA50',
  'Ẩm thực': '#7FDEDD',
  'Nghệ thuật': '#D0C5AF',
  'Cộng đồng': '#7FDEDD',
  'Du lịch': '#FFB4A8',
};

function TranslatedTitle({ text, style, numberOfLines }: { text: string; style?: any; numberOfLines?: number }) {
  const translated = useTranslate(text);
  return (
    <ThemedText style={style} numberOfLines={numberOfLines}>
      {translated}
    </ThemedText>
  );
}

const HERO_IMAGE = require('@/assets/images/hero-khmer.jpg');

export default function HomeScreen() {
  const { isAdmin, firebaseUser, profile } = useAuthSession();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(colors, colorScheme ?? 'dark');
  const { t, language } = useLanguage();
  const router = useRouter();

  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [heritages, setHeritages] = useState<HeritageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [stats, setStats] = useState({ heritage: 12, articles: 19, provinces: 6 });

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          setLoading(true);
          
          let articleData: ArticleDocument[] = [];
          try {
            articleData = await fetchArticles();
          } catch (e) {
            console.error('Error fetching articles:', e);
          }

          let heritageData: HeritageDocument[] = [];
          try {
            heritageData = await fetchHeritages();
          } catch (e) {
            console.error('Error fetching heritages:', e);
          }

          if (mounted) {
            setArticles(articleData.slice(0, 6));
            setHeritages(heritageData.slice(0, 6));
            
            const uniqueProvinces = Array.from(new Set(heritageData.map(h => h.province).filter(Boolean)));
            setStats({
              heritage: heritageData.length || 12,
              articles: articleData.length || 19,
              provinces: uniqueProvinces.length || 6,
            });
          }
        } finally {
          if (mounted) setLoading(false);
        }
      })();
      return () => { mounted = false; };
    }, [])
  );

  const filteredArticles = articles.filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayName = profile?.displayName ?? firebaseUser?.displayName ?? 'Heritage';

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Section ── */}
        <View style={styles.heroSection}>
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <ThemedText style={styles.heroTitle}>{t.home.title}</ThemedText>
            <ThemedText style={styles.heroSub} numberOfLines={2}>{t.home.subtitle}</ThemedText>
          </View>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <IconSymbol name="magnifyingglass" size={18} color={`${colors.primary}80`} />
            <TextInput
              style={styles.searchInput}
              placeholder={t.common.search + '...'}
              placeholderTextColor={`${colors.textTertiary}80`}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search.length > 0 ? (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                <IconSymbol name="xmark.circle.fill" size={18} color={`${colors.primary}80`} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Admin shortcut */}
        {isAdmin && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.adminRow}>
            <Pressable
              style={({ pressed }) => [
                styles.adminBtn,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => router.push('/admin')}
            >
              <LinearGradient
                colors={colorScheme === 'dark' ? ['#241C0F', '#3D2F18', '#241C0F'] : ['#FFFDF5', '#FAF0D9', '#FFFDF5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.adminGradient}
              >
                <View style={styles.adminBtnLeft}>
                  <View style={styles.adminIconCircle}>
                    <IconSymbol name="shield.fill" size={20} color="#D4AF37" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <ThemedText style={styles.adminBtnTitle}>
                        {language === 'vi' ? 'Bảng Quản Trị Viên' : language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Admin Portal'}
                      </ThemedText>
                      <View style={styles.adminBadgePill}>
                        <ThemedText style={styles.adminBadgePillText}>PRO</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.adminBtnSub} numberOfLines={1}>
                      {language === 'vi' ? 'Quản lý bài viết, di sản & phân quyền' : language === 'km' ? 'គ្រប់គ្រងអត្ថបទ បេតិកភណ្ឌ និងសិទ្ធិ' : 'Manage articles, heritage & roles'}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.adminArrowWrap}>
                  <IconSymbol name="chevron.right" size={14} color="#131313" />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}

        {/* ── Statistics Section ── */}
        <View
          style={styles.statsSection}
        >
          <View style={styles.statsContainer}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/heritage')}
              style={[styles.statCard, { backgroundColor: colors.backgroundSecondary, borderColor: `${colors.primary}20` }]}
            >
              <View style={[styles.statIconWrap, { backgroundColor: `${colors.primary}12` }]}>
                <IconSymbol name="building.columns.fill" size={14} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <ThemedText style={styles.statNumber}>{stats.heritage}</ThemedText>
                <ThemedText style={styles.statLabel}>{t.home.stats.heritage}</ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/explore')}
              style={[styles.statCard, { backgroundColor: colors.backgroundSecondary, borderColor: `${colors.primary}20` }]}
            >
              <View style={[styles.statIconWrap, { backgroundColor: `${colors.accent}12` }]}>
                <IconSymbol name="doc.text.fill" size={14} color={colors.accent} />
              </View>
              <View style={styles.statContent}>
                <ThemedText style={styles.statNumber}>{stats.articles}</ThemedText>
                <ThemedText style={styles.statLabel}>{t.home.stats.articles}</ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/map')}
              style={[styles.statCard, { backgroundColor: colors.backgroundSecondary, borderColor: `${colors.primary}20` }]}
            >
              <View style={[styles.statIconWrap, { backgroundColor: 'rgba(255, 180, 168, 0.12)' }]}>
                <IconSymbol name="map.fill" size={14} color={colors.secondary} />
              </View>
              <View style={styles.statContent}>
                <ThemedText style={styles.statNumber}>{stats.provinces}</ThemedText>
                <ThemedText style={styles.statLabel}>{t.home.stats.provinces}</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Khmer Festival Calendar Widget ── */}
        <View style={{ paddingHorizontal: Spacing.md, marginBottom: Spacing.lg }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/festivals' as any)}
            style={{
              borderRadius: BorderRadius.xl,
              overflow: 'hidden',
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 26, 18, 0.95)' : '#FFF9EE',
              borderWidth: 1.5,
              borderColor: '#D4AF37',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...Platform.select({
                web: { boxShadow: '0 4px 20px rgba(212,175,55,0.15)' },
                default: {
                  shadowColor: '#D4AF37',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 5,
                },
              }),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(212,175,55,0.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#D4AF37',
                }}
              >
                <IconSymbol name="calendar" size={24} color="#D4AF37" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF4D4D' }} />
                  <ThemedText style={{ fontSize: 10, fontWeight: '800', color: '#D4AF37', letterSpacing: 0.8 }}>
                    {t.home.festivalCalendar.tag}
                  </ThemedText>
                </View>
                <ThemedText style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                  {t.home.festivalCalendar.title}
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>
                  {t.home.festivalCalendar.subtitle}
                </ThemedText>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#D4AF37',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ThemedText style={{ color: '#131313', fontSize: 11, fontWeight: '800' }}>{t.home.festivalCalendar.button}</ThemedText>
              <IconSymbol name="chevron.right" size={12} color="#131313" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Featured Heritage ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{t.home.sections.featured}</ThemedText>
            <Link href="/(tabs)/heritage" asChild>
              <Pressable>
                <ThemedText style={styles.seeAll}>{t.common.seeAll}</ThemedText>
              </Pressable>
            </Link>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {heritages.slice(0, 5).map((h) => {
              const CardContentWrapper = LinearGradient;
              const wrapperProps = { colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'], style: styles.heritageCardContent };

              return (
                <View key={h.id} style={styles.heritageCard}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push(`/heritage/${h.id}`)}
                    style={styles.heritageCardInner}
                  >
                    <Image
                      source={getHeritageImageSource(h.id, h.coverImage, h.type)}
                      style={styles.heritageCardImage}
                      resizeMode="cover"
                    />

                    {/* @ts-ignore */}
                    <CardContentWrapper {...wrapperProps}>
                      <View style={[styles.provinceTag]}>
                        <ThemedText style={styles.provinceTagText}>{h.province ?? 'Sóc Trăng'}</ThemedText>
                      </View>
                      <ThemedText 
                        style={[styles.heritageCardName]} 
                        numberOfLines={2}
                      >
                        {h.title}
                      </ThemedText>
                      <View style={styles.heritageCardMeta}>
                        <IconSymbol name="location.fill" size={12} color="rgba(255,255,255,0.75)" />
                        <ThemedText style={[styles.heritageCardDist]}>
                          {h.province ?? 'Nam Bộ'}
                        </ThemedText>
                      </View>
                    </CardContentWrapper>
                  </TouchableOpacity>
                </View>
              );
            })}


            {heritages.length === 0 && [0, 1, 2].map(i => (
              <View key={i} style={[styles.heritageCard, styles.skeletonCard]} />
            ))}
          </ScrollView>
        </View>

        {/* ── Latest Articles ── */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { paddingHorizontal: Spacing.containerMargin }]}>
            {t.home.sections.articles}
          </ThemedText>

          <View style={styles.articleList}>
            {filteredArticles.slice(0, 6).map((article, idx) => (
              <Pressable
                key={article.id}
                onPress={() => router.push(`/articles/${article.id}`)}
                style={({ pressed }) => [styles.articleCardFull, pressed && { opacity: 0.85 }]}
              >
                {/* Full-width Image */}
                <Image
                  source={getArticleImageSource(article.id, article.coverImage, article.category)}
                  style={styles.articleCardImageFull}
                  resizeMode="cover"
                />

                {/* Title & Info below image */}
                <View style={styles.articleCardTextFull}>
                  <View style={styles.articleMeta}>
                    <ThemedText style={[styles.articleCategory, {
                      color: CATEGORY_COLORS[article.category] ?? colors.accent,
                    }]}>
                      {(article.category ?? 'Heritage').toUpperCase()}
                    </ThemedText>
                    <View style={styles.metaDot} />
                    <ThemedText style={styles.readTime}>
                      {language === 'vi' ? '5 phút đọc' : language === 'km' ? '៥ នាទីអាន' : '5 min read'}
                    </ThemedText>
                  </View>
                  <TranslatedTitle text={article.title} style={styles.articleTitleFull} />
                </View>
              </Pressable>
            ))}

            {filteredArticles.length === 0 && (
              <View style={[styles.emptyState, { paddingHorizontal: Spacing.containerMargin }]}>
                <IconSymbol name="doc.text" size={32} color={colors.textTertiary} />
                <ThemedText style={styles.emptyText}>{t.common.noResults}</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },

  scrollContent: {
    paddingBottom: 0,
  },

  // ── Statistics Section ────────────────────────────
  statsSection: {
    paddingHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 16,
    color: C.primary,
    lineHeight: 18,
  },
  statLabel: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 9,
    color: C.textSecondary,
    lineHeight: 11,
  },

  // ── Hero ──────────────────────────────────────────
  heroSection: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    top: '60%',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.containerMargin,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 4,
    ...Platform.select({
      web: { textShadow: '0 1px 6px rgba(0,0,0,0.9)' },
      default: {
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
      },
    }),
  },
  heroSub: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    lineHeight: 17,
    maxWidth: '85%',
    ...Platform.select({
      web: { textShadow: '0 1px 4px rgba(0,0,0,0.8)' },
      default: {
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
      },
    }),
  },

  // ── Search ────────────────────────────────────────
  searchSection: {
    paddingHorizontal: Spacing.containerMargin,
    marginTop: -28,
    zIndex: 10,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: scheme === 'light' ? 'rgba(243, 237, 226, 0.9)' : 'rgba(30,30,30,0.85)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 0.5,
    borderColor: `${C.primary}20`,
    ...Platform.select({
      web: { boxShadow: '0 8px 20px rgba(0,0,0,0.4)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  searchBarFocused: {
    borderColor: `${C.primary}40`,
    ...Platform.select({
      web: { boxShadow: '0 0 20px rgba(212,175,55,0.15)' },
      default: {
        shadowColor: '#D4AF37',
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
    }),
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontFamily: FontFamily.inter,
    fontSize: 15,
    padding: 0,
    height: 24,
  },

  // ── Admin shortcut ────────────────────────────────
  adminRow: {
    paddingHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.md,
  },
  adminBtn: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    ...Platform.select({
      web: { boxShadow: '0 6px 24px rgba(212,175,55,0.25)' },
      default: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 7,
      },
    }),
  },
  adminGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  adminBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  adminIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: scheme === 'dark' ? '#F2CA50' : '#8F6C13',
    fontFamily: FontFamily.playfairBold,
  },
  adminBadgePill: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adminBadgePillText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#131313',
    letterSpacing: 0.5,
  },
  adminBtnSub: {
    fontSize: 11,
    fontWeight: '500',
    color: C.textSecondary,
  },
  adminArrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // ── Section ───────────────────────────────────────
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headlineLarge,
    color: C.text,
  },
  seeAll: {
    ...Typography.labelLarge,
    color: C.primary,
  },

  // ── Heritage Cards ────────────────────────────────
  hScroll: {
    paddingHorizontal: Spacing.containerMargin,
    gap: Spacing.md,
  },
  heritageCard: {
    width: 220,
    height: 290,
    borderRadius: BorderRadius.xxl,
    backgroundColor: scheme === 'light' ? '#FFFFFF' : C.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
    ...Shadows.large,
  },
  heritageCardInner: {
    width: 220,
    height: 290,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  skeletonCard: {
    backgroundColor: C.surfaceHigh,
  },
  heritageCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220,
    height: 290,
    backgroundColor: '#8B7355',
    borderRadius: BorderRadius.xxl,
  },
  heritageCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    paddingTop: Spacing.xl + 8,
  },
  provinceTag: {
    backgroundColor: `${C.primary}25`,
    borderWidth: 0.5,
    borderColor: `${C.primary}40`,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  provinceTagText: {
    ...Typography.labelSmall,
    color: C.primary,
  },
  heritageCardName: {
    ...Typography.headlineSmall,
    color: '#FFFFFF', // Always white so it is readable on dark overlay
    marginBottom: Spacing.xs,
    lineHeight: 26,
  },
  heritageCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heritageCardDist: {
    ...Typography.labelSmall,
    color: 'rgba(255, 255, 255, 0.75)', // Always white/translucent
  },

  // ── Article List ──────────────────────────────────
  articleList: {
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
  articleCardFull: {
    width: SCREEN_WIDTH,
  },
  articleCardImageFull: {
    width: SCREEN_WIDTH,
    height: 220,
  },
  articleCardTextFull: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.md,
    gap: 6,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleCategory: {
    ...Typography.labelSmall,
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.border,
  },
  readTime: {
    ...Typography.labelSmall,
    color: `${C.textSecondary}80`,
  },
  articleTitleFull: {
    fontFamily: FontFamily.playfairBold,
    color: C.text,
    fontSize: 20,
    lineHeight: 27,
  },

  // ── Empty ─────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: C.textTertiary,
  },
});
