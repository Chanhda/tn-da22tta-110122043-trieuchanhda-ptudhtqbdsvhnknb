/**
 * Script: Tạo 20 bài viết đóng góp từ tài khoản thành viên.
 * Các bài viết sẽ ở trạng thái "published" (đã được admin duyệt).
 * 
 * Usage: npx tsx scripts/seed-member-articles.ts
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps, type ServiceAccount, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function loadServiceAccount(): ServiceAccount | undefined {
  const knownPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');
  if (fs.existsSync(knownPath)) {
    return JSON.parse(fs.readFileSync(knownPath, 'utf8')) as ServiceAccount;
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }
  return undefined;
}

// Load .env
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
      if (match) {
        process.env[match[1]] = (match[2] || '').replace(/(^['"]|['"]$)/g, '').trim();
      }
    });
  }
} catch (e) { /* ignore */ }

const serviceAccount = loadServiceAccount();
if (getApps().length === 0) {
  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({ credential: applicationDefault() });
  }
}

const db = getFirestore();

// ============================================================
// 20 bài viết về văn hóa Khmer Nam Bộ
// ============================================================
const articles = [
  {
    id: 'member-chua-ang-tra-vinh',
    title: 'Chùa Âng – Ngôi chùa cổ nhất Trà Vinh',
    category: 'Kiến trúc',
    summary: 'Khám phá ngôi chùa Khmer có lịch sử gần 1000 năm tại trung tâm thành phố Trà Vinh.',
    content: 'Chùa Âng (Angkorajaborey) tọa lạc ngay trung tâm TP. Trà Vinh, được xây dựng từ thế kỷ thứ 10, là ngôi chùa Khmer cổ nhất tỉnh Trà Vinh. Chùa nổi tiếng với kiến trúc mái cong nhiều tầng, chánh điện rộng lớn trang trí hoa văn tinh xảo và khuôn viên rợp bóng cây cổ thụ hàng trăm năm tuổi. Chùa Âng không chỉ là nơi thờ tự mà còn là trung tâm văn hóa, giáo dục của cộng đồng Khmer Trà Vinh, nơi tổ chức các lớp dạy chữ Khmer và truyền bá giáo lý Phật giáo Nam tông.',
    date: '15/06/2026',
  },
  {
    id: 'member-le-hoi-ok-om-bok',
    title: 'Lễ hội Ok Om Bok – Cúng trăng và đua ghe ngo',
    category: 'Lễ hội',
    summary: 'Tìm hiểu lễ hội cúng trăng lớn nhất của đồng bào Khmer Nam Bộ.',
    content: 'Ok Om Bok (Lễ cúng trăng) là lễ hội truyền thống quan trọng nhất của người Khmer, diễn ra vào rằm tháng 10 Âm lịch hằng năm. Người Khmer tin rằng Mặt Trăng là vị thần cai quản mùa màng nên họ tổ chức cúng tạ ơn với cốm dẹp, chuối, dừa và các loại nông sản. Điểm nhấn là lễ thả đèn nước trên sông và đặc biệt là giải đua ghe ngo truyền thống thu hút hàng trăm nghìn người tham dự, tạo nên không khí náo nhiệt đậm đà bản sắc.',
    date: '16/06/2026',
  },
  {
    id: 'member-nghe-thuat-du-ke',
    title: 'Nghệ thuật Dù-kê – Sân khấu dân gian Khmer',
    category: 'Nghệ thuật',
    summary: 'Dù-kê là loại hình sân khấu dân gian độc đáo kết hợp ca múa nhạc kịch.',
    content: 'Dù-kê (hay còn gọi Lakhon Bassac) là nghệ thuật sân khấu dân gian đặc sắc của người Khmer Nam Bộ, ra đời vào đầu thế kỷ 20 tại vùng Bassac (Hậu Giang). Dù-kê kết hợp giữa ca, múa, nhạc và kịch để kể lại các câu chuyện dân gian, truyền thuyết Phật giáo. Diễn viên mặc trang phục truyền thống lộng lẫy, biểu diễn các điệu múa uyển chuyển theo nhạc ngũ âm truyền thống, thu hút khán giả bằng lối diễn xuất sinh động và cốt truyện mang tính giáo dục cao.',
    date: '17/06/2026',
  },
  {
    id: 'member-chua-doi-soc-trang',
    title: 'Chùa Dơi Sóc Trăng – Di tích kiến trúc nghệ thuật cấp quốc gia',
    category: 'Kiến trúc',
    summary: 'Ngôi chùa nổi tiếng với đàn dơi hàng nghìn con trú ngụ trong khuôn viên.',
    content: 'Chùa Dơi (Serây Tê Chô) tọa lạc tại phường 3, TP. Sóc Trăng, được xây dựng cách đây hơn 400 năm. Chùa được công nhận là Di tích kiến trúc nghệ thuật cấp quốc gia nhờ kiến trúc chánh điện hoành tráng với mái lợp ngói nhiều tầng uốn cong hình Naga. Điểm đặc biệt nhất là đàn dơi quạ hàng nghìn con treo mình trên các cây cổ thụ trong khuôn viên chùa, tạo nên cảnh quan độc đáo không nơi nào có được.',
    date: '18/06/2026',
  },
  {
    id: 'member-nhac-ngu-am',
    title: 'Nhạc Ngũ âm – Linh hồn âm nhạc Khmer',
    category: 'Nghệ thuật',
    summary: 'Dàn nhạc Ngũ âm truyền thống với 5 bộ nhạc cụ đặc trưng.',
    content: 'Nhạc Ngũ âm (Pinpeat) là dàn nhạc truyền thống quan trọng nhất của người Khmer, gồm 5 bộ nhạc cụ chính: Skor Thom (trống lớn), Roneat Ek (đàn gỗ cao), Roneat Thung (đàn gỗ trầm), Kong Vong (cồng chiêng) và Sralai (kèn). Dàn nhạc Ngũ âm được sử dụng trong hầu hết các nghi lễ tôn giáo, lễ hội truyền thống và biểu diễn nghệ thuật. Âm thanh hòa quyện tạo nên giai điệu linh thiêng, trang trọng đậm nét văn hóa Khmer.',
    date: '19/06/2026',
  },
  {
    id: 'member-chol-chnam-thmay',
    title: 'Chol Chnam Thmay – Tết Năm Mới của người Khmer',
    category: 'Lễ hội',
    summary: 'Lễ hội đón năm mới truyền thống lớn nhất của đồng bào Khmer.',
    content: 'Chol Chnam Thmay (Tết năm mới Khmer) diễn ra vào giữa tháng 4 Dương lịch, kéo dài 3 ngày. Ngày đầu tiên (Moha Songkran) đón chào năm mới, ngày thứ hai (Wanabat) đắp núi cát cầu phước, ngày thứ ba (Leung Saka) tắm tượng Phật và dâng cơm cho sư sãi. Trong những ngày này, người Khmer mặc trang phục truyền thống, đến chùa cầu phước, thăm hỏi bà con và tổ chức các trò chơi dân gian vui nhộn.',
    date: '20/06/2026',
  },
  {
    id: 'member-lang-nghe-det-tho-cam',
    title: 'Làng nghề dệt thổ cẩm Khmer ở Trà Vinh',
    category: 'Văn hóa',
    summary: 'Nghề dệt thổ cẩm truyền thống tạo nên những tấm vải Sampot rực rỡ.',
    content: 'Dệt thổ cẩm là nghề truyền thống lâu đời của phụ nữ Khmer, đặc biệt phát triển tại các phum sóc ở Trà Vinh và Sóc Trăng. Những tấm vải Sampot dệt tay với hoa văn phức tạp lấy cảm hứng từ thiên nhiên và tín ngưỡng Phật giáo, sử dụng chỉ tơ tằm nhuộm màu tự nhiên. Mỗi tấm Sampot mất từ 1-3 tháng để hoàn thành, thể hiện sự kiên nhẫn và tài hoa của người thợ dệt Khmer.',
    date: '21/06/2026',
  },
  {
    id: 'member-chua-chen-kieu',
    title: 'Chùa Chén Kiểu – Kiệt tác từ mảnh sành sứ',
    category: 'Kiến trúc',
    summary: 'Ngôi chùa Khmer nổi tiếng được trang trí bằng hàng triệu mảnh sành sứ.',
    content: 'Chùa Chén Kiểu (Sà Lôn) tại huyện Mỹ Xuyên, Sóc Trăng là ngôi chùa Khmer độc nhất vô nhị. Toàn bộ mặt ngoài chánh điện được ốp bằng hàng triệu mảnh chén, đĩa, bát sứ vỡ tạo nên các bức phù điêu kể lại sử thi Reamker và các câu chuyện Phật giáo. Chùa còn lưu giữ nhiều hiện vật quý giá và bộ cột gỗ chạm trổ tinh xảo từ phủ của một quý tộc thời Pháp thuộc.',
    date: '22/06/2026',
  },
  {
    id: 'member-sene-dolta',
    title: 'Sene Dolta – Lễ cúng ông bà tổ tiên',
    category: 'Lễ hội',
    summary: 'Lễ hội tưởng nhớ và tri ân tổ tiên quan trọng thứ hai của người Khmer.',
    content: 'Sene Dolta (Lễ Cúng Ông Bà) diễn ra từ ngày 29/8 đến 1/9 Âm lịch, kéo dài 3 ngày. Đây là dịp con cháu tưởng nhớ công ơn tổ tiên, cha mẹ đã khuất. Người Khmer mang thức ăn đến chùa dâng sư sãi để hồi hướng công đức cho người đã mất. Các gia đình quây quần bên nhau, thăm mộ phần tổ tiên và tổ chức các buổi tụng kinh cầu siêu. Đây là dịp gắn kết tình thân và truyền tải giá trị hiếu đạo.',
    date: '23/06/2026',
  },
  {
    id: 'member-mam-bo-hoc',
    title: 'Mắm bò hóc (Prahok) – Đặc sản ẩm thực Khmer',
    category: 'Ẩm thực',
    summary: 'Loại mắm truyền thống đặc trưng nhất trong ẩm thực người Khmer.',
    content: 'Mắm bò hóc (Prahok) là gia vị cốt lõi trong ẩm thực Khmer, được chế biến từ cá nước ngọt ủ muối lên men tự nhiên trong hàng tháng trời. Mắm có mùi nồng đặc trưng, vị mặn đậm đà và được sử dụng trong hầu hết các món ăn truyền thống như bún nước lèo, canh chua, lẩu mắm và các món kho. Kỹ thuật làm mắm được truyền từ đời này sang đời khác, là bí quyết gia truyền của các bà mẹ Khmer.',
    date: '24/06/2026',
  },
  {
    id: 'member-chua-kh-leang',
    title: 'Chùa Kh\'Leang – Chùa cổ nhất Sóc Trăng',
    category: 'Kiến trúc',
    summary: 'Ngôi chùa hơn 500 tuổi với kiến trúc Angkor nguyên bản.',
    content: 'Chùa Kh\'Leang (hay Khlêang) tọa lạc tại TP. Sóc Trăng, được xây dựng cách đây hơn 500 năm, là một trong những ngôi chùa Khmer cổ nhất Nam Bộ. Chánh điện mang phong cách kiến trúc Angkor nguyên bản với mái đầu đao cong vút hình Naga, cột gỗ chạm khắc tinh xảo và các bức phù điêu kể lại cuộc đời Đức Phật. Khuôn viên chùa rộng lớn với nhiều tháp cốt, cây bồ đề cổ thụ tạo nên không gian linh thiêng.',
    date: '25/06/2026',
  },
  {
    id: 'member-dua-ghe-ngo',
    title: 'Đua ghe ngo – Môn thể thao truyền thống Khmer',
    category: 'Văn hóa',
    summary: 'Giải đua ghe ngo truyền thống thu hút hàng trăm nghìn khán giả.',
    content: 'Đua ghe ngo (Tuk Ngo) là môn thể thao dưới nước truyền thống gắn liền với lễ hội Ok Om Bok. Mỗi chiếc ghe ngo dài từ 25-30 mét, do 40-60 tay chèo đồng loạt bơi với tốc độ cao trên sông Maspéro (Sóc Trăng). Các đội thi đấu đại diện cho các chùa, phum sóc trong tỉnh. Giải đua thu hút hàng trăm nghìn khán giả cổ vũ cuồng nhiệt, tạo nên sự kiện thể thao văn hóa lớn nhất của cộng đồng Khmer Nam Bộ.',
    date: '26/06/2026',
  },
  {
    id: 'member-bun-nuoc-leo',
    title: 'Bún nước lèo – Món ăn đặc sản Sóc Trăng',
    category: 'Ẩm thực',
    summary: 'Món bún nổi tiếng với nước lèo đậm đà từ mắm bò hóc và sả.',
    content: 'Bún nước lèo là món ăn đặc trưng nhất của người Khmer Sóc Trăng, nổi tiếng khắp cả nước. Nước lèo được nấu từ cá lóc, mắm bò hóc, sả, ngải bún và nước cốt dừa tạo nên hương vị béo ngậy, đậm đà. Bún được ăn kèm rau sống, giá, bắp chuối thái mỏng và tôm, thịt heo quay. Mỗi quán bún nước lèo đều có bí quyết nấu riêng, nhưng tất cả đều giữ được hương vị truyền thống đặc trưng.',
    date: '27/06/2026',
  },
  {
    id: 'member-chua-som-rong-st',
    title: 'Chùa Som Rong – Tượng Phật nằm lớn nhất Sóc Trăng',
    category: 'Kiến trúc',
    summary: 'Ngôi chùa nổi tiếng với tượng Phật nằm dài 63 mét.',
    content: 'Chùa Som Rong (Wath Sereyvoansa Bâtdâmbâng) nằm trên đường Tôn Đức Thắng, TP. Sóc Trăng. Nổi bật nhất là tượng Phật nhập Niết Bàn dài 63 mét, cao 22 mét – một trong những tượng Phật nằm lớn nhất Đông Nam Á. Khuôn viên chùa được trang trí với nhiều tượng thần, tiên nữ Apsara và các công trình kiến trúc Khmer hoành tráng, thu hút hàng nghìn du khách tham quan mỗi ngày.',
    date: '28/06/2026',
  },
  {
    id: 'member-nghe-lam-gom',
    title: 'Nghề làm gốm truyền thống của người Khmer',
    category: 'Văn hóa',
    summary: 'Nghề gốm thủ công lâu đời với kỹ thuật nung bằng rơm rạ.',
    content: 'Nghề làm gốm là một trong những nghề thủ công truyền thống lâu đời của người Khmer Nam Bộ, đặc biệt phát triển tại các làng gốm ở Trà Vinh và Kiên Giang. Người thợ gốm Khmer sử dụng đất sét địa phương nhào nặn bằng tay hoặc bàn xoay, tạo hình các sản phẩm như nồi, chum, vại và đồ trang trí. Đặc biệt, kỹ thuật nung gốm bằng rơm rạ ở nhiệt độ thấp tạo nên màu đất nung tự nhiên đẹp mắt.',
    date: '29/06/2026',
  },
  {
    id: 'member-truyen-thuyet-naga',
    title: 'Truyền thuyết rắn thần Naga trong văn hóa Khmer',
    category: 'Văn hóa',
    summary: 'Hình tượng Naga và ý nghĩa tâm linh trong đời sống người Khmer.',
    content: 'Naga (rắn thần) là biểu tượng linh thiêng quan trọng nhất trong văn hóa Khmer. Theo truyền thuyết, Naga là vị thần bảo hộ nguồn nước, mùa màng và sự thịnh vượng. Hình tượng Naga xuất hiện ở khắp nơi: trên mái chùa, cầu thang, lan can và các công trình kiến trúc Khmer. Rắn Naga thường được điêu khắc với 7 đầu hoặc 9 đầu, tượng trưng cho cầu vồng nối liền trời và đất. Hình tượng này phản ánh mối quan hệ mật thiết giữa con người và thiên nhiên.',
    date: '30/06/2026',
  },
  {
    id: 'member-le-dang-y',
    title: 'Lễ Dâng Y Kathina – Nét đẹp Phật giáo Nam tông',
    category: 'Lễ hội',
    summary: 'Nghi lễ dâng y cà sa truyền thống sau mùa an cư kiết hạ.',
    content: 'Lễ Dâng Y Kathina là nghi lễ Phật giáo Nam tông quan trọng, diễn ra sau 3 tháng An cư Kiết hạ (tháng 9-10 Âm lịch). Phật tử Khmer tổ chức rước y cà sa mới dâng tặng chư tăng tại các chùa. Đoàn rước trang trọng với nhạc Ngũ âm, múa truyền thống và các xe hoa trang trí lộng lẫy đi quanh phum sóc trước khi vào chùa hành lễ. Đây là dịp thể hiện lòng tôn kính Tam Bảo và tích lũy phước đức.',
    date: '01/07/2026',
  },
  {
    id: 'member-chua-hang-tra-vinh',
    title: 'Chùa Hang – Điểm đến tâm linh nổi tiếng Trà Vinh',
    category: 'Kiến trúc',
    summary: 'Ngôi chùa Khmer được bao bọc bởi rừng cây cổ thụ hàng trăm năm.',
    content: 'Chùa Hang (Kompong Chrây) tọa lạc tại xã Đa Lộc, huyện Châu Thành, Trà Vinh. Tên gọi "Chùa Hang" bắt nguồn từ con đường dẫn vào chùa xuyên qua rừng cây dầu cổ thụ um tùm tạo thành vòm hang tự nhiên. Chùa được xây dựng cách đây hơn 300 năm với chánh điện mang phong cách Angkor truyền thống. Khuôn viên chùa rộng 5 hecta với hệ sinh thái phong phú, là nơi trú ngụ của nhiều loài chim và đàn cò trắng hàng nghìn con.',
    date: '02/07/2026',
  },
  {
    id: 'member-banh-tet-khmer',
    title: 'Bánh tét lá cẩm – Nét riêng ẩm thực Khmer Trà Vinh',
    category: 'Ẩm thực',
    summary: 'Đặc sản bánh tét với màu tím tự nhiên từ lá cẩm.',
    content: 'Bánh tét lá cẩm là đặc sản nổi tiếng của đồng bào Khmer Trà Vinh. Khác với bánh tét thông thường, bánh được nhuộm màu tím tự nhiên từ nước lá cẩm, tạo nên sắc tím đẹp mắt bắt mắt. Nhân bánh gồm đậu xanh, thịt heo ba chỉ, lòng đỏ trứng muối gói trong lá chuối. Bánh được nấu trong 8-10 tiếng đồng hồ để đạt độ dẻo mềm hoàn hảo. Đây là món quà không thể thiếu trong dịp Tết Chol Chnam Thmay.',
    date: '03/07/2026',
  },
  {
    id: 'member-phum-soc-khmer',
    title: 'Phum Sóc – Đơn vị cộng đồng truyền thống Khmer',
    category: 'Văn hóa',
    summary: 'Tìm hiểu cấu trúc phum sóc và vai trò trong đời sống xã hội Khmer.',
    content: 'Phum Sóc là đơn vị tổ chức xã hội truyền thống của người Khmer Nam Bộ. Mỗi phum (làng nhỏ) gồm vài chục hộ gia đình có quan hệ huyết thống, nhiều phum hợp thành một sóc (làng lớn). Trung tâm mỗi sóc là ngôi chùa – nơi thờ tự, giáo dục, hòa giải tranh chấp và tổ chức lễ hội. Người Khmer sống quây quần xung quanh chùa, tạo nên mối liên kết cộng đồng bền chặt. Cấu trúc phum sóc phản ánh triết lý sống hài hòa, đoàn kết của người Khmer.',
    date: '04/07/2026',
  },
];

async function run() {
  console.log('🔍 Tìm tài khoản thành viên (không phải admin)...');

  // Query all non-admin users
  const usersSnapshot = await db.collection('users').where('role', '!=', 'admin').get();
  
  if (usersSnapshot.empty) {
    console.log('❌ Không tìm thấy tài khoản thành viên nào! Thử tìm tất cả users...');
    const allUsersSnapshot = await db.collection('users').get();
    console.log(`Tổng users: ${allUsersSnapshot.size}`);
    for (const doc of allUsersSnapshot.docs) {
      const d = doc.data();
      console.log(`  - ${d.email} (role: ${d.role})`);
    }
    return;
  }

  const members = usersSnapshot.docs.map(doc => ({
    uid: doc.id,
    email: doc.data().email,
    displayName: doc.data().displayName || doc.data().email?.split('@')[0] || 'Thành viên',
  }));

  console.log(`✅ Tìm thấy ${members.length} tài khoản thành viên:`);
  members.forEach(m => console.log(`  - ${m.email} (${m.displayName})`));

  console.log(`\n📝 Đang tạo ${articles.length} bài viết...`);

  const batch = db.batch();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    // Phân bài viết đều cho các thành viên
    const member = members[i % members.length];

    const docRef = db.collection('articles').doc(article.id);
    
    const baseDate = new Date('2026-06-15T08:00:00.000Z');
    baseDate.setDate(baseDate.getDate() + i);
    
    batch.set(docRef, {
      title: article.title,
      category: article.category,
      summary: article.summary,
      content: article.content,
      author: member.displayName,
      authorId: member.uid,
      date: article.date,
      createdAt: baseDate.toISOString(),
      published: true,
      status: 'published',
      views: Math.floor(Math.random() * 200) + 20,
      likes: Math.floor(Math.random() * 50) + 5,
      coverImage: '',
      gallery: [],
    });

    console.log(`  ${i + 1}. "${article.title}" → by ${member.displayName}`);
  }

  await batch.commit();
  console.log(`\n✅ Hoàn thành! Đã tạo ${articles.length} bài viết thành công.`);
}

run().catch(console.error);
