import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRequireAdmin } from '@/lib/auth-session';

export default function AdminLayout() {
  const { loading } = useRequireAdmin();

  if (loading) {
    return (
      <ThemedView style={styles.loadingScreen} lightColor="#FAF7F2" darkColor="#101815">
        <ActivityIndicator />
        <ThemedText>Đang kiểm tra quyền quản trị...</ThemedText>
      </ThemedView>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
});