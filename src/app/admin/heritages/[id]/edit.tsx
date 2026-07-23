import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchHeritageById, updateHeritage } from '@/lib/heritage-repository';
import { isFirebaseConfigured, isDemoDataEnabled } from '@/lib/firebase';
import { CustomAlert } from '@/components/ui/custom-alert';

async function uploadImageAsync(uri: string): Promise<string> {
  return await uploadImageToCloudinary(uri, 'heritages');
}

export default function AdminEditHeritageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [province, setProvince] = useState('');
  const [category, setCategory] = useState('Kiến trúc tôn giáo');
  const [type, setType] = useState<'tangible' | 'intangible'>('tangible');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('Khám phá');
  const [description, setDescription] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [viewsInput, setViewsInput] = useState('0');
  const [likesInput, setLikesInput] = useState('0');

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
          showAlert('Lỗi tải ảnh', 'Không thể tải ảnh lên máy chủ. Bạn vẫn có thể dùng ảnh dưới dạng cục bộ.', 'warning');
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
          showAlert('Lỗi tải ảnh', 'Không thể tải ảnh lên máy chủ. Bạn vẫn có thể dùng ảnh dưới dạng cục bộ.', 'warning');
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

  const categories = ['Kiến trúc tôn giáo', 'Lễ hội truyền thống', 'Nghệ thuật biểu diễn', 'Ẩm thực', 'Khác'];
  const tags = ['Khám phá', 'Nổi bật', 'Mới', 'Sự kiện', 'Xem nhanh'];

  useEffect(() => {
    async function loadHeritage() {
      if (!id) return;
      try {
        setLoading(true);
        const item = await fetchHeritageById(id);
        if (item) {
          setTitle(item.title);
          setProvince(item.province);
          setCategory(item.category);
          setType(item.type || 'tangible');
          setSubtitle(item.subtitle);
          setBody(item.body || '');
          setTag(item.tag);
          setDescription(item.description);
          setHighlightsInput(item.highlights ? item.highlights.join('\n') : '');
          setCoverImage(item.coverImage || '');
          setGallery(item.gallery || []);
          setViewsInput(item.views !== undefined ? String(item.views) : '0');
          setLikesInput(item.likes !== undefined ? String(item.likes) : '0');
          if (item.location) {
            setLatInput(item.location.lat ? String(item.location.lat) : '');
            setLngInput(item.location.lng ? String(item.location.lng) : '');
          }
        } else {
          showAlert('Lỗi', 'Không tìm thấy di sản.', 'error', () => router.back());
        }
      } catch (error) {
        console.error(error);
        showAlert('Lỗi', 'Không thể tải dữ liệu di sản.', 'error', () => router.back());
      } finally {
        setLoading(false);
      }
    }
    loadHeritage();
  }, [id]);

  async function handleSave() {
    if (!title.trim() || !province.trim() || !description.trim()) {
      showAlert('Thiếu thông tin', 'Vui lòng điền đầy đủ Tiêu đề, Tỉnh thành và Mô tả chi tiết.', 'warning');
      return;
    }

    try {
      setIsSaving(true);
      
      const highlights = highlightsInput
        .split('\n')
        .map(h => h.trim())
        .filter(h => h.length > 0);

      const lat = parseFloat(latInput);
      const lng = parseFloat(lngInput);
      const location = (type === 'tangible' && !isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
      const views = parseInt(viewsInput) || 0;
      const likes = parseInt(likesInput) || 0;

      await updateHeritage(id, {
        title: title.trim(),
        province: province.trim(),
        category,
        type,
        subtitle: subtitle.trim(),
        body: body.trim() || subtitle.trim() || title.trim(),
        tag,
        description: description.trim(),
        highlights,
        coverImage: coverImage.trim() || undefined,
        gallery,
        location,
        views,
        likes,
      });

      if (Platform.OS === 'web') {
        alert('Cập nhật di sản thành công!');
        router.back();
      } else {
        showAlert('Thành công', 'Đã cập nhật thông tin di sản.', 'success', () => router.back());
      }
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Lỗi không xác định';
      showAlert('Lỗi', `Không thể cập nhật di sản: ${msg}`, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải di sản...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Curved Gold Header */}
      <Animated.View entering={FadeIn.duration(500)} style={[styles.header, { backgroundColor: colors.secondary, paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="chevron.left" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <ThemedText style={styles.headerTitle}>Chỉnh sửa di sản</ThemedText>
            <ThemedText style={styles.headerSub}>Cập nhật thông tin di sản văn hóa</ThemedText>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <IconSymbol name="pencil.circle.fill" size={22} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1 - Basic Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Thông tin cơ bản</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tên di sản *</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="VD: Chùa Hang, Lễ hội đua ghe Ngo..."
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Type Switcher */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Loại di sản</ThemedText>
              <View style={styles.typeSelectorRow}>
                <Pressable
                  onPress={() => setType('tangible')}
                  style={[
                    styles.typeSelectorBtn,
                    { borderColor: colors.border, backgroundColor: colors.background },
                    type === 'tangible' && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
                  ]}
                >
                  <IconSymbol name="building.2.fill" size={16} color={type === 'tangible' ? colors.primary : colors.textSecondary} />
                  <ThemedText style={[styles.typeSelectorText, { color: type === 'tangible' ? colors.primary : colors.textSecondary }, type === 'tangible' && { fontWeight: '700' }]}>
                    {t.heritage.types.tangible}
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => setType('intangible')}
                  style={[
                    styles.typeSelectorBtn,
                    { borderColor: colors.border, backgroundColor: colors.background },
                    type === 'intangible' && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
                  ]}
                >
                  <IconSymbol name="sparkles" size={16} color={type === 'intangible' ? colors.primary : colors.textSecondary} />
                  <ThemedText style={[styles.typeSelectorText, { color: type === 'intangible' ? colors.primary : colors.textSecondary }, type === 'intangible' && { fontWeight: '700' }]}>
                    {t.heritage.types.intangible}
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Danh mục di sản</ThemedText>
              <View style={styles.chipsContainer}>
                {categories.map((cat) => {
                  const active = cat === category;
                  return (
                    <Pressable key={cat} onPress={() => setCategory(cat)}>
                      <Badge 
                        variant={active ? 'primary' : 'secondary'} 
                        size="medium"
                        style={active ? { backgroundColor: colors.primary } : undefined}
                        textStyle={active ? { color: '#FFFFFF' } : undefined}
                      >
                        {cat}
                      </Badge>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Province */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tỉnh thành *</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="VD: Sóc Trăng, Trà Vinh, An Giang..."
                placeholderTextColor={colors.textTertiary}
                value={province}
                onChangeText={setProvince}
              />
            </View>
          </View>
        </Animated.View>

        {/* Section 2 - Content */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="doc.text.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Nội dung mô tả</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tiêu đề phụ</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="VD: Ngôi chùa cổ độc đáo ở Trà Vinh..."
                placeholderTextColor={colors.textTertiary}
                value={subtitle}
                onChangeText={setSubtitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Giới thiệu / Mô tả ngắn *</ThemedText>
              <TextInput
                style={[styles.input, styles.largeTextArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder="Nhập giới thiệu ngắn gọn về di sản..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Detailed Content */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Nội dung chi tiết</ThemedText>
              <TextInput
                style={[styles.input, styles.largeTextArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, minHeight: 180 }]}
                placeholder="Nhập thông tin lịch sử, kiến trúc, văn hóa chi tiết..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={8}
                value={body}
                onChangeText={setBody}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Các điểm nổi bật (mỗi dòng một ý)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                placeholder={"Ý 1\nÝ 2\nÝ 3..."}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                value={highlightsInput}
                onChangeText={setHighlightsInput}
              />
            </View>
          </View>
        </Animated.View>

        {/* Section 3 - Media & Location */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="photo.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Hình ảnh & Vị trí</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Thẻ đánh dấu (Tag)</ThemedText>
              <View style={styles.chipsContainer}>
                {tags.map((tItem) => {
                  const active = tItem === tag;
                  return (
                    <Pressable key={tItem} onPress={() => setTag(tItem)}>
                      <Badge 
                        variant={active ? 'warning' : 'secondary'} 
                        size="medium"
                        style={active ? { backgroundColor: colors.warning } : undefined}
                        textStyle={active ? { color: '#FFFFFF' } : undefined}
                      >
                        {tItem}
                      </Badge>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Cover Image URL / Picker */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Hình ảnh di sản</ThemedText>
              
              {/* Image Picker Box / Preview */}
              <TouchableOpacity
                style={[
                  styles.imagePickerBox,
                  { borderColor: colors.border, backgroundColor: colors.background }
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
                  style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  onPress={pickImage}
                  disabled={isUploadingImage}
                >
                  <IconSymbol name="photo.on.rectangle.angled" size={14} color={colors.primary} />
                  <ThemedText style={[styles.photoActionText, { color: colors.text }]}>Chọn từ thư viện</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  onPress={takePhoto}
                  disabled={isUploadingImage}
                >
                  <IconSymbol name="camera.fill" size={14} color={colors.primary} />
                  <ThemedText style={[styles.photoActionText, { color: colors.text }]}>Chụp ảnh mới</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Manual Link Input */}
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, marginTop: Spacing.sm }]}
                placeholder="Hoặc nhập liên kết ảnh trực tiếp (URL)..."
                value={coverImage}
                onChangeText={setCoverImage}
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Gallery Images (Thư viện ảnh di sản) */}
            <View style={[styles.inputGroup, { marginTop: Spacing.md }]}>
              <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Thư viện ảnh di sản</ThemedText>
              
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
                <View style={[styles.emptyGalleryBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <IconSymbol name="photo.on.rectangle.angled" size={24} color={colors.textTertiary} />
                  <ThemedText style={{ color: colors.textTertiary, fontSize: 12, marginTop: 4 }}>Chưa có ảnh trong thư viện</ThemedText>
                </View>
              )}

              {/* Gallery Action Buttons */}
              <View style={styles.photoActionsRow}>
                <TouchableOpacity
                  style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  onPress={pickGalleryImage}
                  disabled={isUploadingGallery}
                >
                  <IconSymbol name="photo.on.rectangle.angled" size={14} color={colors.primary} />
                  <ThemedText style={[styles.photoActionText, { color: colors.text }]}>
                    {isUploadingGallery ? 'Đang tải...' : 'Thêm từ thư viện'}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.photoActionBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  onPress={takeGalleryPhoto}
                  disabled={isUploadingGallery}
                >
                  <IconSymbol name="camera.fill" size={14} color={colors.primary} />
                  <ThemedText style={[styles.photoActionText, { color: colors.text }]}>Chụp ảnh mới</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {type === 'tangible' && (
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: colors.textSecondary }]}>Tọa độ địa lý (Cho Bản đồ)</ThemedText>
                <View style={styles.coordsRow}>
                  <View style={{ flex: 1, gap: Spacing.xs }}>
                    <ThemedText style={[styles.miniLabel, { color: colors.textTertiary }]}>Vĩ độ (Latitude)</ThemedText>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                      placeholder="VD: 9.5775"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="numeric"
                      value={latInput}
                      onChangeText={setLatInput}
                    />
                  </View>
                  <View style={{ flex: 1, gap: Spacing.xs }}>
                    <ThemedText style={[styles.miniLabel, { color: colors.textTertiary }]}>Kinh độ (Longitude)</ThemedText>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                      placeholder="VD: 105.9728"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="numeric"
                      value={lngInput}
                      onChangeText={setLngInput}
                    />
                  </View>
                </View>
                <Pressable 
                  onPress={() => Linking.openURL('https://www.google.com/maps')}
                  style={({ pressed }) => [styles.coordsLink, pressed && { opacity: 0.7 }]}
                >
                  <IconSymbol name="map.fill" size={14} color={colors.primary} />
                  <ThemedText style={[styles.coordsLinkText, { color: colors.primary }]}>
                    Mở Google Maps để lấy tọa độ địa điểm
                  </ThemedText>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Section 4 - Stats */}
        <Animated.View entering={FadeInDown.delay(250).duration(600)}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.primary + '18' }]}>
              <IconSymbol name="chart.bar.fill" size={18} color={colors.primary} />
            </View>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Thống kê tương tác</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderLight }]}>
            <View style={styles.coordsRow}>
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <View style={styles.statLabelRow}>
                  <IconSymbol name="eye.fill" size={14} color={colors.textTertiary} />
                  <ThemedText style={[styles.miniLabel, { color: colors.textTertiary }]}>Lượt xem</ThemedText>
                </View>
                <View
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      justifyContent: 'center',
                    }
                  ]}
                >
                  <ThemedText style={{ color: colors.textSecondary, fontFamily: FontFamily.interSemiBold }}>
                    {viewsInput || '0'}
                  </ThemedText>
                </View>
              </View>
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <View style={styles.statLabelRow}>
                  <IconSymbol name="heart.fill" size={14} color={colors.textTertiary} />
                  <ThemedText style={[styles.miniLabel, { color: colors.textTertiary }]}>Lượt thích</ThemedText>
                </View>
                <View
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      justifyContent: 'center',
                    }
                  ]}
                >
                  <ThemedText style={{ color: colors.textSecondary, fontFamily: FontFamily.interSemiBold }}>
                    {likesInput || '0'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Sticky Action Buttons */}
      <View style={[
        styles.stickyBottomBar,
        {
          backgroundColor: isDark ? '#1C1B1B' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          paddingBottom: Math.max(insets.bottom, 12),
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.actionBtnCancel,
            { borderColor: colors.primary }
          ]}
          onPress={() => router.back()}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.actionBtnCancelText, { color: colors.primary }]}>
            Hủy
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtnSave,
            { backgroundColor: colors.primary }
          ]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#131313" />
          ) : (
            <ThemedText style={styles.actionBtnSaveText}>
              Lưu thay đổi
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>

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
  },
  loadingText: {
    ...Typography.bodyMedium,
    opacity: 0.7,
  },
  header: {
    paddingBottom: Spacing.xl + 8,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.large,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: 110,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.titleSmall,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.small,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.labelMedium,
    fontWeight: '600',
  },
  miniLabel: {
    ...Typography.labelSmall,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  largeTextArea: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeSelectorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  typeSelectorText: {
    ...Typography.labelMedium,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  stickyBottomBar: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    borderTopWidth: 0.5,
    ...Platform.select({
      ios: Shadows.medium,
      web: Shadows.medium,
      default: {},
    }),
  },
  actionBtnCancel: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnCancelText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnSave: {
    flex: 2,
    height: 46,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: Shadows.small,
      web: Shadows.small,
      default: {},
    }),
  },
  actionBtnSaveText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    color: '#131313',
    fontWeight: '700',
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
  coordsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  coordsLinkText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
