import { Colors, FontFamily } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const { t, language } = useLanguage();

  return (
    <Stack
      key={language}
      screenOptions={{
        headerStyle: {
          backgroundColor: C.background,
        },
        headerTintColor: C.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontFamily: FontFamily.playfair,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="my-articles"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: t.profile.menu.settings,
          headerBackTitle: t.common.back,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: t.profile.menu.notifications,
          headerBackTitle: t.common.back,
        }}
      />
      <Stack.Screen
        name="favorites"
        options={{
          title: t.profile.menu.favorites,
          headerBackTitle: t.common.back,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: t.profile.menu.history,
          headerBackTitle: t.common.back,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: t.profile.menu.help,
          headerBackTitle: t.common.back,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: t.profile.menu.about,
          headerBackTitle: t.common.back,
        }}
      />
    </Stack>
  );
}
