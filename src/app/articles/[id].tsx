import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { type ArticleDocument, fetchArticleById, isArticleLikedLocally, toggleArticleLike, incrementArticleViews, fetchArticles } from '@/lib/article-repository';
import { useAuthSession } from '@/lib/auth-session';
import { type CommentDocument, fetchCommentsForArticle, addCommentToArticle, toggleCommentLike, deleteComment } from '@/lib/comment-repository';
import { getArticleImageSource } from '@/constants/image-resolver';
import { getTimeAgo } from '@/lib/time-utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translateText } from '@/lib/translation-helper';

const { width: SW, height: SH } = Dimensions.get('window');
const HERO_H = Math.min(SH * 0.4, 320);

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const { firebaseUser, profile } = useAuthSession();
  const scrollViewRef = useRef<ScrollView>(null);
  const [article, setArticle] = useState<ArticleDocument | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentDocument | null>(null);
  const [comments, setComments] = useState<CommentDocument[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<ArticleDocument[]>([]);
  const [activeGalleryImg, setActiveGalleryImg] = useState(0);

  // Auto Translation States (translates Vietnamese to active lang)
  const [displayTitle, setDisplayTitle] = useState('');
  const [displaySummary, setDisplaySummary] = useState('');
  const [displayContent, setDisplayContent] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (!article) return;

    async function performTranslation() {
      try {
        const [tTitle, tSummary, tContent] = await Promise.all([
          translateText(article.title, language as any),
          translateText(article.summary || '', language as any),
          translateText(article.content || '', language as any),
        ]);
        if (isMounted) {
          setDisplayTitle(tTitle);
          setDisplaySummary(tSummary);
          setDisplayContent(tContent);
        }
      } catch (err) {
        console.error('Translation error:', err);
        if (isMounted) {
          setDisplayTitle(article.title);
          setDisplaySummary(article.summary || '');
          setDisplayContent(article.content || '');
        }
      }
    }

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [article, language]);

  const scrollCommentsToView = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || typeof id !== 'string') return;
    const authorName = profile?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'Người đóng góp';
    
    // Strip leading @AuthorName if present to avoid double-tagging
    let text = newComment.trim();
    if (replyingTo?.authorName && text.startsWith(`@${replyingTo.authorName}`)) {
      text = text.replace(`@${replyingTo.authorName}`, '').trim();
    }
    if (!text) return;

    const parentId = replyingTo?.id;
    const replyToAuthor = replyingTo?.authorName;
    setNewComment('');
    setReplyingTo(null);
    
    try {
      const savedComment = await addCommentToArticle(
        id,
        text,
        authorName,
        firebaseUser?.uid,
        parentId,
        replyToAuthor
      );
      setComments(prev => [...prev, savedComment]);
      setTimeout(() => {
        scrollCommentsToView();
      }, 100);
    } catch (err) {
      console.error('Error adding comment:', err);
      Alert.alert('Lỗi', 'Không thể gửi bình luận của bạn lúc này.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (typeof id !== 'string') return;
    setComments(prev => prev.filter(c => c.id !== commentId));
    try {
      await deleteComment(id, commentId);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleToggleCommentLike = async (commentId: string) => {
    const userId = firebaseUser?.uid || 'guest-user';
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const likedBy = Array.isArray(c.likedBy) ? [...c.likedBy] : [];
          const hasLiked = likedBy.includes(userId);
          const newLikedBy = hasLiked ? likedBy.filter(u => u !== userId) : [...likedBy, userId];
          const newLikes = Math.max(0, (c.likes || 0) + (hasLiked ? -1 : 1));
          return { ...c, likes: newLikes, likedBy: newLikedBy };
        }
        return c;
      })
    );
    if (typeof id === 'string') {
      await toggleCommentLike(id, commentId, userId);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadArticle() {
      if (typeof id !== 'string') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchArticleById(id);

        if (isMounted) {
          setArticle(result);
        }

        if (result) {
          const liked = await isArticleLikedLocally(id);
          if (isMounted) {
            setIsLiked(liked);
          }
          // Increment view count in Firestore
          await incrementArticleViews(id);

          // Fetch related articles
          try {
            const allArticles = await fetchArticles();
            let related = allArticles.filter(a => a.id !== id && a.category === result.category);
            if (related.length < 2) {
              const nonCategoryRelated = allArticles.filter(a => a.id !== id && a.category !== result.category);
              related = [...related, ...nonCategoryRelated];
            }
            if (isMounted) {
              setRelatedArticles(related.slice(0, 2));
            }
          } catch (relatedErr) {
            console.error('Error fetching related articles:', relatedErr);
          }
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được bài viết');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    async function loadComments() {
      if (typeof id !== 'string') return;
      try {
        setCommentsLoading(true);
        const data = await fetchCommentsForArticle(id);
        if (isMounted) {
          setComments(data);
        }
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        if (isMounted) {
          setCommentsLoading(false);
        }
      }
    }
    loadComments();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n✍️ Tác giả: ${article.author || ''}\n\n${article.summary}\n\nĐọc tiếp tại ứng dụng Khmer Heritage!`,
      });
    } catch (shareError) {
      console.error('Lỗi chia sẻ:', shareError);
    }
  };

  const handleToggleLike = async () => {
    if (typeof id !== 'string') return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);

    if (article) {
      setArticle(prev => {
        if (!prev) return prev;
        const currentLikes = prev.likes ?? 0;
        return {
          ...prev,
          likes: Math.max(0, currentLikes + (nextLiked ? 1 : -1))
        };
      });
    }

    try {
      await toggleArticleLike(id, nextLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCopyLink = () => {
    if (!article) return;
    const shareUrl = Platform.OS === 'web'
      ? window.location.href
      : `https://khmerapp.com/articles/${article.id}`;

    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(shareUrl);
      alert('Đã sao chép liên kết bài viết!');
    } else {
      Alert.alert('Thành công', 'Đã sao chép liên kết vào bộ nhớ tạm.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>{t.common.loading}</Text>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <IconSymbol name="exclamationmark.triangle.fill" size={40} color={C.error} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>{error || 'Không tìm thấy bài viết này trong cơ sở dữ liệu.'}</Text>
        <Pressable style={[styles.backPillBtn, { backgroundColor: C.primary }]} onPress={() => router.back()}>
          <Text style={styles.backPillBtnText}>{t.common.back}</Text>
        </Pressable>
      </View>
    );
  }

  // Fallback gallery images
  const FALLBACK_ARTICLE_GALLERY = [
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'
  ];

  const galleryImages = Array.isArray(article.gallery) && article.gallery.length > 0
    ? article.gallery
    : (article.coverImage
        ? [article.coverImage, ...FALLBACK_ARTICLE_GALLERY.slice(0, 3)]
        : FALLBACK_ARTICLE_GALLERY);

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Floating Header Actions */}
      <View style={[styles.floatingHeader, { top: Math.max(insets.top, 12) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.floatBtn,
            { borderColor: `${C.primary}20`, backgroundColor: isDark ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.85)' },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={18} color={C.text} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.floatBtn,
            { borderColor: `${C.primary}20`, backgroundColor: isDark ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.85)' },
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleToggleLike}
        >
          <IconSymbol
            name={isLiked ? 'heart.fill' : 'heart'}
            size={18}
            color={isLiked ? C.secondary : C.text}
          />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Cover Hero Block */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.heroWrap}>
          <Image source={getArticleImageSource(article.id, article.coverImage, article.category)} style={styles.heroImage} resizeMode="cover" />
        </Animated.View>

        {/* Content Overlap Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(600)}
          style={[styles.contentCard, { backgroundColor: C.background }]}
        >
          {/* Badge & Metadata */}
          <View style={styles.metaHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: `${C.accent}15`, borderColor: `${C.accent}40` }]}>
              <Text style={[styles.categoryBadgeText, { color: C.accent }]}>
                {article.category ? article.category.toUpperCase() : (language === 'vi' ? 'BÀI VIẾT' : language === 'km' ? 'អត្ថបទ' : 'ARTICLE')}
              </Text>
            </View>
            <View style={styles.authorDateRow}>
              <View style={styles.metaItem}>
                <IconSymbol name="person.fill" size={12} color={C.textTertiary} />
                <Text style={[styles.metaText, { color: C.textTertiary }]}>
                  {article.author || (language === 'vi' ? 'Tác giả ẩn danh' : language === 'km' ? 'អ្នកនិពន្ធមិនស្គាល់ឈ្មោះ' : 'Anonymous author')}
                </Text>
              </View>
              <Text style={[styles.metaDot, { color: C.textTertiary }]}>•</Text>
              <View style={styles.metaItem}>
                <IconSymbol name="clock.fill" size={12} color={C.textTertiary} />
                <Text style={[styles.metaText, { color: C.textTertiary }]}>
                  {article.date || (language === 'vi' ? 'Gần đây' : language === 'km' ? 'ថ្មីៗនេះ' : 'Recent')}
                </Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: C.primary }]}>
            {displayTitle || article.title}
          </Text>

          {/* Summary / Blockquote Panel */}
          {(displaySummary || article.summary) ? (
            <View style={[styles.summaryPanel, { borderLeftColor: C.primary, backgroundColor: C.backgroundSecondary, borderColor: `${C.primary}20` }]}>
              <Text style={[styles.summaryTitle, { color: C.primary }]}>
                {language === 'vi' ? 'TÓM TẮT BÀI VIẾT' : language === 'km' ? 'សេចក្តីសង្ខេបអត្ថបទ' : 'ARTICLE SUMMARY'}
              </Text>
              <Text style={[styles.summaryText, { color: C.textSecondary }]}>
                {displaySummary || article.summary}
              </Text>
            </View>
          ) : null}

          {/* Main Content Body */}
          <View style={styles.bodyContainer}>
            <Text style={[styles.bodyText, { color: C.text }]}>
              {displayContent || article.content}
            </Text>
          </View>

          {/* Dynamic illustration block */}
          <View style={[styles.illustrationCard, { backgroundColor: C.backgroundSecondary, borderColor: `${C.primary}15` }]}>
            <View style={styles.illustrationHeader}>
              <IconSymbol name="sparkles" size={16} color={C.primary} />
              <Text style={[styles.illustrationTitle, { color: C.text }]}>
                {language === 'vi' ? 'Khối minh họa & Tư liệu' : language === 'km' ? 'ឯកសារយោង និងគំនូរ' : 'Illustrations & Reference'}
              </Text>
            </View>
            <Text style={[styles.illustrationDescription, { color: C.textSecondary }]}>
              {language === 'vi' ? 'Hệ thống cung cấp thêm các tài liệu đính kèm, thước phim tư liệu và hình ảnh phục chế chất lượng cao liên quan đến bài viết này.' : language === 'km' ? 'ប្រព័ន្ធផ្តល់នូវឯកសារភ្ជាប់បន្ថែម វីដេអូឯកសារ និងរូបភាពស្តារឡើងវិញដែលមានគុណភាពខ្ពស់ទាក់ទងនឹងអត្ថបទនេះ។' : 'The system provides additional attachments, documentary films and high-quality restored images related to this article.'}
            </Text>
            <View style={styles.illustrationTags}>
              {[
                { icon: 'photo.fill' as const, label: language === 'vi' ? 'Hình ảnh' : language === 'km' ? 'រូបភាព' : 'Images' },
                { icon: 'video.fill' as const, label: language === 'vi' ? 'Video tư liệu' : language === 'km' ? 'វីដេអូឯកសារ' : 'Documentary Videos' },
                { icon: 'book.fill' as const, label: language === 'vi' ? 'Trích dẫn cổ' : language === 'km' ? 'សម្រង់បុរាណ' : 'Ancient Quotes' },
              ].map(tag => (
                <View key={tag.label} style={[styles.illustrationTag, { backgroundColor: C.backgroundTertiary, borderColor: `${C.border}40` }]}>
                  <IconSymbol name={tag.icon} size={12} color={C.primary} />
                  <Text style={[styles.illustrationTagText, { color: C.textSecondary }]}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Gallery / Thư viện ảnh bài viết */}
          {galleryImages.length > 0 && (
            <View style={styles.sectionContainer}>
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
            </View>
          )}

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={[styles.sectionTitleText, { color: C.text }]}>
              {language === 'vi' ? `Bình luận (${comments.length})` : language === 'km' ? `មតិយោបល់ (${comments.length})` : `Comments (${comments.length})`}
            </Text>

            {/* Replying Banner */}
            {replyingTo && (
              <View style={[styles.replyingBanner, { backgroundColor: `${C.primary}15`, borderColor: `${C.primary}35` }]}>
                <Text style={[styles.replyingText, { color: C.primary }]}>
                  💬 {language === 'vi' ? `Đang trả lời @${replyingTo.authorName}` : language === 'km' ? `កំពុងឆ្លើយតប @${replyingTo.authorName}` : `Replying to @${replyingTo.authorName}`}
                </Text>
                <Pressable onPress={() => setReplyingTo(null)} hitSlop={8}>
                  <IconSymbol name="xmark.circle.fill" size={16} color={C.textTertiary} />
                </Pressable>
              </View>
            )}

            {/* Comment Input */}
            <View style={[styles.commentInputRow, { borderColor: C.border, backgroundColor: C.backgroundSecondary }]}>
              <TextInput
                style={[styles.commentInput, { color: C.text }]}
                placeholder={replyingTo ? (language === 'vi' ? `Trả lời ${replyingTo.authorName}...` : `Reply to ${replyingTo.authorName}...`) : (language === 'vi' ? 'Viết bình luận...' : language === 'km' ? 'សរសេរមតិយោបល់...' : 'Write a comment...')}
                placeholderTextColor={C.textTertiary}
                value={newComment}
                onChangeText={setNewComment}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.sendBtn,
                  { backgroundColor: C.primary },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={handleAddComment}
              >
                <IconSymbol name="paperplane.fill" size={14} color="#131313" />
              </Pressable>
            </View>

            {/* Comments List */}
            <View style={styles.commentsList}>
              {commentsLoading ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={C.primary} />
                </View>
              ) : comments.length > 0 ? (
                comments.map((comment) => {
                  const currentUserId = firebaseUser?.uid || 'guest-user';
                  const currentAuthorName = profile?.displayName ?? firebaseUser?.email?.split('@')[0] ?? 'Người đóng góp';
                  const hasLiked = Array.isArray(comment.likedBy) && comment.likedBy.includes(currentUserId);
                  
                  // Strict check: only allow deleting own comment
                  const isMyComment = Boolean(
                    (firebaseUser?.uid && comment.userId === firebaseUser.uid) ||
                    (comment.authorName && comment.authorName === currentAuthorName)
                  );

                  return (
                    <View key={comment.id} style={[styles.commentItem, comment.parentId ? { marginLeft: 24, borderLeftWidth: 2, borderLeftColor: `${C.primary}30`, paddingLeft: 10 } : null, { borderBottomColor: `${C.border}40` }]}>
                      <View style={[styles.commentAvatar, { backgroundColor: C.backgroundTertiary }]}>
                        <Text style={[styles.avatarLetter, { color: C.primary }]}>
                          {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                      </View>
                      <View style={styles.commentContent}>
                        <View style={styles.commentHeader}>
                          <Text style={[styles.commentAuthor, { color: C.text }]}>{comment.authorName}</Text>
                          <Text style={[styles.commentTime, { color: C.textTertiary }]}>{getTimeAgo(comment.createdAt, language)}</Text>
                        </View>
                        
                        <Text style={[styles.commentText, { color: C.textSecondary }]}>
                          {comment.replyToAuthor && (
                            <Text style={styles.replyBadge}>@{comment.replyToAuthor} </Text>
                          )}
                          {comment.text}
                        </Text>

                        {/* Comment Action Buttons (Like, Reply, Retract) */}
                        <View style={styles.commentActionRow}>
                          <Pressable
                            style={({ pressed }) => [styles.commentActionBtn, pressed && { opacity: 0.7 }]}
                            onPress={() => handleToggleCommentLike(comment.id)}
                          >
                            <IconSymbol
                              name={hasLiked ? 'heart.fill' : 'heart'}
                              size={13}
                              color={hasLiked ? C.secondary : C.textTertiary}
                            />
                            <Text style={[styles.commentActionText, { color: hasLiked ? C.secondary : C.textTertiary }]}>
                              {comment.likes && comment.likes > 0 ? comment.likes : (language === 'vi' ? 'Thích' : 'Like')}
                            </Text>
                          </Pressable>

                          <Pressable
                            style={({ pressed }) => [styles.commentActionBtn, pressed && { opacity: 0.7 }]}
                            onPress={() => {
                              setReplyingTo(comment);
                              setNewComment('');
                            }}
                          >
                            <IconSymbol name="bubble.left" size={13} color={C.textTertiary} />
                            <Text style={[styles.commentActionText, { color: C.textTertiary }]}>
                              {language === 'vi' ? 'Trả lời' : language === 'km' ? 'ឆ្លើយតប' : 'Reply'}
                            </Text>
                          </Pressable>

                          {isMyComment && (
                            <Pressable
                              style={({ pressed }) => [styles.commentActionBtn, pressed && { opacity: 0.7 }]}
                              onPress={() => handleDeleteComment(comment.id)}
                            >
                              <IconSymbol name="trash" size={12} color="#FFB4AB" />
                              <Text style={[styles.commentActionText, { color: '#FFB4AB' }]}>
                                {language === 'vi' ? 'Thu hồi' : language === 'km' ? 'ដកវិញ' : 'Delete'}
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: C.textTertiary, fontStyle: 'italic', fontSize: 13 }}>
                    {language === 'vi' ? 'Chưa có bình luận nào. Hãy là người đầu tiên!' : language === 'km' ? 'មិនទាន់មានមតិយោបល់នៅឡើយទេ។' : 'No comments yet. Be the first to comment!'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Related Articles List */}
          {relatedArticles.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.relatedTitle, { color: C.text }]}>
                {language === 'vi' ? 'Bài viết liên quan' : language === 'km' ? 'អត្ថបទពាក់ព័ន្ធ' : 'Related Articles'}
              </Text>
              <View style={styles.relatedList}>
                {relatedArticles.map((relArticle) => (
                  <Link key={relArticle.id} href={`/articles/${relArticle.id}`} asChild>
                    <Pressable
                      style={({ pressed }) => [
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <View
                        style={[
                          styles.relatedItemCard,
                          { 
                            backgroundColor: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.7)', 
                            borderColor: `${C.border}35`,
                            borderLeftWidth: 3,
                            borderLeftColor: C.primary,
                          }
                        ]}
                      >
                        <View style={styles.relatedLeftGroup}>
                          <View style={[styles.relatedIconWrap, { backgroundColor: `${C.primary}14` }]}>
                            <IconSymbol name="doc.text.fill" size={15} color={C.primary} />
                          </View>
                          <View style={styles.relatedTextWrap}>
                            <Text style={{ color: C.text, fontFamily: FontFamily.interSemiBold, fontSize: 14 }} numberOfLines={1}>
                              {relArticle.title}
                            </Text>
                            <Text style={{ color: C.textTertiary, fontFamily: FontFamily.inter, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                              {relArticle.summary || (language === 'vi' ? 'Tìm hiểu sâu sắc các di sản văn hóa Nam Bộ' : language === 'km' ? 'ស្វែងយល់ស៊ីជម្រៅអំពីបេតិកភណ្ឌវប្បធម៌' : 'Deeply understand the cultural heritage')}
                            </Text>
                          </View>
                        </View>
                        <IconSymbol name="chevron.right" size={12} color={C.textTertiary} />
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Interaction Bar */}
      <View style={[
        styles.stickyBottomBar,
        {
          backgroundColor: isDark ? '#1C1B1B' : '#FFFFFF',
          borderTopColor: `${C.border}30`,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}>
        <Pressable
          style={({ pressed }) => [
            {
              flex: 1,
              flexShrink: 1,
              backgroundColor: pressed ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)') : 'transparent',
              borderRadius: 8,
            },
          ]}
          onPress={handleToggleLike}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 40,
            flex: 1,
          }}>
            <IconSymbol
              name={isLiked ? 'heart.fill' : 'heart'}
              size={18}
              color={isLiked ? C.secondary : C.textSecondary}
            />
            <Text
              numberOfLines={1}
              style={[styles.interactionBtnText, { color: isLiked ? C.secondary : C.textSecondary }]}
            >
              {isLiked ? (language === 'vi' ? 'Đã thích' : language === 'km' ? 'បានចូលចិត្ត' : 'Liked') : (language === 'vi' ? 'Thích' : language === 'km' ? 'ចូលចិត្ត' : 'Like')}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            {
              flex: 1,
              flexShrink: 1,
              backgroundColor: pressed ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)') : 'transparent',
              borderRadius: 8,
            },
          ]}
          onPress={scrollCommentsToView}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 40,
            flex: 1,
          }}>
            <IconSymbol
              name="bubble.left"
              size={18}
              color={C.textSecondary}
            />
            <Text
              numberOfLines={1}
              style={[styles.interactionBtnText, { color: C.textSecondary }]}
            >
              {language === 'vi' ? 'Bình luận' : language === 'km' ? 'មតិ' : 'Comment'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            {
              flex: 1,
              flexShrink: 1,
              backgroundColor: pressed ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)') : 'transparent',
              borderRadius: 8,
            },
          ]}
          onPress={handleShare}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 40,
            flex: 1,
          }}>
            <IconSymbol
              name="square.and.arrow.up"
              size={18}
              color={C.textSecondary}
            />
            <Text
              numberOfLines={1}
              style={[styles.interactionBtnText, { color: C.textSecondary }]}
            >
              {language === 'vi' ? 'Chia sẻ' : language === 'km' ? 'ចែករំលែក' : 'Share'}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodyMedium,
  },
  backPillBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  backPillBtnText: {
    ...Typography.labelLarge,
    color: '#131313',
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    ...Platform.select({
      web: { backdropFilter: 'blur(8px)' } as any,
      default: {},
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroWrap: {
    width: SW,
    height: HERO_H,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.lg,
    minHeight: 450,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    ...Typography.labelSmall,
    letterSpacing: 1,
    fontWeight: '600',
  },
  authorDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
  },
  metaDot: {
    fontSize: 10,
  },
  title: {
    ...Typography.headlineLarge,
    marginBottom: Spacing.md,
    lineHeight: 38,
    fontFamily: FontFamily.playfairBold,
  },
  summaryPanel: {
    borderLeftWidth: 3,
    borderWidth: 0.5,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  summaryTitle: {
    ...Typography.labelSmall,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryText: {
    ...Typography.bodyMedium,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  bodyContainer: {
    marginBottom: Spacing.xl,
  },
  bodyText: {
    ...Typography.bodyMedium,
    lineHeight: 26,
    fontFamily: FontFamily.inter,
  },
  illustrationCard: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  illustrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  illustrationTitle: {
    ...Typography.titleSmall,
  },
  illustrationDescription: {
    ...Typography.bodySmall,
    lineHeight: 18,
  },
  illustrationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  illustrationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 0.5,
  },
  illustrationTagText: {
    ...Typography.labelSmall,
  },
  relatedSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  relatedTitle: {
    ...Typography.titleMedium,
  },
  relatedList: {
    gap: Spacing.sm,
  },
  relatedItemCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.md,
  },
  relatedLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  relatedIconWrap: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  relatedTextWrap: {
    flex: 1,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
  },
  interactionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    gap: 4,
    height: 40,
    borderRadius: 8,
  },
  interactionBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Comments Styles ───────────────────────────────
  commentsSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitleText: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 20,
    fontWeight: '700',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.md,
    paddingRight: 6,
    height: 48,
  },
  commentInput: {
    flex: 1,
    fontFamily: FontFamily.inter,
    fontSize: 14,
    height: '100%',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsList: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  commentItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontFamily: FontFamily.inter,
    fontSize: 11,
  },
  commentText: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 18,
  },
  replyBadge: {
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '700',
    color: '#D4AF37',
  },
  replyingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 6,
  },
  replyingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  commentActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: Spacing.md,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccentBar: {
    width: 3.5,
    height: 20,
    borderRadius: BorderRadius.full,
  },
  sectionTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  galleryMain: {
    width: '100%',
    height: 210,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImgCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  galleryImgCounterText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    color: '#fff',
  },
  galleryTapHint: {
    position: 'absolute',
    bottom: 10,
    left: 10,
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
});