export const money = (value) => `${Number(value).toLocaleString('vi-VN')}đ`;
export const initials = (name) => name.split(' ').slice(-2).map((word) => word[0]).join('');

export const sortRows = (rows, key, dir) => {
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    let av = a[key], bv = b[key];
    if (typeof av === 'boolean') { av = av ? 1 : 0; bv = bv ? 1 : 0; }
    // Convert DD/MM/YYYY → YYYYMMDD for correct date ordering
    if (typeof av === 'string' && /^\d{2}\/\d{2}\/\d{4}/.test(av)) {
      av = av.split('/').reverse().join('');
      bv = (bv || '').split('/').reverse().join('');
    }
    if (typeof av === 'number') return dir === 'asc' ? av - bv : bv - av;
    return dir === 'asc'
      ? String(av ?? '').localeCompare(String(bv ?? ''), 'vi')
      : String(bv ?? '').localeCompare(String(av ?? ''), 'vi');
  });
};

export const downloadCsv = (filename, headers, rows) => {
  const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
};
