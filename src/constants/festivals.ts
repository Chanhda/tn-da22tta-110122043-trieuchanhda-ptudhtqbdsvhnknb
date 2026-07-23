export type MultiLangText = {
  vi: string;
  km: string;
  en: string;
};

export type MultiLangArray = {
  vi: string[];
  km: string[];
  en: string[];
};

export type FestivalItem = {
  id: string;
  title: MultiLangText;
  khmerTitle: string;
  subtitle: MultiLangText;
  targetDate: string; // ISO string for live countdown
  dateDisplay: MultiLangText;
  location: MultiLangText;
  summary: MultiLangText;
  description: MultiLangText;
  rituals: MultiLangArray;
  foods: MultiLangArray;
  highlights: MultiLangArray;
  coverImage: string;
  featured?: boolean;
};

export const festivalItems: FestivalItem[] = [
  {
    id: 'ok-om-bok',
    title: {
      vi: 'Lễ hội Ók Om Bók & Đua Ghe Ngọ',
      km: 'ពិធីបុណ្យអុំទូក និងសំពះព្រះខែ (អកអំបុក)',
      en: 'Ok Om Bok & Ngo Boat Race Festival',
    },
    khmerTitle: 'ពិធីបុណ្យអុំទូក និងសំពះព្រះខែ',
    subtitle: {
      vi: 'Di sản văn hóa phi vật thể quốc gia - Lễ cúng trăng',
      km: 'បេតិកភណ្ឌវប្បធម៌អរូបិយជាតិ - ពិធីសំពះព្រះខែ',
      en: 'National Intangible Heritage - Moon Worshipping Ceremony',
    },
    targetDate: '2026-11-23T08:00:00.000Z',
    dateDisplay: {
      vi: 'Rằm tháng 10 Âm lịch (15/10 Âm lịch)',
      km: 'ថ្ងៃ ១៥ កើត ខែកត្តិក រៀងរាល់ឆ្នាំ',
      en: 'Full Moon of the 10th Lunar Month (November)',
    },
    location: {
      vi: 'Sóc Trăng & Trà Vinh (Trung tâm chính)',
      km: 'សុកត្រាំង និង ត្រាវិញ (មជ្ឈមណ្ឌលដើម)',
      en: 'Soc Trang & Tra Vinh Provinces (Main Hubs)',
    },
    summary: {
      vi: 'Đại lễ cúng trăng cảm ơn thần Mặt Trăng đã bảo vệ mùa màng, kết hợp giải Đua ghe Ngọ rực rỡ trên sông Maspero.',
      km: 'ពិធីបុណ្យសំពះព្រះខែដើម្បីអរគុណដល់ព្រះខែដែលបានជួយថែរក្សាភោគផលកសិកម្ម បូករួមនឹងការប្រកួតទូក ង យ៉ាងអធិកអធម។',
      en: 'Grand moon worshipping ceremony thanking the Moon God for agricultural bounties, paired with spectacular Ngo boat races.',
    },
    description: {
      vi: 'Ók Om Bók là lễ hội náo nhiệt và lớn bậc nhất tại Miền Tây. Khi trăng tròn rúp đỉnh, mọi người tụ tập tại sân chùa hoặc sân nhà để cúng đút cốm dẹp (Cốm dẹp quết tươi thơm lừng vị dừa). Ngay sau đó là giải đua ghe Ngọ - những chiếc thuyền rồng uốn lượn dài hơn 30m với 50-60 tay chèo rèn luyện dũng mãnh, lướt sóng trong tiếng reo hò vang dội cả một vùng sông nước.',
      km: 'អកអំបុកគឺជាពិធីបុណ្យដ៏អ៊ូអរ និងធំបំផុតនៅភាគខាងត្បូង។ នៅពេលព្រះខែពេញបូណ៌មី មនុស្សគ្រប់គ្នាកកកុញនៅទីធ្លាវត្ត ឬទីធ្លាផ្ទះដើម្បីធ្វើពិធីអកអំបុក។ បន្ទាប់មកគឺការប្រកួតទូក ង - ទូកវែងជាង ៣០ម៉ែត្រ ដែលមានកីឡាករ ៥០-៦០នាក់ ចាយយ៉ាងក្លាហានលើផ្ទៃទឹក។',
      en: 'Ok Om Bok is the largest and most exhilarating festival in the Mekong Delta. Under the full moon, families gather to feed pounded rice (Ambok) to children for blessings, followed by thrilling Ngo dragon boat races with 50-60 rowers per boat.',
    },
    rituals: {
      vi: [
        'Nghi thức cúng trăng và đút Cốm Dẹp cho trẻ em',
        'Thả đèn gió (Khom Loy) và đèn nước (Khom Prout) lung linh trên bầu trời và dòng sông',
        'Giải thi đấu Đua ghe Ngọ truyền thống sôi động',
      ],
      km: [
        'ពិធីសំពះព្រះខែ និងអកអំបុកឲ្យក្មេងៗ',
        'ការបង្ហោះគោមខ្យល់ និងបណ្តែតប្រទីបលើផ្ទៃទឹក',
        'ការប្រកួតកីឡាប្រណាំងទូក ង ប្រពៃណីយ៉ាងសប្បាយរីករាយ',
      ],
      en: [
        'Moon worship ritual and Ambok feeding for children',
        'Releasing sky lanterns (Khom Loy) and floating water lanterns (Khom Prout)',
        'Exhilarating traditional Ngo boat racing regatta',
      ],
    },
    foods: {
      vi: ['Cốm dẹp trộn dừa nạo', 'Bún nước lèo', 'Bánh pía', 'Bánh dừa Khmer'],
      km: ['អំបុកដូងស្រស់', 'នំបញ្ចុកសម្លប្រហើរ', 'នំពីអា (Pia)', 'នំដូងខ្មែរ'],
      en: ['Fresh Ambok Pounded Rice with Coconut', 'Num Banh Chok Noodle', 'Pia Cake', 'Khmer Coconut Cake'],
    },
    highlights: {
      vi: ['Giải đua ghe Ngọ hàng chục vạn người xem', 'Hàng ngàn đèn gió lung linh đêm trăng', 'Tục đút cốm dẹp truyền thống'],
      km: ['ការប្រកួតទូក ង ទាក់ទាញទស្សនិកជនរាប់សែននាក់', 'គោមខ្យល់រាប់ពាន់រះត្រចះត្រចង់ក្នុងរាត្រីសមោសរ', 'ទំនៀមទម្លាប់អកអំបុកប្រពៃណី'],
      en: ['Ngo boat race with hundreds of thousands of spectators', 'Thousands of glowing sky lanterns in the moonlight', 'Traditional Ambok feeding custom'],
    },
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
];
