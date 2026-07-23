import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { BorderRadius, Colors, Spacing, Typography, Shadows, FontFamily } from '@/constants/theme';
import { articleTemplates, getTemplateById } from '@/data/article-templates';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthSession } from '@/lib/auth-session';
import { submitArticle } from '@/lib/article-repository';
import { addUserNotification } from '@/lib/user-repository';
import { isFirebaseConfigured, isDemoDataEnabled } from '@/lib/firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const currentDateText = () => {
  const today = new Date();
  return today.toLocaleDateString('vi-VN');
};

async function uploadImageAsync(uri: string): Promise<string> {
  return await uploadImageToCloudinary(uri, 'articles');
}

export default function NewArticleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { firebaseUser, profile } = useAuthSession();
  const insets = useSafeAreaInsets();

  const [templateId, setTemplateId] = useState(articleTemplates[0].id);
  const selectedTemplate = useMemo(() => getTemplateById(templateId), [templateId]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [dateText, setDateText] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const isDark = colorScheme === 'dark';

  if (!firebaseUser) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Guest Avatar Placeholder */}
        <Animated.View 
          entering={FadeInDown.duration(600)}
          style={[
            styles.avatarWrap, 
            { 
              backgroundColor: colors.backgroundSecondary, 
              borderColor: isDark ? 'rgba(242, 202, 80, 0.45)' : 'rgba(182, 139, 30, 0.35)',
              borderWidth: 2,
            }
          ]}
        >
          <IconSymbol name="person.fill" size={48} color={colors.primary} />
        </Animated.View>

        {/* Heading */}
        <Animated.Text 
          entering={FadeInDown.delay(100).duration(600)}
          style={[styles.lockTitle, { color: isDark ? colors.primary : colors.primaryDark }]}
        >
          Yêu cầu đăng nhập
        </Animated.Text>

        {/* Message */}
        <Animated.Text 
          entering={FadeInDown.delay(150).duration(600)}
          style={[styles.lockMessage, { color: colors.textSecondary }]}
        >
          Vui lòng đăng nhập tài khoản để đóng góp các bài viết di sản văn hóa. Đăng nhập giúp lưu trữ bài viết của bạn an toàn hơn.
        </Animated.Text>

        {/* Login Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ width: '100%', gap: 22, alignItems: 'center' }}>
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
                <ThemedText style={styles.loginBtnText}>Đăng Nhập Ngay</ThemedText>
                <IconSymbol name="chevron.right" size={14} color="rgba(19,19,19,0.6)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryAuthButton, 
              { 
                borderColor: isDark ? '#E5E2E1' : 'rgba(28, 26, 23, 0.4)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                minWidth: 260,
              }
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.secondaryAuthButtonText, { color: colors.textSecondary }]}>Quay lại</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }


  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    onConfirm?: () => void,
    confirmText?: string,
    cancelText?: string,
    onClose?: () => void
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
    });
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh để tải ảnh lên.', 'warning');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setIsUploadingImage(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageAsync(selectedUri);
          }
          setCoverImage(uploadedUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
          const errMsg = err instanceof Error ? err.message : String(err);
          showAlert('Lỗi tải ảnh', `Không thể tải ảnh lên máy chủ.\n\nChi tiết lỗi: ${errMsg}\n\nBạn vẫn có thể dùng ảnh dưới dạng cục bộ.`, 'warning');
          setCoverImage(selectedUri);
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Quyền truy cập', 'Ứng dụng cần quyền truy cập máy ảnh để chụp ảnh.', 'warning');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setIsUploadingImage(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageAsync(selectedUri);
          }
          setCoverImage(uploadedUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
          const errMsg = err instanceof Error ? err.message : String(err);
          showAlert('Lỗi tải ảnh', `Không thể tải ảnh lên máy chủ.\n\nChi tiết lỗi: ${errMsg}\n\nBạn vẫn có thể dùng ảnh dưới dạng cục bộ.`, 'warning');
          setCoverImage(selectedUri);
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    }
  };

  const pickGalleryImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh để tải ảnh lên.', 'warning');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsUploadingGallery(true);
        try {
          const uploadedUrls: string[] = [];
          for (const asset of result.assets) {
            let uploadedUrl = asset.uri;
            if (isFirebaseConfigured() && !isDemoDataEnabled()) {
              uploadedUrl = await uploadImageAsync(asset.uri);
            }
            uploadedUrls.push(uploadedUrl);
          }
          setGallery(prev => [...prev, ...uploadedUrls]);
        } catch (err) {
          console.error('Error uploading gallery image:', err);
          showAlert('Lỗi tải ảnh', 'Không thể tải ảnh lên máy chủ. Bạn vẫn có thể dùng ảnh cục bộ.', 'warning');
          const localUris = result.assets.map(asset => asset.uri);
          setGallery(prev => [...prev, ...localUris]);
        } finally {
          setIsUploadingGallery(false);
        }
      }
    } catch (err) {
      console.error('Error picking gallery image:', err);
    }
  };

  const takeGalleryPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Quyền truy cập', 'Ứng dụng cần quyền truy cập máy ảnh để chụp ảnh.', 'warning');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setIsUploadingGallery(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageAsync(selectedUri);
          }
          setGallery(prev => [...prev, uploadedUrl]);
        } catch (err) {
          console.error('Error uploading camera gallery image:', err);
          showAlert('Lỗi tải ảnh', 'Không thể tải ảnh chụp lên máy chủ. Bạn vẫn có thể dùng ảnh cục bộ.', 'warning');
          setGallery(prev => [...prev, selectedUri]);
        } finally {
          setIsUploadingGallery(false);
        }
      }
    } catch (err) {
      console.error('Error taking gallery photo:', err);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  function handleTemplateChange(nextTemplateId: string) {
    const nextTemplate = getTemplateById(nextTemplateId);
    setTemplateId(nextTemplate.id);
    setTitle('');
    setSummary('');
    setContent('');
  }

  async function handleSave() {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      showAlert('Thiếu nội dung', 'Bạn cần nhập ít nhất tiêu đề, tóm tắt và nội dung.', 'warning');
      return;
    }

    try {
      setIsSaving(true);

      if (!firebaseUser) {
        showAlert(
          'Chưa đăng nhập',
          'Bạn cần đăng nhập để gửi bài viết.',
          'warning',
          () => {
            setAlertConfig(prev => ({ ...prev, visible: false }));
            router.push('/auth');
          },
          'Đăng nhập',
          'Hủy'
        );
        return;
      }

      await submitArticle({
        templateId: selectedTemplate.id,
        title: title.trim(),
        category: selectedTemplate.category,
        summary: summary.trim(),
        content: content.trim(),
        author: author.trim() || profile?.displayName || 'Ban biên soạn',
        date: dateText.trim() || currentDateText(),
        coverImage: coverImage.trim() || undefined,
        gallery,
        createdAt: new Date().toISOString(),
        authorId: firebaseUser.uid,
      });

      // Add notification for the user
      await addUserNotification(firebaseUser.uid, {
        titleVi: 'Bài viết đang chờ duyệt 📝',
        titleKm: 'អត្ថបទកំពុងរង់ចាំការអនុម័ត 📝',
        titleEn: 'Article Pending Approval 📝',
        descriptionVi: `Bài viết "${title.trim()}" của bạn đã được gửi và đang chờ ban quản trị kiểm duyệt.`,
        descriptionKm: `អត្ថបទ "${title.trim()}" របស់អ្នកត្រូវបានផ្ញើ និងកំពុងរង់ចាំការត្រួតពិនិត្យ។`,
        descriptionEn: `Your article "${title.trim()}" has been submitted and is pending review.`,
        timeVi: 'Vừa xong',
        timeKm: 'មុននេះបន្តិច',
        timeEn: 'Just now',
        icon: 'doc.text.fill',
        color: '#FFA000',
        isNew: true,
      });

      showAlert(
        'Đã gửi bài viết',
        'Bài viết của bạn đã được gửi thành công và đang chờ admin duyệt. Sau khi được duyệt, bài sẽ xuất hiện cho mọi người.',
        'success',
        () => router.back(),
        'OK'
      );
    } catch (error) {
      showAlert('Lỗi', error instanceof Error ? error.message : 'Không gửi được bài viết', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Curved Header Panel */}
        <Animated.View 
          entering={FadeIn.duration(600)}
          style={[styles.headerSection, { backgroundColor: colors.primary, paddingTop: Math.max(insets.top, 12) + Spacing.sm }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Badge variant="warning" size="small" style={styles.headerBadge}>
              CMS
            </Badge>
          </View>
          
          <ThemedText style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Viết Bài Mới
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
            Chọn một mẫu điển tích sẵn có để viết nhanh và lưu trữ bài viết
          </ThemedText>
        </Animated.View>

        <View style={styles.formContent}>
          {/* Template selection Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Card variant="elevated" padding="md" style={styles.card}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]} type="subtitle">Chọn mẫu cấu trúc</ThemedText>
              <View style={styles.templateRow}>
                {articleTemplates.map((template) => {
                  const active = template.id === templateId;
                  return (
                    <TouchableOpacity 
                      key={template.id} 
                      onPress={() => handleTemplateChange(template.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        styles.templateChip, 
                        active 
                          ? { backgroundColor: colors.primary } 
                          : { backgroundColor: colors.backgroundSecondary, borderWidth: 1, borderColor: colors.borderLight }
                      ]}>
                        <ThemedText style={[
                          styles.templateChipText, 
                          active ? { color: '#FFFFFF', fontWeight: '700' } : { color: colors.textSecondary }
                        ]}>
                          {template.name}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <ThemedText style={[styles.templateHint, { color: colors.textTertiary }]}>
                Phân loại bài viết: {selectedTemplate.category}
              </ThemedText>
            </Card>
          </Animated.View>

          {/* Form details Card */}
          <Animated.View entering={FadeInDown.delay(150).duration(600)}>
            <Card variant="elevated" padding="md" style={styles.card}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]} type="subtitle">Thông tin bài viết</ThemedText>
              
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Tiêu đề bài viết</ThemedText>
                <TextInput 
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundSecondary }]} 
                  placeholder={selectedTemplate.titlePlaceholder} 
                  value={title} 
                  onChangeText={setTitle} 
                  placeholderTextColor={colors.textTertiary} 
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Tóm ý nhanh (Summary)</ThemedText>
                <TextInput 
                  style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundSecondary }]} 
                  placeholder={selectedTemplate.summaryPlaceholder} 
                  value={summary} 
                  onChangeText={setSummary} 
                  placeholderTextColor={colors.textTertiary} 
                  multiline 
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Nội dung chi tiết</ThemedText>
                <TextInput
                  style={[styles.input, styles.contentArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundSecondary }]}
                  placeholder={selectedTemplate.contentPlaceholder}
                  value={content}
                  onChangeText={setContent}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Tác giả</ThemedText>
                <TextInput 
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundSecondary }]} 
                  placeholder={profile?.displayName || 'Ban biên soạn'} 
                  value={author} 
                  onChangeText={setAuthor} 
                  placeholderTextColor={colors.textTertiary} 
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Ngày đăng</ThemedText>
                <TextInput 
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundSecondary }]} 
                  placeholder={currentDateText()} 
                  value={dateText} 
                  onChangeText={setDateText} 
                  placeholderTextColor={colors.textTertiary} 
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Ảnh bìa bài viết</ThemedText>
                
                {/* Image Picker Box / Preview */}
                <TouchableOpacity
                  style={[
                    styles.imagePickerBox,
                    { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }
                  ]}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  {isUploadingImage ? (
                    <View style={styles.pickerContent}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <ThemedText style={[styles.pickerHint, { color: colors.textTertiary }]}>Đang tải ảnh lên...</ThemedText>
                    </View>
                  ) : coverImage.trim() ? (
                    <View style={styles.previewImageContainer}>
                      <Image source={{ uri: coverImage.trim() }} style={styles.pickerImage} />
                      <TouchableOpacity
                        style={[styles.removeImageBadge, { backgroundColor: colors.secondary }]}
                        onPress={() => setCoverImage('')}
                      >
                        <IconSymbol name="xmark.circle.fill" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.pickerContent}>
                      <IconSymbol name="photo.fill" size={28} color={colors.primary} />
                      <ThemedText style={[styles.pickerHint, { color: colors.textTertiary }]}>Nhấn để chọn ảnh từ thư viện</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Camera / Library Action Buttons */}
                <View style={styles.photoActionsRow}>
                  <TouchableOpacity
                    style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                    onPress={pickImage}
                    disabled={isUploadingImage}
                  >
                    <IconSymbol name="photo.on.rectangle.angled" size={14} color={colors.primary} />
                    <ThemedText style={[styles.photoActionText, { color: colors.text }]}>Chọn từ thư viện</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                    onPress={takePhoto}
                    disabled={isUploadingImage}
                  >
                    <IconSymbol name="camera.fill" size={14} color={colors.primary} />
                    <ThemedText style={[styles.photoActionText, { color: colors.text }]}>Chụp ảnh mới</ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Manual Link Input */}
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundSecondary, marginTop: Spacing.sm }]}
                  placeholder="Hoặc nhập liên kết ảnh bìa trực tiếp (URL)..."
                  value={coverImage}
                  onChangeText={setCoverImage}
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Gallery Images (Thư viện ảnh bài viết) */}
          <Animated.View entering={FadeInDown.delay(180).duration(600)}>
            <Card variant="elevated" padding="md" style={styles.card}>
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>Thư viện ảnh bài viết</ThemedText>
                
                {/* Gallery Scroll */}
                {gallery.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScrollContainer}>
                    {gallery.map((imgUrl, idx) => (
                      <View key={idx} style={[styles.galleryThumbContainer, { borderColor: colors.border }]}>
                        <Image source={{ uri: imgUrl }} style={styles.galleryThumbImage} />
                        <TouchableOpacity
                          style={[styles.galleryRemoveBadge, { backgroundColor: colors.secondary }]}
                          onPress={() => removeGalleryImage(idx)}
                        >
                          <IconSymbol name="xmark.circle.fill" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={[styles.emptyGalleryBox, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}>
                    <IconSymbol name="photo.on.rectangle.angled" size={24} color={colors.textTertiary} />
                    <ThemedText style={{ color: colors.textTertiary, fontSize: 12, marginTop: 4 }}>Chưa có ảnh trong thư viện</ThemedText>
                  </View>
                )}

                {/* Gallery Action Buttons */}
                <View style={styles.photoActionsRow}>
                  <TouchableOpacity
                    style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                    onPress={pickGalleryImage}
                    disabled={isUploadingGallery}
                  >
                    <IconSymbol name="photo.on.rectangle.angled" size={14} color={colors.primary} />
                    <ThemedText style={[styles.photoActionText, { color: colors.text }]}>
                      {isUploadingGallery ? 'Đang tải...' : 'Thêm từ thư viện'}
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                    onPress={takeGalleryPhoto}
                    disabled={isUploadingGallery}
                  >
                    <IconSymbol name="camera.fill" size={14} color={colors.primary} />
                    <ThemedText style={[styles.photoActionText, { color: colors.text }]}>Chụp ảnh mới</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Tip Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Card variant="filled" padding="md" style={styles.card}>
              <View style={styles.tipTitleRow}>
                <IconSymbol name="sparkles" size={16} color={colors.primary} />
                <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>Gợi ý biên soạn</ThemedText>
              </View>
              <ThemedText style={[styles.tipText, { color: colors.textSecondary }]}>
                Các bài viết bạn biên tập sẽ được lưu lại cục bộ trong ứng dụng. Sau khi kết nối thành công với máy chủ Firestore, bài viết sẽ được gửi đồng bộ lên CSDL đám mây để tất cả người dùng khác cùng xem.
              </ThemedText>
            </Card>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View entering={FadeInDown.delay(250).duration(600)}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
              onPress={handleSave} 
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.primaryButtonText}>Lưu bài viết</ThemedText>
              )}
            </TouchableOpacity>
          </Animated.View>
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
        onClose={() => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          if (alertConfig.onClose) {
            alertConfig.onClose();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.large,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderColor: 'transparent',
  },
  headerTitle: {
    ...Typography.headlineMedium,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.bodyMedium,
    lineHeight: 20,
  },
  formContent: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    gap: Spacing.sm + 2,
  },
  cardTitle: {
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  templateChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  templateChipText: {
    ...Typography.labelSmall,
    fontWeight: '600',
  },
  templateHint: {
    ...Typography.bodySmall,
    fontStyle: 'italic',
    marginTop: 2,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    ...Typography.labelSmall,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 44,
    ...Typography.bodyMedium,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  contentArea: {
    height: 180,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  helperText: {
    ...Typography.bodySmall,
    fontSize: 11,
    lineHeight: 14,
  },
  imagePickerBox: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  pickerContent: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pickerHint: {
    ...Typography.bodySmall,
    fontSize: 12,
  },
  previewImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  pickerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  photoActionBtn: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  photoActionText: {
    ...Typography.bodySmall,
    fontSize: 12,
    fontWeight: '600',
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tipText: {
    ...Typography.bodySmall,
    lineHeight: 16,
  },
  primaryButton: {
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
    marginTop: Spacing.xs,
  },
  primaryButtonText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
  secondaryAuthButton: {
    height: 52,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryAuthButtonText: {
    fontSize: 15,
    fontFamily: FontFamily.interMedium,
    fontWeight: '600',
  },
  galleryScrollContainer: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  galleryThumbContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  galleryRemoveBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  emptyGalleryBox: {
    width: '100%',
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});