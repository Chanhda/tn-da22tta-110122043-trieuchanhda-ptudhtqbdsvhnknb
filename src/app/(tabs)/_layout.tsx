import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLanguage } from '@/contexts/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

// Tab icon sizes — thin line style matching design
const ICON_SIZE = 24;

export default function TabLayout() {
  const { t, language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      key={`${language}-${colorScheme}`}
      screenOptions={{
        tabBarActiveTintColor: C.tabIconSelected,
        tabBarInactiveTintColor: C.tabIconDefault,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarButton: HapticTab,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colorScheme === 'light' ? 'rgba(249, 246, 240, 0.96)' : 'rgba(19,19,19,0.92)',
            borderTopColor: colorScheme === 'light' ? 'rgba(208, 196, 178, 0.4)' : 'rgba(77,70,53,0.4)',
            height: Platform.select({
              web: 70,
              ios: 88,
              default: 62 + Math.max(insets.bottom, 12),
            }),
            paddingBottom: Platform.select({
              web: 10,
              ios: 24,
              default: Math.max(insets.bottom, 10),
            }),
          }
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: language === 'vi' ? 'Trang chủ' : language === 'km' ? 'ទំព័រដើម' : 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrap}>
              <IconSymbol size={ICON_SIZE} name={focused ? 'house.fill' : 'house'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t.explore.title,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrap}>
              <IconSymbol size={ICON_SIZE} name={focused ? 'safari.fill' : 'safari'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="heritage"
        options={{
          title: language === 'vi' ? 'Di sản' : language === 'km' ? 'បេតិកភណ្ឌ' : 'Archive',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrap}>
              <IconSymbol size={ICON_SIZE} name={focused ? 'building.columns.fill' : 'building.columns'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: language === 'vi' ? 'Hành trình' : language === 'km' ? 'ដំណើរ' : 'Journey',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrap}>
              <IconSymbol size={ICON_SIZE} name={focused ? 'map.fill' : 'map'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile.title,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrap}>
              <IconSymbol size={ICON_SIZE} name={focused ? 'person.fill' : 'person'} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19,19,19,0.92)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(77,70,53,0.4)',
    paddingTop: Platform.select({ ios: 10, default: 6 }),
    ...Platform.select({
      web: { boxShadow: '0 -4px 20px rgba(212,175,55,0.05)' },
      default: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 20,
      },
    }),
  },
  tabItem: {
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
