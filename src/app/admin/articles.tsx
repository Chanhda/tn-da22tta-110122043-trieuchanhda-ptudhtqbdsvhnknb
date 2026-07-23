import { useRouter, type Href, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomAlert } from '@/components/ui/custom-alert';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import {
  approveArticle,
  deleteArticle,
  fetchAllArticlesAdmin,
  rejectArticle,
  updateArticle,
  type ArticleDocument,
  type ArticleStatus,
} from '@/lib/article-repository';
import { useRequireAdmin } from '@/lib/auth-session';
import { getArticleImageSource } from '@/constants/image-resolver';

type TabType = 'pending' | 'published' | 'rejected';

const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring( cleanHex.length === 3 ? 2 : 4, cleanHex.length === 3 ? 3 : 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const FILTER_CATEGORIES = ['Tất cả', 'Lễ hội', 'Kiến trúc', 'Ẩm thực', 'Nghệ thuật', 'Cộng đồng', 'Du lịch'];

const categoryLabelMap: Record<string, Record<string, string>> = {
  vi: {
    'Tất cả': 'Tất cả',
    'Lễ hội': 'Lễ hội',
    'Kiến trúc': 'Kiến trúc',
    'Ẩm thực': 'Ẩm thực',
    'Nghệ thuật': 'Nghệ thuật',
    'Cộng đồng': 'Cộng đồng',
    'Du lịch': 'Du lịch'
  },
  km: {
    'Tất cả': 'ទាំងអស់',
    'Lễ hội': 'ពិធីបុណ្យ',
    'Kiến trúc': 'ស្ថាបត្យកម្ម',
    'Ẩm thực': 'ម្ហូបអាហារ',
    'Nghệ thuật': 'សិល្បៈ',
    'Cộng đồng': 'សហគមន៍',
    'Du lịch': 'ទេសចរណ៍'
  },
  en: {
    'Tất cả': 'All',
    'Lễ hội': 'Festival',
    'Kiến trúc': 'Architecture',
    'Ẩm thực': 'Cuisine',
    'Nghệ thuật': 'Art',
    'Cộng đồng': 'Community',
    'Du lịch': 'Tourism'
  }
};

export default function AdminArticlesScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const { resolvedColorScheme } = useColorSchemePreference();
  const { t, language } = useLanguage();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [allArticles, setAllArticles] = useState<ArticleDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

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

  useFocusEffect(
    useCallback(() => {
      loadArticles();
    }, [])
  );

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchAllArticlesAdmin();
      setAllArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Stats ──
  const pendingArticles = allArticles.filter(a => getStatus(a) === 'pending');
  const publishedArticles = allArticles.filter(a => getStatus(a) === 'published');
  const rejectedArticles = allArticles.filter(a => getStatus(a) === 'rejected');

  function getStatus(article: ArticleDocument): ArticleStatus {
    if (article.status) return article.status;
    return article.published ? 'published' : 'pending';
  }

  // ── Tab data ──
  const tabArticles = allArticles.filter(a => {
    const status = getStatus(a);
    if (activeTab === 'pending') return status === 'pending';
    if (activeTab === 'published') return status === 'published';
    return status === 'rejected';
  });

  const filteredArticles = tabArticles.filter(a => {
    const matchSearch =
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Tất cả' || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // ── Approve ──
  const handleApprove = async (article: ArticleDocument) => {
    setTogglingId(article.id);
    try {
      await approveArticle(article.id);
      setAllArticles(prev =>
        prev.map(a => a.id === article.id ? { ...a, status: 'published', published: true } : a)
      );
    } catch {
      showAlert(t.admin.alerts.error, t.admin.alerts.approveError, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Reject ──
  const handleReject = (article: ArticleDocument) => {
    const doReject = async (reason?: string) => {
      setRejectingId(article.id);
      try {
        await rejectArticle(article.id, reason);
        setAllArticles(prev =>
          prev.map(a => a.id === article.id
            ? { ...a, status: 'rejected', published: false, rejectReason: reason }
            : a
          )
        );
      } catch {
        showAlert(t.admin.alerts.error, t.admin.alerts.rejectError, 'error');
      } finally {
        setRejectingId(null);
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

  // ── Unpublish toggle (for published articles) ──
  const handleTogglePublish = async (article: ArticleDocument) => {
    const newPublished = !article.published;
    setTogglingId(article.id);
    try {
      await updateArticle(article.id, {
        published: newPublished,
        status: newPublished ? 'published' : 'pending',
      });
      setAllArticles(prev =>
        prev.map(a => a.id === article.id
          ? { ...a, published: newPublished, status: newPublished ? 'published' : 'pending' }
          : a
        )
      );
    } catch {
      showAlert(t.admin.alerts.error, t.admin.alerts.togglePublishError, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = (articleId: string, title: string) => {
    const doDelete = async () => {
      try {
        await deleteArticle(articleId);
        setAllArticles(prev => prev.filter(a => a.id !== articleId));
        showAlert(t.admin.alerts.success, t.admin.alerts.deleteSuccess, 'success');
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

  if (authLoading || loading) {
    return (
      <View style={[styles.screen, { backgroundColor: C.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={[styles.loadingText, { color: C.textSecondary }]}>{t.admin.loading}</Text>
        </View>
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
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { backgroundColor: `${C.primary}15` }, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={18} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.primary }]}>{t.admin.articlesTitle}</Text>
          <View style={[styles.headerBadge, { backgroundColor: `${C.primary}20`, borderColor: `${C.primary}40` }]}>
            <Text style={[styles.headerBadgeText, { color: C.primary }]}>{allArticles.length}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add New Button */}
        <Animated.View entering={FadeInDown.delay(60).duration(500)}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/admin/articles/new' as Href)}
            icon={<IconSymbol name="plus" size={16} color="#131313" />}
            iconPosition="left"
            style={{ backgroundColor: C.primary }}
            textStyle={{ color: '#131313', fontWeight: '800' }}
          >
            {t.admin.addNewArticle}
          </Button>
        </Animated.View>

        {/* ── Tabs ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.tabsWrap}>
          {([
            { key: 'pending', label: t.admin.tabPending, count: pendingArticles.length },
            { key: 'published', label: t.admin.tabPublished, count: publishedArticles.length },
            { key: 'rejected', label: t.admin.tabRejected, count: rejectedArticles.length },
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

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(130).duration(500)}>
          <View
            style={[
              styles.searchBar, 
              { 
                backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : '#FFFFFF', 
                borderColor: isDark ? 'rgba(242, 202, 80, 0.25)' : 'rgba(182, 139, 30, 0.3)' 
              }
            ]}
          >
            <IconSymbol name="magnifyingglass" size={15} color={C.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: C.text }]}
              placeholder={t.admin.searchPlaceholderArticles}
              placeholderTextColor={C.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={15} color={C.textTertiary} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Category filter (only for published tab) */}
        {activeTab === 'published' && (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {FILTER_CATEGORIES.map(cat => {
                const active = cat === selectedCategory;
                return (
                  <Pressable key={cat} onPress={() => setSelectedCategory(cat)}>
                    <View style={[
                      styles.filterChip,
                      { 
                        backgroundColor: active ? C.primary : (isDark ? 'rgba(30,30,30,0.4)' : '#FFFFFF'), 
                        borderColor: active ? C.primary : `${C.border}30`,
                      },
                    ]}>
                      <Text style={[
                        styles.filterChipText, 
                        { 
                          color: active ? '#131313' : C.textSecondary,
                          fontWeight: active ? '800' : '600'
                        }
                      ]}>
                        {categoryLabelMap[language][cat] || cat}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── List ── */}
        <View style={styles.listSection}>
          {/* Result count / Refresh */}
          <View style={styles.resultRow}>
            <Text style={[styles.resultCount, { color: C.textTertiary }]}>
              {t.admin.resultCountArticles.replace('{count}', filteredArticles.length.toString())}
            </Text>
            <Pressable onPress={loadArticles} style={styles.refreshBtn}>
              <IconSymbol name="arrow.clockwise" size={13} color={C.primary} />
              <Text style={[styles.refreshText, { color: C.primary }]}>{t.admin.refresh}</Text>
            </Pressable>
          </View>

          {/* Empty state */}
          {filteredArticles.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500)}>
              <View style={[
                styles.emptyCard, 
                { 
                  backgroundColor: isDark ? 'rgba(30,30,30,0.3)' : 'rgba(255,255,255,0.5)', 
                  borderColor: `${C.border}30` 
                }
              ]}>
                <View style={[styles.emptyIconBg, { backgroundColor: C.backgroundTertiary }]}>
                  <IconSymbol
                    name={activeTab === 'pending' ? 'clock.fill' : activeTab === 'published' ? 'checkmark.circle' : 'xmark.circle'}
                    size={32}
                    color={C.textTertiary}
                  />
                </View>
                <Text style={[styles.emptyTitle, { color: C.text }]}>
                  {activeTab === 'pending' ? t.admin.emptyPending
                    : activeTab === 'published' ? t.admin.emptyPublished
                    : t.admin.emptyRejected}
                </Text>
                <Text style={[styles.emptySubtitle, { color: C.textSecondary }]}>
                  {activeTab === 'pending'
                    ? (language === 'vi' ? 'Khi người dùng gửi bài, bài viết sẽ xuất hiện ở đây để chờ duyệt.'
                       : language === 'km' ? 'នៅពេលអ្នកប្រើប្រាស់ផ្ញើអត្ថបទ វានឹងបង្ហាញនៅទីនេះដើម្បីរង់ចាំការអនុម័ត។'
                       : 'When users submit articles, they will appear here pending approval.')
                    : activeTab === 'published'
                    ? (language === 'vi' ? 'Chưa có bài viết nào được hiển thị cho người dùng.'
                       : language === 'km' ? 'មិនទាន់មានអត្ថបទណាមួយត្រូវបានបង្ហាញជូនអ្នកប្រើប្រាស់នៅឡើយទេ។'
                       : 'No articles are displayed to users yet.')
                    : (language === 'vi' ? 'Các bài viết bị từ chối sẽ hiển thị ở đây.'
                       : language === 'km' ? 'អត្ថបទដែលត្រូវបានបដិសេធនឹងបង្ហាញនៅទីនេះ។'
                       : 'Rejected articles will be displayed here.')}
                </Text>
              </View>
            </Animated.View>
          ) : (
            filteredArticles.map((article, index) => {
              const status = getStatus(article);
              const statusColors = {
                pending: { bg: `${C.primary}18`, border: `${C.primary}35`, text: C.primary, label: t.admin.statusBadgePending },
                published: { bg: `${C.accent}18`, border: `${C.accent}35`, text: C.accent, label: t.admin.statusBadgePublished },
                rejected: { bg: `${C.error}18`, border: `${C.error}35`, text: C.error, label: t.admin.statusBadgeRejected },
              };
              const sc = statusColors[status];
              return (
                <Animated.View
                  key={article.id}
                  entering={FadeInDown.delay(180 + index * 40).duration(450)}
                >
                  <View style={[
                    styles.articleCard,
                    { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)', borderColor: `${C.primary}15` },
                  ]}>
                    {/* Top Row: Thumbnail + Details */}
                    <View style={styles.cardTop}>
                      <Image source={getArticleImageSource(article.id, article.coverImage, article.category)} style={styles.thumbnail} />
                      <View style={styles.cardInfo}>
                        <View style={styles.cardHeaderRow}>
                          <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
                            <Text style={[styles.statusBadgeText, { color: sc.text }]}>
                              {sc.label}
                            </Text>
                          </View>
                          <Text style={[styles.categoryBadgeText, { color: C.textTertiary }]}>
                            {article.category 
                              ? (categoryLabelMap[language][article.category] || article.category).toUpperCase()
                              : (language === 'vi' ? 'BÀI VIẾT' : language === 'km' ? 'អត្ថបទ' : 'ARTICLE')}
                          </Text>
                        </View>
                        <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={2}>
                          {article.title}
                        </Text>
                        <View style={styles.authorRow}>
                          <IconSymbol name="person.fill" size={11} color={C.textTertiary} />
                          <Text style={[styles.metaText, { color: C.textSecondary }]}>
                            {article.author || t.admin.authorAnonymous}
                          </Text>
                          <Text style={[styles.dotSep, { color: C.textTertiary }]}>•</Text>
                          <Text style={[styles.metaText, { color: C.textSecondary }]}>
                            {article.date || (article.createdAt ? new Date(article.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'km' ? 'km-KH' : 'en-US') : '')}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Summary preview */}
                    {article.summary ? (
                      <View style={[styles.summaryRow, { borderTopColor: `${C.border}30` }]}>
                        <Text style={[styles.summaryText, { color: C.textSecondary }]} numberOfLines={2}>
                          {article.summary}
                        </Text>
                      </View>
                    ) : null}

                    {/* Reject reason banner */}
                    {status === 'rejected' && article.rejectReason && (
                      <View style={[styles.rejectReasonRow, { borderTopColor: `${C.border}30` }]}>
                        <Text style={[styles.rejectReasonText, { color: C.error }]}>
                          {t.admin.reasonLabel}{article.rejectReason}
                        </Text>
                      </View>
                    )}

                    {/* Action buttons — PENDING TAB */}
                    {status === 'pending' && (
                      <View style={[styles.actionsRow, { borderTopColor: `${C.border}30` }]}>
                        {togglingId === article.id ? (
                          <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color={C.primary} />
                            <Text style={[styles.processingText, { color: C.textSecondary }]}>{t.admin.processing}</Text>
                          </View>
                        ) : (
                          <>
                            <Pressable
                              style={{ flex: 1.5 }}
                              onPress={() => handleApprove(article)}
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
                              onPress={() => handleReject(article)}
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
                              onPress={() => router.push(`/admin/articles/${article.id}/edit` as Href)}
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
                      </View>
                    )}

                    {/* Action buttons — PUBLISHED TAB */}
                    {status === 'published' && (
                      <>
                        <View style={[styles.publishToggleRow, { borderTopColor: `${C.border}30` }]}>
                          <View style={styles.statsGroup}>
                            <View style={styles.statItm}>
                              <IconSymbol name="eye.fill" size={12} color={C.accent} />
                              <Text style={[styles.statVal, { color: C.textSecondary }]}>{article.views ?? 0}</Text>
                            </View>
                            <View style={styles.statItm}>
                              <IconSymbol name="heart.fill" size={12} color={C.secondary} />
                              <Text style={[styles.statVal, { color: C.textSecondary }]}>{article.likes ?? 0}</Text>
                            </View>
                          </View>
                          <View style={styles.switchRow}>
                            {togglingId === article.id ? (
                              <ActivityIndicator size="small" color={C.primary} />
                            ) : (
                              <>
                                <Text style={[styles.switchLabel, { color: article.published ? C.accent : C.textTertiary }]}>
                                  {article.published ? t.admin.switchShow : t.admin.switchHide}
                                </Text>
                                <Switch
                                  value={article.published ?? false}
                                  onValueChange={() => handleTogglePublish(article)}
                                  trackColor={{ false: C.border, true: `${C.accent}70` }}
                                  thumbColor={article.published ? C.accent : C.textTertiary}
                                  style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                                />
                              </>
                            )}
                          </View>
                        </View>

                        <View style={[styles.actionsRow, { borderTopColor: `${C.border}30` }]}>
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
                            onPress={() => router.push(`/admin/articles/${article.id}/edit` as Href)}
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
                            onPress={() => handleDelete(article.id, article.title)}
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
                        </View>
                      </>
                    )}

                    {/* Action buttons — REJECTED TAB */}
                    {status === 'rejected' && (
                      <View style={[styles.actionsRow, { borderTopColor: `${C.border}30` }]}>
                        {togglingId === article.id ? (
                          <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color={C.primary} />
                            <Text style={[styles.processingText, { color: C.textSecondary }]}>{t.admin.processing}</Text>
                          </View>
                        ) : (
                          <>
                            <Pressable
                              style={{ flex: 1.5 }}
                              onPress={() => handleApprove(article)}
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
                              onPress={() => handleDelete(article.id, article.title)}
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
                    )}
                  </View>
                </Animated.View>
              );
            })
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
        options={alertConfig.options}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(182,139,30,0.2)',
  },
  headerTitle: {
    ...Typography.headlineMedium,
    fontFamily: FontFamily.playfairBold,
    flex: 1,
    letterSpacing: -0.5,
  },
  headerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
  },
  headerBadgeText: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    gap: Spacing.md,
    paddingBottom: 120,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    gap: Spacing.sm,
    ...Shadows.goldGlow,
  },
  addNewBtnText: {
    ...Typography.labelLarge,
    color: '#131313',
    fontWeight: '800',
  },
  tabsWrap: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
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
    fontFamily: FontFamily.inter,
    height: '100%',
  },
  filterRow: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
    ...Shadows.small,
  },
  filterChipText: {
    ...Typography.labelSmall,
    fontSize: 11,
  },
  listSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
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
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
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
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  categoryBadgeText: {
    ...Typography.labelSmall,
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
    lineHeight: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
    fontSize: 12,
  },
  dotSep: {
    fontSize: 10,
  },
  summaryRow: {
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  summaryText: {
    ...Typography.bodySmall,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  rejectReasonRow: {
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  rejectReasonText: {
    ...Typography.bodySmall,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
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
  },
  processingText: {
    ...Typography.bodySmall,
  },
  loadingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 36,
  },
  publishToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    paddingTop: Spacing.sm,
  },
  statsGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    ...Typography.labelMedium,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  switchLabel: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
});
