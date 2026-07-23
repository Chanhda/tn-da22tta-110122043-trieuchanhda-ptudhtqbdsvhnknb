/**
 * Seed 10 bài viết về di sản vật thể và phi vật thể Khmer Nam Bộ lên Firestore
 * Chạy: node scripts/seed-articles.js
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../khmerapp-9895c-firebase-adminsdk-fbsvc-c52a5dc7fe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: 'khmerapp-9895c',
});

const db = admin.firestore();

// ─────────────────────────────────────────────
// 10 BÀI VIẾT DI SẢN KHMER NAM BỘ
// ─────────────────────────────────────────────
const articles = [
  // ── DI SẢN VẬT THỂ ──────────────────────────
  {
    id: 'chua-som-rong-soc-trang',
    title: 'Chùa Som Rong – Kiệt tác kiến trúc Phật giáo Nam Tông Khmer',
    category: 'Kiến trúc',
    summary:
      'Chùa Som Rong tọa lạc tại thành phố Sóc Trăng là một trong những ngôi chùa Khmer lớn và đẹp nhất vùng Nam Bộ, nổi tiếng với tháp lớn cao 32 mét và những công trình điêu khắc tinh xảo.',
    content: `Chùa Som Rong (hay còn gọi là Chrôi Tăng Chrôm) tọa lạc tại đường Tôn Đức Thắng, phường 5, thành phố Sóc Trăng. Đây là một trong những ngôi chùa Khmer Nam Tông tiêu biểu và hoành tráng bậc nhất ở vùng đồng bằng sông Cửu Long.

Ngôi chùa được xây dựng từ thế kỷ XV và đã qua nhiều lần trùng tu, tôn tạo. Điểm nhấn ấn tượng nhất của chùa Som Rong là tháp lớn cao 32 mét được xây dựng theo kiến trúc Khmer truyền thống, với các tầng thu dần về phía đỉnh, trang trí bằng hoa văn phong phú và tượng thần Garuda.

Khuôn viên chùa rộng lớn với nhiều công trình kiến trúc độc đáo: chánh điện thờ Phật Thích Ca, nhà hội trường, tháp đựng cốt và khu vực học kinh Pali của các sư sãi. Mái chùa được lợp ngói màu đỏ và vàng, uốn cong theo kiểu truyền thống Khmer với các đầu đao vươn cao.

Nội thất chánh điện được trang trí bằng những bức tranh tường mô tả cuộc đời Đức Phật Thích Ca và các câu chuyện Jataka. Tượng Phật chính được đúc bằng đồng, sơn vàng rực rỡ, đặt trên bệ đá cao.

Chùa Som Rong còn là trung tâm sinh hoạt văn hóa, tôn giáo của cộng đồng người Khmer Sóc Trăng. Hằng năm, vào các dịp lễ lớn như Tết Chol Chnam Thmay, lễ Sene Dolta hay lễ Ok Om Bok, hàng ngàn phật tử về đây dự lễ và vui hội.`,
    author: 'Ban biên tập Khmer Heritage',
    date: '10/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 1842,
    likes: 312,
  },
  {
    id: 'chua-doi-bac-lieu',
    title: 'Chùa Dơi (Mã Tộc) – Ngôi chùa 400 tuổi của người Khmer Sóc Trăng',
    category: 'Kiến trúc',
    summary:
      'Chùa Mã Tộc (Chùa Dơi) là di tích lịch sử cấp quốc gia, nổi tiếng không chỉ vì kiến trúc Phật giáo Khmer cổ kính mà còn bởi đàn dơi quý hàng chục ngàn con cư trú trong vườn cây cổ thụ bao quanh chùa.',
    content: `Chùa Mã Tộc, dân gian thường gọi là "Chùa Dơi", tọa lạc tại đường Văn Ngọc Chính, phường 3, thành phố Sóc Trăng. Ngôi chùa có lịch sử trên 400 năm, là một trong những ngôi chùa Khmer cổ nhất và nổi tiếng nhất ở miền Tây Nam Bộ.

Điều kỳ lạ làm nên danh tiếng của Chùa Dơi chính là đàn dơi quạ (dơi ngựa lớn) khổng lồ với hàng chục ngàn con sinh sống trong vườn cây cổ thụ bao quanh chùa. Những con dơi này có sải cánh lên đến 1,5m, treo lủng lẳng trên các nhánh cây suốt ngày và chỉ bay đi kiếm ăn vào buổi chiều tối. Điều đặc biệt là chúng sống cộng sinh hòa bình với con người từ hàng trăm năm nay.

Về mặt kiến trúc, chùa Mã Tộc mang đậm phong cách Phật giáo Nam Tông Khmer với chánh điện đặt trên nền cao, mái ngói đỏ nhiều tầng uốn cong, các đầu đao hình rắn Naga và tượng thần Garuda trang trí. Nội thất chánh điện lưu giữ nhiều cổ vật quý như tượng Phật bằng đá, đồng và gỗ quý có niên đại hàng trăm năm.

Khuôn viên chùa được xây bao quanh bởi tường thấp, bên trong có nhiều cây cổ thụ bóng mát, tạo nên không gian thanh tịnh và linh thiêng. Khu vực trường học dạy chữ Khmer và kinh Pali cũng được duy trì hoạt động, góp phần bảo tồn văn hóa truyền thống.

Chùa Mã Tộc được Nhà nước công nhận là Di tích Lịch sử - Văn hóa cấp Quốc gia năm 1999 và là một trong những điểm du lịch không thể bỏ qua khi đến Sóc Trăng.`,
    author: 'Nguyễn Thị Hoa',
    date: '15/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 2341,
    likes: 489,
  },
  {
    id: 'thap-banh-an-tra-vinh',
    title: 'Tháp Bà Đen và Khu di tích Ăngkor Borei tại Trà Vinh',
    category: 'Kiến trúc',
    summary:
      'Khu di tích khảo cổ tại Trà Vinh lưu giữ dấu tích của nền văn minh tiền Angkor với những tháp gạch cổ đại, hiện vật đá quý và di chỉ cư trú từ thế kỷ VI-IX sau Công nguyên.',
    content: `Trà Vinh là tỉnh có mật độ chùa Khmer cao nhất cả nước với hơn 140 ngôi chùa, và cũng là nơi lưu giữ nhiều di tích khảo cổ có giá trị từ thời kỳ tiền Angkor. Những công trình này là bằng chứng về sự hiện diện của nền văn minh Óc Eo – văn hóa Phù Nam và Chân Lạp sớm tại vùng đất Nam Bộ.

Các tháp gạch cổ tại Trà Vinh được xây dựng chủ yếu từ thế kỷ VI đến IX sau Công nguyên, thuộc thời kỳ Chân Lạp (tiền thân của đế chế Angkor). Kỹ thuật xây gạch của người Khmer cổ đặc biệt ở chỗ không dùng vữa liên kết – các viên gạch được mài phẳng và xếp khít lên nhau, chất kết dính là nhựa cây tự nhiên. Điều này khiến những ngôi tháp này bền vững qua hàng nghìn năm.

Tại khu di tích Ăngkor Borei (vùng biên giới Trà Vinh - Bến Tre), các nhà khảo cổ đã tìm thấy nhiều hiện vật quý như tượng thần Vishnu, tượng Nữ thần Lakshmi bằng đá sa thạch, các đồ gốm sứ tráng men và trang sức vàng bạc. Những hiện vật này hiện được lưu giữ tại Bảo tàng Trà Vinh và Bảo tàng Lịch sử Thành phố Hồ Chí Minh.

Di tích Chùa Hang (Kompong Chrây) tại xã Đại An, huyện Trà Cú là một trong những địa điểm khảo cổ quan trọng, nơi phát lộ nhiều di vật thời Chân Lạp và là bằng chứng về sự giao thoa văn hóa Ấn Độ - Khmer trong lịch sử.

Hiện nay, các di tích tại Trà Vinh đang được các nhà khoa học trong và ngoài nước nghiên cứu, bảo tồn và đã được đề nghị xếp hạng Di tích Quốc gia đặc biệt.`,
    author: 'GS. Trần Văn Bình',
    date: '18/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1470076892663-af684e5e15af?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 978,
    likes: 143,
  },
  {
    id: 'khu-di-tich-oc-eo-an-giang',
    title: 'Khu di tích Óc Eo – Nền văn minh cổ đại ở An Giang',
    category: 'Kiến trúc',
    summary:
      'Di tích Óc Eo tại An Giang là một trong những khu khảo cổ quan trọng nhất Đông Nam Á, lưu giữ dấu tích của vương quốc Phù Nam cách đây hơn 2000 năm với những hệ thống kênh đào kỳ vĩ và hiện vật vàng bạc quý hiếm.',
    content: `Di tích Óc Eo – Ba Thê tọa lạc tại huyện Thoại Sơn, tỉnh An Giang, được phát hiện lần đầu vào năm 1942 bởi nhà khảo cổ học người Pháp Louis Malleret. Đây là khu di tích khảo cổ học đặc biệt quan trọng của Việt Nam và khu vực Đông Nam Á.

Óc Eo từng là thương cảng sầm uất của vương quốc Phù Nam (thế kỷ I-VII sau CN), nằm trong mạng lưới thương mại hàng hải quốc tế kết nối La Mã, Ấn Độ, Trung Hoa và Đông Nam Á. Những đồng tiền vàng La Mã, huy hiệu của Hoàng đế Antoninus Pius (thế kỷ II) và nhiều hiện vật từ Ấn Độ, Ba Tư được tìm thấy tại đây là minh chứng cho sự phát triển thương mại quốc tế của Phù Nam.

Hệ thống kênh đào tại Óc Eo cho thấy trình độ kỹ thuật thủy lợi rất cao của người Phù Nam xưa. Một số kênh đào dài hàng chục km, đóng vai trò vừa là đường giao thông thủy vừa là hệ thống thoát lũ và tưới tiêu. Đây là công trình thủy lợi cổ đại quy mô lớn nhất được biết đến tại Đông Nam Á.

Các hiện vật quý được tìm thấy bao gồm: tượng thần Vishnu, Shiva, Ganesha bằng đá và đồng; trang sức vàng bạc tinh xảo; đồ gốm sứ nhiều chủng loại; và đặc biệt là các con dấu bằng đá khắc chữ cổ Sanskrit. Bảo tàng Óc Eo tại An Giang hiện lưu giữ hàng nghìn hiện vật từ khu di tích này.

Năm 2012, Thủ tướng Chính phủ đã ký quyết định xếp hạng Di tích Óc Eo – Ba Thê là Di tích Quốc gia đặc biệt. Đây cũng là ứng cử viên của Việt Nam để đề nghị UNESCO công nhận là Di sản Văn hóa Thế giới.`,
    author: 'TS. Lê Minh Quốc',
    date: '20/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1562625964-ffe9b2f617bc?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 1523,
    likes: 287,
  },
  {
    id: 'lang-mo-nguoi-khmer-soc-trang',
    title: 'Làng nghề dệt chiếu và đan lát truyền thống người Khmer Sóc Trăng',
    category: 'Nghệ thuật',
    summary:
      'Làng nghề dệt chiếu và đan lát thủ công tại các phum sóc Khmer Sóc Trăng là di sản văn hóa vật thể độc đáo, nơi người dân vẫn gìn giữ kỹ thuật truyền thống hàng trăm năm với những hoa văn đặc trưng của dân tộc Khmer.',
    content: `Nghề dệt chiếu truyền thống và đan lát thủ công là một phần không thể tách rời trong đời sống vật chất và văn hóa của đồng bào Khmer Nam Bộ, đặc biệt tại tỉnh Sóc Trăng. Những sản phẩm này không chỉ mang giá trị sử dụng mà còn là tác phẩm nghệ thuật phản ánh thẩm mỹ và bản sắc văn hóa Khmer.

Chiếu Khmer được dệt từ lác (cói) – một loại thực vật mọc tự nhiên ở vùng đồng bằng ngập nước. Trước khi dệt, lác được phơi khô, nhuộm màu bằng các loại thực vật tự nhiên như củ nghệ (vàng), vỏ cây sòi (nâu đỏ), lá chàm (xanh). Hoa văn trên chiếu Khmer thường là hình thoi, hình sóng nước, hoa lá và các họa tiết Phật giáo như hoa sen, bánh xe Dharma.

Tại xã Phú Tân, huyện Châu Thành, Sóc Trăng, nhiều gia đình vẫn duy trì khung dệt chiếu thủ công truyền thống. Người dệt thường ngồi trên sàn nhà, điều khiển các cần gỗ để luồn sợi lác qua nhau theo họa tiết định sẵn. Mỗi tấm chiếu có thể mất từ vài ngày đến cả tuần để hoàn thành tùy theo kích cỡ và độ phức tạp của hoa văn.

Đan lát là nghề bổ sung quan trọng, tạo ra các vật dụng hàng ngày như thúng, mủng, giỏ, nón lá, bình đựng nước bằng tre, nứa và mây. Đặc biệt, những chiếc nón lá của phụ nữ Khmer có hình dạng và họa tiết trang trí riêng biệt, khác với nón lá của người Kinh.

Ngày nay, các làng nghề này đang đối mặt với nguy cơ mai một do sự cạnh tranh của hàng công nghiệp. Tỉnh Sóc Trăng đang nỗ lực bảo tồn bằng cách tổ chức lớp học nghề, hỗ trợ đầu ra sản phẩm và đưa làng nghề vào tour du lịch cộng đồng.`,
    author: 'Phạm Thị Lan',
    date: '22/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 734,
    likes: 98,
  },

  // ── DI SẢN PHI VẬT THỂ ──────────────────────
  {
    id: 'le-hoi-ok-om-bok',
    title: 'Lễ hội Ok Om Bok – Lễ cúng trăng độc đáo của người Khmer',
    category: 'Lễ hội',
    summary:
      'Ok Om Bok (lễ cúng trăng) là một trong ba lễ hội lớn nhất của người Khmer Nam Bộ, diễn ra vào rằm tháng 10 âm lịch với nghi thức dâng cốm dẹp lên mặt trăng và hội đua ghe Ngo náo nhiệt trên sông.',
    content: `Ok Om Bok (tiếng Khmer có nghĩa là "đút cốm dẹp") là lễ hội truyền thống quan trọng bậc nhất của người Khmer Nam Bộ, được tổ chức vào đêm rằm tháng 10 âm lịch hằng năm. Lễ hội này vừa mang tính chất tôn giáo – cúng tạ ơn thần Mặt Trăng đã ban mưa thuận gió hòa cho mùa màng – vừa là ngày hội vui tươi của cộng đồng.

Phần lễ cúng trăng diễn ra vào lúc trăng lên đỉnh đầu. Bàn cúng được đặt ngoài sân, trên đó bày cốm dẹp (loại gạo nếp non rang chín giã dẹp, trộn đường dừa), dừa, chuối, khoai và các loại hoa quả địa phương. Ông bà lớn tuổi trong phum sóc làm chủ lễ, đọc kinh cầu nguyện rồi lấy cốm dẹp nhét vào miệng trẻ em với ước nguyện các cháu sẽ mạnh khỏe, học giỏi trong năm mới.

Phần hội đặc sắc nhất là đua ghe Ngo – môn thể thao thủy dân tộc đặc trưng của người Khmer. Ghe Ngo là loại thuyền độc mộc dài từ 22-29m, sức chứa 40-60 tay chèo. Mỗi chùa Khmer trong phum sóc đều có ghe Ngo riêng được thờ tại chùa và chỉ hạ thủy vào dịp lễ Ok Om Bok. Cuộc đua diễn ra trên sông Maspero (Sóc Trăng) hoặc sông Cổ Chiên (Trà Vinh) với hàng trăm nghìn khán giả cổ vũ hai bên bờ.

Trong những ngày hội, các phum sóc còn tổ chức thả đèn gió, múa lâm thon, hát Aday và nhiều trò chơi dân gian truyền thống. Không khí vừa trang nghiêm, vừa rộn ràng, tạo nên bức tranh văn hóa đặc sắc của cộng đồng Khmer Nam Bộ.

Năm 2014, Bộ Văn hóa, Thể thao và Du lịch đã đưa Lễ hội Ok Om Bok – Đua ghe Ngo vào danh mục Di sản văn hóa phi vật thể quốc gia.`,
    author: 'Ban biên tập Khmer Heritage',
    date: '05/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1524412529636-bb435f6c2d1d?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 3241,
    likes: 678,
  },
  {
    id: 'mua-ro-bam-nghe-thuat-san-khau',
    title: 'Rô Băm – Nghệ thuật múa sân khấu cổ điển Khmer hàng nghìn năm tuổi',
    category: 'Nghệ thuật',
    summary:
      'Rô Băm là loại hình nghệ thuật sân khấu múa cổ điển của người Khmer, có nguồn gốc từ cung đình Angkor, kể những câu chuyện thần thoại và sử thi thông qua điệu múa cách điệu tinh tế và trang phục lộng lẫy.',
    content: `Rô Băm (Khmer: រោបាំ) là nghệ thuật múa sân khấu cổ điển truyền thống của người Khmer, được xem là di sản văn hóa phi vật thể vô giá. Loại hình nghệ thuật này có nguồn gốc từ múa cung đình của triều đình Angkor cách đây hơn 1000 năm, khi các vũ nữ (Apsara) biểu diễn trước nhà vua và thần linh.

Nội dung của Rô Băm thường là những câu chuyện lấy từ sử thi Reamker (phiên bản Khmer của Ramayana), câu chuyện về các vị thần Hindu như Vishnu, Indra, và những truyền thuyết dân gian Khmer. Các nhân vật trong Rô Băm chia thành ba loại: thiện nhân (thường đội mũ vàng, mặc trang phục đính kim tuyến), ác nhân (mang mặt nạ hung dữ) và nhân vật hài hước (mặc trang phục sặc sỡ).

Điệu múa Rô Băm đặc trưng bởi các động tác tay và ngón tay cách điệu cao độ, gọi là "sam peur" – mỗi tư thế tay mang một ý nghĩa biểu tượng riêng như hoa sen nở, chim phượng múa hay nước chảy. Diễn viên phải học múa từ nhỏ, trải qua nhiều năm luyện tập để làm chủ các kỹ thuật khó như uốn ngón tay ngược, di chuyển tinh tế và biểu cảm khuôn mặt.

Trang phục Rô Băm là một trong những nét đặc sắc nhất – bộ phục trang của mỗi nhân vật gồm hàng chục phụ kiện thủ công tinh xảo: mũ đội đầu bằng vàng bạc giả đính đá quý, áo thêu kim tuyến, váy xếp nhiều tầng, vòng tay, vòng cổ và hoa tai. Một bộ trang phục Rô Băm đầy đủ có thể nặng tới 10-15 kg.

Ngày nay, Rô Băm được UNESCO công nhận là Di sản văn hóa phi vật thể cần được bảo vệ khẩn cấp. Tại Sóc Trăng và Trà Vinh, một số câu lạc bộ nghệ thuật và trường nghề đang nỗ lực truyền dạy Rô Băm cho thế hệ trẻ.`,
    author: 'Nguyễn Văn Dũng',
    date: '08/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 2109,
    likes: 445,
  },
  {
    id: 'hat-aday-dan-gian-khmer',
    title: 'Hát Aday – Loại hình đối đáp dân gian trữ tình của người Khmer',
    category: 'Nghệ thuật',
    summary:
      'Aday là nghệ thuật hát đối đáp dân gian đặc sắc của người Khmer Nam Bộ, nơi hai diễn viên nam nữ ứng khẩu tức thì những câu thơ trào lộng, trữ tình xen lẫn triết lý sống, thường biểu diễn trong các dịp lễ hội.',
    content: `Aday (Khmer: អ័ yday) là loại hình nghệ thuật biểu diễn dân gian đặc trưng của người Khmer Nam Bộ, mang tính ứng tấu cao và đậm chất trào phúng. Tên gọi "Aday" xuất phát từ tiếng Pali "aday" có nghĩa là "tức thì" hay "ngay lập tức", phản ánh đặc điểm quan trọng nhất của loại hình nghệ thuật này – tính ứng khẩu tức thì.

Aday thường được biểu diễn bởi một cặp đôi nam nữ (không nhất thiết phải là cặp đôi thực tế) đứng đối mặt nhau trên sân khấu hoặc giữa đám đông. Họ thay nhau hát những câu thơ lục bát Khmer ứng tấu, bình luận về cuộc sống hàng ngày, trêu chọc lẫn nhau, kể chuyện tình yêu hay phản ánh các vấn đề xã hội. Người hát giỏi là người có khả năng ứng khẩu nhanh, lời lẽ thú vị, hóm hỉnh và không bao giờ để "tắt lời".

Giai điệu của Aday khá đặc biệt – không theo một cung điệu cố định mà linh hoạt tùy theo nội dung và cảm xúc. Tiếng đàn Chapei (đàn bầu Khmer) hay Tro (đàn nhị Khmer) thường đệm theo tạo nền âm nhạc.

Nội dung lời hát Aday rất phong phú: từ những câu tán tỉnh dí dỏm, những câu triết lý về cuộc sống đến những lời phê phán nhẹ nhàng các thói hư tật xấu. Đặc biệt, trong các đám cưới Khmer, Aday là phần biểu diễn không thể thiếu, giúp không khí lễ hội thêm vui tươi, rộn ràng.

Hiện nay, Aday đang đứng trước nguy cơ thất truyền do thiếu nghệ nhân và ít người học. Tỉnh Sóc Trăng và Trà Vinh đang thực hiện các chương trình ghi âm, lưu trữ và truyền dạy Aday cho thế hệ trẻ trong các trường học và phum sóc.`,
    author: 'Thạch Thị Sary',
    date: '12/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 867,
    likes: 134,
  },
  {
    id: 'tet-chol-chnam-thmay',
    title: 'Tết Chol Chnam Thmay – Năm mới truyền thống của người Khmer',
    category: 'Lễ hội',
    summary:
      'Chol Chnam Thmay là Tết cổ truyền của người Khmer, diễn ra vào tháng 4 dương lịch (tháng Chét âm lịch Khmer), với các nghi lễ rước Preah Thong, tắm Phật, dâng cơm sư và nhiều trò chơi dân gian truyền thống.',
    content: `Chol Chnam Thmay (tiếng Khmer có nghĩa là "bước vào năm mới") là lễ hội lớn nhất trong năm của người Khmer, tương đương với Tết Nguyên Đán của người Kinh hay Tết Songkran của Thái Lan. Lễ hội thường diễn ra từ ngày 13-15 tháng 4 dương lịch, kéo dài 3 ngày với nhiều nghi thức trang trọng và vui chơi náo nhiệt.

Ngày đầu tiên (Maha Songkran) là ngày nghênh đón năm mới. Người dân tắm gội sạch sẽ, mặc quần áo mới, đến chùa thắp hương cầu nguyện. Đặc biệt là nghi thức rước Preah Thong – hình tượng vị thần mang năm mới từ thiên đàng xuống trần gian. Bàn thờ thiên bày biện công phu với hoa quả, bánh trái và đèn nến.

Ngày thứ hai (Virak Wanabat) là ngày dâng cơm cho sư sãi và tổ tiên. Các gia đình gói bánh Num Ansam (bánh tét Khmer) dâng lên chùa cúng dường, sau đó cùng các sư sãi tụng kinh hồi hướng công đức cho người đã khuất. Đây cũng là ngày tổ chức các trò chơi dân gian như kéo co, đẩy gậy, thả diều và bịt mắt đánh trống.

Ngày thứ ba (Laeung Sak) là ngày tắm Phật và tắm cho ông bà cha mẹ để tỏ lòng hiếu thảo. Nghi thức "tắm Phật" thực chất là rưới nước thơm pha hương hoa lên tượng Phật, cầu nguyện bình an cho gia đình. Con cháu cũng rưới nước thơm lên tay cha mẹ, ông bà như một cách bày tỏ lòng biết ơn.

Trong suốt 3 ngày tết, tiếng nhạc Trống Skor (trống lớn), kèn Sralai (kèn Khmer) và đàn Roneat (đàn tranh Khmer) vang lên không ngừng, hòa cùng tiếng cười nói rộn ràng của cộng đồng.`,
    author: 'Kim Sokha',
    date: '01/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 4567,
    likes: 892,
  },
  {
    id: 'am-thuc-truyen-thong-khmer',
    title: 'Ẩm thực truyền thống Khmer Nam Bộ – Tinh hoa từ đất và nước',
    category: 'Ẩm thực',
    summary:
      'Ẩm thực Khmer Nam Bộ mang đặc trưng riêng với việc sử dụng nhiều loại thảo mộc bản địa, kỹ thuật chế biến độc đáo và những món ăn gắn liền với nghi lễ tôn giáo như bánh Num Ansam, cốm dẹp và mắm Prahok.',
    content: `Ẩm thực của người Khmer Nam Bộ là sự hòa quyện giữa truyền thống nông nghiệp lúa nước, văn hóa Phật giáo và sự phong phú của thiên nhiên nhiệt đới. Khác với ẩm thực người Kinh, ẩm thực Khmer thiên về việc sử dụng nhiều loại thảo mộc và rau thơm bản địa, ít dầu mỡ và có vị chua nhẹ đặc trưng.

Mắm Prahok (tiếng Khmer: ប្រហក់) là "gia vị quốc hồn quốc túy" của ẩm thực Khmer. Đây là loại mắm cá lên men đặc sánh, được làm từ cá lóc hoặc cá rô đồng qua quy trình lên men 3-6 tháng. Prahok có mùi nồng đặc trưng nhưng là thứ gia vị không thể thiếu trong rất nhiều món ăn Khmer, từ nước chấm đến các món xào, kho và canh.

Bánh Num Ansam là loại bánh tét truyền thống Khmer làm từ gạo nếp nhân thịt heo và đậu xanh, gói trong lá dong xanh và buộc bằng lạt tre. Điểm khác biệt là bánh Num Ansam của người Khmer thường có hình dạng thuôn dài, hai đầu nhọn và được cột theo kiểu đặc trưng riêng. Bánh này xuất hiện trong mọi lễ hội lớn của người Khmer.

Bún nước lèo (tiếng Khmer: Num Banh Chock Samlor Kari) là món ăn phổ biến nhất trong bữa sáng của người Khmer Sóc Trăng. Nước lèo được nấu từ cá lóc tươi, mắm Prahok, sả, riềng và nhiều loại gia vị thơm, có màu vàng nhạt đặc trưng. Bún được trụng sơ rồi chan nước lèo nóng hổi, ăn kèm với rau sống gồm bắp chuối, giá đỗ, rau muống chẻ và húng quế.

Cốm dẹp là món quà đặc trưng của mùa lúa chín. Lúa nếp non được rang trên chảo nóng rồi giã dẹt bằng cối đá, đãi sạch trấu và trộn với đường thốt nốt, dừa bào. Cốm dẹp có vị ngọt thanh, béo nhẹ và được dùng làm lễ vật dâng cúng Trăng trong lễ Ok Om Bok.`,
    author: 'Võ Thị Mỹ Duyên',
    date: '25/05/2026',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    published: true,
    views: 1678,
    likes: 321,
  },
];

// ─────────────────────────────────────────────
async function seedArticles() {
  console.log('🚀 Bắt đầu upload 10 bài viết lên Firestore...\n');

  const collectionRef = db.collection('articles');
  let successCount = 0;

  for (const article of articles) {
    const { id, ...data } = article;
    try {
      await collectionRef.doc(id).set({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ [${successCount + 1}/10] "${article.title}"`);
      successCount++;
    } catch (err) {
      console.error(`❌ Lỗi khi upload "${article.title}":`, err.message);
    }
  }

  console.log(`\n🎉 Hoàn thành! Đã upload ${successCount}/${articles.length} bài viết.`);
  console.log(`\n🔗 Xem tại: https://console.firebase.google.com/project/khmerapp-9895c/firestore/data/articles`);

  process.exit(0);
}

seedArticles().catch(err => {
  console.error('❌ Lỗi nghiêm trọng:', err);
  process.exit(1);
});
