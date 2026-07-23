import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography, Shadows, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { fetchArticlesByAuthor, type ArticleDocument, type ArticleStatus } from '@/lib/article-repository';
import { useAuthSession } from '@/lib/auth-session';
import { getArticleImageSource } from '@/constants/image-resolver';

export default function MyArticlesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { firebaseUser } = useAuthSession();
  const { language } = useLanguage();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseUser) {
      loadUserArticles();
    } else {
      setLoading(false);
    }
  }, [firebaseUser]);

  const loadUserArticles = async () => {
    if (!firebaseUser) return;
    try {
      setLoading(true);
      const data = await fetchArticlesByAuthor(firebaseUser.uid);
      setArticles(data);
    } catch (error) {
      console.error('Error fetching user articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status?: ArticleStatus, published?: boolean) => {
    const finalStatus: ArticleStatus = status ?? (published ? 'published' : 'pending');
    switch (finalStatus) {
      case 'published':
        return {
          label: language === 'vi' ? 'Đã duyệt' : language === 'km' ? 'បានអនុម័ត' : 'Approved',
          bg: isDark ? 'rgba(127, 222, 221, 0.15)' : 'rgba(0, 112, 115, 0.1)',
          color: C.accent,
          icon: 'checkmark.circle.fill' as const,
        };
      case 'rejected':
        return {
          label: language === 'vi' ? 'Bị từ chối' : language === 'km' ? 'បានបដិសេធ' : 'Rejected',
          bg: isDark ? 'rgba(255, 180, 171, 0.15)' : 'rgba(186, 26, 26, 0.1)',
          color: C.error,
          icon: 'exclamationmark.octagon.fill' as const,
        };
      default:
        return {
          label: language === 'vi' ? 'Đang chờ duyệt' : language === 'km' ? 'រង់ចាំការអនុម័ត' : 'Pending',
          bg: isDark ? 'rgba(242, 202, 80, 0.15)' : 'rgba(182, 139, 30, 0.1)',
          color: C.primary,
          icon: 'clock.fill' as const,
        };
    }
  };

  if (!firebaseUser) {
    return (
      <View style={[styles.screen, { backgroundColor: C.background, paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: `${C.primary}15` }]}>
            <IconSymbol name="chevron.left" size={18} color={C.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: C.primary }]}>
            {language === 'vi' ? 'Bài viết của tôi' : language === 'km' ? 'អត្ថបទរបស់ខ្ញុំ' : 'My Articles'}
          </Text>
        </View>
        <View style={[styles.centerContainer, { paddingHorizontal: Spacing.xl }]}>
          {/* Guest Avatar Placeholder */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={[
              styles.avatarWrap, 
              { 
                backgroundColor: C.backgroundSecondary,
                borderColor: isDark ? 'rgba(242, 202, 80, 0.45)' : 'rgba(182, 139, 30, 0.35)',
                borderWidth: 2,
              }
            ]}
          >
            <IconSymbol name="person.fill" size={48} color={C.primary} />
          </Animated.View>

          {/* Heading */}
          <Animated.Text 
            entering={FadeInDown.delay(100).duration(600)}
            style={[styles.lockTitle, { color: isDark ? C.primary : C.primaryDark }]}
          >
            {language === 'vi' ? 'Yêu cầu đăng nhập' : language === 'km' ? 'តម្រូវឲ្យចូល' : 'Login Required'}
          </Animated.Text>

          {/* Message */}
          <Animated.Text 
            entering={FadeInDown.delay(150).duration(600)}
            style={[styles.lockMessage, { color: C.textSecondary }]}
          >
            {language === 'vi' ? 'Vui lòng đăng nhập để xem danh sách bài viết đóng góp của bạn.' : language === 'km' ? 'សូមចូលដើម្បីមើលបញ្ជីអត្ថបទដែលអ្នកបានចូលរួម។' : 'Please log in to view your contributed articles.'}
          </Animated.Text>

          {/* Login Button */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.loginBtnWrapper}
              onPress={() => router.push('/auth')}
              activeOpacity={0.85}
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
                  <Text style={styles.loginBtnText}>
                    {language === 'vi' ? 'Đăng nhập ngay' : language === 'km' ? 'ចូលឥឡូវនេះ' : 'Log in now'}
                  </Text>
                  <IconSymbol name="chevron.right" size={14} color="rgba(19,19,19,0.6)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { backgroundColor: `${C.primary}15` }, pressed ? { opacity: 0.7 } : {}]}
        >
          <IconSymbol name="chevron.left" size={18} color={C.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: C.primary }]}>
          {language === 'vi' ? 'Bài viết của tôi' : language === 'km' ? 'អត្ថបទរបស់ខ្ញុំ' : 'My Articles'}
        </Text>
        <Pressable
          onPress={loadUserArticles}
          style={({ pressed }) => [styles.refreshBtn, { backgroundColor: `${C.primary}15` }, pressed ? { opacity: 0.7 } : {}]}
        >
          <IconSymbol name="arrow.clockwise" size={16} color={C.primary} />
        </Pressable>
      </Animated.View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={[styles.loadingText, { color: C.textSecondary }]}>
            {language === 'vi' ? 'Đang tải danh sách bài viết...' : language === 'km' ? 'កំពុងទាញយកបញ្ជីអត្ថបទ...' : 'Loading articles list...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconBg, { backgroundColor: C.backgroundSecondary }]}>
                <IconSymbol name="doc.text" size={36} color={C.textTertiary} />
              </View>
              <Text style={[styles.emptyTitle, { color: C.text }]}>
                {language === 'vi' ? 'Chưa đóng góp bài viết nào' : language === 'km' ? 'មិនទាន់បានចូលរួមអត្ថបទនៅឡើយទេ' : 'No articles contributed yet'}
              </Text>
              <Text style={[styles.emptyDesc, { color: C.textSecondary }]}>
                {language === 'vi' ? 'Bài viết bạn chia sẻ về văn hóa, lịch sử và di sản sẽ xuất hiện ở đây sau khi bạn gửi.' : language === 'km' ? 'អត្ថបទដែលអ្នកចែករំលែកអំពីវប្បធម៌ ប្រវត្តិសាស្ត្រ និងបេតិកភណ្ឌនឹងបង្ហាញនៅទីនេះ។' : 'Articles you share about culture, history and heritage will appear here after you submit.'}
              </Text>
              <Pressable
                style={({ pressed }) => [styles.contributeBtn, { backgroundColor: C.primary }, pressed ? { opacity: 0.9 } : {}]}
                onPress={() => router.push('/articles/new')}
              >
                <Text style={styles.contributeBtnText}>
                  {language === 'vi' ? 'Viết bài ngay' : language === 'km' ? 'សរសេរអត្ថបទឥឡូវនេះ' : 'Write an article now'}
                </Text>
              </Pressable>
            </View>
          }
          renderItem={({ item, index }) => {
            const sd = getStatusDetails(item.status, item.published);
            return (
              <Animated.View entering={FadeInDown.delay(100 + index * 40).duration(450)}>
                <Pressable
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: isDark ? 'rgba(28, 28, 28, 0.8)' : 'rgba(255, 254, 250, 0.95)',
                      borderColor: isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(182, 139, 30, 0.16)',
                    },
                    pressed ? { opacity: 0.9 } : {},
                  ]}
                  onPress={() => router.push(`/articles/${item.id}` as Href)}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: sd.bg, borderColor: `${sd.color}40` }]}>
                      <IconSymbol name={sd.icon} size={12} color={sd.color} />
                      <Text style={[styles.statusText, { color: sd.color }]}>{sd.label}</Text>
                    </View>
                    <Text style={[styles.categoryText, { color: C.textTertiary }]}>
                      {item.category?.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Image source={getArticleImageSource(item.id, item.coverImage, item.category)} style={styles.thumbnail} />
                    <View style={styles.textWrap}>
                      <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={[styles.dateText, { color: C.textSecondary }]}>
                        {language === 'vi' ? 'Ngày gửi' : language === 'km' ? 'កាលបរិច្ឆេទ' : 'Date'}: {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'km' ? 'km-KH' : 'en-US') : '')}
                      </Text>
                    </View>
                  </View>

                  {item.summary ? (
                    <Text style={[styles.summaryText, { color: C.textTertiary }]} numberOfLines={2}>
                      {item.summary}
                    </Text>
                  ) : null}

                  {item.status === 'rejected' && item.rejectReason ? (
                    <View style={[styles.rejectBox, { backgroundColor: `${C.error}08`, borderColor: `${C.error}25` }]}>
                      <IconSymbol name="info.circle.fill" size={12} color={C.error} />
                      <Text style={[styles.rejectReason, { color: C.error }]}>
                        Lý do từ chối: {item.rejectReason}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              </Animated.View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(182, 139, 30, 0.15)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.titleLarge,
    fontFamily: FontFamily.playfairBold,
    flex: 1,
    marginLeft: Spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.goldGlow,
  },
  lockTitle: {
    fontSize: 24,
    fontFamily: FontFamily.playfairBold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  lockMessage: {
    fontSize: 15,
    fontFamily: FontFamily.inter,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  loadingText: {
    fontFamily: FontFamily.inter,
    fontSize: 14,
    marginTop: Spacing.sm,
  },
  messageTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 20,
    marginTop: Spacing.sm,
  },
  messageDesc: {
    fontFamily: FontFamily.inter,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
  listContainer: {
    padding: Spacing.containerMargin,
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    marginTop: 40,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyDesc: {
    fontFamily: FontFamily.inter,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    color: '#8E7D6A',
  },
  contributeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    ...Shadows.goldGlow,
  },
  contributeBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    color: '#131313',
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 0.5,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  categoryText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
    flexShrink: 0,
  },
  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 0.5,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  dateText: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
  },
  summaryText: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 2,
  },
  rejectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 0.5,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rejectReason: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    flex: 1,
  },
});
