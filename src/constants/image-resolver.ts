/**
 * Heritage & Article image resolver
 * Ưu tiên ảnh local require() (ảnh thật/AI) trước, sau đó fallback về URL online
 */

// Local heritage images - require() cho từng di sản cụ thể
export const HERITAGE_LOCAL_IMAGES: Record<string, number> = {
  'chua-som-rong': require('../assets/heritages/chua-som-rong.png'),
  'chua-doi': require('../assets/heritages/chua-doi.png'),
  'chua-chantarangsay': require('../assets/heritages/chua-chantarangsay.png'),
  'chua-hang': require('../assets/heritages/chua-hang.png'),
  'chua-ghositaram': require('../assets/heritages/chua-ghositaram.png'),
  'le-hoi-ooc-om-bok': require('../assets/heritages/le-hoi-ooc-om-bok.png'),
  'le-hoi-sene-dolta': require('../assets/heritages/le-hoi-sene-dolta.png'),
  'nghe-thuat-ro-bam': require('../assets/heritages/nghe-thuat-ro-bam.png'),
  'le-hoi-kathina': require('../assets/heritages/le-hoi-kathina.png'),
  'nghe-thuat-chapei-don-ca': require('../assets/heritages/nghe-thuat-chapei-don-ca.png'),
};

// Local article images - require() cho các bài viết có ảnh riêng
export const ARTICLE_LOCAL_IMAGES: Record<string, number> = {
  'bun-nuoc-leo-soc-trang': require('../assets/articles/bun-nuoc-leo.png'),
  'nhac-ngu-am-pinpeat': require('../assets/articles/nhac-ngu-am-pinpeat.png'),
};

// Local festival images - require() cho từng lễ hội cụ thể
export const FESTIVAL_LOCAL_IMAGES: Record<string, number> = {
  'ok-om-bok': require('../assets/heritages/le-hoi-ooc-om-bok.png'),
  'sen-dol-ta': require('../assets/heritages/le-hoi-sene-dolta.png'),
  'kathina': require('../assets/heritages/le-hoi-kathina.png'),
  'dua-bo-that-son': require('../assets/heritages/chua-ghositaram.png'),
  'chol-chnam-thmay': require('../assets/heritages/chua-som-rong.png'),
};

// Mặc định các Unsplash URL ban đầu để kiểm tra xem ảnh bìa có bị thay đổi không
const DEFAULT_HERITAGE_URLS: Record<string, string> = {
  'chua-som-rong': 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80',
  'chua-doi': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
  'chua-chantarangsay': 'https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?auto=format&fit=crop&w=600&q=80',
  'chua-hang': 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
  'chua-ghositaram': 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
  'le-hoi-ooc-om-bok': 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
  'le-hoi-sene-dolta': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
  'nghe-thuat-ro-bam': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
  'le-hoi-kathina': 'https://images.unsplash.com/photo-1608976478549-3652f4007b7b?auto=format&fit=crop&w=600&q=80',
  'nghe-thuat-chapei-don-ca': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_ARTICLE_URLS: Record<string, string> = {
  'bun-nuoc-leo-soc-trang': 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
  'nhac-ngu-am-pinpeat': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
};

/**
 * Trả về image source cho heritage:
 * - Nếu coverImage bị đổi (khác URL ban đầu hoặc là ảnh custom Cloudinary/local) → dùng URL mới
 * - Nếu không đổi → Ưu tiên ảnh local (require) chất lượng cao
 * - Fallback về URL chung theo type
 */
export function getHeritageImageSource(
  id: string,
  coverImage?: string,
  type?: 'tangible' | 'intangible'
): { uri: string } | number {
  const isCustomImage =
    coverImage &&
    coverImage.trim().length > 0 &&
    (coverImage.includes('cloudinary.com') ||
      coverImage.startsWith('file:') ||
      coverImage.startsWith('content:') ||
      coverImage.startsWith('ph:') ||
      coverImage.startsWith('assets-library:') ||
      coverImage.trim() !== DEFAULT_HERITAGE_URLS[id]);

  if (isCustomImage && coverImage) {
    return { uri: coverImage.trim() };
  }

  // Ưu tiên ảnh local nếu không đổi
  if (HERITAGE_LOCAL_IMAGES[id]) {
    return HERITAGE_LOCAL_IMAGES[id];
  }

  // Fallback về URL
  if (coverImage && coverImage.trim().length > 0) {
    return { uri: coverImage.trim() };
  }
  // Generic fallback theo type
  return {
    uri: type === 'intangible'
      ? 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80',
  };
}

/**
 * Trả về image source cho article:
 * - Nếu coverImage bị đổi (khác URL ban đầu hoặc là ảnh custom Cloudinary/local) → dùng URL mới
 * - Nếu không đổi → Ưu tiên ảnh local (require) chất lượng cao
 * - Fallback về URL chung theo category
 */
export function getArticleImageSource(
  id: string,
  coverImage?: string,
  category?: string
): { uri: string } | number {
  const isCustomImage =
    coverImage &&
    coverImage.trim().length > 0 &&
    (coverImage.includes('cloudinary.com') ||
      coverImage.startsWith('file:') ||
      coverImage.startsWith('content:') ||
      coverImage.startsWith('ph:') ||
      coverImage.startsWith('assets-library:') ||
      coverImage.trim() !== DEFAULT_ARTICLE_URLS[id]);

  if (isCustomImage && coverImage) {
    return { uri: coverImage.trim() };
  }

  // Ưu tiên ảnh local nếu không đổi
  if (ARTICLE_LOCAL_IMAGES[id]) {
    return ARTICLE_LOCAL_IMAGES[id];
  }

  // Fallback về URL
  if (coverImage && coverImage.trim().length > 0) {
    return { uri: coverImage.trim() };
  }
  // Generic fallback theo category
  const cat = (category || '').trim().toLowerCase();
  const fallbackUrl = (() => {
    switch (cat) {
      case 'lễ hội': case 'lễ hội truyền thống':
        return 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80';
      case 'kiến trúc': case 'kiến trúc tôn giáo':
        return 'https://images.unsplash.com/photo-1598908313407-4fbd48db2c96?auto=format&fit=crop&w=600&q=80';
      case 'ẩm thực':
        return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80';
      case 'nghệ thuật':
        return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80';
      case 'cộng đồng':
        return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
      case 'du lịch':
        return 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=600&q=80';
      default:
        return 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80';
    }
  })();
  return { uri: fallbackUrl };
}

export function getFestivalImageSource(id: string, coverImage?: string): { uri: string } | number {
  if (coverImage && coverImage.trim().length > 0) {
    const trimmed = coverImage.trim();
    const isCustomImage =
      trimmed.includes('cloudinary.com') ||
      trimmed.startsWith('file:') ||
      trimmed.startsWith('content:') ||
      trimmed.startsWith('ph:') ||
      trimmed.startsWith('assets-library:') ||
      trimmed.startsWith('data:') ||
      (trimmed.startsWith('http') && !FESTIVAL_LOCAL_IMAGES[id]);
    if (isCustomImage || !FESTIVAL_LOCAL_IMAGES[id]) {
      return { uri: trimmed };
    }
  }
  if (FESTIVAL_LOCAL_IMAGES[id]) {
    return FESTIVAL_LOCAL_IMAGES[id];
  }
  if (coverImage && coverImage.trim().length > 0) {
    return { uri: coverImage.trim() };
  }
  return { uri: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80' };
}
