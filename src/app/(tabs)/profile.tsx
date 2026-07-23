import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { type Language } from '@/constants/languages';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { useAuthSession } from '@/lib/auth-session';
import { getFirebaseAuth } from '@/lib/firebase';
import { fetchViewedItemsCount } from '@/lib/views-repository';
import { fetchLikedHeritagesLocally } from '@/lib/heritage-repository';
import { fetchLikedArticlesLocally } from '@/lib/article-repository';
import { countUserComments } from '@/lib/comment-repository';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { firebaseUser, profile, isAdmin, isStaff, isModerator } = useAuthSession();
  const { language, setLanguage, t } = useLanguage();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const [viewedCount, setViewedCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadStats() {
        try {
          const views = await fetchViewedItemsCount();
          const likedHeritages = await fetchLikedHeritagesLocally();
          const likedArticles = await fetchLikedArticlesLocally();
          const comments = await countUserComments(firebaseUser?.uid);

          if (isMounted) {
            setViewedCount(views);
            setFavoritesCount(likedHeritages.length + likedArticles.length);
            setCommentsCount(comments);
          }
        } catch (err) {
          console.error('Error loading profile stats:', err);
        }
      }
      loadStats();
      return () => {
        isMounted = false;
      };
    }, [firebaseUser?.uid])
  );

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) await firebaseSignOut(auth);
  };

  const displayName = profile?.displayName ?? firebaseUser?.email?.split('@')[0] ?? t.profile.guest;
  const email = firebaseUser?.email ?? '';

  const stats = [
    { label: t.profile.stats.viewed, value: String(viewedCount), icon: 'eye.fill' as const, color: C.primary },
    { label: t.profile.stats.favorites, value: String(favoritesCount), icon: 'heart.fill' as const, color: isDark ? '#FFB4A8' : '#A83B2D' },
    { label: t.profile.stats.reviews, value: String(commentsCount), icon: 'star.fill' as const, color: C.accent },
  ];

  const menuItems = [
    ...(isStaff ? [{
      id: 'admin',
      label: language === 'vi'
        ? (isAdmin ? 'Quản trị viên' : 'Phó quản trị viên')
        : language === 'km'
          ? (isAdmin ? 'អ្នកគ្រប់គ្រង' : 'អនុអ្នកគ្រប់គ្រង')
          : (isAdmin ? 'Admin' : 'Vice Admin'),
      icon: 'crown.fill' as const,
      color: C.primary,
      route: '/admin' as const
    }] : []),
    ...(firebaseUser ? [{ id: 'edit-profile', label: language === 'vi' ? 'Chỉnh sửa hồ sơ' : language === 'km' ? 'កែសម្រួលប្រវត្តិរូប' : 'Edit Profile', icon: 'person.crop.circle.fill' as const, color: C.primary, route: '/profile/edit' as const }] : []),
    { id: 'settings', label: t.profile.menu.settings, icon: 'gearshape.fill' as const, color: C.primary, route: '/profile/settings' as const },
    { id: 'notifications', label: t.profile.menu.notifications, icon: 'bell.fill' as const, color: C.accent, route: '/profile/notifications' as const },
    ...(firebaseUser ? [{ id: 'my-articles', label: language === 'vi' ? 'Bài viết của tôi' : language === 'km' ? 'អត្ថបទរបស់ខ្ញុំ' : 'My Articles', icon: 'doc.text.fill' as const, color: C.accent, route: '/profile/my-articles' as const }] : []),
    { id: 'favorites', label: t.profile.menu.favorites, icon: 'heart.fill' as const, color: isDark ? '#FFB4A8' : '#A83B2D', route: '/profile/favorites' as const },
    { id: 'history', label: t.profile.menu.history, icon: 'clock.fill' as const, color: C.textSecondary, route: '/profile/history' as const },
    { id: 'help', label: t.profile.menu.help, icon: 'questionmark.circle.fill' as const, color: C.textSecondary, route: '/profile/help' as const },
    { id: 'about', label: t.profile.menu.about, icon: 'info.circle.fill' as const, color: C.textSecondary, route: '/profile/about' as const },
  ];

  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'km', label: 'ភាសាខ្មែរ', flag: '🇰🇭' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: C.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header / Avatar section ── */}
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.headerSection, { paddingTop: insets.top + Spacing.lg }]}
      >
        {/* Background */}
        <View style={styles.headerBg}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80' }}
            style={[StyleSheet.absoluteFill, { opacity: isDark ? 0.15 : 0.25 }]}
            resizeMode="cover"
          />
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: isDark ? 'rgba(19,19,19,0.85)' : 'rgba(249,246,240,0.82)',
          }]} />
        </View>

        {/* Avatar */}
        <Pressable
          disabled={!firebaseUser}
          onPress={() => router.push('/profile/edit')}
          style={({ pressed }) => [
            styles.avatarWrap,
            pressed && { opacity: 0.85 }
          ]}
        >
          {profile?.photoURL ? (
            <Image source={{ uri: profile.photoURL }} style={[styles.avatar, { borderColor: `${C.primary}50` }]} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: C.surfaceHigh, justifyContent: 'center', alignItems: 'center', borderColor: `${C.primary}40` }]}>
              <IconSymbol name="person.fill" size={48} color={C.primary} />
            </View>
          )}
          {isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: C.primary, borderColor: C.background }]}>
              <IconSymbol name="crown.fill" size={10} color={isDark ? '#131313' : '#FFFFFF'} />
            </View>
          )}
        </Pressable>

        {/* Name */}
        <Text style={[styles.displayName, { color: C.text }]}>{displayName}</Text>
        {email ? <Text style={[styles.emailText, { color: C.textTertiary }]}>{email}</Text> : null}

        {/* Role badge */}
        <View style={[
          styles.roleBadge,
          { backgroundColor: isDark ? `${C.textTertiary}20` : 'rgba(182,139,30,0.08)', borderColor: isDark ? `${C.textTertiary}40` : 'rgba(182,139,30,0.2)' },
          isAdmin && { backgroundColor: `${C.primary}20`, borderColor: `${C.primary}40` },
          isModerator && { backgroundColor: `${C.accent}20`, borderColor: `${C.accent}40` },
        ]}>
          <Text style={[
            styles.roleText,
            { color: C.textTertiary },
            isAdmin && { color: C.primary },
            isModerator && { color: C.accent }
          ]}>
            {isAdmin
              ? '✦ ADMIN'
              : isModerator
                ? (language === 'vi' ? '✦ PHÓ QUẢN TRỊ VIÊN' : language === 'km' ? '✦ អនុអ្នកគ្រប់គ្រង' : '✦ VICE ADMIN')
                : 'MEMBER'}
          </Text>
        </View>

        {/* Auth button */}
        {firebaseUser ? (
          <Pressable
            style={({ pressed }) => [
              styles.loginBtnWrapper,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 },
            ]}
            onPress={handleSignOut}
          >
            <LinearGradient
              colors={isDark ? ['#FF8A80', '#C62828'] : ['#FF8A80', '#D32F2F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginBtnGradient}
            >
              <View style={styles.loginBtnContent}>
                <View style={[styles.loginBtnIconWrap, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <IconSymbol name="arrow.left.circle.fill" size={16} color="#FFFFFF" />
                </View>
                <Text style={[styles.loginBtnText, { color: '#FFFFFF' }]}>{t.profile.signOut}</Text>
                <IconSymbol name="chevron.right" size={14} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.loginBtnWrapper,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 },
            ]}
            onPress={() => router.push('/auth')}
          >
            <LinearGradient
              colors={isDark ? ['#FFE082', '#C99E2E'] : ['#F9D368', '#B68B1E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginBtnGradient}
            >
              <View style={styles.loginBtnContent}>
                <View style={styles.loginBtnIconWrap}>
                  <IconSymbol name="person.fill" size={16} color="#131313" />
                </View>
                <Text style={styles.loginBtnText}>{t.profile.login}</Text>
                <IconSymbol name="chevron.right" size={14} color="rgba(19,19,19,0.6)" />
              </View>
            </LinearGradient>
          </Pressable>
        )}
      </Animated.View>

      {/* ── Stats ── */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={[
            styles.statCard,
            { 
              backgroundColor: isDark ? 'rgba(28,28,28,0.8)' : 'rgba(255,254,250,0.95)', 
              borderColor: isDark ? 'rgba(212,175,55,0.15)' : 'rgba(182,139,30,0.16)' 
            }
          ]}>
            <IconSymbol name={s.icon} size={18} color={s.color} />
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: C.textTertiary }]}>{s.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* ── Language picker ── */}
      <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="globe" size={14} color={C.textTertiary} />
          <Text style={[styles.sectionTitle, { color: C.textTertiary, marginBottom: 0 }]}>
            {language === 'vi' ? 'Ngôn ngữ' : language === 'km' ? 'ភាសា' : 'Language'}
          </Text>
        </View>
        <View style={styles.langRow}>
          {languages.map(l => {
            const isActive = language === l.code;
            return (
              <Pressable
                key={l.code}
                style={[
                  styles.langPill,
                  { borderColor: C.border },
                  isActive && { backgroundColor: `${C.primary}20`, borderColor: `${C.primary}50` },
                ]}
                onPress={() => setLanguage(l.code)}
              >
                <Text style={styles.langFlag}>{l.flag}</Text>
                <Text style={[styles.langLabel, { color: C.textTertiary }, isActive && { color: C.primary, fontWeight: '700' }]}>
                  {l.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* ── Account & Utilities ── */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="slider.horizontal.3" size={14} color={C.textTertiary} />
          <Text style={[styles.sectionTitle, { color: C.textTertiary, marginBottom: 0 }]}>
            {language === 'vi' ? 'Tài khoản & Tiện ích' : language === 'km' ? 'គណនី និងឧបករណ៍ប្រើប្រាស់' : 'Account & Utilities'}
          </Text>
        </View>
        <View style={styles.menuList}>
          {menuItems.map((item, idx) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(320 + idx * 40).duration(400)}>
              <Pressable
                style={({ pressed }) => [
                  { width: '100%' },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => router.push(item.route)}
              >
                <View
                  style={[
                    styles.menuRow,
                    { 
                      backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.7)', 
                      borderColor: `${C.border}35`,
                      borderLeftWidth: 3,
                      borderLeftColor: item.color,
                    }
                  ]}
                >
                  <View style={styles.menuLeftGroup}>
                    <View style={[styles.menuIconWrap, { backgroundColor: `${item.color}14` }]}>
                      <IconSymbol name={item.icon} size={15} color={item.color} />
                    </View>
                    <Text style={{ color: C.text, fontFamily: FontFamily.interSemiBold, fontSize: 14 }}>
                      {item.label}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={12} color={C.textTertiary} />
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Header
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2.5,
    ...Shadows.goldGlow,
  },
  adminBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2,
  },
  displayName: {
    fontFamily: FontFamily.playfair,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    marginBottom: 4,
  },
  emailText: {
    fontFamily: FontFamily.inter,
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  roleBadge: {
    paddingHorizontal: Spacing.md, paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
    marginBottom: Spacing.lg,
  },
  roleText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },

  signOutBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    minWidth: 200,
  },
  signOutIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    letterSpacing: 0.3,
    fontWeight: '700',
  },
  loginBtnWrapper: {
    alignSelf: 'center',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#B68B1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  loginBtnGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    minWidth: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loginBtnIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(19,19,19,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: '#131313',
  },

  // Stats
  statsRow: {
    flexDirection: 'row', gap: Spacing.md,
    marginHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1, 
    alignItems: 'center', 
    gap: 4,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      default: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  statValue: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
  },
  statLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 11,
    textAlign: 'center',
  },

  // Sections
  section: {
    marginHorizontal: Spacing.containerMargin,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },

  // Language
  langRow: { flexDirection: 'row', gap: Spacing.sm },
  langPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: Spacing.sm, borderRadius: BorderRadius.full,
    borderWidth: 0.5,
  },
  langFlag: { fontSize: 16 },
  langLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 11,
  },

  // Menu
  menuList: { gap: Spacing.xs },
  menuRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.md,
    ...Shadows.small,
  },
  menuLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  menuLabel: {
    fontFamily: FontFamily.inter,
    fontSize: 16,
    flex: 1,
  },
});
