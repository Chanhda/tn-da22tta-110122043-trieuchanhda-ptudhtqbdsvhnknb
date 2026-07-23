import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography, FontFamily } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AboutScreen() {
  const { language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');

  const openLink = (url: string) => {
    const errorMsg = language === 'vi' ? 'Không thể mở liên kết' : language === 'km' ? 'មិនអាចបើកតំណបានទេ' : 'Cannot open link';
    Linking.canOpenURL(url)
      .then((canOpen) => {
        if (canOpen) return Linking.openURL(url);
        Alert.alert(errorMsg, url);
        return undefined;
      })
      .catch(() => Alert.alert(errorMsg, url));
  };

  const features = language === 'vi' ? [
    { icon: 'mappin.circle.fill' as const, text: 'Bản đồ tương tác với các địa điểm di sản', color: C.accent },
    { icon: 'book.fill' as const, text: 'Bài viết chi tiết về lịch sử và văn hóa', color: C.primary },
    { icon: 'heart.fill' as const, text: 'Lưu và quản lý danh sách yêu thích', color: C.secondary },
    { icon: 'globe' as const, text: 'Hỗ trợ nhiều ngôn ngữ: Việt, Khmer, Anh', color: C.accent },
  ] : language === 'km' ? [
    { icon: 'mappin.circle.fill' as const, text: 'ផែនទីអន្តរកម្មជាមួយទីតាំងបេតិកភណ្ឌ', color: C.accent },
    { icon: 'book.fill' as const, text: 'អត្ថបទលម្អិតអំពីប្រវត្តិសាស្ត្រ និងវប្បធម៌', color: C.primary },
    { icon: 'heart.fill' as const, text: 'រក្សាទុក និងគ្រប់គ្រងបញ្ជីចូលចិត្ត', color: C.secondary },
    { icon: 'globe' as const, text: 'គាំទ្រច្រើនភាសា៖ វៀតណាម ខ្មែរ អង់គ្លេស', color: C.accent },
  ] : [
    { icon: 'mappin.circle.fill' as const, text: 'Interactive map with heritage locations', color: C.accent },
    { icon: 'book.fill' as const, text: 'Detailed articles about history and culture', color: C.primary },
    { icon: 'heart.fill' as const, text: 'Save and manage your favorite list', color: C.secondary },
    { icon: 'globe' as const, text: 'Multi-language support: Vietnamese, Khmer, English', color: C.accent },
  ];

  const links = language === 'vi' ? [
    { id: 'website', title: 'Trang web chính thức', icon: 'globe' as const, color: C.accent, url: 'https://khmerheritage.com' },
    { id: 'facebook', title: 'Facebook chính thức', icon: 'person.2.fill' as const, color: '#1877F2', url: 'https://facebook.com/khmerheritage' },
    { id: 'instagram', title: 'Instagram di sản', icon: 'camera.fill' as const, color: C.secondary, url: 'https://instagram.com/khmerheritage' },
    { id: 'email', title: 'Email liên hệ hỗ trợ', icon: 'envelope.fill' as const, color: C.primary, url: 'mailto:contact@khmerheritage.com' },
  ] : language === 'km' ? [
    { id: 'website', title: 'គេហទំព័រផ្លូវការ', icon: 'globe' as const, color: C.accent, url: 'https://khmerheritage.com' },
    { id: 'facebook', title: 'ហ្វេសប៊ុកផ្លូវការ', icon: 'person.2.fill' as const, color: '#1877F2', url: 'https://facebook.com/khmerheritage' },
    { id: 'instagram', title: 'អ៊ិនស្តាក្រាមបេតិកភណ្ឌ', icon: 'camera.fill' as const, color: C.secondary, url: 'https://instagram.com/khmerheritage' },
    { id: 'email', title: 'អ៊ីមែលទំនាក់ទំនងគាំទ្រ', icon: 'envelope.fill' as const, color: C.primary, url: 'mailto:contact@khmerheritage.com' },
  ] : [
    { id: 'website', title: 'Official Website', icon: 'globe' as const, color: C.accent, url: 'https://khmerheritage.com' },
    { id: 'facebook', title: 'Official Facebook', icon: 'person.2.fill' as const, color: '#1877F2', url: 'https://facebook.com/khmerheritage' },
    { id: 'instagram', title: 'Heritage Instagram', icon: 'camera.fill' as const, color: C.secondary, url: 'https://instagram.com/khmerheritage' },
    { id: 'email', title: 'Support Email Contact', icon: 'envelope.fill' as const, color: C.primary, url: 'mailto:contact@khmerheritage.com' },
  ];

  return (
    <View style={styles.screen}>
      {/* Curved Header Banner */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View style={styles.headerLogoRow}>
          <View style={styles.logoBox}>
            <IconSymbol name="building.2.fill" size={32} color={C.primary} />
          </View>
          <View>
            <ThemedText style={styles.headerAppName}>Khmer Heritage</ThemedText>
            <ThemedText style={styles.headerVersion}>
              {language === 'vi' ? 'Phiên bản v1.0.0' : language === 'km' ? 'កំណែ v1.0.0' : 'Version v1.0.0'}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.headerTagline}>
          {language === 'vi' ? 'Kết nối cộng đồng với di sản văn hóa Khmer Nam Bộ' : language === 'km' ? 'ភ្ជាប់សហគមន៍ជាមួយបេតិកភណ្ឌវប្បធម៌ខ្មែរកម្ពុជាក្រោម' : 'Connecting the community with Khmer cultural heritage in Southern Vietnam'}
        </ThemedText>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description Panel */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <View style={styles.descriptionCard}>
            <ThemedText style={styles.descriptionText}>
              {language === 'vi' 
                ? 'Khmer Heritage là ứng dụng toàn diện được thiết kế để khám phá và bảo tồn di sản văn hóa phong phú của người Khmer Nam Bộ. Chúng tôi mang đến thông tin chi tiết về các ngôi đền cổ kính, lễ hội truyền thống náo nhiệt và những loại hình nghệ thuật đặc sắc.'
                : language === 'km'
                ? 'Khmer Heritage គឺជាកម្មវិធីទូលំទូលាយដែលត្រូវបានរចនាឡើងដើម្បីរុករក និងអភិរក្សបេតិកភណ្ឌវប្បធម៌ដ៏សម្បូរបែបរបស់ប្រជាជនខ្មែរកម្ពុជាក្រោម។ យើងនាំមកនូវព័ត៌មានលម្អិតអំពីវត្តអារាមបុរាណ ពិធីបុណ្យប្រពៃណីដ៏អធិកអធម និងទម្រង់សិល្បៈពិសេសៗ។'
                : 'Khmer Heritage is a comprehensive application designed to explore and preserve the rich cultural heritage of Khmer people in Southern Vietnam. We bring detailed information about ancient temples, vibrant traditional festivals, and unique art forms.'}
            </ThemedText>
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="sparkles" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Tính năng nổi bật' : language === 'km' ? 'លក្ខណៈពិសេសលេចធ្លោ' : 'Key Features'}
            </ThemedText>
          </View>
          <View style={styles.listCard}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureRow,
                  index !== features.length - 1 && styles.rowBorder,
                ]}
              >
                <View style={[styles.featureIconBg, { backgroundColor: `${feature.color}15` }]}>
                  <IconSymbol name={feature.icon} size={18} color={feature.color} />
                </View>
                <ThemedText style={styles.featureText}>{feature.text}</ThemedText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Social Links */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="link" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Theo dõi chúng tôi' : language === 'km' ? 'តាមដានពួកយើង' : 'Follow Us'}
            </ThemedText>
          </View>
          <View style={styles.listCard}>
            {links.map((link, index) => (
              <Pressable
                key={link.id}
                onPress={() => openLink(link.url)}
                style={({ pressed }) => [
                  { width: '100%' },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View
                  style={[
                    styles.linkRow,
                    index !== links.length - 1 && styles.rowBorder,
                  ]}
                >
                  <View style={styles.linkLeftGroup}>
                    <View style={[styles.linkIconBg, { backgroundColor: `${link.color}15` }]}>
                      <IconSymbol name={link.icon} size={18} color={link.color} />
                    </View>
                    <ThemedText style={styles.linkText}>{link.title}</ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={14} color={C.textTertiary} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Credits Card */}
        <Animated.View entering={FadeInDown.delay(250).duration(600)}>
          <View style={styles.creditsCard}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <IconSymbol key={i} name="star.fill" size={14} color={C.primary} />
              ))}
            </View>
            <ThemedText style={styles.creditsTitle}>
              {language === 'vi' ? 'Phát triển bởi Khmer Heritage Team' : language === 'km' ? 'បង្កើតឡើងដោយក្រុមការងារ Khmer Heritage' : 'Developed by Khmer Heritage Team'}
            </ThemedText>
            <ThemedText style={styles.creditsSubtitle}>
              {language === 'vi' 
                ? '© 2026 Văn hóa Khmer Nam Bộ. Bảo lưu mọi quyền.' 
                : language === 'km' 
                ? '© 2026 វប្បធម៌ខ្មែរកម្ពុជាក្រោម។ រក្សាសិទ្ធិគ្រប់យ៉ាង។' 
                : '© 2026 Khmer Culture in Southern Vietnam. All rights reserved.'}
            </ThemedText>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const getStyles = (C: typeof Colors.dark, scheme: string) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.containerMargin,
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
    gap: Spacing.sm,
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: `${C.primary}12`,
    borderWidth: 0.5,
    borderColor: `${C.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.goldGlow,
  },
  headerAppName: {
    fontSize: 22,
    fontFamily: FontFamily.playfairBold,
    color: C.primary,
  },
  headerVersion: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    fontSize: 12,
    marginTop: 2,
  },
  headerTagline: {
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    paddingBottom: 60,
    gap: Spacing.md,
  },
  descriptionCard: {
    backgroundColor: scheme === 'light' ? '#FFFFFF' : C.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.15)' : 'rgba(242, 202, 80, 0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Platform.select({
      ios: Shadows.medium,
      web: Shadows.medium,
      default: {},
    }),
  },
  descriptionText: {
    ...Typography.bodyMedium,
    color: C.text,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.labelSmall,
    color: C.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  listCard: {
    backgroundColor: scheme === 'light' ? 'rgba(255, 254, 250, 0.95)' : 'rgba(28, 28, 28, 0.8)',
    borderWidth: 1,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.16)' : 'rgba(212, 175, 55, 0.15)',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      default: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: `${C.border}60`,
  },
  featureIconBg: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: `${C.border}40`,
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    ...Typography.bodyMedium,
    color: C.text,
    lineHeight: 20,
  },
  linkRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  linkLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  linkIconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexShrink: 0,
  },
  linkText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    color: C.text,
  },
  creditsCard: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    backgroundColor: scheme === 'light' ? 'rgba(255, 254, 250, 0.95)' : 'rgba(28, 28, 28, 0.8)',
    borderWidth: 1,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.16)' : 'rgba(212, 175, 55, 0.15)',
    borderRadius: 16,
    padding: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      default: {
        shadowColor: '#B68B1E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  creditsTitle: {
    ...Typography.bodyMedium,
    color: C.text,
    fontWeight: '700',
  },
  creditsSubtitle: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
