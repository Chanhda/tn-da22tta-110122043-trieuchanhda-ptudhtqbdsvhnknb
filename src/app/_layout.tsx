import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import {
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { Colors } from '@/constants/theme';
import { ColorSchemeProvider } from '@/contexts/color-scheme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/lib/auth-session';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// ── Disable system font scaling globally ────────────────────
// This ensures the UI looks identical on ALL devices regardless
// of the user's accessibility "Large Text" settings.
Object.assign(Text, {
  defaultProps: { ...(Text as any).defaultProps, allowFontScaling: false },
});
Object.assign(TextInput, {
  defaultProps: { ...(TextInput as any).defaultProps, allowFontScaling: false },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    CormorantGaramond_400Regular_Italic,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Load MaterialIcons font để icon hiển thị đúng trên mọi Android
    // Font name phải khớp với tên dùng trong @expo/vector-icons ('material')
    material: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });

  // Show blank dark screen while fonts load
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#131313' }} />;
  }

  return (
    <SafeAreaProvider>
      <ColorSchemeProvider>
        <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1 }}>
          <AppShell />
        </Animated.View>
      </ColorSchemeProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];

  const NavigationTheme = {
    ...(colorScheme === 'light' ? DefaultTheme : DarkTheme),
    colors: {
      ...(colorScheme === 'light' ? DefaultTheme.colors : DarkTheme.colors),
      background: C.background,
      card: C.card,
      text: C.text,
      primary: C.primary,
      border: C.border,
      notification: C.primary,
    },
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider value={NavigationTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="festivals" options={{ headerShown: false }} />
          </Stack>
          <StatusBar 
            style={colorScheme === 'light' ? 'dark' : 'light'} 
            backgroundColor={C.background} 
          />
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
