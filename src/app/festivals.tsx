import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { festivalItems, type FestivalItem } from '@/constants/festivals';
import { Colors, BorderRadius, FontFamily, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';
import { getFestivalImageSource } from '@/constants/image-resolver';
import { fetchFestivals } from '@/lib/festival-repository';
import { TranslatedText } from '@/components/translated-text';
import { useTranslateArray, useTranslateMultiLang } from '@/lib/translation-helper';

const { width } = Dimensions.get('window');

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function FestivalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { language } = useLanguage();
  const isDark = colorScheme === 'dark';
  const C = Colors[colorScheme ?? 'dark'];

  const lang = (language === 'km' || language === 'en') ? language : 'vi';

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'featured'>('all');
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [allFestivals, setAllFestivals] = useState<FestivalItem[]>(festivalItems);

  // Default target is the first featured festival
  const [heroFestival, setHeroFestival] = useState<FestivalItem>(
    festivalItems.find((f) => f.featured) || festivalItems[0]
  );
  const translatedHeroTitle = useTranslateMultiLang(heroFestival.title);
  const translatedHeroDate = useTranslateMultiLang(heroFestival.dateDisplay);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const RitualsList = useCallback(({ list }: { list: string[] | undefined }) => {
    const translated = useTranslateArray(list);
    return (
      <>
        {translated.map((r, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>🪔</Text>
            <Text style={[styles.bulletText, { color: C.text }]}>{r}</Text>
          </View>
        ))}
      </>
    );
  }, [C.text]);

  const FoodsList = useCallback(({ list }: { list: string[] | undefined }) => {
    const translated = useTranslateArray(list);
    return (
      <View style={styles.tagWrap}>
        {translated.map((f, i) => (
          <View key={i} style={styles.foodTag}>
            <Text style={styles.foodTagText}>{f}</Text>
          </View>
        ))}
      </View>
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFestivals();
        if (data && data.length > 0) {
          setAllFestivals(data);
          setHeroFestival(data.find((f) => f.featured) || data[0]);
        }
      } catch (e) {
        console.error('Error loading live festivals:', e);
      }
    })();
  }, []);

  // Calculate live countdown timer
  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(heroFestival.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [heroFestival]);

  const filteredFestivals = allFestivals.filter((item) => {
    if (activeFilter === 'featured') return item.featured;
    if (activeFilter === 'upcoming') {
      const target = new Date(item.targetDate).getTime();
      return target > new Date().getTime();
    }
    return true;
  });

  const openDetail = (item: FestivalItem) => {
    setSelectedFestival(item);
    setModalVisible(true);
  };

  // Static translations dictionary for UI labels
  const uiTexts = {
    vi: {
      headerTitle: 'Lịch Lễ Hội Khmer',
      headerSub: 'Sự kiện & Đếm ngược thời gian thực',
      upcomingBadge: 'SẮP DIỄN RA',
      days: 'NGÀY',
      hours: 'GIỜ',
      mins: 'PHÚT',
      secs: 'GIÂY',
      discoverBtn: 'Khám phá nghi thức lễ hội',
      sectionTitle: 'Danh sách sự kiện văn hóa',
      filterAll: 'Tất cả lễ hội',
      filterFeatured: '⭐ Tiêu biểu',
      filterUpcoming: '⏳ Sắp tới',
      featuredTag: 'TIÊU BIỂU',
      countingDown: 'Đang đếm ngược',
      selectCountdown: 'Đếm ngược ⏱️',
      ritualHeader: '📖 Giới thiệu nghi lễ',
      stepsHeader: '✨ Các nghi thức chính',
      foodHeader: '🍲 Ẩm thực lễ hội',
      closeBtn: 'Đóng',
    },
    km: {
      headerTitle: 'ប្រតិទិនបុណ្យប្រពៃណី',
      headerSub: 'ព្រឹត្តិការណ៍ និងការរាប់ថយក្រោយ',
      upcomingBadge: 'ជិតមកដល់',
      days: 'ថ្ងៃ',
      hours: 'ម៉ោង',
      mins: 'នាទី',
      secs: 'វិនាទី',
      discoverBtn: 'ស្វែងយល់ពីពិធីបុណ្យ',
      sectionTitle: 'បញ្ជីព្រឹត្តិការណ៍វប្បធម៌',
      filterAll: 'ពិធីបុណ្យទាំងអស់',
      filterFeatured: '⭐ ពិសេស',
      filterUpcoming: '⏳ ជិតមកដល់',
      featuredTag: 'ពិសេស',
      countingDown: 'កំពុងរាប់ថយក្រោយ',
      selectCountdown: 'រាប់ថយក្រោយ ⏱️',
      ritualHeader: '📖 សេចក្តីផ្តើមពិធីបុណ្យ',
      stepsHeader: '✨ ពិធីសំខាន់ៗ',
      foodHeader: '🍲 ម្ហូបអាហារពិធីបុណ្យ',
      closeBtn: 'បិទ',
    },
    en: {
      headerTitle: 'Khmer Festival Calendar',
      headerSub: 'Events & Real-time Live Countdown',
      upcomingBadge: 'UPCOMING',
      days: 'DAYS',
      hours: 'HOURS',
      mins: 'MINS',
      secs: 'SECS',
      discoverBtn: 'Explore Festival Rituals',
      sectionTitle: 'Cultural Events Catalog',
      filterAll: 'All Festivals',
      filterFeatured: '⭐ Featured',
      filterUpcoming: '⏳ Upcoming',
      featuredTag: 'FEATURED',
      countingDown: 'Counting Down',
      selectCountdown: 'Countdown ⏱️',
      ritualHeader: '📖 Ritual Overview',
      stepsHeader: '✨ Key Ceremonies',
      foodHeader: '🍲 Festival Cuisine',
      closeBtn: 'Close',
    },
  }[lang];

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={C.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: C.text }]}>{uiTexts.headerTitle}</Text>
          <Text style={[styles.headerSubtitle, { color: C.textSecondary }]}>{uiTexts.headerSub}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO LIVE COUNTDOWN CARD */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.heroWrap}>
          <Image source={getFestivalImageSource(heroFestival.id, heroFestival.coverImage)} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          
          <View style={styles.heroBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.heroBadgeText}>{uiTexts.upcomingBadge}</Text>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroKhmerTitle}>{heroFestival.khmerTitle}</Text>
            <Text style={styles.heroTitle}>{translatedHeroTitle}</Text>
            <Text style={styles.heroDateDisplay}>📅 {translatedHeroDate}</Text>

            {/* COUNTDOWN DIGITS */}
            <View style={styles.timerContainer}>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{String(timeLeft.days).padStart(2, '0')}</Text>
                <Text style={styles.timerLabel}>{uiTexts.days}</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{String(timeLeft.hours).padStart(2, '0')}</Text>
                <Text style={styles.timerLabel}>{uiTexts.hours}</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
                <Text style={styles.timerLabel}>{uiTexts.mins}</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
                <Text style={styles.timerLabel}>{uiTexts.secs}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.heroBtn,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => openDetail(heroFestival)}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroBtnGradient}
              >
                <Text style={styles.heroBtnText}>{uiTexts.discoverBtn}</Text>
                <IconSymbol name="chevron.right" size={16} color="#000000" />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>

        {/* FILTER BAR */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>{uiTexts.sectionTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
            <Pressable
              style={[
                styles.chip,
                activeFilter === 'all' && styles.chipActive,
                { borderColor: isDark ? 'rgba(212,175,55,0.3)' : '#D0C4B2' }
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.chipText, activeFilter === 'all' && styles.chipTextActive]}>
                {uiTexts.filterAll}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.chip,
                activeFilter === 'featured' && styles.chipActive,
                { borderColor: isDark ? 'rgba(212,175,55,0.3)' : '#D0C4B2' }
              ]}
              onPress={() => setActiveFilter('featured')}
            >
              <Text style={[styles.chipText, activeFilter === 'featured' && styles.chipTextActive]}>
                {uiTexts.filterFeatured}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.chip,
                activeFilter === 'upcoming' && styles.chipActive,
                { borderColor: isDark ? 'rgba(212,175,55,0.3)' : '#D0C4B2' }
              ]}
              onPress={() => setActiveFilter('upcoming')}
            >
              <Text style={[styles.chipText, activeFilter === 'upcoming' && styles.chipTextActive]}>
                {uiTexts.filterUpcoming}
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* FESTIVAL LIST CARDS */}
        <View style={styles.listSection}>
          {filteredFestivals.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(index * 100).duration(400)}>
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.08)',
                  },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }
                ]}
                onPress={() => openDetail(item)}
              >
                <View style={styles.cardImageWrap}>
                  <Image source={getFestivalImageSource(item.id, item.coverImage)} style={styles.cardImage} resizeMode="cover" />
                  {item.featured && (
                    <View style={styles.featuredBadgeWrap}>
                      <Text style={styles.featuredBadge}>{uiTexts.featuredTag}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.cardInfo}>
                  <Text style={styles.cardKhmer}>{item.khmerTitle}</Text>
                  <TranslatedText field={item.title} style={[styles.cardTitle, { color: C.text }]} />
                  <TranslatedText field={item.subtitle} style={[styles.cardSubtitle, { color: C.textSecondary }]} numberOfLines={2} />

                  <View style={styles.cardFooter}>
                    <View style={styles.locTag}>
                      <IconSymbol name="mappin" size={14} color="#D4AF37" />
                      <TranslatedText field={item.location} style={styles.locText} numberOfLines={1} />
                    </View>
                    <Pressable
                      style={[
                        styles.selectCountdownBtn,
                        heroFestival.id === item.id && styles.selectCountdownBtnActive
                      ]}
                      onPress={() => setHeroFestival(item)}
                    >
                      <Text style={[
                        styles.selectCountdownText,
                        heroFestival.id === item.id && styles.selectCountdownTextActive
                      ]}>
                        {heroFestival.id === item.id ? uiTexts.countingDown : uiTexts.selectCountdown}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* FESTIVAL DETAIL MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#191919' : '#FFF' }]}>
            {selectedFestival && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalImageWrap}>
                  <Image source={getFestivalImageSource(selectedFestival.id, selectedFestival.coverImage)} style={styles.modalImage} resizeMode="cover" />
                  <Pressable
                    style={styles.modalCloseBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <IconSymbol name="xmark" size={20} color="#FFF" />
                  </Pressable>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalKhmer}>{selectedFestival.khmerTitle}</Text>
                  <TranslatedText field={selectedFestival.title} style={[styles.modalTitle, { color: C.text }]} />
                  <Text style={styles.modalLocation}>📍 <TranslatedText field={selectedFestival.location} /></Text>

                  <View style={styles.divider} />

                  <Text style={styles.sectionHeading}>{uiTexts.ritualHeader}</Text>
                  <TranslatedText field={selectedFestival.description} style={[styles.modalDesc, { color: C.textSecondary }]} />

                  <Text style={styles.sectionHeading}>{uiTexts.stepsHeader}</Text>
                  <RitualsList list={selectedFestival.rituals?.vi || []} />

                  <Text style={styles.sectionHeading}>{uiTexts.foodHeader}</Text>
                  <FoodsList list={selectedFestival.foods?.vi || []} />

                  <Pressable
                    style={styles.modalDoneBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalDoneText}>{uiTexts.closeBtn}</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', fontFamily: FontFamily.playfairBold },
  headerSubtitle: { fontSize: 11, fontWeight: '500' },
  scrollContent: { paddingBottom: 40 },
  heroWrap: {
    margin: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    height: 360,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    elevation: 8,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  heroImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 8, 5, 0.75)',
  },
  heroBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,175,55,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4D4D', marginRight: 6 },
  heroBadgeText: { color: '#F2CA50', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroContent: { padding: Spacing.md },
  heroKhmerTitle: { color: '#D4AF37', fontSize: 14, fontWeight: '600' },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginVertical: 4, fontFamily: FontFamily.playfairBold },
  heroDateDisplay: { color: '#E0D6C3', fontSize: 13, marginBottom: 12 },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    marginBottom: 14,
  },
  timerBox: { alignItems: 'center', minWidth: 46 },
  timerValue: { color: '#F2CA50', fontSize: 20, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  timerLabel: { color: '#A09580', fontSize: 9, fontWeight: '700', marginTop: 2 },
  timerColon: { color: '#F2CA50', fontSize: 18, fontWeight: '700', marginHorizontal: 2 },
  heroBtn: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(255,215,0,0.5)' },
      default: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  heroBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    gap: 8,
  },
  heroBtnText: { color: '#000000', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  filterSection: { paddingHorizontal: Spacing.md, marginTop: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 10, fontFamily: FontFamily.playfairBold },
  filterBar: { flexDirection: 'row', marginBottom: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  chipActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  chipText: { fontSize: 13, color: '#A09580', fontWeight: '600' },
  chipTextActive: { color: '#131313', fontWeight: '800' },
  listSection: { paddingHorizontal: Spacing.md, marginTop: 10, gap: 16 },
  card: {
    flexDirection: 'column',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    ...Platform.select({
      web: { boxShadow: '0 4px 20px rgba(0,0,0,0.25)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },
  cardImageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  featuredBadgeWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredBadge: { color: '#F2CA50', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardInfo: { padding: 14, gap: 6 },
  cardKhmer: { color: '#D4AF37', fontSize: 12, fontWeight: '700' },
  cardTitle: { fontSize: 18, fontWeight: '800', fontFamily: FontFamily.playfairBold },
  cardSubtitle: { fontSize: 13, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(212,175,55,0.15)' },
  locTag: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  locText: { fontSize: 12, color: '#A09580', fontWeight: '600' },
  selectCountdownBtn: { backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  selectCountdownBtnActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  selectCountdownText: { color: '#D4AF37', fontSize: 11, fontWeight: '800' },
  selectCountdownTextActive: { color: '#131313' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { height: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalImageWrap: { height: 220, width: '100%' },
  modalImage: { width: '100%', height: '100%' },
  modalCloseBtn: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalBody: { padding: Spacing.lg },
  modalKhmer: { color: '#D4AF37', fontSize: 14, fontWeight: '700' },
  modalTitle: { fontSize: 22, fontWeight: '800', marginVertical: 4, fontFamily: FontFamily.playfairBold },
  modalLocation: { color: '#A09580', fontSize: 13, marginBottom: 12 },
  divider: { height: 1, backgroundColor: 'rgba(212,175,55,0.2)', marginVertical: 12 },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: '#D4AF37', marginTop: 12, marginBottom: 8 },
  modalDesc: { fontSize: 14, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { fontSize: 14 },
  bulletText: { fontSize: 13, flex: 1, lineHeight: 20 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 20 },
  foodTag: { backgroundColor: 'rgba(212,175,55,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)' },
  foodTagText: { color: '#F2CA50', fontSize: 12, fontWeight: '600' },
  modalDoneBtn: { backgroundColor: '#D4AF37', paddingVertical: 14, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: 10 },
  modalDoneText: { color: '#131313', fontWeight: '800', fontSize: 15 },
});
