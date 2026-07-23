import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Colors, BorderRadius, FontFamily, Spacing, Typography } from '@/constants/theme';
import { useColorSchemePreference } from '@/contexts/color-scheme-context';
import { useLanguage } from '@/contexts/language-context';
import { useRequireSuperAdmin } from '@/lib/auth-session';
import { fetchUsers, updateUserRole, addUserNotification, type UserDocument, type UserRole } from '@/lib/user-repository';

export default function UserManagementScreen() {
  const { loading: authLoading, profile: currentAdmin } = useRequireSuperAdmin();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolvedColorScheme } = useColorSchemePreference();
  const { t, language } = useLanguage();
  const C = Colors[resolvedColorScheme];
  const isDark = resolvedColorScheme === 'dark';

  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadUsers();
    }
  }, [authLoading]);

  const handleRoleChange = (user: UserDocument, newRole: UserRole) => {
    if (user.id === currentAdmin?.id) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: language === 'vi' ? 'Không thể tự gỡ quyền' : language === 'km' ? 'មិនអាចដកសិទ្ធិខ្លួនឯងបានទេ' : 'Cannot Revoke Own Role',
        message: language === 'vi' ? 'Bạn không thể thay đổi vai trò quản trị viên của chính mình.' : language === 'km' ? 'អ្នកមិនអាចផ្លាស់ប្តូរតួនាទីអ្នកគ្រប់គ្រងរបស់ខ្លួនឯងបានទេ។' : 'You cannot change your own admin role.',
      });
      return;
    }

    const actionText = newRole === 'moderator'
      ? (language === 'vi' ? 'Bổ nhiệm Phó Quản trị viên' : language === 'km' ? 'តែងតាំង អនុអ្នកគ្រប់គ្រង' : 'Appoint Vice Admin')
      : (language === 'vi' ? 'Gỡ quyền về Thành viên' : language === 'km' ? 'ដកសិទ្ធិមកជា សមាជិក' : 'Revoke to Member');

    const confirmMsg = language === 'vi'
      ? `Bạn có chắc chắn muốn ${actionText.toLowerCase()} cho tài khoản "${user.displayName || user.email}"?`
      : language === 'km'
      ? `តើអ្នកប្រាកដជាចង់${actionText}សម្រាប់គណនី "${user.displayName || user.email}" ដែរឬទេ?`
      : `Are you sure you want to ${actionText.toLowerCase()} for user "${user.displayName || user.email}"?`;

    setAlertConfig({
      visible: true,
      type: 'warning',
      title: actionText,
      message: confirmMsg,
      confirmText: language === 'vi' ? 'Xác nhận' : language === 'km' ? 'យល់ព្រម' : 'Confirm',
      cancelText: language === 'vi' ? 'Hủy' : language === 'km' ? 'បោះបង់' : 'Cancel',
      onConfirm: async () => {
        try {
          const success = await updateUserRole(user.id, newRole);
          if (success) {
            // Add notification for the user
            if (newRole === 'moderator') {
              await addUserNotification(user.id, {
                titleVi: 'Bổ nhiệm Phó quản trị viên ✦',
                titleKm: 'តែងតាំងជាអនុអ្នកគ្រប់គ្រង ✦',
                titleEn: 'Appointed as Vice Admin ✦',
                descriptionVi: 'Tài khoản của bạn đã được quản trị viên thăng cấp lên Phó quản trị viên. Bạn hiện đã có quyền truy cập trang quản trị.',
                descriptionKm: 'គណនីរបស់អ្នកត្រូវបានដំឡើងទៅជាអនុអ្នកគ្រប់គ្រង។ អ្នកឥឡូវនេះមានសិទ្ធិចូលប្រើផ្ទាំងគ្រប់គ្រង។',
                descriptionEn: 'Your account has been promoted to Vice Admin. You now have access to the Admin panel.',
                timeVi: 'Vừa xong',
                timeKm: 'មុននេះបន្តិច',
                timeEn: 'Just now',
                icon: 'crown.fill',
                color: '#7FDEED',
                isNew: true,
              });
            } else {
              await addUserNotification(user.id, {
                titleVi: 'Thay đổi quyền tài khoản',
                titleKm: 'ការផ្លាស់ប្តូរសិទ្ធិគណនី',
                titleEn: 'Account Role Updated',
                descriptionVi: 'Vai trò tài khoản của bạn đã được chuyển về Thành viên thông thường.',
                descriptionKm: 'តួនាទីគណនីរបស់អ្នកត្រូវបានផ្លាស់ប្តូរមកជាសមាជិកធម្មតាវិញ។',
                descriptionEn: 'Your account role has been changed back to regular Member.',
                timeVi: 'Vừa xong',
                timeKm: 'មុននេះបន្តិច',
                timeEn: 'Just now',
                icon: 'person.fill',
                color: '#FFB4AB',
                isNew: true,
              });
            }

            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
            setTimeout(() => {
              setAlertConfig({
                visible: true,
                type: 'success',
                title: language === 'vi' ? 'Thành công' : language === 'km' ? 'ជោគជ័យ' : 'Success',
                message: language === 'vi' ? `Đã cập nhật vai trò cho ${user.displayName || user.email}.` : language === 'km' ? `បានធ្វើបច្ចុប្បន្នភាពតួនាទីសម្រាប់ ${user.displayName || user.email}.` : `Updated role for ${user.displayName || user.email}.`,
              });
            }, 200);
          } else {
            throw new Error('Update failed');
          }
        } catch {
          setTimeout(() => {
            setAlertConfig({
              visible: true,
              type: 'error',
              title: language === 'vi' ? 'Lỗi' : language === 'km' ? 'កំហុស' : 'Error',
              message: language === 'vi' ? 'Không thể cập nhật vai trò. Vui lòng thử lại.' : language === 'km' ? 'មិនអាចធ្វើបច្ចុប្បន្នភាពតួនាទីបានទេ។ សូមព្យាយាមម្តងទៀត។' : 'Could not update role. Please try again.',
            });
          }, 200);
        }
      },
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>
          {language === 'vi' ? 'Đang tải danh sách tài khoản...' : language === 'km' ? 'កំពុងទាញយកបញ្ជីគណនី...' : 'Loading users list...'}
        </Text>
      </View>
    );
  }

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
            {language === 'vi' ? 'Quản lý Tài khoản' : language === 'km' ? 'គ្រប់គ្រងគណនី' : 'User Management'}
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search & Stats Banner */}
        <View style={styles.bannerContainer}>
          <Text style={[styles.bannerTitle, { color: C.text }]}>
            {language === 'vi' ? `Tài khoản Đăng ký (${users.length})` : language === 'km' ? `គណនីបានចុះឈ្មោះ (${users.length})` : `Registered Users (${users.length})`}
          </Text>
          <Text style={[styles.bannerSub, { color: C.textSecondary }]}>
            {language === 'vi' ? 'Quản lý và bổ nhiệm Phó Quản trị viên hỗ trợ duyệt bài viết cộng đồng.' : language === 'km' ? 'គ្រប់គ្រង និងតែងតាំង អនុអ្នកគ្រប់គ្រង ដើម្បីជួយពិនិត្យអត្ថបទសហគមន៍។' : 'Manage and appoint Vice Admins to assist community moderation.'}
          </Text>

          <View style={[styles.searchBar, { backgroundColor: C.surfaceHigh, borderColor: `${C.primary}30` }]}>
            <IconSymbol name="magnifyingglass" size={16} color={C.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: C.text }]}
              placeholder={language === 'vi' ? 'Tìm theo tên hoặc email...' : language === 'km' ? 'ស្វែងរកតាមឈ្មោះ ឬ អ៊ីមែល...' : 'Search by name or email...'}
              placeholderTextColor={C.textTertiary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <IconSymbol name="xmark.circle.fill" size={16} color={C.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Users List */}
        <View style={styles.listContainer}>
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyWrap}>
              <IconSymbol name="person.slash" size={40} color={C.textTertiary} />
              <Text style={[styles.emptyText, { color: C.textTertiary }]}>
                {language === 'vi' ? 'Không tìm thấy tài khoản phù hợp' : language === 'km' ? 'រកមិនឃើញគណនីដែលស័ក្តិសមទេ' : 'No matching users found'}
              </Text>
            </View>
          ) : (
            filteredUsers.map((user, idx) => {
              const isAdmin = user.role === 'admin';
              const isModerator = user.role === 'moderator';

              return (
                <Animated.View key={user.id} entering={FadeInDown.delay(idx * 40).duration(300)}>
                  <View
                    style={[
                      styles.userCard,
                      {
                        backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : '#FFFDF9',
                        borderColor: isAdmin
                          ? `${C.primary}50`
                          : isModerator
                          ? 'rgba(127, 222, 221, 0.5)'
                          : `${C.border}40`,
                      },
                    ]}
                  >
                    <View style={styles.userCardLeft}>
                      <View style={[styles.avatar, { backgroundColor: `${C.primary}20` }]}>
                        {user.photoURL ? (
                          <Image source={{ uri: user.photoURL }} style={styles.avatarImg} />
                        ) : (
                          <Text style={[styles.avatarText, { color: C.primary }]}>
                            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View style={styles.userInfo}>
                        <View style={styles.userNameRow}>
                          <Text style={[styles.userName, { color: C.text }]} numberOfLines={1}>
                            {user.displayName || (language === 'vi' ? 'Người dùng' : language === 'km' ? 'អ្នកប្រើប្រាស់' : 'User')}
                          </Text>
                          {isAdmin ? (
                            <View style={[styles.roleBadge, { backgroundColor: `${C.primary}20`, borderColor: C.primary }]}>
                              <Text style={[styles.roleBadgeText, { color: C.primary }]}>
                                {language === 'vi' ? 'Quản trị viên' : language === 'km' ? 'អ្នកគ្រប់គ្រង' : 'Admin'}
                              </Text>
                            </View>
                          ) : isModerator ? (
                            <View style={[styles.roleBadge, { backgroundColor: 'rgba(127,222,221,0.2)', borderColor: '#7FDEDD' }]}>
                              <Text style={[styles.roleBadgeText, { color: isDark ? '#7FDEDD' : '#007073' }]}>
                                {language === 'vi' ? 'Phó QTV' : language === 'km' ? 'អនុអ្នកគ្រប់គ្រង' : 'Vice Admin'}
                              </Text>
                            </View>
                          ) : (
                            <View style={[styles.roleBadge, { backgroundColor: `${C.border}20`, borderColor: `${C.border}60` }]}>
                              <Text style={[styles.roleBadgeText, { color: C.textSecondary }]}>
                                {language === 'vi' ? 'Thành viên' : language === 'km' ? 'សមាជិក' : 'Member'}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.userEmail, { color: C.textSecondary }]} numberOfLines={1}>
                          {user.email}
                        </Text>
                      </View>
                    </View>

                    {/* Actions for Super Admin */}
                    {!isAdmin && (
                      <View style={styles.userCardRight}>
                        {isModerator ? (
                          <Pressable
                            style={({ pressed }) => [styles.actionBtn, styles.demoteBtn, pressed && { opacity: 0.7 }]}
                            onPress={() => handleRoleChange(user, 'user')}
                          >
                            <IconSymbol name="arrow.down.circle" size={14} color="#FFB4AB" />
                            <Text style={styles.demoteBtnText}>
                              {language === 'vi' ? 'Gỡ quyền' : language === 'km' ? 'ដកសិទ្ធិ' : 'Revoke'}
                            </Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            style={({ pressed }) => [styles.actionBtn, styles.promoteBtn, pressed && { opacity: 0.8 }]}
                            onPress={() => handleRoleChange(user, 'moderator')}
                          >
                            <IconSymbol name="shield.fill" size={14} color="#131313" />
                            <Text style={styles.promoteBtnText}>
                              {language === 'vi' ? 'Bổ nhiệm Phó QTV' : language === 'km' ? 'តែងតាំង អនុ QTV' : 'Appoint Vice Admin'}
                            </Text>
                          </Pressable>
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
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  loadingText: { ...Typography.bodyMedium },
  stickyHeader: {
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    zIndex: 100,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerMargin,
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
    letterSpacing: -0.5,
  },
  scrollContent: { paddingBottom: 100 },
  bannerContainer: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md },
  bannerTitle: { fontSize: 20, fontWeight: '700', fontFamily: FontFamily.playfairBold },
  bannerSub: { fontSize: 12, marginTop: 4, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13 },
  listContainer: { paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.md, gap: 10 },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 13 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  userCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  userName: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  roleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 0.8 },
  roleBadgeText: { fontSize: 9, fontWeight: '800' },
  userEmail: { fontSize: 11, marginTop: 2 },
  userCardRight: { marginLeft: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  promoteBtn: { backgroundColor: '#F2CA50' },
  promoteBtnText: { color: '#131313', fontSize: 11, fontWeight: '800' },
  demoteBtn: { backgroundColor: 'rgba(255, 180, 171, 0.2)', borderWidth: 1, borderColor: '#FFB4AB' },
  demoteBtnText: { color: '#FFB4AB', fontSize: 11, fontWeight: '700' },
});
