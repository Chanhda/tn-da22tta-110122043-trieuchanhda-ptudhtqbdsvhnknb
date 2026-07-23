/**
 * Hàm tính thời gian tương đối từ ISO string, hỗ trợ đa ngôn ngữ.
 * Ví dụ: "Vừa xong", "5 phút trước", "2 giờ trước", "1 ngày trước"
 */
export function getTimeAgo(isoString: string, language: string = 'vi'): string {
  if (!isoString) return '';

  const diff = Date.now() - new Date(isoString).getTime();
  if (diff < 0) {
    // Nếu thời gian trong tương lai (lệch đồng hồ nhẹ)
    if (language === 'km') return 'ទើបតែ';
    if (language === 'en') return 'Just now';
    return 'Vừa xong';
  }

  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (secs < 60) {
    if (language === 'km') return 'ទើបតែ';
    if (language === 'en') return 'Just now';
    return 'Vừa xong';
  }

  if (mins < 60) {
    if (language === 'km') return `${mins} នាទីមុន`;
    if (language === 'en') return `${mins} min${mins > 1 ? 's' : ''} ago`;
    return `${mins} phút trước`;
  }

  if (hrs < 24) {
    if (language === 'km') return `${hrs} ម៉ោងមុន`;
    if (language === 'en') return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${hrs} giờ trước`;
  }

  if (days < 7) {
    if (language === 'km') return `${days} ថ្ងៃមុន`;
    if (language === 'en') return `${days} day${days > 1 ? 's' : ''} ago`;
    return `${days} ngày trước`;
  }

  if (weeks < 5) {
    if (language === 'km') return `${weeks} សប្តាហ៍មុន`;
    if (language === 'en') return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    return `${weeks} tuần trước`;
  }

  if (months < 12) {
    if (language === 'km') return `${months} ខែមុន`;
    if (language === 'en') return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${months} tháng trước`;
  }

  if (language === 'km') return `${years} ឆ្នាំមុន`;
  if (language === 'en') return `${years} year${years > 1 ? 's' : ''} ago`;
  return `${years} năm trước`;
}
