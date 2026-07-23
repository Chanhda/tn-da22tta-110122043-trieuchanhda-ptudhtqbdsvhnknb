export type ArticleTemplate = {
  id: string;
  name: string;
  category: string;
  titlePlaceholder: string;
  summaryPlaceholder: string;
  contentPlaceholder: string;
};

export const articleTemplates: ArticleTemplate[] = [
  {
    id: 'festival',
    name: 'Mẫu lễ hội',
    category: 'Lễ hội',
    titlePlaceholder: 'Tên lễ hội hoặc sự kiện',
    summaryPlaceholder: 'Tóm tắt ngắn về không khí, nghi thức và ý nghĩa.',
    contentPlaceholder: 'Viết nội dung chi tiết theo từng đoạn. Có thể thêm thời gian, địa điểm, nhân vật và điểm nổi bật.',
  },
  {
    id: 'architecture',
    name: 'Mẫu kiến trúc',
    category: 'Kiến trúc',
    titlePlaceholder: 'Tên công trình hoặc địa điểm',
    summaryPlaceholder: 'Tóm tắt nét kiến trúc, chất liệu và giá trị văn hóa.',
    contentPlaceholder: 'Mô tả cấu trúc, màu sắc, trang trí và cách công trình gắn với đời sống cộng đồng.',
  },
  {
    id: 'food',
    name: 'Mẫu ẩm thực',
    category: 'Ẩm thực',
    titlePlaceholder: 'Tên món ăn hoặc chủ đề ẩm thực',
    summaryPlaceholder: 'Tóm tắt hương vị, dịp dùng và ý nghĩa trong đời sống.',
    contentPlaceholder: 'Viết các đoạn ngắn về nguyên liệu, cách chế biến, cách thưởng thức và hoàn cảnh sử dụng.',
  },
  {
    id: 'performance',
    name: 'Mẫu nghệ thuật',
    category: 'Nghệ thuật',
    titlePlaceholder: 'Tên loại hình nghệ thuật',
    summaryPlaceholder: 'Tóm tắt đặc điểm biểu diễn và giá trị truyền thống.',
    contentPlaceholder: 'Mô tả sân khấu, nhạc cụ, nghệ nhân và bối cảnh trình diễn.',
  },
];

export function getTemplateById(templateId: string) {
  return articleTemplates.find((template) => template.id === templateId) ?? articleTemplates[0];
}