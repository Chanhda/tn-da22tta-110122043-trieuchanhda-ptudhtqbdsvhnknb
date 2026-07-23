import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Colors, BorderRadius, FontFamily, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useRequireAdmin } from '@/lib/auth-session';
import { fetchFestivalById, updateFestival, createFestival } from '@/lib/festival-repository';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { isFirebaseConfigured, isDemoDataEnabled } from '@/lib/firebase';
import type { FestivalItem } from '@/constants/festivals';
import { translateText } from '@/lib/translation-helper';

async function uploadImageAsync(uri: string): Promise<string> {
  return await uploadImageToCloudinary(uri, 'festivals');
}

export default function EditFestivalScreen() {
  const { loading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { resolvedColorScheme } = useColorSchemePreference();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const festivalId = params.id;
  const isEditing = Boolean(festivalId);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form State
  const [titleVi, setTitleVi] = useState('');
  const [khmerTitle, setKhmerTitle] = useState('');
  const [subtitleVi, setSubtitleVi] = useState('');
  
  // Easy Date & Time inputs for Countdown Target
  const [targetDateString, setTargetDateString] = useState('2026-11-23'); // YYYY-MM-DD
  const [targetTimeString, setTargetTimeString] = useState('08:00'); // HH:mm

  // Dual Calendar Display (Lunar & Solar)
  const [dateDisplayVi, setDateDisplayVi] = useState('');
  const [dateDisplayKm, setDateDisplayKm] = useState('');
  const [dateDisplayEn, setDateDisplayEn] = useState('');

  // Rituals (newline separated)
  const [ritualsVi, setRitualsVi] = useState('');
  const [ritualsKm, setRitualsKm] = useState('');
  const [ritualsEn, setRitualsEn] = useState('');

  // Foods (comma separated)
  const [foodsVi, setFoodsVi] = useState('');
  const [foodsKm, setFoodsKm] = useState('');
  const [foodsEn, setFoodsEn] = useState('');

  const [locationVi, setLocationVi] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (!authLoading && festivalId) {
      (async () => {
        try {
          const item = await fetchFestivalById(festivalId);
          if (item) {
            setTitleVi(typeof item.title === 'string' ? item.title : item.title.vi || '');
            setKhmerTitle(item.khmerTitle || '');
            setSubtitleVi(typeof item.subtitle === 'string' ? item.subtitle : item.subtitle?.vi || '');
            
            // Extract Date & Time from targetDate ISO string
            if (item.targetDate) {
              try {
                const d = new Date(item.targetDate);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const hh = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                setTargetDateString(`${yyyy}-${mm}-${dd}`);
                setTargetTimeString(`${hh}:${min}`);
              } catch {
                setTargetDateString('2026-11-23');
                setTargetTimeString('08:00');
              }
            }

            const displayVi = typeof item.dateDisplay === 'string' ? item.dateDisplay : item.dateDisplay?.vi || '';
            setDateDisplayVi(displayVi);
            setDateDisplayKm(typeof item.dateDisplay === 'object' ? item.dateDisplay?.km || '' : '');
            setDateDisplayEn(typeof item.dateDisplay === 'object' ? item.dateDisplay?.en || '' : '');

            setLocationVi(typeof item.location === 'string' ? item.location : item.location?.vi || '');
            setDescriptionVi(typeof item.description === 'string' ? item.description : item.description?.vi || '');
            setCoverImage(item.coverImage || '');

            // Load rituals (array of strings -> string joined by newline)
            if (item.rituals) {
              setRitualsVi((item.rituals.vi || []).join('\n'));
              setRitualsKm((item.rituals.km || []).join('\n'));
              setRitualsEn((item.rituals.en || []).join('\n'));
            }
            // Load foods (array of strings -> string joined by comma)
            if (item.foods) {
              setFoodsVi((item.foods.vi || []).join(', '));
              setFoodsKm((item.foods.km || []).join(', '));
              setFoodsEn((item.foods.en || []).join(', '));
            }
          }
        } catch (err) {
          console.error('Error fetching festival details:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [authLoading, festivalId]);

  // Image Picker Functions
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({ visible: true, type: 'warning', title: 'Quyền truy cập', message: 'Cần quyền truy cập thư viện ảnh.' });
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
        } catch {
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
        setAlertConfig({ visible: true, type: 'warning', title: 'Quyền truy cập', message: 'Cần quyền truy cập máy ảnh.' });
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
        } catch {
          setCoverImage(selectedUri);
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    }
  };

  const handleSubmit = async () => {
    if (!titleVi.trim()) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập tên lễ hội.',
      });
      return;
    }

    try {
      setSubmitting(true);

      // Construct ISO Target Date cleanly
      let isoTarget = new Date().toISOString();
      if (targetDateString.trim()) {
        const timePart = targetTimeString.trim() || '08:00';
        const fullStr = `${targetDateString.trim()}T${timePart}:00.000Z`;
        const parsed = new Date(fullStr);
        if (!isNaN(parsed.getTime())) {
          isoTarget = parsed.toISOString();
        } else {
          isoTarget = new Date(targetDateString.trim()).toISOString();
        }
      }

      // Clean up inputs and translate missing languages automatically
      const cleanTitleVi = titleVi.trim();
      const finalKhmerTitle = khmerTitle.trim() || await translateText(cleanTitleVi, 'km');
      const finalEnglishTitle = await translateText(cleanTitleVi, 'en');

      const cleanSubtitleVi = subtitleVi.trim();
      const finalSubtitleKm = await translateText(cleanSubtitleVi, 'km');
      const finalSubtitleEn = await translateText(cleanSubtitleVi, 'en');

      const cleanDescriptionVi = descriptionVi.trim();
      const finalDescriptionKm = await translateText(cleanDescriptionVi, 'km');
      const finalDescriptionEn = await translateText(cleanDescriptionVi, 'en');

      const cleanLocationVi = locationVi.trim();
      const finalLocationKm = await translateText(cleanLocationVi, 'km');
      const finalLocationEn = await translateText(cleanLocationVi, 'en');

      const cleanDateDisplayVi = dateDisplayVi.trim();
      const finalDateDisplayKm = dateDisplayKm.trim() || await translateText(cleanDateDisplayVi, 'km');
      const finalDateDisplayEn = dateDisplayEn.trim() || await translateText(cleanDateDisplayVi, 'en');

      // Helper to split and clean text list (newline separated)
      const parseList = (text: string) => 
        text.split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);

      // Helper to split and clean comma list
      const parseCommaList = (text: string) => 
        text.split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);

      // Rituals Translation
      const parsedRitualsVi = parseList(ritualsVi);
      const parsedRitualsKm = ritualsKm.trim() 
        ? parseList(ritualsKm) 
        : await Promise.all(parsedRitualsVi.map(item => translateText(item, 'km')));
      const parsedRitualsEn = ritualsEn.trim() 
        ? parseList(ritualsEn) 
        : await Promise.all(parsedRitualsVi.map(item => translateText(item, 'en')));

      const parsedRituals = {
        vi: parsedRitualsVi,
        km: parsedRitualsKm,
        en: parsedRitualsEn,
      };

      // Foods Translation
      const parsedFoodsVi = parseCommaList(foodsVi);
      const parsedFoodsKm = foodsKm.trim() 
        ? parseCommaList(foodsKm) 
        : await Promise.all(parsedFoodsVi.map(item => translateText(item, 'km')));
      const parsedFoodsEn = foodsEn.trim() 
        ? parseCommaList(foodsEn) 
        : await Promise.all(parsedFoodsVi.map(item => translateText(item, 'en')));

      const parsedFoods = {
        vi: parsedFoodsVi,
        km: parsedFoodsKm,
        en: parsedFoodsEn,
      };

      const festivalData: Partial<FestivalItem> = {
        title: { vi: cleanTitleVi, km: finalKhmerTitle, en: finalEnglishTitle },
        khmerTitle: finalKhmerTitle,
        subtitle: { vi: cleanSubtitleVi, km: finalSubtitleKm, en: finalSubtitleEn },
        targetDate: isoTarget,
        dateDisplay: {
          vi: cleanDateDisplayVi,
          km: finalDateDisplayKm,
          en: finalDateDisplayEn,
        },
        location: { vi: cleanLocationVi, km: finalLocationKm, en: finalLocationEn },
        summary: { vi: cleanSubtitleVi, km: finalSubtitleKm, en: finalSubtitleEn },
        description: { vi: cleanDescriptionVi, km: finalDescriptionKm, en: finalDescriptionEn },
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
        rituals: parsedRituals,
        foods: parsedFoods,
        highlights: {
          vi: parsedRituals.vi.slice(0, 3),
          km: parsedRituals.km.slice(0, 3),
          en: parsedRituals.en.slice(0, 3),
        }
      };

      if (isEditing && festivalId) {
        await updateFestival(festivalId, festivalData);
      } else {
        await createFestival({
          ...festivalData,
          featured: true,
        } as any);
      }

      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Thành công',
        message: isEditing ? 'Đã cập nhật thông tin lễ hội.' : 'Đã tạo lễ hội mới thành công.',
        onConfirm: () => router.back(),
      });
    } catch {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể lưu lễ hội. Vui lòng kiểm tra lại.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Đang tải dữ liệu biểu mẫu...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
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
            {isEditing ? 'Chỉnh sửa Lễ hội' : 'Thêm Lễ hội Mới'}
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isEditing && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: C.primary + '18',
              borderColor: C.primary,
              borderWidth: 1,
              borderRadius: BorderRadius.md,
              paddingVertical: 10,
              marginBottom: 8,
            }}
            onPress={() => {
              setTitleVi('Tết Chôl Chnăm Thmây');
              setKhmerTitle('បុណ្យចូលឆ្នាំថ្មី');
              setSubtitleVi('Lễ đón Năm Mới truyền thống lớn nhất của người Khmer Nam Bộ.');
              setTargetDateString('2027-04-14');
              setTargetTimeString('08:00');
              setDateDisplayVi('Diễn ra vào ngày 14, 15, 16 tháng 4 Dương lịch hằng năm');
              setDateDisplayEn('April 14, 15, 16 every year');
              setDateDisplayKm('ថ្ងៃទី ១៤, ១៥, ១៦ ខែមេសា ជារៀងរាល់ឆ្នាំ');
              setCoverImage('');
              setLocationVi('Các chùa Khmer và phum sóc trên toàn Nam Bộ');
              setDescriptionVi('Chol Chnam Thmay là lễ hội mừng năm mới theo lịch cổ truyền của đồng bào Khmer. Lễ hội kéo dài 3 ngày với nhiều nghi thức ý nghĩa: ngày thứ nhất đón Songkran rước lịch mới, ngày thứ hai đắp cát cầu phúc, ngày thứ ba tắm Phật cầu bình an và tỏ lòng kính trọng với ông bà tổ tiên.');
              setRitualsVi('Đón đại lịch Moha Songkran\nĐắp núi cát cầu phúc đức\nLễ tắm Phật và tắm chư tăng cầu bình an');
              setRitualsKm('ពិធីទទួលទេវតាឆ្នាំថ្មី\nពិធីពូនភ្នំខ្សាច់\nពិធីស្រង់ព្រះ និងស្រង់ព្រះសង្ឃ');
              setRitualsEn('Welcoming the new angel ritual\nSand dome building for blessings\nBuddha bathing ceremony for peace');
              setFoodsVi('Bánh tét Khmer, Bánh gừng, Trà gừng cúng dường');
              setFoodsKm('នំអន្សម, នំខ្ញី, ទឹកតែថ្វាយព្រះសង្ឃ');
              setFoodsEn('Khmer cylindric sticky rice cake, Ginger cake, Tea offering');
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="sparkles" size={16} color={C.primary} />
            <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>
              ✨ Chuẩn bị dữ liệu Demo (Lễ hội)
            </Text>
          </TouchableOpacity>
        )}
        {/* SECTION 1: TÊN LỄ HỘI */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>📌 Thông tin Tên Lễ Hội</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Tên Lễ Hội (Tiếng Việt) *</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={titleVi}
              onChangeText={setTitleVi}
              placeholder="Ví dụ: Lễ hội Ók Om Bók & Đua Ghe Ngọ"
              placeholderTextColor={C.textTertiary}
            />
          </View>


        </View>

        {/* SECTION 2: THỜI GIAN ĐẾM NGƯỢC (ĐƠN GIẢN NĂM-THÁNG-NGÀY) */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>⏱️ Cài Đặt Đồng Hồ Đếm Ngược (Dễ dàng)</Text>
          
          <View style={styles.rowTwo}>
            <View style={[styles.formGroup, { flex: 1.5 }]}>
              <Text style={[styles.label, { color: C.text }]}>Ngày diễn ra (NĂM-THÁNG-NGÀY)</Text>
              <TextInput
                style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
                value={targetDateString}
                onChangeText={setTargetDateString}
                placeholder="2026-11-23"
                placeholderTextColor={C.textTertiary}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: C.text }]}>Giờ bắt đầu</Text>
              <TextInput
                style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
                value={targetTimeString}
                onChangeText={setTargetTimeString}
                placeholder="08:00"
                placeholderTextColor={C.textTertiary}
              />
            </View>
          </View>
          <Text style={styles.helperText}>💡 Hệ thống tự động tính toán đồng hồ đếm ngược từng giây đến mốc thời gian này.</Text>
        </View>

        {/* SECTION 3: LỊCH ÂM KHMER & LỊCH DƯƠNG HIỂN THỊ */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>📅 Hiển Thị Lịch Âm & Lịch Dương (Đa ngôn ngữ)</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>🇻🇳 Lịch hiển thị (Tiếng Việt) *</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={dateDisplayVi}
              onChangeText={setDateDisplayVi}
              placeholder="Ví dụ: Rằm tháng 10 Âm lịch (15/10 Âm lịch)"
              placeholderTextColor={C.textTertiary}
            />
          </View>


        </View>

        {/* SECTION 4: ẢNH BÌA (TẢI LÊN HOẶC LINK) */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>🖼️ Hình Ảnh Lễ Hội (Tải lên hoặc Dùng Link)</Text>

          {/* Image Preview */}
          {coverImage.trim() ? (
            <View style={styles.imagePreviewWrap}>
              <Image source={{ uri: coverImage.trim() }} style={styles.imagePreview} />
              <Pressable style={styles.removeImgBtn} onPress={() => setCoverImage('')}>
                <IconSymbol name="xmark" size={16} color="#FFF" />
              </Pressable>
            </View>
          ) : null}

          {/* Upload buttons */}
          <View style={styles.photoActionsRow}>
            <TouchableOpacity
              style={[styles.photoActionBtn, { borderColor: `${C.primary}50`, backgroundColor: C.surfaceHigh }]}
              onPress={pickImage}
              disabled={isUploadingImage}
            >
              <IconSymbol name="photo.on.rectangle.angled" size={16} color={C.primary} />
              <Text style={[styles.photoActionText, { color: C.text }]}>
                {isUploadingImage ? 'Đang tải...' : '🖼️ Chọn từ thư viện'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoActionBtn, { borderColor: `${C.primary}50`, backgroundColor: C.surfaceHigh }]}
              onPress={takePhoto}
              disabled={isUploadingImage}
            >
              <IconSymbol name="camera.fill" size={16} color={C.primary} />
              <Text style={[styles.photoActionText, { color: C.text }]}>📷 Chụp ảnh mới</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Hoặc Nhập Liên Kết Ảnh Trực Tiếp (URL)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="https://..."
              placeholderTextColor={C.textTertiary}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* SECTION 5: ĐỊA ĐIỂM & MÔ TẢ */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>📖 Nội Dung & Địa Điểm</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Địa điểm Tổ chức</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={locationVi}
              onChangeText={setLocationVi}
              placeholder="Ví dụ: Sóc Trăng & Trà Vinh"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Mô tả Ngắn (Subtitle)</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={subtitleVi}
              onChangeText={setSubtitleVi}
              placeholder="Ví dụ: Di sản văn hóa phi vật thể cúng trăng"
              placeholderTextColor={C.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>Giới thiệu Chi tiết Nghi lễ</Text>
            <TextInput
              style={[styles.textArea, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={descriptionVi}
              onChangeText={setDescriptionVi}
              multiline
              numberOfLines={4}
              placeholder="Mô tả chi tiết ý nghĩa và các hoạt động của lễ hội..."
              placeholderTextColor={C.textTertiary}
            />
          </View>
        </View>

        {/* SECTION 6: CÁC NGHI THỨC & ẨM THỰC */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9', borderColor: `${C.primary}30` }]}>
          <Text style={[styles.sectionTitle, { color: C.primary }]}>✨ Các Nghi Thức & Ẩm Thực (Đa Ngôn Ngữ)</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>🪔 Các nghi thức chính (Tiếng Việt) - Mỗi nghi thức 1 dòng</Text>
            <TextInput
              style={[styles.textArea, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={ritualsVi}
              onChangeText={setRitualsVi}
              multiline
              numberOfLines={3}
              placeholder="Ví dụ:&#10;Đắp núi cát (Mô-ha-sốt) cầu may mắn&#10;Nghi thức tắm Phật và tắm các vị cao tăng"
              placeholderTextColor={C.textTertiary}
            />
          </View>



          <View style={{ height: 1, backgroundColor: `${C.primary}20`, marginVertical: 8 }} />

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: C.text }]}>🍲 Ẩm thực lễ hội (Tiếng Việt) - Ngăn cách bằng dấu phẩy</Text>
            <TextInput
              style={[styles.input, { color: C.text, backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}
              value={foodsVi}
              onChangeText={setFoodsVi}
              placeholder="Ví dụ: Bánh gừng Khmer, Bún nước lèo, Bánh num-bo-chok"
              placeholderTextColor={C.textTertiary}
            />
          </View>


        </View>

        <Pressable
          style={({ pressed }) => [styles.submitBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.8 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#131313" />
          ) : (
            <Text style={styles.submitBtnText}>{isEditing ? 'Lưu Thay Đổi' : 'Tạo Lễ Hội Mới'}</Text>
          )}
        </Pressable>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
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
  headerTitle: { ...Typography.headlineMedium, fontFamily: FontFamily.playfairBold, letterSpacing: -0.5 },
  scrollContent: { padding: Spacing.containerMargin, paddingBottom: 100, gap: 16 },
  cardSection: { padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', fontFamily: FontFamily.playfairBold },
  formGroup: { gap: 6 },
  rowTwo: { flexDirection: 'row', gap: 10 },
  label: { fontSize: 13, fontWeight: '700' },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1, fontSize: 13 },
  textArea: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1, fontSize: 13, height: 100, textAlignVertical: 'top' },
  helperText: { fontSize: 11, color: '#A09580', marginTop: 2 },
  imagePreviewWrap: { height: 160, width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden', marginVertical: 6 },
  imagePreview: { width: '100%', height: '100%' },
  removeImgBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(186,26,26,0.8)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  photoActionsRow: { flexDirection: 'row', gap: 10, marginVertical: 4 },
  photoActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1 },
  photoActionText: { fontSize: 12, fontWeight: '700' },
  submitBtn: { paddingVertical: 14, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#131313', fontSize: 15, fontWeight: '800' },
});
