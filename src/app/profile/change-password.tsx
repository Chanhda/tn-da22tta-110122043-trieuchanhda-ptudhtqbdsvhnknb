import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
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
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { addUserNotification } from '@/lib/user-repository';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { firebaseUser } = useAuthSession();
  const { language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';
  const styles = getStyles(C, isDark);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ visible: false, type: 'success', title: '', message: '' });

  const t = {
    title: language === 'vi' ? 'Đổi mật khẩu' : language === 'km' ? 'ផ្លាស់ប្តូរពាក្យសម្ងាត់' : 'Change Password',
    subtitle: language === 'vi' ? 'Cập nhật mật khẩu để bảo mật tài khoản' : language === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ដើម្បីការពារគណនី' : 'Update your password to secure your account',
    currentPwd: language === 'vi' ? 'Mật khẩu hiện tại' : language === 'km' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' : 'Current Password',
    newPwd: language === 'vi' ? 'Mật khẩu mới' : language === 'km' ? 'ពាក្យសម្ងាត់ថ្មី' : 'New Password',
    confirmPwd: language === 'vi' ? 'Xác nhận mật khẩu mới' : language === 'km' ? 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី' : 'Confirm New Password',
    save: language === 'vi' ? 'Cập nhật mật khẩu' : language === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Update Password',
    hint: language === 'vi' ? 'Mật khẩu tối thiểu 6 ký tự' : language === 'km' ? 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ' : 'Minimum 6 characters',
  };

  const showAlert = (type: 'success' | 'error' | 'warning', title: string, message: string, onConfirm?: () => void) => {
    setAlertConfig({ visible: true, type, title, message, onConfirm });
  };

  const handleChangePassword = async () => {
    if (!firebaseUser) {
      showAlert('error',
        language === 'vi' ? 'Chưa đăng nhập' : 'Not logged in',
        language === 'vi' ? 'Bạn cần đăng nhập để đổi mật khẩu.' : language === 'km' ? 'អ្នកត្រូវចូលគណនីដើម្បីផ្លាស់ប្តូរពាក្យសម្ងាត់។' : 'You need to be logged in to change your password.'
      );
      return;
    }

    if (!currentPassword.trim()) {
      showAlert('warning',
        language === 'vi' ? 'Thiếu thông tin' : language === 'km' ? 'ព័ត៌មានខ្វះខាត' : 'Missing Info',
        language === 'vi' ? 'Vui lòng nhập mật khẩu hiện tại.' : language === 'km' ? 'សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន។' : 'Please enter your current password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      showAlert('warning',
        language === 'vi' ? 'Mật khẩu quá ngắn' : language === 'km' ? 'ពាក្យសម្ងាត់ខ្លីពេក' : 'Password Too Short',
        language === 'vi' ? 'Mật khẩu mới phải có ít nhất 6 ký tự.' : language === 'km' ? 'ពាក្យសម្ងាត់ថ្មីត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ។' : 'New password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('warning',
        language === 'vi' ? 'Không khớp' : language === 'km' ? 'មិនត្រូវគ្នា' : 'Mismatch',
        language === 'vi' ? 'Mật khẩu mới và xác nhận không khớp nhau.' : language === 'km' ? 'ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់មិនត្រូវគ្នា។' : 'New password and confirmation do not match.'
      );
      return;
    }

    if (newPassword === currentPassword) {
      showAlert('warning',
        language === 'vi' ? 'Trùng mật khẩu cũ' : language === 'km' ? 'ដូចពាក្យសម្ងាត់ចាស់' : 'Same as Old Password',
        language === 'vi' ? 'Mật khẩu mới không được trùng với mật khẩu hiện tại.' : language === 'km' ? 'ពាក្យសម្ងាត់ថ្មីមិនអាចដូចគ្នាជាមួយពាក្យសម្ងាត់ដែលមានបច្ចុប្បន្នបានទេ។' : 'New password cannot be the same as the current password.'
      );
      return;
    }

    try {
      setSaving(true);
      const email = firebaseUser.email;
      if (!email) throw new Error('No email');

      // Re-authenticate first
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);

      // Update password
      await updatePassword(firebaseUser, newPassword);

      // Send notification
      await addUserNotification(firebaseUser.uid, {
        titleVi: 'Mật khẩu đã được thay đổi 🔐',
        titleKm: 'ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរ 🔐',
        titleEn: 'Password Changed 🔐',
        descriptionVi: 'Mật khẩu tài khoản của bạn đã được cập nhật thành công.',
        descriptionKm: 'ពាក្យសម្ងាត់គណនីរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។',
        descriptionEn: 'Your account password has been updated successfully.',
        timeVi: 'Vừa xong',
        timeKm: 'មុននេះបន្តិច',
        timeEn: 'Just now',
        icon: 'lock.fill',
        color: '#4CAF50',
        isNew: true,
      });

      showAlert('success',
        language === 'vi' ? 'Thành công!' : language === 'km' ? 'ជោគជ័យ!' : 'Success!',
        language === 'vi' ? 'Mật khẩu của bạn đã được cập nhật thành công.' : language === 'km' ? 'ពាក្យសម្ងាត់របស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។' : 'Your password has been updated successfully.',
        () => router.back()
      );
    } catch (error: any) {
      let msg = language === 'vi' ? 'Đã xảy ra lỗi. Vui lòng thử lại.' : language === 'km' ? 'មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។' : 'An error occurred. Please try again.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = language === 'vi' ? 'Mật khẩu hiện tại không đúng.' : language === 'km' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ។' : 'Current password is incorrect.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = language === 'vi' ? 'Quá nhiều lần thử. Vui lòng thử lại sau.' : language === 'km' ? 'ព្យាយាមច្រើនពេក។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។' : 'Too many attempts. Please try again later.';
      }
      showAlert('error',
        language === 'vi' ? 'Lỗi' : language === 'km' ? 'កំហុស' : 'Error',
        msg
      );
    } finally {
      setSaving(false);
    }
  };

  const strength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3;
  const strengthColor = strength === 1 ? '#F44336' : strength === 2 ? '#FFA000' : '#4CAF50';
  const strengthLabel = strength === 0 ? '' : strength === 1
    ? (language === 'vi' ? 'Yếu' : language === 'km' ? 'ខ្សោយ' : 'Weak')
    : strength === 2
      ? (language === 'vi' ? 'Trung bình' : language === 'km' ? 'មធ្យម' : 'Medium')
      : (language === 'vi' ? 'Mạnh' : language === 'km' ? 'ខ្លាំង' : 'Strong');

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {t.title}
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[styles.screenSubtitle, { color: C.textSecondary }]}>
            {t.subtitle}
          </Text>

          {/* Current Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: C.textSecondary }]}>{t.currentPwd}</Text>
            <View style={[styles.inputRow, { backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}>
              <IconSymbol name="lock.fill" size={18} color={C.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: C.text, fontFamily: FontFamily.regular }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                placeholder={language === 'vi' ? 'Nhập mật khẩu hiện tại...' : language === 'km' ? 'បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន...' : 'Enter current password...'}
                placeholderTextColor={C.textTertiary}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowCurrent(p => !p)} style={styles.eyeBtn}>
                <IconSymbol name={showCurrent ? 'eye.slash.fill' : 'eye.fill'} size={18} color={C.textTertiary} />
              </Pressable>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: C.textSecondary }]}>{t.newPwd}</Text>
            <View style={[styles.inputRow, { backgroundColor: C.surfaceHigh, borderColor: newPassword.length > 0 ? `${strengthColor}60` : `${C.primary}30` }]}>
              <IconSymbol name="key.fill" size={18} color={C.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: C.text, fontFamily: FontFamily.regular }]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                placeholder={language === 'vi' ? 'Nhập mật khẩu mới...' : language === 'km' ? 'បញ្ចូលពាក្យសម្ងាត់ថ្មី...' : 'Enter new password...'}
                placeholderTextColor={C.textTertiary}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowNew(p => !p)} style={styles.eyeBtn}>
                <IconSymbol name={showNew ? 'eye.slash.fill' : 'eye.fill'} size={18} color={C.textTertiary} />
              </Pressable>
            </View>
            {/* Strength bar */}
            {newPassword.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColor : `${C.textTertiary}30` }]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
              </View>
            )}
            <Text style={[styles.hint, { color: C.textTertiary }]}>{t.hint}</Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: C.textSecondary }]}>{t.confirmPwd}</Text>
            <View style={[
              styles.inputRow,
              {
                backgroundColor: C.surfaceHigh,
                borderColor: confirmPassword.length > 0
                  ? (confirmPassword === newPassword ? '#4CAF5060' : '#F4433660')
                  : `${C.primary}30`
              }
            ]}>
              <IconSymbol name="checkmark.shield.fill" size={18} color={C.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: C.text, fontFamily: FontFamily.regular }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                placeholder={language === 'vi' ? 'Nhập lại mật khẩu mới...' : language === 'km' ? 'បញ្ចូលពាក្យសម្ងាត់ថ្មីម្តងទៀត...' : 'Re-enter new password...'}
                placeholderTextColor={C.textTertiary}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowConfirm(p => !p)} style={styles.eyeBtn}>
                <IconSymbol name={showConfirm ? 'eye.slash.fill' : 'eye.fill'} size={18} color={C.textTertiary} />
              </Pressable>
            </View>
            {confirmPassword.length > 0 && (
              <View style={styles.matchRow}>
                <IconSymbol
                  name={confirmPassword === newPassword ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                  size={14}
                  color={confirmPassword === newPassword ? '#4CAF50' : '#F44336'}
                />
                <Text style={[styles.matchText, { color: confirmPassword === newPassword ? '#4CAF50' : '#F44336' }]}>
                  {confirmPassword === newPassword
                    ? (language === 'vi' ? 'Mật khẩu khớp nhau' : language === 'km' ? 'ពាក្យសម្ងាត់ត្រូវគ្នា' : 'Passwords match')
                    : (language === 'vi' ? 'Mật khẩu không khớp' : language === 'km' ? 'ពាក្យសម្ងាត់មិនត្រូវគ្នា' : 'Passwords do not match')
                  }
                </Text>
              </View>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleChangePassword}
            disabled={saving}
            style={[styles.saveBtn, { backgroundColor: C.primary }]}
          >
            {saving ? (
              <ActivityIndicator color="#131313" size="small" />
            ) : (
              <View style={styles.saveBtnContent}>
                <IconSymbol name="checkmark.circle.fill" size={20} color="#131313" />
                <Text style={styles.saveBtnText}>{t.save}</Text>
              </View>
            )}
          </TouchableOpacity>


        </Animated.View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onConfirm={() => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          alertConfig.onConfirm?.();
        }}
      />
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, isDark: boolean) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
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
  screenSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.containerMargin, paddingTop: Spacing.lg, paddingBottom: 60, gap: 4 },
  fieldGroup: { marginBottom: Spacing.lg },
  label: { fontSize: 13, fontFamily: FontFamily.semiBold, marginBottom: 8, marginLeft: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.sm,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  eyeBtn: { padding: 6 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  strengthBars: { flexDirection: 'row', gap: 6, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontFamily: FontFamily.semiBold, minWidth: 60, textAlign: 'right' },
  hint: { fontSize: 12, marginTop: 6, marginLeft: 2 },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  matchText: { fontSize: 12, fontFamily: FontFamily.medium },
  saveBtn: {
    height: 54,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveBtnText: { color: '#131313', fontSize: 16, fontFamily: FontFamily.bold },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20 },
});
