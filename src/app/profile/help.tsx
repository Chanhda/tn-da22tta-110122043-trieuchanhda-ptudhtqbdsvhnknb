import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HelpScreen() {
  const { language } = useLanguage();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'dark'];
  const styles = getStyles(C, colorScheme ?? 'dark');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = language === 'vi' ? [
    {
      id: 'q1',
      question: 'Làm cách nào để tìm kiếm di sản?',
      answer: 'Bạn có thể sử dụng thanh tìm kiếm ở trang chủ hoặc duyệt theo danh mục trong phần "Khám phá" ở thanh điều hướng dưới.',
    },
    {
      id: 'q2',
      question: 'Làm cách nào để thêm di sản vào yêu thích?',
      answer: 'Nhấp vào biểu tượng trái tim trên trang chi tiết di sản để thêm vào danh sách yêu thích. Bạn có thể xem danh sách yêu thích trong trang Hồ sơ.',
    },
    {
      id: 'q3',
      question: 'Tôi có thể lưu các bài viết để đọc sau không?',
      answer: 'Có, bạn có thể lưu bài viết bằng cách nhấp vào nút "Lưu" trên trang chi tiết bài viết. Chức năng này sẽ sớm ra mắt!',
    },
    {
      id: 'q4',
      question: 'Làm cách nào để báo cáo nội dung không chính xác?',
      answer: 'Bạn có thể liên hệ với chúng tôi thông qua email support@khmerheritage.com hoặc mở trang hỗ trợ bên dưới.',
    },
    {
      id: 'q5',
      question: 'Ứng dụng có yêu cầu kết nối Internet không?',
      answer: 'Có, bạn cần kết nối Internet để tải dữ liệu di sản, bài viết và hình ảnh từ máy chủ của chúng tôi.',
    },
    {
      id: 'q6',
      question: 'Làm cách nào để thay đổi ngôn ngữ ứng dụng?',
      answer: 'Vào Hồ sơ → Tùy chỉnh ngôn ngữ. Ứng dụng hỗ trợ Tiếng Việt, Tiếng Khmer, và Tiếng Anh.',
    },
  ] : language === 'km' ? [
    {
      id: 'q1',
      question: 'តើខ្ញុំស្វែងរកបេតិកភណ្ឌដោយរបៀបណា?',
      answer: 'អ្នកអាចប្រើប្រាស់ប្រអប់ស្វែងរកនៅលើទំព័រដើម ឬរកមើលតាមប្រភេទនៅក្នុងផ្នែក "ស្វែងរក" នៃរបាររុករកខាងក្រោម។',
    },
    {
      id: 'q2',
      question: 'តើធ្វើដូចម្តេចដើម្បីបន្ថែមបេតិកភណ្ឌទៅក្នុងបញ្ជីចូលចិត្ត?',
      answer: 'ចុចលើរូបបេះដូងនៅលើទំព័រលម្អិតបេតិកភណ្ឌដើម្បីបន្ថែមទៅក្នុងបញ្ជីចូលចិត្ត។ អ្នកអាចមើលបញ្ជីចូលចិត្តនៅក្នុងទំព័រប្រវត្តិរូប។',
    },
    {
      id: 'q3',
      question: 'តើខ្ញុំអាចរក្សាទុកអត្ថបទសម្រាប់អានពេលក្រោយបានទេ?',
      answer: 'បាទ/ចាស អ្នកអាចរក្សាទុកអត្ថបទដោយចុចលើប៊ូតុង "រក្សាទុក" នៅលើទំព័រលម្អិតអត្ថបទ។ មុខងារនេះនឹងមកដល់ឆាប់ៗនេះ!',
    },
    {
      id: 'q4',
      question: 'តើធ្វើដូចម្តេចដើម្បីរាយការណ៍អំពីមាតិកាមិនត្រឹមត្រូវ?',
      answer: 'អ្នកអាចទាក់ទងមកយើងខ្ញុំតាមរយៈអ៊ីមែល support@khmerheritage.com ឬបើកទំព័រគាំទ្រខាងក្រោម។',
    },
    {
      id: 'q5',
      question: 'តើកម្មវិធីតម្រូវឱ្យមានការភ្ជាប់អ៊ីនធឺណិតដែរឬទេ?',
      answer: 'បាទ/ចាស អ្នកត្រូវភ្ជាប់អ៊ីនធឺណិតដើម្បីទាញយកទិន្នន័យបេតិកភណ្ឌ អត្ថបទ និងរូបភាពពីម៉ាស៊ីនមេរបស់យើង។',
    },
    {
      id: 'q6',
      question: 'តើធ្វើដូចម្តេចដើម្បីផ្លាស់ប្តូរភាសារបស់កម្មវិធី?',
      answer: 'ចូលទៅកាន់ប្រវត្តិរូប → ភាសា។ កម្មវិធីគាំទ្រភាសាវៀតណាម ភាសាខ្មែរ និងភាសាអង់គ្លេស។',
    },
  ] : [
    {
      id: 'q1',
      question: 'How do I search for heritage sites?',
      answer: 'You can use the search bar on the home screen or browse by category in the "Explore" section of the bottom navigation bar.',
    },
    {
      id: 'q2',
      question: 'How do I add a heritage site to favorites?',
      answer: 'Tap the heart icon on the heritage detail page to add it to your favorites. You can view your favorite list in the Profile page.',
    },
    {
      id: 'q3',
      question: 'Can I save articles to read later?',
      answer: 'Yes, you can save articles by clicking the "Save" button on the article detail page. This feature is coming soon!',
    },
    {
      id: 'q4',
      question: 'How do I report inaccurate content?',
      answer: 'You can contact us via email at support@khmerheritage.com or open the support page below.',
    },
    {
      id: 'q5',
      question: 'Does the app require an internet connection?',
      answer: 'Yes, you need an internet connection to load heritage data, articles, and images from our server.',
    },
    {
      id: 'q6',
      question: 'How do I change the app language?',
      answer: 'Go to Profile → Language. The app supports Vietnamese, Khmer, and English.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openSupportEmail = async () => {
    const title = language === 'vi' ? 'Liên hệ hỗ trợ' : language === 'km' ? 'ទាក់ទងផ្នែកគាំទ្រ' : 'Contact Support';
    try {
      await Linking.openURL('mailto:support@khmerheritage.com?subject=Khmer%20Heritage%20Support');
    } catch {
      Alert.alert(title, 'support@khmerheritage.com');
    }
  };

  const openSupportWebsite = async () => {
    const title = language === 'vi' ? 'Liên hệ hỗ trợ' : language === 'km' ? 'ទាក់ទងផ្នែកគាំទ្រ' : 'Contact Support';
    try {
      await Linking.openURL('https://khmerheritage.com/support');
    } catch {
      Alert.alert(title, 'https://khmerheritage.com/support');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="list.bullet.circle.fill" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Câu hỏi thường gặp' : language === 'km' ? 'សំណួរដែលសួរញឹកញាប់' : 'Frequently Asked Questions'}
            </ThemedText>
          </View>

          <View style={styles.faqList}>
            {faqs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;
              return (
                <View key={faq.id} style={styles.faqCard}>
                  <Pressable
                    onPress={() => toggleFaq(faq.id)}
                    style={styles.faqHeader}
                  >
                    <View style={styles.faqNumBg}>
                      <ThemedText style={styles.faqNum}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
                    <IconSymbol
                      name={isExpanded ? 'chevron.up' : 'chevron.down'}
                      size={16}
                      color={isExpanded ? C.primary : C.textTertiary}
                    />
                  </Pressable>
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <ThemedText style={styles.faqAnswer}>
                        {faq.answer}
                      </ThemedText>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Contact Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="envelope.fill" size={14} color={C.textSecondary} />
            <ThemedText style={styles.sectionTitle}>
              {language === 'vi' ? 'Cần thêm trợ giúp?' : language === 'km' ? 'ត្រូវការជំនួយបន្ថែម?' : 'Need more help?'}
            </ThemedText>
          </View>

          <View style={styles.contactCard}>
            <View style={styles.contactTop}>
              <View style={styles.contactIconBg}>
                <IconSymbol name="headphones" size={24} color="#131313" />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactTitle}>
                  {language === 'vi' ? 'Đội ngũ hỗ trợ' : language === 'km' ? 'ក្រុមការងារគាំទ្រ' : 'Support Team'}
                </ThemedText>
                <ThemedText style={styles.contactEmail}>
                  support@khmerheritage.com
                </ThemedText>
                <ThemedText style={styles.contactHours}>
                  {language === 'vi' ? 'Thứ 2 – Thứ 6, 8:00 – 17:00' : language === 'km' ? 'ចន្ទ – សុក្រ, 8:00 – 17:00' : 'Mon – Fri, 8:00 – 17:00'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.contactActions}>
              <Pressable
                style={({ pressed }) => [styles.contactBtn, styles.primaryBtn, pressed && { opacity: 0.9 }]}
                onPress={openSupportEmail}
              >
                <IconSymbol name="envelope.fill" size={14} color="#131313" />
                <ThemedText style={styles.primaryBtnText}>
                  {language === 'vi' ? 'Gửi email' : language === 'km' ? 'ផ្ញើអ៊ីមែល' : 'Send Email'}
                </ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.contactBtn, styles.outlineBtn, pressed && { opacity: 0.85 }]}
                onPress={openSupportWebsite}
              >
                <IconSymbol name="globe" size={14} color={C.primary} />
                <ThemedText style={styles.outlineBtnText}>
                  {language === 'vi' ? 'Trang hỗ trợ' : language === 'km' ? 'ទំព័រគាំទ្រ' : 'Support Page'}
                </ThemedText>
              </Pressable>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.containerMargin,
    paddingBottom: 60,
    gap: Spacing.md,
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
  faqList: {
    gap: Spacing.sm,
  },
  faqCard: {
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
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  faqNumBg: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: `${C.primary}12`,
    borderWidth: 0.5,
    borderColor: `${C.primary}25`,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  faqNum: {
    ...Typography.labelLarge,
    color: C.primary,
    fontWeight: '800',
  },
  faqQuestion: {
    ...Typography.bodyMedium,
    color: C.text,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  faqAnswerContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: `${C.border}60`,
  },
  faqAnswer: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: scheme === 'light' ? 'rgba(255, 254, 250, 0.95)' : 'rgba(28, 28, 28, 0.8)',
    borderWidth: 1,
    borderColor: scheme === 'light' ? 'rgba(182, 139, 30, 0.16)' : 'rgba(212, 175, 55, 0.15)',
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.md,
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
  contactTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  contactIconBg: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    ...Shadows.goldGlow,
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  contactTitle: {
    ...Typography.titleSmall,
    color: C.text,
    fontWeight: '700',
  },
  contactEmail: {
    ...Typography.bodySmall,
    color: C.textSecondary,
    fontWeight: '600',
  },
  contactHours: {
    ...Typography.bodySmall,
    color: C.textTertiary,
    fontSize: 12,
  },
  contactActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    height: 44,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: C.primary,
    ...Shadows.goldGlow,
  },
  primaryBtnText: {
    ...Typography.labelMedium,
    color: '#131313',
    fontWeight: '800',
  },
  outlineBtn: {
    backgroundColor: `${C.primary}0B`,
    borderWidth: 1,
    borderColor: `${C.primary}40`,
  },
  outlineBtnText: {
    ...Typography.labelMedium,
    color: C.primary,
    fontWeight: '700',
  },
});
