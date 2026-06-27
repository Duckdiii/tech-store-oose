export const blankItem = () => ({
  serialId: '',
  ramGb: '',
  storageGb: '',
  color: '',
  price: '',
  importPrice: '',
});

export const formatMoney = (value) => new Intl.NumberFormat('vi-VN').format(value || 0);

export const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN') : '-';
