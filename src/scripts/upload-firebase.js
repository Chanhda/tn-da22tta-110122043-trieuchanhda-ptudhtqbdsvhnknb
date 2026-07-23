/**
 * Script upload dữ liệu lên Firebase Firestore
 * Chạy: node scripts/upload-firebase.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, writeBatch, doc } = require('firebase/firestore');
require('dotenv').config();

// Firebase config từ .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Dữ liệu mẫu
const data = {
  categories: [
    { id: 'le-hoi', name: 'Lễ hội', slug: 'le-hoi', icon: 'calendar' },
    { id: 'kien-truc', name: 'Kiến trúc', slug: 'kien-truc', icon: 'building' },
    { id: 'am-thuc', name: 'Ẩm thực', slug: 'am-thuc', icon: 'restaurant' },
    { id: 'nghe-thuat', name: 'Nghệ thuật', slug: 'nghe-thuat', icon: 'music-note' },
  ],
  
  heritages: [
    {
      id: 'chua-chantarangsay',
      title: 'Chùa Chantarangsay',
      province: 'TP. Hồ Chí Minh',
      category: 'Kiến trúc tôn giáo',
      subtitle: 'Ngôi chùa Khmer tiêu biểu trong đô thị lớn',
      body: 'Chùa Chantarangsay (còn gọi là chùa Candaransĩ) tọa lạc tại Quận 3, TP. Hồ Chí Minh, là ngôi chùa Khmer đầu tiên được xây dựng tại thành phố vào năm 1946. Ngôi chùa đóng vai trò là trung tâm sinh hoạt tôn giáo, văn hóa và xã hội quan trọng của cộng đồng người Khmer đang sinh sống, học tập và làm việc tại TP.HCM.\n\nVề mặt kiến trúc, chùa Chantarangsay mang đậm phong cách truyền thống của Phật giáo Nam tông Khmer. Ngôi chính điện có mái nhiều tầng uốn cong thanh thoát, đỉnh mái trang trí hình đuôi rồng thần Naga uốn lượn uy nghiêm. Các hàng cột, bờ tường được chạm khắc hoa văn tinh xảo như chim thần Krud, tượng Phật bốn mặt và các hình ảnh mô phỏng cuộc đời của Đức Phật Thích Ca.\n\nKhông gian bên trong chùa rất thanh tịnh với khuôn viên nhiều cây xanh. Đây không chỉ là nơi cầu an, tu học của các sư sãi mà còn là nơi tổ chức các lễ hội truyền thống lớn của người Khmer như Tết Chol Chnam Thmay, lễ Sen Dolta và lễ hội Oóc Om Bóc, thu hút đông đảo người dân và du khách đến tham quan, trải nghiệm nét đẹp văn hóa độc đáo.',
      tag: 'Nổi bật',
      description: 'Chùa Chantarangsay là điểm tiêu biểu để giới thiệu kiến trúc chùa Khmer Nam Bộ',
      highlights: ['Mái chùa nhiều tầng', 'Không gian thờ tự đặc trưng', 'Phần lớn hoa văn rồng Naga'],
      coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      location: { lat: 10.7769, lng: 106.7009 },
    },
    {
      id: 'le-hoi-ooc-om-bok',
      title: 'Lễ hội Oóc Om Bóc',
      province: 'Sóc Trăng',
      category: 'Lễ hội truyền thống',
      subtitle: 'Lễ cúng trăng và đua ghe ngo',
      body: 'Lễ hội Oóc Om Bóc (hay còn gọi là Lễ cúng Trăng) là di sản văn hóa phi vật thể quốc gia, được tổ chức vào rằm tháng 10 Âm lịch hằng năm khi mùa mưa kết thúc. Đây là ngày hội lớn nhất của người Khmer Nam Bộ nhằm tạ ơn Mặt Trăng - vị thần điều tiết thời tiết, mang lại mùa màng tươi tốt và sự no ấm cho người dân.\n\nNghi lễ chính được thực hiện vào đêm rằm tại các ngôi chùa hoặc khuôn viên rộng lớn. Người dân chuẩn bị mâm cúng gồm bánh cốm dẹp (nguyên liệu chính giã từ nếp mới), chuối, dừa, khoai lang và các loại hoa quả. Dưới sự hướng dẫn của các vị bô lão, mọi người cùng chắp tay cầu nguyện bình an và tài lộc, sau đó thực hiện nghi thức đút cốm dẹp cho trẻ nhỏ để cầu chúc sự thông minh, khỏe mạnh.\n\nPhần hội vô cùng sôi động với hoạt động Đua ghe Ngo truyền thống trên dòng sông Maspero (Sóc Trăng), thu hút hàng chục đội ghe từ các tỉnh vùng Đồng bằng sông Cửu Long tham gia tranh tài. Tiếng trống vang dội, tiếng reo hò cổ vũ của hàng vạn khán giả tạo nên một bầu không khí lễ hội ngập tràn năng lượng và tinh thần đoàn kết cộng đồng sắc son.',
      tag: 'Mới',
      description: 'Lễ hội Oóc Om Bóc là một trong những lễ hội tiêu biểu của người Khmer Nam Bộ',
      highlights: ['Nghi lễ cúng trăng', 'Hoạt động đua ghe ngo', 'Nội dung giàu hình ảnh'],
      coverImage: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
      location: { lat: 9.6008, lng: 105.9745 },
    },
    {
      id: 'ro-bam',
      title: 'Nghệ thuật Rô Băm',
      province: 'Trà Vinh',
      category: 'Nghệ thuật biểu diễn',
      subtitle: 'Sân khấu truyền thống đặc trưng',
      body: 'Nghệ thuật Rô Băm (hay Rô-băm) là loại hình sân khấu múa cổ điển có lịch sử lâu đời của người Khmer Nam Bộ. Trải qua hàng trăm năm gìn giữ, Rô Băm đã được công nhận là Di sản văn hóa phi vật thể quốc gia. Thể loại này nổi bật với sự kết hợp nhuần nhuyễn giữa nghệ thuật múa cung đình, kịch nghệ độc đáo và âm nhạc truyền thống Khmer.\n\nNội dung biểu diễn của các vở Rô Băm thường xoay quanh các câu chuyện thần thoại, truyền thuyết Phật giáo, đặc biệt là sử thi Reamker (phiên bản Khmer của sử thi Ramayana Ấn Độ). Các nghệ sĩ khi biểu diễn sẽ hóa thân thành các nhân vật quen thuộc như hoàng tử Preah Ream, nàng Seda xinh đẹp, tướng khỉ Hanuman trung thành hay quỷ vương Krong Reap độc ác. Mỗi nhân vật đều có trang phục rực rỡ và những chiếc mặt nạ gỗ chạm khắc tinh xảo thể hiện rõ tính cách chính - tà.\n\nSân khấu Rô Băm cuốn hút người xem bởi các động tác múa tay uốn cong điêu luyện, những bước đi uyển chuyển kết hợp với điệu nhạc réo rắt của dàn nhạc ngũ âm (Pinpeat). Nghệ thuật Rô Băm không chỉ mang tính chất giải trí mà còn giáo dục sâu sắc về đạo đức con người, hướng thiện và ca ngợi lẽ phải trong cuộc sống hằng ngày.',
      tag: 'Xem nhanh',
      description: 'Rô Băm là loại hình nghệ thuật biểu diễn truyền thống',
      highlights: ['Sân khấu truyền thống', 'Mặt nạ cổ điển Reamker', 'Kết hợp nhạc cụ Pinpeat'],
      coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
      location: { lat: 9.9347, lng: 106.3456 },
    },
    {
      id: 'chua-doi',
      title: 'Chùa Dơi',
      province: 'Sóc Trăng',
      category: 'Kiến trúc tôn giáo',
      subtitle: 'Điểm đến tiêu biểu có giá trị du lịch và văn hóa',
      body: 'Chùa Dơi, tên Khmer là Serây Tê Chô Mahatup, tọa lạc tại thành phố Sóc Trăng, tỉnh Sóc Trăng. Đây là ngôi chùa cổ kính được xây dựng từ thế kỷ 16, nổi tiếng không chỉ bởi kiến trúc độc đáo mà còn là nơi cư ngụ của hàng vạn con dơi ngựa quý hiếm treo mình trên những tán cây cổ thụ trong khuôn viên chùa suốt nhiều năm qua.\n\nNgôi chùa mang đậm dấu ấn kiến trúc Khmer truyền thống với mái vòm cong hai tầng rực rỡ sắc vàng, đầu đao uốn cong hình rồng thần Naga. Chính điện thờ tượng Đức Phật Thích Ca bằng đá nguyên khối ngự trên đài sen lớn. Xung quanh tường là những bức tranh sống động kể về cuộc đời hành đạo của Phật Thích Ca từ lúc đản sinh đến khi nhập Niết bàn, được vẽ vô cùng tinh tế.\n\nKhuôn viên chùa Dơi rộng lớn, rợp bóng mát của những cây dầu, cây sao cổ thụ, tạo nên không khí trong lành, bình yên. Buổi chiều tà, du khách đến đây sẽ được chiêm ngưỡng cảnh tượng độc đáo khi đàn dơi khổng lồ bay lượn trên bầu trời trước khi đi kiếm ăn. Chùa Dơi là điểm tham quan văn hóa và du lịch tâm linh không thể bỏ lỡ khi ghé thăm vùng đất Sóc Trăng.',
      tag: 'Khám phá',
      description: 'Chùa Dơi là địa điểm nổi tiếng về di sản Khmer Nam Bộ',
      highlights: ['Khuôn viên dơi tự nhiên', 'Kiến trúc Mahatup cổ kính', 'Tượng Phật đá nguyên khối'],
      coverImage: 'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=1200&q=80',
      location: { lat: 9.5775, lng: 105.9728 },
    },
    {
      id: 'ghe-ngo',
      title: 'Đua ghe ngo',
      province: 'Trà Vinh',
      category: 'Lễ hội truyền thống',
      subtitle: 'Hoạt động thể thao - lễ hội đặc trưng',
      body: 'Đua ghe Ngo (hay Lôi Pro-têp) là hoạt động thể thao dân gian có tính biểu diễn cộng đồng cực kỳ cao của đồng bào người Khmer Nam Bộ. Được tổ chức chính trong dịp lễ hội Oóc Om Bóc hằng năm, đua ghe Ngo không chỉ là một giải đấu thể thao mà còn là nghi thức tâm linh nhằm tạ ơn thần Nước và cầu mong dòng sông mang lại tôm cá đầy khoang, phù sa cho ruộng đồng màu mỡ.\n\nChiếc ghe Ngo (tên Khmer là Ngo) dài khoảng 25 đến 30 mét, có hình dáng thon dài như con rắn, được đục đẽo từ thân cây gỗ sao nguyên khối tốt nhất. Thân ghe được trang trí hoa văn rực rỡ với họa tiết vảy rồng, đầu và đuôi ghe uốn cong vút lên trên. Mỗi chiếc ghe Ngo thuộc sở hữu của một ngôi chùa và đại diện cho niềm tự hào của cả một phum sóc (ngôi làng) tham gia cuộc đua.\n\nMỗi đội đua ghe Ngo gồm khoảng 50 đến 60 tay chèo lực lưỡng dưới sự điều khiển của người chỉ huy đứng ở mũi ghe thổi còi giữ nhịp. Khi cuộc đua bắt đầu, những chiếc ghe lao vút đi trên mặt nước trong tiếng reo hò cuồng nhiệt của hàng vạn người dân dọc hai bờ sông. Sự kiện mang tính kết nối cộng đồng mạnh mẽ, lan tỏa tinh thần thượng võ và đoàn kết của đồng bào các dân tộc Nam Bộ.',
      tag: 'Sự kiện',
      description: 'Đua ghe ngo là hoạt động lễ hội giàu năng lượng',
      highlights: ['Ghe đẽo gỗ sao rực rỡ', 'Sức mạnh chèo đồng đội', 'Nhạc hội còi trống thúc giục'],
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      location: { lat: 9.7001, lng: 106.1254 },
    },
  ],
  
  articles: [
    {
      id: 'chuong-trinh-le-hoi',
      title: 'Sắc màu lễ hội Khmer Nam Bộ',
      category: 'Lễ hội',
      summary: 'Giới thiệu không khí lễ hội, nghi thức truyền thống và hoạt động cộng đồng',
      content: 'Lễ hội Khmer Nam Bộ là dịp để cộng đồng sum họp, thể hiện bản sắc văn hóa qua các nghi lễ truyền thống, múa hát, và ẩm thực đặc trưng.',
      author: 'Ban biên tập',
      date: '05/05/2026',
      coverImage: 'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'kien-truc-chua-khmer',
      title: 'Kiến trúc chùa Khmer trong không gian Nam Bộ',
      category: 'Kiến trúc',
      summary: 'Mô tả kiến trúc, trang trí và giá trị văn hóa của chùa Khmer',
      content: 'Chùa Khmer Nam Bộ mang đậm dấu ấn kiến trúc truyền thống với mái chùa nhiều tầng, hoa văn tinh xảo và không gian linh thiêng.',
      author: 'Nhóm nội dung',
      date: '05/05/2026',
      coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'am-thuc-truyen-thong',
      title: 'Ẩm thực truyền thống trong đời sống người Khmer',
      category: 'Ẩm thực',
      summary: 'Khám phá các món ăn đặc trưng của người Khmer Nam Bộ',
      content: 'Ẩm thực Khmer Nam Bộ phong phú với các món như bánh tét, cá kho, và các món canh chua đặc trưng.',
      author: 'Cộng tác viên',
      date: '05/05/2026',
      coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'nghe-thuat-ro-bam',
      title: 'Rô Băm và vai trò trong đời sống văn hóa Khmer',
      category: 'Nghệ thuật',
      summary: 'Nghệ thuật biểu diễn truyền thống Rô Băm',
      content: 'Rô Băm là loại hình nghệ thuật sân khấu truyền thống, kết hợp múa, hát và kể chuyện, phản ánh đời sống và tín ngưỡng của người Khmer.',
      author: 'Ban nội dung',
      date: '06/05/2026',
      coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'du-lich-cong-dong',
      title: 'Gợi ý tuyến tham quan cộng đồng Khmer Nam Bộ',
      category: 'Du lịch',
      summary: 'Hướng dẫn tham quan các điểm văn hóa Khmer',
      content: 'Khám phá các chùa, lễ hội và làng nghề truyền thống của cộng đồng Khmer Nam Bộ qua hành trình văn hóa đầy ý nghĩa.',
      author: 'Nhóm biên soạn',
      date: '06/05/2026',
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
  ],
};

async function uploadToFirebase() {
  console.log('🚀 Bắt đầu upload dữ liệu lên Firebase Firestore...\n');

  // Kiểm tra config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Lỗi: Thiếu Firebase config trong file .env');
    console.log('\n📝 Hãy đảm bảo file .env có các biến:');
    console.log('   EXPO_PUBLIC_FIREBASE_API_KEY=...');
    console.log('   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...');
    console.log('   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...');
    process.exit(1);
  }

  try {
    // Khởi tạo Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log(`✅ Đã kết nối Firebase Project: ${firebaseConfig.projectId}\n`);

    // Upload Categories
    console.log('📁 Đang upload Categories...');
    let batch = writeBatch(db);
    let count = 0;
    
    for (const category of data.categories) {
      const docRef = doc(db, 'categories', category.id);
      batch.set(docRef, {
        ...category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
      
      if (count % 500 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    await batch.commit();
    console.log(`✅ Đã upload ${data.categories.length} categories\n`);

    // Upload Heritages
    console.log('🏛️ Đang upload Heritages...');
    batch = writeBatch(db);
    count = 0;
    
    for (const heritage of data.heritages) {
      const docRef = doc(db, 'heritages', heritage.id);
      batch.set(docRef, {
        ...heritage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        published: true,
      });
      count++;
      
      if (count % 500 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    await batch.commit();
    console.log(`✅ Đã upload ${data.heritages.length} heritages\n`);

    // Upload Articles
    console.log('📝 Đang upload Articles...');
    batch = writeBatch(db);
    count = 0;
    
    for (const article of data.articles) {
      const docRef = doc(db, 'articles', article.id);
      batch.set(docRef, {
        ...article,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        published: true,
      });
      count++;
      
      if (count % 500 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    await batch.commit();
    console.log(`✅ Đã upload ${data.articles.length} articles\n`);

    console.log('🎉 HOÀN THÀNH! Tất cả dữ liệu đã được upload lên Firebase Firestore.');
    console.log('\n📊 Tổng kết:');
    console.log(`   - Categories: ${data.categories.length}`);
    console.log(`   - Heritages: ${data.heritages.length}`);
    console.log(`   - Articles: ${data.articles.length}`);
    console.log('\n✨ Kiểm tra dữ liệu tại:');
    console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi upload:', error.message);
    console.error('\n💡 Gợi ý:');
    console.log('   1. Kiểm tra Firebase config trong .env');
    console.log('   2. Đảm bảo Firestore đã được kích hoạt trong Firebase Console');
    console.log('   3. Kiểm tra quyền truy cập Firestore Rules');
    process.exit(1);
  }
}

// Chạy script
uploadToFirebase();
