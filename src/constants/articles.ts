export type ArticleItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  coverImage?: string;
  createdAt?: string;
};

export const articleItems: ArticleItem[] = [
  {
    id: 'sac-mau-le-hoi-khmer',
    title: 'Sắc màu lễ hội Khmer Nam Bộ',
    category: 'Lễ hội',
    summary: 'Giới thiệu không khí lễ hội, nghi thức truyền thống và hoạt động cộng đồng nổi bật.',
    content: 'Lễ hội của người Khmer Nam Bộ là sự giao thoa độc đáo giữa tín ngưỡng dân gian và Phật giáo Nam tông. Các ngày hội lớn như Chol Chnam Thmay, Sene Dolta và Ok Om Bok thu hút hàng vạn phật tử tham gia, thể hiện sự gắn kết cộng đồng sâu sắc qua các nghi lễ tắm Phật, cúng trăng, đua ghe ngo và các trò chơi dân gian đầy sức sống.',
    author: 'Ban biên tập',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'kien-truc-chua-khmer',
    title: 'Kiến trúc chùa Khmer trong không gian Nam Bộ',
    category: 'Kiến trúc',
    summary: 'Bài viết mô tả kiến trúc độc đáo, họa tiết trang trí Naga và giá trị văn hóa của chùa Khmer.',
    content: 'Chùa Khmer Nam Bộ không chỉ là nơi thờ tự mà còn là trung tâm sinh hoạt văn hóa của phum sóc. Mái chùa nhiều tầng uốn cong hình đuôi rồng thần Naga uốn lượn tượng trưng cho sự thịnh vượng. Các hàng cột, vách tường được điêu khắc tinh xảo các hình tượng chim thần Krud, tượng bốn mặt Bayon thể hiện thế giới quan Phật giáo sống động.',
    author: 'Nhóm nghiên cứu văn hóa',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:05:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'am-thuc-truyen-thong-khmer',
    title: 'Ẩm thực truyền thống trong đời sống người Khmer',
    category: 'Ẩm thực',
    summary: 'Khám phá hương vị đặc trưng, nguyên liệu thảo mộc bản địa và mắm Prahok huyền thoại.',
    content: 'Ẩm thực Khmer Nam Bộ nổi bật với sự hài hòa giữa vị chua, cay và ngọt thanh. Món ăn của người Khmer sử dụng rất nhiều rau thơm bản địa, lá chúc và đặc biệt là mắm Prahok (mắm bò hóc) làm gia vị cốt lõi mang đậm đà bản sắc sông nước Nam Bộ.',
    author: 'Võ Thị Mỹ Duyên',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:10:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ro-bam-van-hoa-khmer',
    title: 'Rô Băm và vai trò trong đời sống văn hóa Khmer',
    category: 'Nghệ thuật',
    summary: 'Sân khấu múa cổ điển Rô Băm với câu chuyện thần thoại sử thi Reamker.',
    content: 'Rô Băm là loại hình kịch múa cổ điển cung đình có lịch sử hàng ngàn năm của người Khmer. Các điệu múa uốn tay mềm dẻo của vũ nữ Apsara kết hợp với mặt nạ gỗ khắc họa các nhân vật hoàng tử, quỷ vương, tướng khỉ Hanuman kể lại cuộc chiến thiện - ác mang tính giáo dục nhân văn sâu sắc.',
    author: 'Nghệ nhân ưu tú',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:15:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'du-lich-cong-dong-khmer',
    title: 'Gợi ý tuyến tham quan cộng đồng Khmer Nam Bộ',
    category: 'Du lịch',
    summary: 'Tuyến hành trình khám phá các phum sóc cổ kính và thưởng ngoạn văn hóa bản địa.',
    content: 'Tuyến du lịch cộng đồng đưa du khách trải nghiệm đời sống của người Khmer tại Sóc Trăng và Trà Vinh. Du khách sẽ được tham quan các ngôi chùa cổ, học làm cốm dẹp, trải nghiệm dệt chiếu và thưởng thức bún nước lèo nóng hổi ngay tại phum sóc.',
    author: 'Hướng dẫn viên địa phương',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:20:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lich-su-chua-som-rong',
    title: 'Lịch sử hình thành và phát triển của Chùa Som Rông',
    category: 'Kiến trúc',
    summary: 'Hành trình phát triển từ ngôi chùa lá đơn sơ đến bảo tháp lộng lẫy uy nghi.',
    content: 'Chùa Som Rông được thành lập từ thế kỷ XV ban đầu bằng tre lá đơn sơ. Qua hàng trăm năm phát triển và trùng tu, chùa nay sở hữu khuôn viên rộng lớn với bảo tháp cao 32 mét lộng lẫy và tượng Phật Thích Ca nằm khổng lồ ngoài trời, trở thành biểu tượng kiến trúc tôn giáo hàng đầu tại Sóc Trăng.',
    author: 'Thạch Sa Phơ',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:25:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1608958416733-1492ba666e5f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'kham-pha-chua-doi-400-nam',
    title: 'Khám phá Chùa Dơi (Mã Tộc) 400 năm tuổi',
    category: 'Kiến trúc',
    summary: 'Tìm hiểu lịch sử cổ kính và sự kỳ lạ của đàn dơi quạ tại chùa Mã Tộc.',
    content: 'Chùa Mã Tộc hay còn gọi là Chùa Dơi được xây dựng vào khoảng thế kỷ XVI. Ngôi chùa nổi tiếng với đàn dơi quạ khổng lồ cư ngụ tự nhiên trên các tán cây dầu cổ thụ. Kiến trúc chùa mang đậm phong cách Nam tông Khmer cổ kính với mái ngói cong vuốt rực rỡ và những bích họa Phật giáo quý giá.',
    author: 'Nguyễn Thị Hoa',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:30:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'thap-co-oc-eo-ba-the',
    title: 'Tháp cổ Óc Eo và dấu tích vương quốc Phù Nam',
    category: 'Kiến trúc',
    summary: 'Những hiện vật khảo cổ học quý báu minh chứng nền văn minh rực rỡ 2000 năm trước.',
    content: 'Khu di tích Óc Eo tại An Giang lưu giữ những tháp gạch và nền móng đền đài cổ xưa của vương quốc Phù Nam. Các hiện vật khai quật được như tượng đá sa thạch, trang sức vàng, đồng tiền La Mã cổ đại minh chứng cho thương cảng Óc Eo sầm uất từng kết nối thế giới hàng hải quốc tế cổ đại.',
    author: 'TS. Lê Minh Quốc',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:35:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1608958416733-1492ba666e5f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lang-nghe-det-chieu-phu-tan',
    title: 'Làng nghề dệt chiếu truyền thống Khmer Sóc Trăng',
    category: 'Cộng đồng',
    summary: 'Nét đẹp lao động của nghệ nhân phum sóc giữ hồn nghề dệt chiếu thủ công.',
    content: 'Làng nghề dệt chiếu tại xã Phú Tân, huyện Châu Thành dệt nên những tấm chiếu màu sắc rực rỡ bằng sợi lác tự nhiên nhuộm củ nghệ và cây rừng. Những tấm chiếu có hoa văn hình thoi, sóng nước tinh xảo không chỉ phục vụ đời sống mà còn mang giá trị văn hóa độc đáo của dân tộc Khmer.',
    author: 'Phạm Thị Lan',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:40:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'nghi-le-cung-trang-ok-om-bok',
    title: 'Nghi lễ cúng trăng trong lễ hội Ok Om Bok',
    category: 'Lễ hội',
    summary: 'Tìm hiểu nghi thức tạ ơn thần Mặt Trăng và tục đút cốm dẹp cầu chúc trẻ nhỏ.',
    content: 'Nghi lễ cúng trăng diễn ra vào đêm rằm tháng 10 âm lịch khi trăng lên đỉnh đầu. Người dân bày cúng cốm dẹp, trái cây, hoa quả và làm lễ tạ ơn Mặt Trăng đã điều hòa thời tiết mang lại mùa màng no ấm. Sau đó, bô lão sẽ đút cốm dẹp cho trẻ em và hỏi mong ước để chúc phúc cho thế hệ trẻ phum sóc.',
    author: 'Ban biên tập',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:45:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'suc-song-nghe-thuat-ro-bam',
    title: 'Sức sống của sân khấu cổ điển Rô Băm ngày nay',
    category: 'Nghệ thuật',
    summary: 'Sự nỗ lực truyền dạy kịch múa Rô Băm cho thế hệ trẻ của các nghệ nhân tâm huyết.',
    content: 'Trải qua nhiều biến thiên lịch sử, nghệ thuật múa Rô Băm vẫn được bảo tồn và giữ lửa nhờ các nghệ nhân truyền dạy lớp học chữ và múa cổ tại Trà Vinh. Những vũ điệu uyển chuyển rực rỡ sắc màu trang phục truyền thống tiếp tục được trình diễn trong các mùa lễ hội phum sóc.',
    author: 'Nguyễn Văn Dũng',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:50:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'nhac-ngu-am-pinpeat',
    title: 'Nghệ thuật Đờn ca tài tử Khmer và Nhạc ngũ âm',
    category: 'Nghệ thuật',
    summary: 'Dàn nhạc ngũ âm Pinpeat và âm điệu rộn ràng trong các nghi lễ trang trọng.',
    content: 'Dàn nhạc ngũ âm (Pinpeat) của người Khmer gồm 5 nhóm nhạc cụ làm từ các chất liệu đồng, sắt, gỗ, da và hơi thở (sáo). Đây là linh hồn âm nhạc của mọi lễ hội tại chùa Khmer, hòa quyện tạo nên giai điệu rộn ràng, linh thiêng dẫn dắt các điệu múa và nghi lễ tôn giáo truyền thống.',
    author: 'GS. Trần Văn Bình',
    date: '04/06/2026',
    createdAt: '2026-06-04T08:55:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'y-nghia-tet-chol-chnam-thmay',
    title: 'Ý nghĩa ngày Tết cổ truyền Chol Chnam Thmay',
    category: 'Lễ hội',
    summary: 'Lễ hội đón năm mới bước vào mùa vụ gieo cấy lúa mới của người Khmer.',
    content: 'Chol Chnam Thmay là ngày Tết đón năm mới lớn nhất của người Khmer Nam Bộ diễn ra giữa tháng 4 dương lịch. Ba ngày tết là thời điểm người dân rước thần Maha Songkran, dâng cơm chúc phúc cho các sư sãi, làm lễ đắp núi cát cầu duyên và tắm tượng Phật cầu an lành thịnh vượng.',
    author: 'Kim Sokha',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mon-banh-gung-cuoi-hoi',
    title: 'Món bánh gừng truyền thống trong đám cưới Khmer',
    category: 'Ẩm thực',
    summary: 'Bánh gừng ngọt ngào - biểu tượng của tình yêu thủy chung son sắt vợ chồng.',
    content: 'Bánh gừng (Num Khnhei) làm từ bột nếp, trứng gà và đường thốt nốt, được chiên giòn và áo một lớp đường vàng óng tạo hình củ gừng độc đáo. Món bánh ngọt ngào này xuất hiện trang trọng trong các mâm quả cưới hỏi Khmer, gửi gắm ước nguyện thủy chung và đầm ấm của đôi lứa.',
    author: 'Thạch Thị Sary',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:05:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'le-hoi-sene-dolta-hieu-nghia',
    title: 'Lễ hội Đôn-ta (Sene Dolta) và đạo lý hiếu nghĩa',
    category: 'Lễ hội',
    summary: 'Ngày giỗ tập thể tưởng nhớ tổ tiên và tục dâng cơm cúng chùa truyền thống.',
    content: 'Lễ hội Sene Dolta diễn ra vào cuối tháng 8 âm lịch nhằm cúng tế tưởng nhớ công ơn tổ tiên và ông bà đã khuất. Con cháu tề tựu chuẩn bị mâm cúng thịnh soạn dâng lên ban thờ gia tiên và mang cơm cúng dường lên chùa, củng cố tình cảm gia đình và phum sóc khăng khít.',
    author: 'Ban biên tập',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:10:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'tieng-dan-chapey-dong-veng',
    title: 'Nghệ thuật Chapei Don Ca - Tiếng đàn ca tự sự',
    category: 'Nghệ thuật',
    summary: 'Tiếng đàn Chapey trầm bổng đi sâu vào đời sống tinh thần của đồng bào.',
    content: 'Chapei Don Ca (Chapey Dong Veng) là di sản phi vật thể nhân loại. Nghệ sĩ biểu diễn độc tấu chiếc đàn Chapey hai dây kết hợp với lời ca tự sự ứng khẩu sâu sắc giảng giải đạo lý làm người, ca ngợi tình yêu quê hương đất nước và răn dạy thế hệ trẻ cách sống lương thiện.',
    author: 'Nghệ nhân Thạch Sên',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:15:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'le-danh-y-ca-sa-kathina',
    title: 'Lễ hội Kathina - Nghi lễ dâng y cà sa của Phật giáo',
    category: 'Lễ hội',
    summary: 'Nghi lễ dâng y phục cà sa cúng dường chư tăng kết thúc mùa an cư kiết hạ.',
    content: 'Lễ hội Kathina là ngày hội quyên góp y phục cà sa mới và các nhu yếu phẩm sinh hoạt dâng lên các vị sư sãi sau 3 tháng an cư kiết hạ tại chùa. Nghi lễ tạo phước đức to lớn cho gia đình phật tử và mang lại không khí diễu hành trang trọng rực rỡ khắp nẻo đường phum sóc.',
    author: 'Ban nội dung',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:20:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1608976478549-3652f4007b7b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bun-nuoc-leo-soc-trang',
    title: 'Bún nước lèo Sóc Trăng - Hương vị đậm đà Nam Bộ',
    category: 'Ẩm thực',
    summary: 'Khám phá món bún trứ danh hòa quyện giữa ba dân tộc Kinh - Hoa - Khmer.',
    content: 'Bún nước lèo Sóc Trăng nổi tiếng bởi nước dùng ngọt lịm từ cá lóc đồng, sả riềng thơm nức và gia vị cốt lõi là mắm Prahok Khmer đặc trưng. Tô bún ăn kèm rau muống chẻ, giá đỗ, bắp chuối và thịt heo quay Hoa tạo nên sự giao thoa ẩm thực Kinh - Hoa - Khmer đậm nét.',
    author: 'Võ Thị Mỹ Duyên',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:25:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ky-thuat-xay-chua-naga',
    title: 'Kỹ thuật xây tháp đá và chạm khắc Naga cổ đại',
    category: 'Kiến trúc',
    summary: 'Kỹ thuật điêu khắc phù điêu đá tỉ mỉ của nghệ nhân Khmer Nam Bộ xưa.',
    content: 'Nghệ thuật kiến trúc Khmer đặc trưng bởi kỹ thuật xây đền tháp bằng đá sa thạch kết dính tự nhiên và chạm khắc phù điêu Naga, thần Garuda vô cùng tỉ mỉ. Các hình tượng rồng 3 đầu, 5 đầu uốn quanh các mái chùa hay đầu cột chánh điện thể hiện kỹ nghệ điêu khắc gỗ đá đỉnh cao.',
    author: 'Nhóm nghiên cứu kiến trúc',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:30:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'com-dep-tron-dua-du-vi',
    title: 'Làng nghề làm cốm dẹp truyền thống ở Trà Vinh',
    category: 'Cộng đồng',
    summary: 'Làng nghề giã cốm dẹp thơm dẻo dâng cúng tạ ơn thần Mặt Trăng.',
    content: 'Cốm dẹp được giã thủ công từ nếp non rang nóng trên chảo đất nung của đồng bào Khmer Trà Vinh. Hạt nếp sau khi giã dẹp được đãi vỏ trấu, trộn với dừa nạo và đường thốt nốt ngọt thanh, dẻo bùi tạo nên lễ vật dâng cúng Trăng linh thiêng không thể thiếu trong lễ Ok Om Bok.',
    author: 'Lâm Minh Hoàng',
    date: '04/06/2026',
    createdAt: '2026-06-04T09:35:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  },
];

export function getArticleById(id: string) {
  return articleItems.find((item) => item.id === id);
}

export function getArticleCover(coverImage?: string, category?: string): string {
  if (coverImage && coverImage.trim().length > 0) return coverImage.trim();
  
  const cat = (category || '').trim().toLowerCase();
  switch (cat) {
    case 'lễ hội':
    case 'lễ hội truyền thống':
    case 'festival':
      return 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80';
    case 'kiến trúc':
    case 'kiến trúc tôn giáo':
    case 'architecture':
      return 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80';
    case 'ẩm thực':
    case 'cuisine':
    case 'food':
      return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80';
    case 'nghệ thuật':
    case 'nghệ thuật truyền thống':
    case 'art':
      return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80';
    case 'cộng đồng':
    case 'community':
      return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
    case 'du lịch':
    case 'travel':
      return 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=600&q=80';
    default:
      return 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80';
  }
}