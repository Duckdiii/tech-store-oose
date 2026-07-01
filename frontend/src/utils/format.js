export function fmt(n) {
  return n ? n.toLocaleString('vi-VN') : '0';
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}
