import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomAlert } from '@/components/ui/custom-alert';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { fetchAllArticlesAdmin, approveArticle, rejectArticle, deleteArticle, type ArticleDocument } from '@/lib/article-repository';
import { useRequireAdmin } from '@/lib/auth-session';
import { fetchHeritages } from '@/lib/heritage-repository';
import { fetchUsers, addUserNotification } from '@/lib/user-repository';
import { fetchFestivals } from '@/lib/festival-repository';
import { getTimeAgo } from '@/lib/time-utils';

const HERO_IMAGE = require('../../assets/heritages/chua-ghositaram.png');

type TabType = 'pending' | 'published' | 'rejected';

const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring( cleanHex.length === 3 ? 2 : 4, cleanHex.length === 3 ? 3 : 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function AdminDashboardScreen() {
  const { loading: authLoading, isAdmin, isModerator } = useRequireAdmin();
  const router = useRouter();
  const { resolvedColorScheme } = useColorSchemePreference();
  const { t, language } = useLanguage();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [heritageCount, setHeritageCount] = useState(0);
  const [heritageViews, setHeritageViews] = useState(0);
  const [festivalCount, setFestivalCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    options?: {
      text: string;
      onPress: () => void;
      style?: 'cancel' | 'destructive' | 'default';
    }[];
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
    onClose?: () => void,
    options?: {
      text: string;
      onPress: () => void;
      style?: 'cancel' | 'destructive' | 'default';
    }[]
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
      options,
    });
  };

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        const [articleData, heritageData, festivalData, userData] = await Promise.all([
          fetchAllArticlesAdmin(),
          fetchHeritages(),
          fetchFestivals(),
          isAdmin ? fetchUsers() : Promise.resolve([]),
        ]);
        setArticles(articleData);
        setHeritageCount(heritageData.length);
        setHeritageViews(heritageData.reduce((sum, h) => sum + (h.views ?? 0), 0));
        setFestivalCount(festivalData.length);
        setUserCount(userData.length);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, isAdmin]);

  const handleApprove = async (id: string) => {
    try {
      await approveArticle(id);
      
      const targetArticle = articles.find(a => a.id === id);
      if (targetArticle && targetArticle.authorId) {
        await addUserNotification(targetArticle.authorId, {
          titleVi: 'Bài viết được phê duyệt! 🎉',
          titleKm: 'អត្ថបទត្រូវបានអនុម័ត! 🎉',
          titleEn: 'Article Approved! 🎉',
          descriptionVi: `Bài viết "${targetArticle.title}" của bạn đã được phê duyệt và xuất bản.`,
          descriptionKm: `អត្ថបទ "${targetArticle.title}" របស់អ្នកត្រូវបានអនុម័ត និងបោះពុម្ពផ្សាយ។`,
          descriptionEn: `Your article "${targetArticle.title}" has been approved and published.`,
          timeVi: 'Vừa xong',
          timeKm: 'មុននេះបន្តិច',
          timeEn: 'Just now',
          icon: 'checkmark.circle.fill',
          color: '#4CAF50',
          isNew: true,
        });
      }

      setArticles(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'published', published: true } : a)
      );
      if (Platform.OS === 'web') alert(t.admin.alerts.success);
      else showAlert(t.admin.alerts.success, t.admin.alerts.success, 'success');
    } catch {
      showAlert(t.admin.alerts.error, t.admin.alerts.approveError, 'error');
    }
  };

  const handleReject = (article: ArticleDocument) => {
    const doReject = async (reason?: string) => {
      try {
        await rejectArticle(article.id, reason);

        if (article.authorId) {
          await addUserNotification(article.authorId, {
            titleVi: 'Bài viết bị từ chối ⚠️',
            titleKm: 'អត្ថបទត្រូវបានបដិសេធ ⚠️',
            titleEn: 'Article Rejected ⚠️',
            descriptionVi: `Bài viết "${article.title}" của bạn bị từ chối. Lý do: ${reason || 'Không có lý do cụ thể'}`,
            descriptionKm: `អត្ថបទ "${article.title}" របស់អ្នកត្រូវបានបដិសេធ។ មូលហេតុ៖ ${reason || 'គ្មានមូលហេតុជាក់លាក់'}`,
            descriptionEn: `Your article "${article.title}" was rejected. Reason: ${reason || 'No specific reason'}`,
            timeVi: 'Vừa xong',
            timeKm: 'មុននេះបន្តិច',
            timeEn: 'Just now',
            icon: 'exclamationmark.triangle.fill',
            color: '#F44336',
            isNew: true,
          });
        }

        setArticles(prev =>
          prev.map(a => a.id === article.id
            ? { ...a, status: 'rejected', published: false, rejectReason: reason }
            : a
          )
        );
        if (Platform.OS === 'web') alert(t.admin.alerts.success);
        else showAlert(t.admin.alerts.success, t.admin.alerts.success, 'success');
      } catch {
        showAlert(t.admin.alerts.error, t.admin.alerts.rejectError, 'error');
      }
    };

    if (Platform.OS === 'web') {
      const promptMsg = language === 'vi' ? `Lý do từ chối bài "${article.title}" (bỏ trống = mặc định):`
        : language === 'km' ? `មូលហេតុបដិសេធអត្ថបទ "${article.title}" (ទុកទទេ = លំនាំដើម):`
        : `Reason for rejecting article "${article.title}" (leave empty = default):`;
      const reason = prompt(promptMsg);
      if (reason !== null) doReject(reason || undefined);
    } else {
      showAlert(
        t.admin.alerts.rejectTitle,
        `${t.admin.alerts.rejectMsg} "${article.title}"?`,
        'warning',
        undefined,
        undefined,
        undefined,
        undefined,
        [
          {
            text: t.admin.alerts.rejectOptionAppropriate,
            style: 'destructive',
            onPress: () => doReject(
              language === 'vi' ? 'Nội dung không phù hợp với tiêu chí đăng tải'
              : language === 'km' ? 'មាតិកាមិនសមស្របនឹងលក្ខណៈវិនិច្ឆ័យបោះពុម្ពផ្សាយ'
              : 'Content is not suitable for publication criteria'
            ),
          },
          {
            text: t.admin.alerts.rejectOptionEdit,
            style: 'destructive',
            onPress: () => doReject(
              language === 'vi' ? 'Bài viết cần được chỉnh sửa và bổ sung thêm'
              : language === 'km' ? 'អត្ថបទត្រូវការការកែសម្រួលនិងបន្ថែម'
              : 'Article needs to be edited and supplemented'
            ),
          },
          { text: t.admin.alerts.cancel, style: 'cancel', onPress: () => {} },
        ]
      );
    }
  };

  const handleDelete = (id: string, title: string) => {
    const doDelete = async () => {
      try {
        await deleteArticle(id);
        setArticles(prev => prev.filter(a => a.id !== id));
        if (Platform.OS === 'web') alert(t.admin.alerts.deleteSuccess);
        else showAlert(t.admin.alerts.success, t.admin.alerts.deleteSuccess, 'success');
      } catch {
        showAlert(t.admin.alerts.error, t.admin.alerts.deleteError, 'error');
      }
    };

    if (Platform.OS === 'web') {
      const confirmMsg = language === 'vi' ? `Xóa bài viết "${title}"?`
        : language === 'km' ? `លុបអត្ថបទ "${title}"?`
        : `Delete article "${title}"?`;
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

  function getStatus(a: ArticleDocument) {
    if (a.status) return a.status;
    return a.published ? 'published' : 'pending';
  }

  const pending = articles.filter(a => getStatus(a) === 'pending');
  const published = articles.filter(a => getStatus(a) === 'published');
  const rejected = articles.filter(a => getStatus(a) === 'rejected');
  const tabArticles = activeTab === 'pending' ? pending : activeTab === 'published' ? published : rejected;
  const totalViews = articles.reduce((s, a) => s + (a.views ?? 0), 0) + heritageViews;

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return { text: t.admin.greetings.morning, sub: t.admin.greetings.morningSub };
    if (hr < 18) return { text: t.admin.greetings.afternoon, sub: t.admin.greetings.afternoonSub };
    return { text: t.admin.greetings.evening, sub: t.admin.greetings.eveningSub };
  };
  const greeting = getGreeting();

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>{t.admin.loading}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      {/* ── Sticky Header ── */}
      <Animated.View
        entering={FadeIn.duration(400)}
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
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, { backgroundColor: `${C.primary}15` }, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="chevron.left" size={18} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.primary }]}>{t.admin.dashboardTitle}</Text>
          <View style={[styles.avatarPlaceholder, { borderColor: `${C.primary}30`, backgroundColor: C.surfaceHigh }]}>
            <IconSymbol name="person.fill" size={16} color={C.primary} />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Banner ── */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroWrap}>
          <Image source={typeof HERO_IMAGE === 'number' ? HERO_IMAGE : { uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{greeting.text}</Text>
            <Text style={styles.heroSub}>{greeting.sub}</Text>
          </View>
        </Animated.View>

        <View style={styles.body}>
          {/* ── Bento Stats Grid ── */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            {/* Wide card — total */}
            <View style={[
              styles.glassCard, styles.wideCard,
              { 
                backgroundColor: isDark ? 'rgba(242, 202, 80, 0.06)' : '#FFFDF9', 
                borderColor: isDark ? 'rgba(242, 202, 80, 0.25)' : 'rgba(182, 139, 30, 0.3)',
                borderLeftWidth: 4,
                borderLeftColor: C.primary,
              },
            ]}>
              <View>
                <Text style={[styles.statLabel, { color: C.textTertiary }]}>{t.admin.totalArticles}</Text>
                <Text style={[styles.statBig, { color: C.primary }]}>{articles.length.toLocaleString()}</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: `${C.primary}15` }]}>
                <IconSymbol name="book.fill" size={26} color={C.primary} />
              </View>
            </View>

            {/* 2-col mini stats */}
            <View style={styles.miniStatsRow}>
              <View style={[
                styles.glassCard, styles.miniCard,
                { 
                  backgroundColor: isDark ? 'rgba(242, 202, 80, 0.04)' : '#FFFDF9', 
                  borderColor: isDark ? 'rgba(242, 202, 80, 0.15)' : 'rgba(182, 139, 30, 0.2)',
                  borderLeftWidth: 3,
                  borderLeftColor: C.primary,
                },
              ]}>
                <Text style={[styles.statLabel, { color: C.textTertiary }]}>{t.admin.pendingArticles}</Text>
                <View style={styles.miniStatBottom}>
                  <Text style={[styles.statMedium, { color: C.primary }]}>{pending.length}</Text>
                  {pending.length > 0 && (
                    <View style={styles.badgeWrapper}>
                      <Text style={[styles.statSubGold, { color: C.primary }]}>+{pending.length}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={[
                styles.glassCard, styles.miniCard,
                { 
                  backgroundColor: isDark ? 'rgba(127, 222, 221, 0.04)' : '#F0F9F9', 
                  borderColor: isDark ? 'rgba(127, 222, 221, 0.15)' : 'rgba(0, 112, 115, 0.2)',
                  borderLeftWidth: 3,
                  borderLeftColor: C.accent,
                },
              ]}>
                <Text style={[styles.statLabel, { color: C.textTertiary }]}>{t.admin.viewsStats}</Text>
                <View style={styles.miniStatBottom}>
                  <Text style={[styles.statMedium, { color: C.accent }]}>
                    {totalViews > 1000 ? `${(totalViews / 1000).toFixed(0)}K` : totalViews}
                  </Text>
                  <Text style={[styles.statSubTeal, { color: C.accent }]}>↑ 12%</Text>
                </View>
              </View>
            </View>

            {/* Quick links Grid - Side by Side */}
            <View style={styles.quickLinksGrid}>
              {[
                { 
                  label: language === 'vi' ? 'Thống kê' : language === 'km' ? 'ស្ថិតិ' : 'Analytics', 
                  icon: 'chart.bar.fill' as const, 
                  href: '/admin/analytics', 
                  countText: language === 'vi' ? 'Báo cáo 📊' : language === 'km' ? 'របាយការណ៍ 📊' : 'Report 📊', 
                  color: '#E8CA74' 
                },
                { 
                  label: language === 'vi' ? 'Lễ hội' : language === 'km' ? 'ពិធីបុណ្យ' : 'Festivals', 
                  icon: 'calendar' as const, 
                  href: '/admin/festivals', 
                  countText: `${festivalCount} ${t.admin.itemCount}`, 
                  color: '#F2CA50' 
                },
                { 
                  label: t.admin.articlesLink, 
                  icon: 'doc.text.fill' as const, 
                  href: '/admin/articles', 
                  countText: `${articles.length} ${t.admin.itemCount}`, 
                  color: C.accent 
                },
                { 
                  label: t.admin.heritagesLink, 
                  icon: 'building.columns.fill' as const, 
                  href: '/admin/heritages', 
                  countText: `${heritageCount} ${t.admin.itemCount}`, 
                  color: C.primary 
                },
                ...(isAdmin ? [{ 
                  label: language === 'vi' ? 'Tài khoản' : language === 'km' ? 'គណនី' : 'Users', 
                  icon: 'person.2.fill' as const, 
                  href: '/admin/users', 
                  countText: `${userCount} ${t.admin.itemCount}`, 
                  color: '#FFB4AB' 
                }] : []),
              ].map(item => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.quickLink,
                    { 
                      backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.75)', 
                      borderColor: `${C.border}30`,
                      borderLeftWidth: 3,
                      borderLeftColor: item.color,
                    }
                  ]}
                  activeOpacity={0.85}
                  onPress={() => router.push(item.href as Href)}
                >
                  <View style={[styles.quickLinkIcon, { backgroundColor: `${item.color}15` }]}>
                    <IconSymbol name={item.icon} size={14} color={item.color} />
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.quickLinkLabel, { color: C.text }]} numberOfLines={1}>{item.label}</Text>
                    <Text style={[styles.quickLinkCount, { color: C.textTertiary }]} numberOfLines={1}>{item.countText}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={11} color={C.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* ── Tabs ── */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.tabsWrap}>
            {([
              { key: 'pending', label: t.admin.tabPending, count: pending.length },
              { key: 'published', label: t.admin.tabPublished, count: published.length },
              { key: 'rejected', label: t.admin.tabRejected, count: rejected.length },
            ] as const).map(tab => {
              const active = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  style={[
                    styles.tabPill, 
                    { 
                      borderColor: active ? C.primary : `${C.border}40`,
                      backgroundColor: active ? C.primary : 'transparent',
                    }
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text style={[
                    styles.tabPillText, 
                    { 
                      color: active ? '#131313' : C.textTertiary,
                      fontWeight: active ? '800' : '500',
                    }
                  ]}>
                    {tab.label}
                    {tab.count > 0 ? ` (${tab.count})` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          {/* ── Articles List ── */}
          <View style={styles.articlesList}>
            {tabArticles.length === 0 ? (
              <View style={[styles.emptyCard, { borderColor: `${C.border}30`, backgroundColor: isDark ? 'rgba(30,30,30,0.3)' : 'rgba(255,255,255,0.5)' }]}>
                <IconSymbol name="doc.text" size={32} color={C.textTertiary} />
                <Text style={[styles.emptyText, { color: C.textTertiary }]}>
                  {activeTab === 'pending' ? t.admin.emptyPending
                    : activeTab === 'published' ? t.admin.emptyPublished
                    : t.admin.emptyRejected}
                </Text>
              </View>
            ) : (
              tabArticles.slice(0, 10).map((article, idx) => (
                <Animated.View
                  key={article.id}
                  entering={FadeInDown.delay(350 + idx * 50).duration(400)}
                >
                  <AdminArticleCard
                    article={article}
                    tab={activeTab}
                    C={C}
                    isDark={isDark}
                    onNavigate={() => router.push(`/admin/articles/${article.id}/edit` as Href)}
                    onApprove={() => handleApprove(article.id)}
                    onReject={() => handleReject(article)}
                    onDelete={() => handleDelete(article.id, article.title)}
                  />
                </Animated.View>
              ))
            )}
          </View>
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
        options={alertConfig.options}
        onClose={() => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          if (alertConfig.onClose) alertConfig.onClose();
        }}
      />
    </View>
  );
}

// ── Article Card sub-component ──────────────────────────────
function AdminArticleCard({
  article,
  tab,
  C,
  isDark,
  onNavigate,
  onApprove,
  onReject,
  onDelete,
}: {
  article: ArticleDocument;
  tab: TabType;
  C: typeof Colors.dark;
  isDark: boolean;
  onNavigate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const { t } = useLanguage();
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
  const statusColors = {
    pending: { bg: `${C.primary}18`, border: `${C.primary}35`, text: C.primary },
    published: { bg: `${C.accent}18`, border: `${C.accent}35`, text: C.accent },
    rejected: { bg: `${C.error}18`, border: `${C.error}35`, text: C.error },
  };
  const status = tab;
  const sc = statusColors[status];
  const statusLabel = {
    pending: t.admin.statusBadgePending,
    published: t.admin.statusBadgePublished,
    rejected: t.admin.statusBadgeRejected
  }[status];
  const timeAgo = article.createdAt
    ? getTimeAgo(article.createdAt)
    : '';

  return (
    <View style={[
      styles.articleCard,
      { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)', borderColor: `${C.primary}15` },
      tab === 'rejected' && { opacity: 0.8 },
    ]}>
      <View style={styles.articleCardTop}>
        {/* Thumbnail */}
        <View style={[styles.articleThumb, { backgroundColor: C.surfaceHigh }, tab === 'rejected' && { opacity: 0.7 }]}>
          {article.coverImage ? (
            <Image source={{ uri: article.coverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: C.surfaceHigh, justifyContent: 'center', alignItems: 'center' }]}>
              <IconSymbol name="photo" size={20} color={C.textTertiary} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.articleCardInfo}>
          <View style={styles.articleCardHeaderRow}>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
              <Text style={[styles.statusBadgeText, { color: sc.text }]}>{statusLabel}</Text>
            </View>
            <Text style={[styles.timeAgo, { color: C.textTertiary }]}>{timeAgo}</Text>
          </View>
          <Text style={[styles.articleCardTitle, { color: C.text }]} numberOfLines={2}>{article.title}</Text>
          <Text style={[styles.articleCardAuthor, { color: C.textTertiary }]}>{t.admin.authorLabel}{article.author || t.admin.authorAnonymous}</Text>
        </View>
      </View>

      {/* Reject reason */}
      {tab === 'rejected' && article.rejectReason && (
        <Text style={[styles.rejectReason, { color: C.error, borderTopColor: `${C.border}30` }]}>{t.admin.reasonLabel}{article.rejectReason}</Text>
      )}

      {/* Actions */}
      <View style={[styles.articleCardActions, { borderTopColor: `${C.border}30` }]}>
        {tab === 'pending' && (
          <>
            <Pressable
              style={{ flex: 1.5 }}
              onPress={onApprove}
            >
              {({ pressed }) => (
                <View
                  style={StyleSheet.flatten([
                    styles.actionBtn,
                    {
                      backgroundColor: pressed ? hexToRgba(C.primary, 0.8) : C.primary,
                      borderColor: hexToRgba(C.primary, 0.4),
                      transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
                    }
                  ])}
                >
                  <IconSymbol name="checkmark.circle.fill" size={14} color="#131313" />
                  <Text style={styles.approveActionBtnText}>{t.admin.actionApprove}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={onReject}
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
                  <IconSymbol name="xmark.circle.fill" size={14} color={btnStyles.delete.text} />
                  <Text style={[styles.rejectActionBtnText, { color: btnStyles.delete.text }]}>{t.admin.actionReject}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={onNavigate}
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
                  <Text style={[styles.editActionBtnText, { color: btnStyles.edit.text }]}>{t.admin.actionEdit}</Text>
                </View>
              )}
            </Pressable>
          </>
        )}
        {tab === 'published' && (
          <>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => router.push(`/articles/${article.id}` as Href)}
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
                  <Text style={[styles.viewActionBtnText, { color: btnStyles.view.text }]}>{t.admin.actionView}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={onNavigate}
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
                  <Text style={[styles.editActionBtnText, { color: btnStyles.edit.text }]}>{t.admin.actionEdit}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={onDelete}
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
                  <Text style={[styles.deleteActionBtnText, { color: btnStyles.delete.text }]}>{t.admin.actionDelete}</Text>
                </View>
              )}
            </Pressable>
          </>
        )}
        {tab === 'rejected' && (
          <>
            <Pressable
              style={{ flex: 1.5 }}
              onPress={onApprove}
            >
              {({ pressed }) => (
                <View
                  style={StyleSheet.flatten([
                    styles.actionBtn,
                    {
                      backgroundColor: pressed ? hexToRgba(C.primary, 0.8) : C.primary,
                      borderColor: hexToRgba(C.primary, 0.4),
                      transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
                    }
                  ])}
                >
                  <IconSymbol name="arrow.uturn.left" size={14} color="#131313" />
                  <Text style={styles.approveActionBtnText}>{t.admin.actionApproveAgain}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={onDelete}
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
                  <Text style={[styles.deleteActionBtnText, { color: btnStyles.delete.text }]}>{t.admin.actionDeletePermanent}</Text>
                </View>
              )}
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}


// ── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  loadingText: { ...Typography.bodyMedium },

  // Header
  stickyHeader: {
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    zIndex: 100,
    ...Platform.select({
      web: { backdropFilter: 'blur(16px)' } as any,
      default: {},
    }),
  },
  headerInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerMargin,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(182,139,30,0.2)',
  },
  headerTitle: { 
    ...Typography.headlineMedium,
    fontFamily: FontFamily.playfairBold,
    letterSpacing: -0.5,
  },
  avatarPlaceholder: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 0.8,
    justifyContent: 'center', alignItems: 'center',
  },

  scrollContent: { paddingBottom: 140 },

  // Hero
  heroWrap: { width: '100%', height: 160, position: 'relative', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', opacity: 0.55 },
  heroGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%',
    backgroundColor: 'rgba(19,19,19,0.65)',
  },
  heroContent: {
    position: 'absolute', bottom: Spacing.md, left: Spacing.containerMargin, right: Spacing.containerMargin,
  },
  heroTitle: { 
    ...Typography.headlineLarge,
    fontFamily: FontFamily.playfairBold,
    color: '#FFEAA7',
  },
  heroSub: { 
    ...Typography.bodySmall, 
    color: '#D0C5AF', 
    marginTop: 4,
    fontStyle: 'italic',
  },

  body: { padding: Spacing.containerMargin, gap: Spacing.lg },

  // Glass card
  glassCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Platform.select({
      web: { backdropFilter: 'blur(12px)' } as any,
      default: { ...Shadows.medium },
    }),
  },
  wideCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  miniStatsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  miniCard: { flex: 1 },
  statLabel: { 
    ...Typography.labelSmall, 
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2, 
    marginBottom: Spacing.xs 
  },
  statBig: { 
    ...Typography.displaySmall, 
    fontFamily: FontFamily.playfairBold,
    letterSpacing: -0.5,
  },
  statMedium: { 
    ...Typography.headlineMedium, 
    fontFamily: FontFamily.playfairBold,
    letterSpacing: -0.3,
  },
  miniStatBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: Spacing.xs },
  badgeWrapper: {
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statSubGold: { 
    ...Typography.labelSmall,
    fontWeight: '800',
  },
  statSubTeal: { 
    ...Typography.labelSmall,
    fontWeight: '700',
  },
  statIcon: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },

  // Quick links Grid
  quickLinksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: Spacing.xs },
  quickLink: {
    width: '48%',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 0.5,
    borderRadius: BorderRadius.md, 
    padding: 10,
    ...Shadows.small,
  },
  quickLinkIcon: {
    width: 32, height: 32, borderRadius: BorderRadius.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  quickLinkLabel: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
  },
  quickLinkCount: { ...Typography.labelSmall, fontSize: 10, marginTop: 1 },

  // Tabs
  tabsWrap: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: Shadows.small,
      web: Shadows.small,
      default: {},
    }),
  },
  tabPillText: { 
    ...Typography.labelMedium,
    fontSize: 12,
  },

  // Articles
  articlesList: { gap: Spacing.md },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyText: { ...Typography.bodySmall, fontWeight: '600' },
  articleCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Platform.select({
      ios: Shadows.medium,
      web: Shadows.medium,
      default: {},
    }),
  },
  articleCardTop: { flexDirection: 'row', gap: Spacing.md },
  articleThumb: {
    width: 68, height: 68, borderRadius: BorderRadius.md,
    overflow: 'hidden', flexShrink: 0,
  },
  articleCardInfo: { flex: 1, gap: 4, justifyContent: 'center' },
  articleCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: {
    borderWidth: 0.5, borderRadius: BorderRadius.xs,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  statusBadgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  timeAgo: { ...Typography.labelSmall, fontSize: 10 },
  articleCardTitle: { ...Typography.titleSmall, fontWeight: '700', lineHeight: 20 },
  articleCardAuthor: { ...Typography.labelSmall, fontSize: 11 },
  rejectReason: {
    ...Typography.labelSmall, fontStyle: 'italic',
    borderTopWidth: 0.5, paddingTop: Spacing.sm,
  },
  articleCardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 0.5,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    flex: 1,
    ...Shadows.small,
  },
  approveActionBtn: {
    flex: 1.5,
    ...Shadows.goldGlow,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  approveActionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    color: '#131313',
    fontWeight: '800',
  },
  rejectActionBtn: {
    flex: 1,
  },
  rejectActionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    fontWeight: '700',
  },
  editActionBtnFull: {
    flex: 1,
  },
  editActionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    fontWeight: '700',
  },
  viewActionBtn: {
    flex: 1,
  },
  viewActionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    fontWeight: '700',
  },
  deleteActionBtn: {
    flex: 1,
  },
  deleteActionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    fontWeight: '700',
  },});