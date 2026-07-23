import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Colors, BorderRadius, FontFamily, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { useRequireAdmin } from '@/lib/auth-session';
import { fetchFestivals, deleteFestival } from '@/lib/festival-repository';
import { getFestivalImageSource } from '@/constants/image-resolver';
import type { FestivalItem } from '@/constants/festivals';

export default function AdminFestivalsScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolvedColorScheme } = useColorSchemePreference();
  const { language } = useLanguage();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const loadFestivals = async () => {
    try {
      setLoading(true);
      const data = await fetchFestivals();
      setFestivals(data);
    } catch (err) {
      console.error('Error fetching festivals:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!authLoading) {
        loadFestivals();
      }
    }, [authLoading])
  );

  const handleDelete = (item: FestivalItem) => {
    const titleText = typeof item.title === 'string' ? item.title : item.title.vi;
    setAlertConfig({
      visible: true,
      type: 'warning',
      title: 'Xóa Lễ Hội',
      message: `Bạn có chắc chắn muốn xóa lễ hội "${titleText}"?`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      onConfirm: async () => {
        try {
          await deleteFestival(item.id);
          setFestivals((prev) => prev.filter((f) => f.id !== item.id));
          setTimeout(() => {
            setAlertConfig({
              visible: true,
              type: 'success',
              title: 'Thành công',
              message: 'Đã xóa lễ hội thành công.',
            });
          }, 200);
        } catch {
          setTimeout(() => {
            setAlertConfig({
              visible: true,
              type: 'error',
              title: 'Lỗi',
              message: 'Không thể xóa lễ hội. Vui lòng thử lại.',
            });
          }, 200);
        }
      },
    });
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Đang tải danh sách lễ hội...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Sticky Header */}
      <View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: isDark ? 'rgba(19,19,19,0.95)' : 'rgba(249,246,240,0.97)',
            borderBottomColor: `${C.border}40`,
            paddingTop: Math.max(insets.top, 12),
          },
        ]}
      >
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { backgroundColor: `${C.primary}15` }, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={18} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.primary }]}>
            {language === 'vi' ? 'Quản lý Lễ Hội' : language === 'km' ? 'គ្រប់គ្រងពិធីបុណ្យ' : 'Festival Management'}
          </Text>
          <Pressable
            onPress={() => router.push('/admin/festivals/edit' as any)}
            style={({ pressed }) => [styles.addBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
          >
            <IconSymbol name="plus" size={16} color="#131313" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <Text style={[styles.bannerTitle, { color: C.text }]}>
            {language === 'vi' ? `Sự kiện Lễ hội (${festivals.length})` : language === 'km' ? `ព្រឹត្តិការណ៍ពិធីបុណ្យ (${festivals.length})` : `Festival Events (${festivals.length})`}
          </Text>
          <Text style={[styles.bannerSub, { color: C.textSecondary }]}>
            {language === 'vi' ? 'Chỉnh sửa thời gian đếm ngược thời gian thực và thông tin nghi lễ.' : language === 'km' ? 'កែសម្រួលការរាប់ថយក្រោយតាមពេលវេលាជាក់ស្តែង និងព័ត៌មានពិធីសាសនា។' : 'Edit real-time countdown timers and ritual information.'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          {festivals.map((item, idx) => {
            const titleText = typeof item.title === 'string' ? item.title : (item.title[language] || item.title.vi || item.title.en);
            const locText = typeof item.location === 'string' ? item.location : (item.location[language] || item.location.vi || item.location.en);

            return (
              <Animated.View key={item.id} entering={FadeInDown.delay(idx * 50).duration(300)}>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9',
                      borderColor: `${C.primary}30`,
                    },
                  ]}
                >
                  <Image source={getFestivalImageSource(item.id, item.coverImage)} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.khmerTitle}>{item.khmerTitle}</Text>
                      {item.featured && (
                        <Text style={styles.featuredBadge}>
                          {language === 'vi' ? 'TIÊU BIỂU' : language === 'km' ? 'ពិសេស' : 'FEATURED'}
                        </Text>
                      )}
                    </View>

                    <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={1}>
                      {titleText}
                    </Text>
                    <Text style={[styles.cardLocation, { color: C.textSecondary }]} numberOfLines={1}>
                      📍 {locText}
                    </Text>
                    <Text style={styles.cardTargetDate}>
                      ⏱️ {language === 'vi' ? 'Đếm ngược' : language === 'km' ? 'រាប់ថយក្រោយ' : 'Countdown'}: {new Date(item.targetDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'km' ? 'km-KH' : 'en-US')}
                    </Text>

                    <View style={styles.cardActions}>
                      <Pressable
                        style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && { opacity: 0.8 }]}
                        onPress={() => router.push({ pathname: '/admin/festivals/edit', params: { id: item.id } } as any)}
                      >
                        <IconSymbol name="pencil" size={12} color="#131313" />
                        <Text style={styles.editBtnText}>
                          {language === 'vi' ? 'Chỉnh sửa' : language === 'km' ? 'កែប្រែ' : 'Edit'}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && { opacity: 0.8 }]}
                        onPress={() => handleDelete(item)}
                      >
                        <IconSymbol name="trash.fill" size={12} color="#FFB4AB" />
                        <Text style={styles.deleteBtnText}>
                          {language === 'vi' ? 'Xóa' : language === 'km' ? 'លុប' : 'Delete'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          })}
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
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  loadingText: { ...Typography.bodyMedium },
  stickyHeader: { paddingBottom: 14, borderBottomWidth: 0.5, zIndex: 100 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.containerMargin },
  backBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(182,139,30,0.2)' },
  addBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.headlineMedium, fontFamily: FontFamily.playfairBold, letterSpacing: -0.5 },
  scrollContent: { paddingBottom: 100 },
  bannerContainer: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md },
  bannerTitle: { fontSize: 20, fontWeight: '700', fontFamily: FontFamily.playfairBold },
  bannerSub: { fontSize: 12, marginTop: 4, marginBottom: 14 },
  listContainer: { paddingHorizontal: Spacing.containerMargin, gap: 12 },
  card: { flexDirection: 'row', borderRadius: BorderRadius.lg, borderWidth: 1, overflow: 'hidden', height: 130 },
  cardImage: { width: 110, height: 130, resizeMode: 'cover' },
  cardContent: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  khmerTitle: { color: '#D4AF37', fontSize: 11, fontWeight: '600' },
  featuredBadge: { backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  cardLocation: { fontSize: 11 },
  cardTargetDate: { fontSize: 10, color: '#D4AF37', fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  editBtn: { backgroundColor: '#F2CA50' },
  editBtnText: { color: '#131313', fontSize: 10, fontWeight: '800' },
  deleteBtn: { backgroundColor: 'rgba(255,180,171,0.2)', borderWidth: 1, borderColor: '#FFB4AB' },
  deleteBtnText: { color: '#FFB4AB', fontSize: 10, fontWeight: '700' },
});
