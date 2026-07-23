import { articleItems } from '../constants/articles';
import { heritageItems } from '../constants/heritages';
import { festivalItems } from '../constants/festivals';

export const firestoreSeed = {
  categories: [
    { id: 'le-hoi', name: 'Lễ hội', slug: 'le-hoi', icon: 'calendar' },
    { id: 'kien-truc', name: 'Kiến trúc', slug: 'kien-truc', icon: 'building' },
    { id: 'am-thuc', name: 'Ẩm thực', slug: 'am-thuc', icon: 'restaurant' },
    { id: 'nghe-thuat', name: 'Nghệ thuật', slug: 'nghe-thuat', icon: 'music-note' },
    { id: 'du-lich', name: 'Du lịch', slug: 'du-lich', icon: 'map' },
    { id: 'cong-dong', name: 'Cộng đồng', slug: 'cong-dong', icon: 'people' },
  ],
  articles: articleItems.map((item) => ({
    ...item,
    published: true, // Đảm bảo toàn bộ bài viết seed đều ở trạng thái xuất bản để hiển thị ở trang chủ và khám phá
    status: 'published',
  })),
  heritages: heritageItems,
  festivals: festivalItems,
  media: [
    {
      id: 'media-1',
      type: 'image',
      title: 'Ảnh chùa Som Rông',
      url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=600&q=80',
      relatedId: 'chua-som-rong',
    },
    {
      id: 'media-2',
      type: 'image',
      title: 'Ảnh Chùa Dơi',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
      relatedId: 'chua-doi',
    },
  ],
  users: [
    {
      id: 'user-1',
      displayName: 'Demo User',
      email: 'demo@example.com',
      photoURL: '',
      role: 'admin',
      favorites: ['chua-som-rong', 'chua-doi', 'le-hoi-ooc-om-bok'],
    },
  ],
};