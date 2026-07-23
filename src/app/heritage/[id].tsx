import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as RNAnimated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { getHeritageCoordinates } from '@/components/map/coordinates';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { type HeritageDocument, fetchHeritageById, isHeritageLikedLocally, toggleHeritageLike, incrementHeritageViews } from '@/lib/heritage-repository';
import { useLanguage } from '@/contexts/language-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeritageImageSource } from '@/constants/image-resolver';
import { TranslatedText } from '@/components/translated-text';
import { useTranslateArray } from '@/lib/translation-helper';
import { useAuthSession } from '@/lib/auth-session';
import { addUserNotification } from '@/lib/user-repository';

const { width: SW, height: SH } = Dimensions.get('window');
const HERO_H = Math.min(SH * 0.52, 440);

// Fallback gallery images
const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470076892663-af684e5e15af?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1562625964-ffe9b2f617bc?auto=format&fit=crop&w=600&q=80',
];

export default function HeritageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { firebaseUser } = useAuthSession();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const [heritage, setHeritage] = useState<HeritageDocument | undefined>();
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeGalleryImg, setActiveGalleryImg] = useState(0);

  const HighlightsList = useCallback(({ list }: { list: string[] | undefined }) => {
    const translated = useTranslateArray(list);
    return (
      <View style={styles.highlightsList}>
        {translated.map((h, i) => (
          <Animated.View
            key={i}
            entering={FadeInLeft.delay(300 + i * 60).duration(400)}
            style={[styles.highlightCard, { backgroundColor: isDark ? `${C.primary}10` : `${C.primary}08`, borderColor: `${C.primary}25` }]}
          >
            <View style={[styles.highlightNum, { backgroundColor: `${C.primary}20`, borderColor: `${C.primary}40` }]}>
              <Text style={[styles.highlightNumText, { color: C.primary }]}>{i + 1}</Text>
            </View>
            <Text style={[styles.highlightText, { color: C.textSecondary }]}>{h}</Text>
          </Animated.View>
        ))}
      </View>
    );
  }, [isDark, C.primary, C.textSecondary]);

  const scrollY = useRef(new RNAnimated.Value(0)).current;

  // Parallax + header opacity
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_H],
    outputRange: [0, -HERO_H * 0.3],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_H - 120, HERO_H - 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.15, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof id !== 'string') { setLoading(false); return; }
      try {
        const data = await fetchHeritageById(id);
        if (mounted) {
          setHeritage(data);
        }
        if (data) {
          const liked = await isHeritageLikedLocally(id);
          if (mounted) {
            setIsLiked(liked);
          }
          await incrementHeritageViews(id);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleShare = async () => {
    try {
      await Share.share({
        title: heritage?.title ?? 'Di sản Khmer',
        message: `Khám phá "${heritage?.title ?? 'di sản Khmer'}" trên ứng dụng Di Sản`,
      });
    } catch {}
  };

  const handleToggleLike = async () => {
    if (typeof id !== 'string') return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);

    if (heritage) {
      setHeritage(prev => {
        if (!prev) return prev;
        const currentLikes = prev.likes ?? 0;
        return {
          ...prev,
          likes: Math.max(0, currentLikes + (nextLiked ? 1 : -1))
        };
      });
    }

    try {
      await toggleHeritageLike(id, nextLiked);
      if (nextLiked && firebaseUser && heritage) {
        await addUserNotification(firebaseUser.uid, {
          titleVi: 'Đã thêm vào yêu thích ❤️',
          titleKm: 'បានបន្ថែមទៅចូលចិត្ត ❤️',
          titleEn: 'Added to Favorites ❤️',
          descriptionVi: `"${heritage.title}" đã được thêm vào danh sách yêu thích của bạn.`,
          descriptionKm: `"${heritage.title}" ត្រូវបានបន្ថែមទៅក្នុងបញ្ជីចូលចិត្តរបស់អ្នក។`,
          descriptionEn: `"${heritage.title}" has been added to your favorites list.`,
          timeVi: 'Vừa xong',
          timeKm: 'មុននេះបន្តិច',
          timeEn: 'Just now',
          icon: 'heart.fill',
          color: '#E53935',
          isNew: true,
        });
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleGetDirections = () => {
    if (!heritage) return;
    
    let lat: number | undefined = heritage.location?.lat;
    let lng: number | undefined = heritage.location?.lng;
    
    if (!lat || !lng) {
      const coords = getHeritageCoordinates(heritage, 0);
      lat = coords.latitude;
      lng = coords.longitude;
    }
    
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const appleMapsUrl = `maps://?daddr=${lat},${lng}&dirflg=d`;

    if (Platform.OS === 'ios') {
      Linking.canOpenURL(appleMapsUrl).then((supported) => {
        if (supported) {
          Linking.openURL(appleMapsUrl);
        } else {
          Linking.openURL(googleMapsUrl);
        }
      });
    } else {
      Linking.openURL(googleMapsUrl).catch(() => {
        Alert.alert(
          language === 'vi' ? 'Lỗi' : 'Error',
          language === 'vi' ? 'Không thể mở ứng dụng bản đồ.' : 'Could not open map application.'
        );
      });
    }
  };

  const typeLabel = (type?: string) => {
    if (type === 'tangible') return language === 'vi' ? 'DI SẢN VẬT THỂ' : language === 'km' ? 'បេតិកភណ្ឌធ្វើរូបបញ្ញ' : 'TANGIBLE HERITAGE';
    if (type === 'intangible') return language === 'vi' ? 'DI SẢN PHI VẬT THỂ' : language === 'km' ? 'បេតិកភណ្ឌអរូបកម្ម' : 'INTANGIBLE HERITAGE';
    return language === 'vi' ? 'DI SẢN' : 'HERITAGE';
  };

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Animated.View entering={ZoomIn.duration(400)}>
          <ActivityIndicator size="large" color={C.primary} />
        </Animated.View>
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>
          {language === 'vi' ? 'Đang tải...' : language === 'km' ? 'កំពុងផ្ទុក...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  if (!heritage) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center', gap: 16 }}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={C.primary} />
          <Text style={[Typography.headlineSmall, { color: C.text }]}>
            {language === 'vi' ? 'Không tìm thấy' : language === 'km' ? 'រករកមិនឃើញ' : 'Not Found'}
          </Text>
          <Text style={[Typography.bodyMedium, { color: C.textSecondary, textAlign: 'center' }]}>
            {language === 'vi' ? 'Di sản này không tồn tại hoặc đã bị xóa.' : 'This heritage item could not be found.'}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.backPillBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.85 }]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={14} color="#131313" />
            <Text style={styles.backPillBtnText}>{t.common.back}</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const galleryImages = Array.isArray(heritage.gallery) && heritage.gallery.length > 0
    ? heritage.gallery
    : (heritage.coverImage
        ? [heritage.coverImage, ...GALLERY_IMGS.slice(0, 3)]
        : GALLERY_IMGS);

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Sticky header (appears on scroll) ── */}
      <RNAnimated.View
        style={[
          styles.stickyHeader,
          {
            opacity: headerOpacity,
            backgroundColor: isDark ? 'rgba(19,19,19,0.97)' : 'rgba(249,246,240,0.97)',
            borderBottomColor: `${C.border}50`,
            paddingTop: Math.max(insets.top, 12),
          },
        ]}
        pointerEvents="none"
      >
        <Text style={[styles.stickyHeaderTitle, { color: C.text }]} numberOfLines={1}>
          {heritage.title}
        </Text>
      </RNAnimated.View>

      {/* ── Floating action buttons (always visible) ── */}
      <View style={[styles.floatingBtns, { top: Math.max(insets.top, 12) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.floatBtn,
            { backgroundColor: isDark ? 'rgba(19,19,19,0.85)' : 'rgba(255,255,255,0.92)', borderColor: `${C.border}60` },
            pressed && { opacity: 0.75 },
          ]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={18} color={C.text} />
        </Pressable>
        <View style={styles.floatBtnGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.floatBtn,
              { backgroundColor: isDark ? 'rgba(19,19,19,0.85)' : 'rgba(255,255,255,0.92)', borderColor: `${C.border}60` },
              pressed && { opacity: 0.75 },
            ]}
            onPress={handleShare}
          >
            <IconSymbol name="square.and.arrow.up" size={17} color={C.text} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.floatBtn,
              {
                backgroundColor: isSaved
                  ? `${C.primary}22`
                  : isDark ? 'rgba(19,19,19,0.85)' : 'rgba(255,255,255,0.92)',
                borderColor: isSaved ? `${C.primary}60` : `${C.border}60`,
              },
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => setIsSaved(v => !v)}
          >
            <IconSymbol
              name={isSaved ? 'bookmark.fill' : 'bookmark'}
              size={17}
              color={isSaved ? C.primary : C.text}
            />
          </Pressable>
        </View>
      </View>

      <RNAnimated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ── Hero with parallax ── */}
        {(() => {
          const coverSrc = getHeritageImageSource(heritage.id, heritage.coverImage, heritage.type);
          const hasCoverImage = true;
          return (
            <View style={styles.heroWrap}>
              <RNAnimated.View
                style={[
                  styles.heroImgContainer,
                  {
                    transform: [
                      { translateY: heroTranslateY },
                      { scale: heroScale },
                    ],
                    backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(182, 139, 30, 0.02)',
                  },
                ]}
              >
                <Image
                  source={coverSrc}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </RNAnimated.View>

              {/* Dark gradient overlays */}
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
                style={styles.heroBotGrad}
              />

              {/* Hero content: badge + title */}
              <View style={styles.heroContent}>
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                  <View style={[
                    styles.typeBadge,
                    { 
                      backgroundColor: heritage.type === 'intangible' ? `${C.accent}16` : `${C.primary}16`,
                      borderColor: heritage.type === 'intangible' ? `${C.accent}45` : `${C.primary}45` 
                    },
                  ]}>
                    <IconSymbol
                      name={heritage.type === 'intangible' ? 'music.note' : 'building.columns'}
                      size={10}
                      color={heritage.type === 'intangible' ? C.accent : C.primary}
                    />
                    <Text style={[
                      styles.typeBadgeText,
                      { color: heritage.type === 'intangible' ? C.accent : C.primary },
                    ]}>
                      {typeLabel(heritage.type)}
                    </Text>
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                  <Text style={[
                    styles.heroTitle, 
                    { color: hasCoverImage ? '#FFFFFF' : C.primary }
                  ]}>
                    <TranslatedText field={heritage.title} />
                  </Text>
                </Animated.View>

                {heritage.subtitle && (
                  <Animated.View entering={FadeInDown.delay(380).duration(500)}>
                    <Text style={[
                      styles.heroSubtitle, 
                      { color: hasCoverImage ? 'rgba(255,255,255,0.82)' : C.textSecondary }
                    ]} numberOfLines={2}>
                      <TranslatedText field={heritage.subtitle} />
                    </Text>
                  </Animated.View>
                )}

                {/* Meta chips */}
                <Animated.View entering={FadeInDown.delay(440).duration(500)} style={styles.heroMeta}>
                  {heritage.province && (
                    <View style={[
                      styles.metaChip, 
                      !hasCoverImage && { 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)', 
                        borderColor: `${C.primary}25` 
                      }
                    ]}>
                      <IconSymbol name="location.fill" size={11} color={hasCoverImage ? "rgba(255,255,255,0.7)" : C.textSecondary} />
                      <Text style={[
                        styles.metaChipText, 
                        !hasCoverImage && { color: C.textSecondary }
                      ]}>{heritage.province}</Text>
                    </View>
                  )}
                  {heritage.builtYear && (
                    <View style={[
                      styles.metaChip, 
                      !hasCoverImage && { 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)', 
                        borderColor: `${C.primary}25` 
                      }
                    ]}>
                      <IconSymbol name="calendar" size={11} color={hasCoverImage ? "rgba(255,255,255,0.7)" : C.textSecondary} />
                      <Text style={[
                        styles.metaChipText, 
                        !hasCoverImage && { color: C.textSecondary }
                      ]}>{heritage.builtYear}</Text>
                    </View>
                  )}
                  {heritage.category && (
                    <View style={[
                      styles.metaChip, 
                      !hasCoverImage && { 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)', 
                        borderColor: `${C.primary}25` 
                      }
                    ]}>
                      <IconSymbol name="tag.fill" size={11} color={hasCoverImage ? "rgba(255,255,255,0.7)" : C.textSecondary} />
                      <Text style={[
                        styles.metaChipText, 
                        !hasCoverImage && { color: C.textSecondary }
                      ]}>{heritage.category}</Text>
                    </View>
                  )}
                </Animated.View>
              </View>
            </View>
          );
        })()}

        {/* ── Stats bar ── */}
        {(heritage.views !== undefined || heritage.likes !== undefined) && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            style={[styles.statsBar, { backgroundColor: isDark ? C.backgroundSecondary : C.surfaceHigh, borderBottomColor: `${C.border}40` }]}
          >
            <Pressable
              style={styles.statItem}
              onPress={handleToggleLike}
            >
              <IconSymbol name={isLiked ? 'heart.fill' : 'heart'} size={16} color={isLiked ? '#FF4757' : C.textTertiary} />
              <Text style={[styles.statVal, { color: C.textSecondary }]}>
                {(heritage.likes ?? 0).toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: C.textTertiary }]}>
                {language === 'vi' ? 'yêu thích' : 'likes'}
              </Text>
            </Pressable>

            <View style={[styles.statDivider, { backgroundColor: `${C.border}60` }]} />

            <View style={styles.statItem}>
              <IconSymbol name="eye.fill" size={15} color={C.textTertiary} />
              <Text style={[styles.statVal, { color: C.textSecondary }]}>
                {(heritage.views ?? 0).toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: C.textTertiary }]}>
                {language === 'vi' ? 'lượt xem' : 'views'}
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: `${C.border}60` }]} />

            <Pressable style={styles.statItem} onPress={handleShare}>
              <IconSymbol name="square.and.arrow.up" size={15} color={C.textTertiary} />
              <Text style={[styles.statLabel, { color: C.textTertiary }]}>
                {language === 'vi' ? 'chia sẻ' : 'share'}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* ── Body content ── */}
        <View style={styles.contentWrap}>

          {/* Description / summary */}
          {(heritage.summary || heritage.description) && (
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.contentSection, { borderColor: `${C.border}30` }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionAccentBar, { backgroundColor: C.primary }]} />
                <Text style={[styles.sectionTitle, { color: C.text }]}>
                  {language === 'vi' ? 'Giới thiệu' : language === 'km' ? 'ការណែនាំ' : 'Overview'}
                </Text>
              </View>
              <TranslatedText field={heritage.summary || heritage.description} style={[styles.bodyText, { color: C.text }]} />
            </Animated.View>
          )}

          {/* Detailed Content */}
          {heritage.body && (
            <Animated.View entering={FadeInDown.delay(240).duration(600)} style={[styles.contentSection, { borderColor: `${C.border}30` }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionAccentBar, { backgroundColor: C.accent }]} />
                <Text style={[styles.sectionTitle, { color: C.text }]}>
                  {language === 'vi' ? 'Nội dung chi tiết' : language === 'km' ? 'ខ្លឹមសារលម្អិត' : 'Detailed Content'}
                </Text>
              </View>
              <TranslatedText field={heritage.body} style={[styles.bodyText, { color: C.textSecondary, lineHeight: 26 }]} />
            </Animated.View>
          )}

          {/* Highlights */}
          {Array.isArray(heritage.highlights) && heritage.highlights.length > 0 && (
            <Animated.View entering={FadeInDown.delay(280).duration(600)} style={[styles.contentSection, { borderColor: `${C.border}30` }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionAccentBar, { backgroundColor: C.accent }]} />
                <Text style={[styles.sectionTitle, { color: C.text }]}>
                  {language === 'vi' ? 'Điểm nổi bật' : language === 'km' ? 'ចំណុចលេចធ្លោ' : 'Highlights'}
                </Text>
              </View>
              <HighlightsList list={heritage.highlights} />
            </Animated.View>
          )}

          {/* Gallery */}
          <Animated.View entering={FadeInDown.delay(340).duration(600)} style={[styles.contentSection, { borderColor: `${C.border}30` }]}>
            <View style={[styles.sectionHeaderRow, { marginBottom: 14 }]}>
              <View style={[styles.sectionAccentBar, { backgroundColor: C.secondary }]} />
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                {language === 'vi' ? 'Thư viện ảnh' : language === 'km' ? 'វិចិត្រសាល' : 'Gallery'}
              </Text>
            </View>

            {/* Main gallery image */}
            <Pressable
              style={[styles.galleryMain, { backgroundColor: C.surfaceHigh }]}
              onPress={() => setActiveGalleryImg((activeGalleryImg + 1) % galleryImages.length)}
            >
              <Image
                source={{ uri: galleryImages[activeGalleryImg] }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
              <View style={styles.galleryImgCounter}>
                <Text style={styles.galleryImgCounterText}>
                  {activeGalleryImg + 1} / {galleryImages.length}
                </Text>
              </View>
              <View style={styles.galleryTapHint}>
                <IconSymbol name="hand.tap.fill" size={14} color="rgba(255,255,255,0.8)" />
              </View>
            </Pressable>

            {/* Thumbnail row */}
            <View style={styles.galleryThumbRow}>
              {galleryImages.map((img, i) => (
                <Pressable
                  key={i}
                  style={[
                    styles.galleryThumb,
                    { backgroundColor: C.surfaceHigh, borderColor: i === activeGalleryImg ? C.primary : 'transparent', borderWidth: i === activeGalleryImg ? 2 : 0 },
                  ]}
                  onPress={() => setActiveGalleryImg(i)}
                >
                  <Image source={{ uri: img }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  {i === activeGalleryImg && (
                    <View style={styles.activeThumbOverlay} />
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Location info */}
          {heritage.type === 'tangible' && (heritage.province || heritage.location) && (
            <View
              style={[
                styles.locationBanner,
                { 
                  backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.7)', 
                  borderColor: `${C.border}35`,
                  borderLeftWidth: 3,
                  borderLeftColor: C.primary,
                  flexDirection: 'column',
                  gap: 12,
                  alignItems: 'stretch',
                }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.locationLeftGroup}>
                  <View style={[styles.locationIconWrap, { backgroundColor: `${C.primary}14` }]}>
                    <IconSymbol name="mappin.circle.fill" size={16} color={C.primary} />
                  </View>
                  <View style={styles.locationTextWrap}>
                    <Text style={{ color: C.text, fontFamily: FontFamily.interSemiBold, fontSize: 14 }}>
                      {heritage.title}
                    </Text>
                    <Text style={{ color: C.textSecondary, fontFamily: FontFamily.inter, fontSize: 12, marginTop: 2 }}>
                      {heritage.province ?? 'Nam Bộ, Việt Nam'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions row */}
              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: 4 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    height: 44,
                    borderRadius: BorderRadius.full,
                    borderWidth: 1.5,
                    borderColor: C.primary,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onPress={() => router.push('/map')}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="map.fill" size={14} color={C.primary} />
                  <Text style={{ color: C.primary, fontFamily: FontFamily.interSemiBold, fontSize: 13, fontWeight: '700' }}>
                    {language === 'vi' ? 'Xem Bản Đồ' : language === 'km' ? 'មើលផែនទី' : 'View Map'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    height: 44,
                    borderRadius: BorderRadius.full,
                    backgroundColor: C.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onPress={handleGetDirections}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="location.fill" size={14} color="#131313" />
                  <Text style={{ color: '#131313', fontFamily: FontFamily.interSemiBold, fontSize: 13, fontWeight: '700' }}>
                    {language === 'vi' ? 'Chỉ Đường Đi' : language === 'km' ? 'ចង្អុលផ្លូវ' : 'Get Directions'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>

        <View style={{ height: 40 }} />
      </RNAnimated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Loading
  loadingScreen: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md,
  },
  loadingText: { ...Typography.bodyMedium, marginTop: Spacing.sm },
  backPillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  backPillBtnText: { ...Typography.labelLarge, color: '#131313', fontWeight: '700' },

  // Sticky header
  stickyHeader: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: Spacing.containerMargin + 52,
    alignItems: 'center',
    borderBottomWidth: 0.5,
  },
  stickyHeaderTitle: {
    ...Typography.titleMedium,
    textAlign: 'center',
  },

  // Floating buttons
  floatingBtns: {
    position: 'absolute',
    top: 12,
    left: Spacing.containerMargin,
    right: Spacing.containerMargin,
    zIndex: 101,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatBtnGroup: { flexDirection: 'row', gap: Spacing.sm },
  floatBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 0.5,
    ...Platform.select({
      web: { backdropFilter: 'blur(12px)' } as any,
      default: {},
    }),
    ...Shadows.medium,
  },

  // Hero
  heroWrap: { width: SW, height: HERO_H, position: 'relative', overflow: 'hidden' },
  heroImgContainer: { width: '100%', height: HERO_H + 60, position: 'absolute', top: -30 },
  heroImage: { width: '100%', height: '100%' },
  heroBotGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.containerMargin,
    paddingBottom: 28,
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    marginBottom: 4,
  },
  typeBadgeText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 10, letterSpacing: 1.2, fontWeight: '700',
  },
  heroTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontFamily: FontFamily.inter,
    fontSize: 15, lineHeight: 22,
  },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  metaChipText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12, color: 'rgba(255,255,255,0.88)', fontWeight: '500',
  },

  // Stats bar
  statsBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.containerMargin,
    borderBottomWidth: 0.5,
  },
  statItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  statDivider: { width: 0.5, height: 22 },
  statVal: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14, fontWeight: '600',
  },
  statLabel: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
  },

  // Content
  contentWrap: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  contentSection: {
    borderRadius: BorderRadius.xl,
    borderWidth: 0.5,
    padding: Spacing.md,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccentBar: {
    width: 3.5, height: 20,
    borderRadius: BorderRadius.full,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    flex: 1,
  },
  seeAllText: {
    ...Typography.labelMedium,
    fontWeight: '600',
  },
  bodyText: {
    ...Typography.bodyMedium,
    lineHeight: 27,
  },

  // Highlights
  highlightsList: { gap: 10 },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    padding: 12,
  },
  highlightNum: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 0.5,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  highlightNumText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12, fontWeight: '700',
  },
  highlightText: {
    ...Typography.bodySmall,
    flex: 1,
    lineHeight: 22,
  },

  // Gallery
  galleryMain: {
    width: '100%',
    height: 210,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImgCounter: {
    position: 'absolute',
    bottom: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  galleryImgCounterText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12, color: '#fff',
  },
  galleryTapHint: {
    position: 'absolute',
    bottom: 10, left: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: BorderRadius.full,
    padding: 6,
  },
  galleryThumbRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  galleryThumb: {
    flex: 1,
    height: 72,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  activeThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(242,202,80,0.25)',
  },

  // Location banner
  locationBanner: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.md,
  },
  locationLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  locationIconWrap: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  locationTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
});