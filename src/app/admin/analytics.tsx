import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, BorderRadius, FontFamily, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { useRequireAdmin } from '@/lib/auth-session';
import { fetchAllArticlesAdmin, type ArticleDocument } from '@/lib/article-repository';
import { fetchHeritages, type HeritageDocument } from '@/lib/heritage-repository';
import { fetchUsers, type UserDocument } from '@/lib/user-repository';
import { festivalItems } from '@/constants/festivals';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsDashboardScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolvedColorScheme } = useColorSchemePreference();
  const { t, language } = useLanguage();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [heritages, setHeritages] = useState<HeritageDocument[]>([]);
  const [users, setUsers] = useState<UserDocument[]>([]);

  useEffect(() => {
    if (!authLoading) {
      (async () => {
        try {
          setLoading(true);
          const [articleData, heritageData, userData] = await Promise.all([
            fetchAllArticlesAdmin(),
            fetchHeritages(),
            fetchUsers(),
          ]);
          setArticles(articleData);
          setHeritages(heritageData);
          setUsers(userData);
        } catch (err) {
          console.error('Error fetching analytics data:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>
          {language === 'vi' ? 'Đang phân tích & tổng hợp dữ liệu hệ thống...' : language === 'km' ? 'កំពុងវិភាគ និងសំយោគទិន្នន័យប្រព័ន្ធ...' : 'Analyzing & synthesizing system data...'}
        </Text>
      </View>
    );
  }

  // --- CALCULATIONS ---
  // Heritages Breakdown
  const totalHeritages = heritages.length;
  const tangibleCount = heritages.filter((h) => h.type === 'tangible' || !h.type).length;
  const intangibleCount = heritages.filter((h) => h.type === 'intangible').length;

  // Province Distribution
  const provinceMap: Record<string, number> = {};
  heritages.forEach((h) => {
    const prov = h.province || (language === 'vi' ? 'Khác' : language === 'km' ? 'ផ្សេងៗ' : 'Other');
    provinceMap[prov] = (provinceMap[prov] || 0) + 1;
  });
  const sortedProvinces = Object.entries(provinceMap).sort((a, b) => b[1] - a[1]);

  // Articles Breakdown
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.published || a.status === 'published').length;
  const pendingArticles = articles.filter((a) => a.status === 'pending').length;
  const rejectedArticles = articles.filter((a) => a.status === 'rejected').length;
  const approvalRate = totalArticles > 0 ? Math.round((publishedArticles / totalArticles) * 100) : 100;

  // Interactions Breakdown
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0) + heritages.reduce((sum, h) => sum + (h.views || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0) + heritages.reduce((sum, h) => sum + (h.likes || 0), 0);

  // Users Breakdown
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const moderatorCount = users.filter((u) => u.role === 'moderator').length;
  const memberCount = users.filter((u) => u.role === 'user' || !u.role).length;

  // Top Content Leaderboards
  const topViewedArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

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
            {language === 'vi' ? 'Thống kê Toàn diện' : language === 'km' ? 'ស្ថិតិគ្រប់ជ្រុងជ្រោយ' : 'Comprehensive Analytics'}
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Title */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.bannerContainer}>
          <Text style={[styles.bannerTitle, { color: C.text }]}>
            {language === 'vi' ? 'Báo cáo Tổng quan 📊' : language === 'km' ? 'របាយការណ៍សង្ខេប 📊' : 'Overview Report 📊'}
          </Text>
          <Text style={[styles.bannerSub, { color: C.textSecondary }]}>
            {language === 'vi' ? 'Tổng hợp thời gian thực dữ liệu di sản, bài viết, tài khoản và tương tác.' : language === 'km' ? 'សំយោគទិន្នន័យបេតិកភណ្ឌ អត្ថបទ គណនី និងការអន្តរកម្មតាមពេលវេលាជាក់ស្តែង។' : 'Real-time synthesis of heritage, articles, users and interactions.'}
          </Text>
        </Animated.View>

        {/* 1. CORE METRICS GRID (4 Main Cards) */}
        <View style={styles.metricsGrid}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.gridCol}>
            <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(242,202,80,0.08)' : '#FFFDF9', borderColor: 'rgba(212,175,55,0.3)' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(212,175,55,0.2)' }]}>
                <IconSymbol name="building.columns.fill" size={20} color="#D4AF37" />
              </View>
              <Text style={[styles.metricValue, { color: C.primary }]}>{totalHeritages}</Text>
              <Text style={[styles.metricLabel, { color: C.textSecondary }]}>
                {language === 'vi' ? 'Di sản Văn hóa' : language === 'km' ? 'បេតិកភណ្ឌវប្បធម៌' : 'Cultural Heritage'}
              </Text>
              <Text style={styles.metricSubDetail}>
                {tangibleCount} {language === 'vi' ? 'Vật thể' : language === 'km' ? 'រូបិយ' : 'Tangible'} · {intangibleCount} {language === 'vi' ? 'Phi vật thể' : language === 'km' ? 'អរូបិយ' : 'Intangible'}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.gridCol}>
            <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(127,222,221,0.08)' : '#F0F9F9', borderColor: 'rgba(127,222,221,0.3)' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(127,222,221,0.2)' }]}>
                <IconSymbol name="doc.text.fill" size={20} color="#7FDEDD" />
              </View>
              <Text style={[styles.metricValue, { color: isDark ? '#7FDEDD' : '#007073' }]}>{totalArticles}</Text>
              <Text style={[styles.metricLabel, { color: C.textSecondary }]}>
                {language === 'vi' ? 'Bài viết Hệ thống' : language === 'km' ? 'អត្ថបទប្រព័ន្ធ' : 'System Articles'}
              </Text>
              <Text style={styles.metricSubDetail}>
                {publishedArticles} {language === 'vi' ? 'Đã duyệt' : language === 'km' ? 'បានអនុម័ត' : 'Approved'} · {pendingArticles} {language === 'vi' ? 'Chờ duyệt' : language === 'km' ? 'រង់ចាំ' : 'Pending'}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.gridCol}>
            <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(255,180,168,0.08)' : '#FCECEB', borderColor: 'rgba(255,180,168,0.3)' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,180,168,0.2)' }]}>
                <IconSymbol name="person.2.fill" size={20} color="#FFB4A8" />
              </View>
              <Text style={[styles.metricValue, { color: isDark ? '#FFB4A8' : '#A83B2D' }]}>{totalUsers}</Text>
              <Text style={[styles.metricLabel, { color: C.textSecondary }]}>
                {language === 'vi' ? 'Tài khoản Đăng ký' : language === 'km' ? 'គណនីបានចុះឈ្មោះ' : 'Registered Users'}
              </Text>
              <Text style={styles.metricSubDetail}>
                {adminCount + moderatorCount} {language === 'vi' ? 'Quản trị' : language === 'km' ? 'អ្នកគ្រប់គ្រង' : 'Admin'} · {memberCount} {language === 'vi' ? 'Thành viên' : language === 'km' ? 'សមាជិក' : 'Members'}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.gridCol}>
            <View style={[styles.metricCard, { backgroundColor: isDark ? 'rgba(232,202,116,0.08)' : '#FEF8EC', borderColor: 'rgba(232,202,116,0.3)' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(232,202,116,0.2)' }]}>
                <IconSymbol name="chart.bar.fill" size={20} color="#E8CA74" />
              </View>
              <Text style={[styles.metricValue, { color: C.primary }]}>{totalViews.toLocaleString()}</Text>
              <Text style={[styles.metricLabel, { color: C.textSecondary }]}>
                {language === 'vi' ? 'Tổng Lượt xem' : language === 'km' ? 'ទស្សនាសរុប' : 'Total Views'}
              </Text>
              <Text style={styles.metricSubDetail}>
                {totalLikes} {language === 'vi' ? 'Lượt thích' : language === 'km' ? 'ចូលចិត្ត' : 'Likes'} · {festivalItems.length} {language === 'vi' ? 'Lễ hội' : language === 'km' ? 'ពិធីបុណ្យ' : 'Festivals'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* 2. PROVINCE DISTRIBUTION SECTION */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            🗺️ {language === 'vi' ? 'Mật độ Di sản theo Tỉnh Thành' : language === 'km' ? 'ដង់ស៊ីតេបេតិកភណ្ឌតាមខេត្ត' : 'Heritage Density by Province'}
          </Text>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.border}40` }]}>
            {sortedProvinces.map(([prov, count]) => {
              const pct = totalHeritages > 0 ? Math.round((count / totalHeritages) * 100) : 0;
              return (
                <View key={prov} style={styles.provinceRow}>
                  <View style={styles.provInfoRow}>
                    <Text style={[styles.provName, { color: C.text }]}>{prov}</Text>
                    <Text style={[styles.provCount, { color: C.primary }]}>
                      {count} {language === 'vi' ? 'di sản' : language === 'km' ? 'បេតិកភណ្ឌ' : 'heritages'} ({pct}%)
                    </Text>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: `${C.border}30` }]}>
                    <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: C.primary }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* 3. MODERATION & CONTENT HEALTH */}
        <Animated.View entering={FadeInUp.delay(350).duration(400)} style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            ⚖️ {language === 'vi' ? 'Hiệu quả Kiểm duyệt & Đóng góp' : language === 'km' ? 'ប្រសិទ្ធភាពនៃការពិនិត្យ និងការចូលរួម' : 'Moderation & Contribution Health'}
          </Text>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.border}40` }]}>
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <Text style={[styles.healthVal, { color: C.primary }]}>{approvalRate}%</Text>
                <Text style={[styles.healthLbl, { color: C.textSecondary }]}>
                  {language === 'vi' ? 'Tỷ lệ duyệt bài' : language === 'km' ? 'អត្រាអនុម័ត' : 'Approval Rate'}
                </Text>
              </View>
              <View style={styles.healthDivider} />
              <View style={styles.healthItem}>
                <Text style={[styles.healthVal, { color: isDark ? '#7FDEDD' : '#007073' }]}>{publishedArticles}</Text>
                <Text style={[styles.healthLbl, { color: C.textSecondary }]}>
                  {language === 'vi' ? 'Bài xuất bản' : language === 'km' ? 'បានផ្សព្វផ្សាយ' : 'Published'}
                </Text>
              </View>
              <View style={styles.healthDivider} />
              <View style={styles.healthItem}>
                <Text style={[styles.healthVal, { color: '#FFB4AB' }]}>{rejectedArticles}</Text>
                <Text style={[styles.healthLbl, { color: C.textSecondary }]}>
                  {language === 'vi' ? 'Bài từ chối' : language === 'km' ? 'បានបដិសេធ' : 'Rejected'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 4. LEADERBOARDS (TOP CONTENT) */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            🔥 {language === 'vi' ? 'Bài viết Xem nhiều nhất' : language === 'km' ? 'អត្ថបទដែលមានការទស្សនាច្រើនที่สุด' : 'Most Viewed Articles'}
          </Text>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.border}40` }]}>
            {topViewedArticles.map((article, idx) => (
              <View key={article.id} style={styles.leaderboardRow}>
                <View style={[styles.rankBadge, { backgroundColor: idx === 0 ? '#D4AF37' : idx === 1 ? '#C0C0C0' : '#CD7F32' }]}>
                  <Text style={styles.rankText}>#{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.articleTitle, { color: C.text }]} numberOfLines={1}>{article.title}</Text>
                  <Text style={[styles.articleAuthor, { color: C.textSecondary }]}>
                    {language === 'vi' ? 'Tác giả' : language === 'km' ? 'អ្នកនិពន្ធ' : 'Author'}: {article.author || (language === 'vi' ? 'Văn hóa Khmer' : language === 'km' ? 'វប្បធម៌ខ្មែរ' : 'Khmer Culture')}
                  </Text>
                </View>
                <View style={styles.viewsTag}>
                  <IconSymbol name="eye.fill" size={12} color={C.primary} />
                  <Text style={[styles.viewsText, { color: C.primary }]}>{article.views || 0}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
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
  headerTitle: { ...Typography.headlineMedium, fontFamily: FontFamily.playfairBold, letterSpacing: -0.5 },
  scrollContent: { paddingBottom: 100 },
  bannerContainer: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md, marginBottom: 16 },
  bannerTitle: { fontSize: 22, fontWeight: '800', fontFamily: FontFamily.playfairBold },
  bannerSub: { fontSize: 12, marginTop: 4 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.containerMargin - 4, marginBottom: 10 },
  gridCol: { width: '50%', padding: 4 },
  metricCard: { padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, elevation: 2 },
  iconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  metricValue: { fontSize: 24, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  metricLabel: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  metricSubDetail: { fontSize: 10, color: '#A09580', marginTop: 4 },
  sectionWrap: { paddingHorizontal: Spacing.containerMargin, marginTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, fontFamily: FontFamily.playfairBold },
  sectionCard: { padding: 16, borderRadius: BorderRadius.lg, borderWidth: 1, gap: 14 },
  provinceRow: { gap: 6 },
  provInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  provName: { fontSize: 13, fontWeight: '600' },
  provCount: { fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, width: '100%', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  healthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 8 },
  healthItem: { alignItems: 'center' },
  healthVal: { fontSize: 22, fontWeight: '800' },
  healthLbl: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  healthDivider: { width: 1, height: 30, backgroundColor: 'rgba(212,175,55,0.2)' },
  leaderboardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#131313', fontSize: 10, fontWeight: '900' },
  articleTitle: { fontSize: 13, fontWeight: '700' },
  articleAuthor: { fontSize: 11, marginTop: 1 },
  viewsTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(212,175,55,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  viewsText: { fontSize: 11, fontWeight: '700' },
});
