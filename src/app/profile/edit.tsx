import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthSession } from '@/lib/auth-session';
import { updateUserProfile } from '@/lib/user-repository';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { isFirebaseConfigured, isDemoDataEnabled } from '@/lib/firebase';

// Pre-defined cultural & modern high-quality avatar presets
const PRESET_AVATARS = [
  { id: 'apsara', url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=150&q=80', label: 'Apsara' },
  { id: 'monk', url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=150&q=80', label: 'Heritage' },
  { id: 'nature', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=150&q=80', label: 'Nature' },
  { id: 'male1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', label: 'Male' },
  { id: 'female1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', label: 'Female' },
  { id: 'sunset', url: 'https://images.unsplash.com/photo-1543730728-7da9f7b685cd?auto=format&fit=crop&w=150&q=80', label: 'Scenic' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { firebaseUser, profile, updateProfileLocally } = useAuthSession();
  const { language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success' as 'success' | 'warning' | 'danger',
    title: '',
    message: '',
    confirmText: 'OK',
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAlertConfig({
          visible: true,
          type: 'warning',
          title: language === 'vi' ? 'Quyền truy cập' : language === 'km' ? 'សិទ្ធិចូលប្រើ' : 'Permission Required',
          message: language === 'vi' ? 'Ứng dụng cần quyền truy cập thư viện ảnh để tải ảnh lên.' : language === 'km' ? 'កម្មវិធីត្រូវការសិទ្ធិចូលប្រើបណ្ណាល័យរូបភាពដើម្បីផ្ទុកឡើង។' : 'The app needs photo library access to upload images.',
          confirmText: 'OK',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setUploadingImage(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageToCloudinary(selectedUri, 'avatars');
          }
          setPhotoURL(uploadedUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
          setAlertConfig({
            visible: true,
            type: 'danger',
            title: language === 'vi' ? 'Lỗi tải ảnh' : language === 'km' ? 'កំហុសផ្ទុកឡើង' : 'Upload Error',
            message: language === 'vi' ? 'Không thể tải ảnh đại diện lên máy chủ.' : language === 'km' ? 'មិនអាចផ្ទុកឡើងរូបថតប្រវត្តិរូបបានទេ។' : 'Failed to upload profile picture.',
            confirmText: 'OK',
          });
        } finally {
          setUploadingImage(false);
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
        setAlertConfig({
          visible: true,
          type: 'warning',
          title: language === 'vi' ? 'Quyền truy cập' : language === 'km' ? 'សិទ្ធិចូលប្រើ' : 'Permission Required',
          message: language === 'vi' ? 'Ứng dụng cần quyền truy cập máy ảnh để chụp ảnh.' : language === 'km' ? 'កម្មវិធីត្រូវការសិទ្ធិចូលប្រើកាមេរ៉ាដើម្បីថតរូប។' : 'The app needs camera access to take a photo.',
          confirmText: 'OK',
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setUploadingImage(true);
        try {
          let uploadedUrl = selectedUri;
          if (isFirebaseConfigured() && !isDemoDataEnabled()) {
            uploadedUrl = await uploadImageToCloudinary(selectedUri, 'avatars');
          }
          setPhotoURL(uploadedUrl);
        } catch (err) {
          console.error('Error uploading camera photo:', err);
          setAlertConfig({
            visible: true,
            type: 'danger',
            title: language === 'vi' ? 'Lỗi tải ảnh' : language === 'km' ? 'កំហុសផ្ទុកឡើង' : 'Upload Error',
            message: language === 'vi' ? 'Không thể tải ảnh chụp lên máy chủ.' : language === 'km' ? 'មិនអាចផ្ទុកឡើងរូបថតថតបានទេ។' : 'Failed to upload captured photo.',
            confirmText: 'OK',
          });
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    }
  };

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoURL(profile.photoURL || PRESET_AVATARS[0].url);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!firebaseUser) return;
    if (!displayName.trim()) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: language === 'vi' ? 'Lỗi nhập liệu' : language === 'km' ? 'កំហុសបញ្ចូល' : 'Validation Error',
        message: language === 'vi' ? 'Tên hiển thị không được để trống.' : language === 'km' ? 'ឈ្មោះបង្ហាញមិនអាចទុកទទេបានទេ។' : 'Display name cannot be empty.',
        confirmText: 'OK',
      });
      return;
    }

    setSaving(true);
    try {
      const success = await updateUserProfile(firebaseUser.uid, displayName.trim(), photoURL);
      if (success) {
        updateProfileLocally(displayName.trim(), photoURL);
        
        setAlertConfig({
          visible: true,
          type: 'success',
          title: language === 'vi' ? 'Thành công' : language === 'km' ? 'ជោគជ័យ' : 'Success',
          message: language === 'vi' ? 'Đã cập nhật thông tin hồ sơ tài khoản!' : language === 'km' ? 'បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានប្រវត្តិរូបគណនី!' : 'Account profile successfully updated!',
          confirmText: 'OK',
        });
      } else {
        throw new Error('Database update failed');
      }
    } catch (error) {
      console.error('Error saving profile changes:', error);
      setAlertConfig({
        visible: true,
        type: 'danger',
        title: language === 'vi' ? 'Thất bại' : language === 'km' ? 'បរាជ័យ' : 'Error',
        message: language === 'vi' ? 'Đã xảy ra lỗi khi lưu thông tin.' : language === 'km' ? 'មានកំហុសបានកើតឡើងពេលរក្សាទុក។' : 'An error occurred while saving your profile.',
        confirmText: 'OK',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {language === 'vi' ? 'Chỉnh sửa hồ sơ' : language === 'km' ? 'កែសម្រួលប្រវត្តិរូប' : 'Edit Profile'}
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Profile Image */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.avatarContainer}>
          <Pressable disabled={uploadingImage} onPress={pickImage} style={styles.largeAvatarWrap}>
            <Image source={{ uri: photoURL || PRESET_AVATARS[0].url }} style={styles.largeAvatar} />
            {uploadingImage ? (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 55, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator color={C.primary} size="small" />
              </View>
            ) : (
              <View style={styles.editBadge}>
                <IconSymbol name="camera.fill" size={12} color="#131313" />
              </View>
            )}
          </Pressable>

          {/* Upload & Take Photo buttons */}
          <View style={styles.uploadButtonsRow}>
            <Pressable disabled={uploadingImage} onPress={pickImage} style={styles.uploadSubBtn}>
              <IconSymbol name="photo.on.rectangle" size={13} color={C.primary} />
              <Text style={styles.uploadSubBtnText}>
                {language === 'vi' ? 'Chọn ảnh từ thư viện' : language === 'km' ? 'ជ្រើសរើសពីបណ្ណាល័យ' : 'Choose from library'}
              </Text>
            </Pressable>
            <View style={styles.uploadBtnSeparator} />
            <Pressable disabled={uploadingImage} onPress={takePhoto} style={styles.uploadSubBtn}>
              <IconSymbol name="camera" size={13} color={C.primary} />
              <Text style={styles.uploadSubBtnText}>
                {language === 'vi' ? 'Chụp ảnh mới' : language === 'km' ? 'ថតរូបថ្មី' : 'Take new photo'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Preset Selector Grid */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.section}>
          <Text style={styles.sectionLabel}>
            {language === 'vi' ? 'Chọn ảnh đại diện từ mẫu sẵn có:' : language === 'km' ? 'ជ្រើសរើសរូបតំណាងពីគំរូ៖' : 'Choose avatar from presets:'}
          </Text>
          <View style={styles.avatarGrid}>
            {PRESET_AVATARS.map((avatar) => (
              <Pressable
                key={avatar.id}
                onPress={() => setPhotoURL(avatar.url)}
                style={[
                  styles.avatarGridItem,
                  photoURL === avatar.url && styles.avatarGridItemActive
                ]}
              >
                <Image source={{ uri: avatar.url }} style={styles.gridImg} />
                {photoURL === avatar.url && (
                  <View style={styles.checkOverlay}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={C.primary} />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Inputs */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionLabel}>
            {language === 'vi' ? 'Tên hiển thị:' : language === 'km' ? 'ឈ្មោះបង្ហាញ៖' : 'Display Name:'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={language === 'vi' ? 'Nhập tên hiển thị mới...' : language === 'km' ? 'បញ្ចូលឈ្មោះបង្ហាញថ្មី...' : 'Enter new display name...'}
            placeholderTextColor={`${C.textTertiary}80`}
          />
        </Animated.View>


        {/* Save button */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Pressable
            disabled={saving}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && { opacity: 0.8 },
              saving && { opacity: 0.6 }
            ]}
          >
            {saving ? (
              <ActivityIndicator color="#131313" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>
                {language === 'vi' ? 'Lưu thay đổi' : language === 'km' ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'Save Changes'}
              </Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Change Password button */}
        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={{ marginTop: 12, marginBottom: 8 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push('/profile/change-password' as any)}
            style={{
              borderRadius: 16,
              backgroundColor: C.primary,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 56,
              paddingHorizontal: 18,
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <IconSymbol name="lock.rotation" size={20} color="#1a1a1a" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 15,
                  fontFamily: FontFamily.bold,
                  color: '#1a1a1a',
                }}>
                  {language === 'vi' ? 'Đổi mật khẩu' : language === 'km' ? 'ផ្លាស់ប្តូរពាក្យសម្ងាត់' : 'Change Password'}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: 'rgba(0,0,0,0.5)',
                  fontFamily: FontFamily.regular,
                  marginTop: 1,
                }}>
                  {language === 'vi' ? 'Cập nhật mật khẩu bảo mật' : language === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់' : 'Update your security password'}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color="rgba(0,0,0,0.35)" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        onConfirm={() => {
          setAlertConfig((prev) => ({ ...prev, visible: false }));
          if (alertConfig.type === 'success') {
            router.back();
          }
        }}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerMargin,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}50`,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.playfairBold,
    color: C.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.lg,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  uploadSubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: `${C.primary}35`,
    backgroundColor: `${C.primary}08`,
  },
  uploadSubBtnText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '700',
  },
  uploadBtnSeparator: {
    width: 1,
    height: 16,
    backgroundColor: `${C.border}40`,
  },
  largeAvatarWrap: {
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  largeAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: C.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: C.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.background,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '700',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: Spacing.xs,
  },
  avatarGridItem: {
    width: 54,
    height: 54,
    borderRadius: 27,
    position: 'relative',
    borderWidth: 2.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarGridItemActive: {
    borderColor: C.primary,
  },
  gridImg: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: `${C.border}50`,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    color: C.text,
    backgroundColor: C.surface,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: C.primary,
    height: 50,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: '800',
  },
  changePwdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  changePwdIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePwdText: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    flex: 1,
  },
});
