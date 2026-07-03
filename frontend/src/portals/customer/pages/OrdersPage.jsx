import { useState, useEffect } from 'react';
import { fmt } from '../../../utils/format';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';
import { useTheme } from '../../../shared/context/ThemeContext';
import { httpClient } from '../../../api/httpClient';

function PackageIcon({ size = 32, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

const BACKEND_STATUS_MAP = {
  AWAITING_CONFIRMATION: { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fffbeb' },
  PROCESSING:            { label: 'Đang xử lý',   color: '#3b82f6', bg: '#eff6ff' },
  SHIPPING:              { label: 'Đang giao',    color: '#8b5cf6', bg: '#f5f3ff' },
  COMPLETED:             { label: 'Đã nhận hàng', color: '#16a34a', bg: '#f0fdf4' },
  CANCELLED:             { label: 'Đã hủy',       color: '#e11d48', bg: '#fef2f2' },
  REFUNDED:              { label: 'Đã hoàn tiền', color: '#e11d48', bg: '#fef2f2' }
};

const STATUS_API_MAP = {
  pending: 'AWAITING_CONFIRMATION',
  shipping: 'SHIPPING',
  delivered: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export function OrdersPage() {
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTheme();
  const [params] = useSearchParams();
  const [expanded, setExpanded] = useState(params.get('new') === '1' ? 'new' : null);
  const [filter, setFilter] = useState('all');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const customerId = user?.id || '1';
        let url = `/orders?customerId=${customerId}`;
        if (filter !== 'all') {
          url += `&status=${STATUS_API_MAP[filter]}`;
        }
        const response = await httpClient.get(url);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filter, isLoggedIn, user]);

  const handleToggleExpand = async (orderId) => {
    if (expanded === orderId) {
      setExpanded(null);
      return;
    }
    setExpanded(orderId);

    // If details already fetched, skip API call
    if (orderDetails[orderId]) return;

    setLoadingDetails(prev => ({ ...prev, [orderId]: true }));
    try {
      const customerId = user?.id || '1';
      const response = await httpClient.get(`/orders/${orderId}?customerId=${customerId}`);
      setOrderDetails(prev => ({ ...prev, [orderId]: response.data }));
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const printInvoice = async (orderId) => {
    try {
      const response = await httpClient.get(`/invoices/order/${orderId}`);
      const invoice = response.data;
      
      const win = window.open('', '_blank', 'width=820,height=680');
      win.document.write(`<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8">
<title>Hóa đơn ${invoice.invoiceId} — TechStore</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;padding:48px;color:#0d1117;font-size:14px}
  .hd{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #0d1117;margin-bottom:28px}
  .brand{font-size:22px;font-weight:900;letter-spacing:-0.5px}
  .brand small{display:block;font-size:10px;font-weight:400;color:#6b7280;letter-spacing:1.5px;text-transform:uppercase;margin-top:3px}
  .meta{text-align:right}.meta h2{font-size:16px;font-weight:900;margin-bottom:4px}
  .meta p{font-size:12px;color:#6b7280;line-height:1.6}
  .info{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
  .ib h4{font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:#9ca3af;margin-bottom:8px;font-weight:700}
  .ib p{font-size:13px;line-height:1.6}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  th{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;border-bottom:1.5px solid #e9ecef;padding:8px 10px;text-align:left}
  th:last-child,td:last-child{text-align:right}
  td{padding:12px 10px;font-size:13px;border-bottom:1px solid #f4f5f7}
  .tot{max-width:240px;margin-left:auto}
  .tr{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280}
  .tf{display:flex;justify-content:space-between;font-size:16px;font-weight:900;border-top:2px solid #0d1117;padding-top:10px;margin-top:6px}
  .foot{margin-top:40px;border-top:1px solid #e9ecef;padding-top:14px;text-align:center;font-size:11px;color:#9ca3af}
  .btn-pdf {display: inline-block; margin-bottom: 20px; padding: 8px 14px; background: #0d1117; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px;}
</style></head><body>
<div style="text-align: right;">
  <a href="/api/invoices/order/${invoice.orderId}/pdf" target="_blank" class="btn-pdf">📥 Tải PDF Hóa Đơn Gốc</a>
</div>
<div class="hd">
  <div class="brand">TechStore<small>Điện thoại chính hãng</small></div>
  <div class="meta"><h2>HÓA ĐƠN BÁN HÀNG</h2><p>Số hóa đơn: #${invoice.invoiceId}<br>Mã đơn: #${invoice.orderId}<br>Ngày lập: ${new Date(invoice.issuedAt).toLocaleDateString('vi-VN')}<br>Thanh toán: ${invoice.paymentMethod}</p></div>
</div>
<div class="info">
  <div class="ib"><h4>Khách hàng</h4><p><strong>${invoice.customerName || ''}</strong></p></div>
  <div class="ib"><h4>Địa chỉ giao hàng</h4><p>${invoice.shippingAddress || ''}</p></div>
</div>
<table><thead><tr><th>#</th><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
<tbody>${invoice.items.map((item, i) => `
  <tr>
    <td>${i + 1}</td>
    <td>
      <strong>${item.productName}</strong>
      ${item.variantDisplay ? `<br><small style="color: #6b7280;">Màu sắc/Phiên bản: ${item.variantDisplay}</small>` : ''}
      ${item.bundleServices && item.bundleServices.length > 0 ? `
        <div style="margin-top: 4px; padding-left: 8px; border-left: 2px solid #ddd; font-size: 11.5px; color: #4b5563;">
          Dịch vụ đi kèm: ${item.bundleServices.map(s => `${s.name} (+${s.price.toLocaleString('vi-VN')}₫)`).join(', ')}
        </div>
      ` : ''}
    </td>
    <td>${item.quantity}</td>
    <td>${item.unitPrice.toLocaleString('vi-VN')}₫</td>
    <td>${item.subtotal.toLocaleString('vi-VN')}₫</td>
  </tr>`).join('')}</tbody></table>
<div class="tot">
  <div class="tr"><span>Tạm tính</span><span>${Number(invoice.originalAmount).toLocaleString('vi-VN')}₫</span></div>
  <div class="tr"><span>Giảm giá</span><span>-${Number(invoice.discountAmount).toLocaleString('vi-VN')}₫</span></div>
  <div class="tr"><span>Thuế VAT</span><span>+${Number(invoice.vatAmount).toLocaleString('vi-VN')}₫</span></div>
  <div class="tf"><span>TỔNG CỘNG</span><span>${Number(invoice.finalAmount).toLocaleString('vi-VN')}₫</span></div>
</div>
<div class="foot">Cảm ơn quý khách đã tin tưởng mua hàng tại TechStore — Hotline: 1800 6789</div>
</body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 400);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      showToast(t('Unable to load invoice details.'), 'error');
    }
  };

  const handleDownloadPdf = async (orderId) => {
    try {
      const response = await httpClient.get(`/invoices/order/${orderId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading invoice PDF:', error);
      showToast(t('Unable to generate invoice PDF. Please try again later.'), 'error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Vui lòng đăng nhập</h2>
        <p style={{ fontSize: 14, color: '#6b7280' }}>Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
        <Link to="/sign-in" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'all',       label: 'Tất cả' },
    { id: 'pending',   label: 'Chờ xác nhận' },
    { id: 'shipping',  label: 'Đang giao' },
    { id: 'delivered', label: 'Đã nhận' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
        {params.get('new') === '1' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🎉</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#16a34a', marginBottom: 2 }}>Đặt hàng thành công!</div>
              <div style={{ fontSize: 13, color: '#4ade80' }}>Cảm ơn bạn đã mua hàng tại TechStore. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
              <span style={{ color: '#d1d5db' }}>/</span>
              <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Đơn hàng</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5 }}>Đơn hàng của tôi</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 4, marginBottom: 20, border: '1.5px solid #f1f3f5' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: 'none', background: filter===t.id ? '#0d1117' : 'transparent', color: filter===t.id ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '64px 24px', textAlign: 'center', color: '#6b7280' }}>
            Đang tải danh sách đơn hàng...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#f8f9fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1.5px solid #f1f3f5' }}>
              <PackageIcon size={32} color="#6b7280" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Không có đơn hàng nào</h3>
            <Link to="/products" style={{ fontSize: 14, color: '#0d1117', fontWeight: 700, textDecoration: 'none' }}>Mua sắm ngay →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => {
              const st = BACKEND_STATUS_MAP[order.orderStatus] || { label: order.orderStatus, color: '#374151', bg: '#f3f4f6' };
              const isOpen = expanded === order.orderId;
              const detail = orderDetails[order.orderId];
              const loadingDetail = loadingDetails[order.orderId];

              return (
                <div key={order.orderId} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                    onClick={() => handleToggleExpand(order.orderId)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0d1117' }}>#{order.orderId}</span>
                        <span style={{ background: st.bg, color: st.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')} · <strong style={{ color: '#0d1117' }}>{fmt(order.totalAmount)}₫</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {order.orderStatus === 'COMPLETED' && (
                        <button style={{ padding: '8px 14px', background: '#f4f5f7', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                          Mua lại
                        </button>
                      )}
                      <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f1f3f5', padding: '18px 22px', background: '#fafafa' }}>
                      {loadingDetail ? (
                        <div style={{ textAlign: 'center', padding: '14px 0', color: '#6b7280', fontSize: 13.5 }}>
                          Đang tải chi tiết đơn hàng...
                        </div>
                      ) : detail ? (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {detail.items.map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                <div style={{ width: 52, height: 52, background: '#eaecf0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                  <svg width="24" height="40" viewBox="0 0 72 120" fill="none"><rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/><rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/></svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0d1117' }}>{item.productName}</div>
                                  {item.variantDisplay && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{item.variantDisplay}</div>}
                                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>x{item.quantity} · {fmt(item.unitPrice)}₫/cái</div>
                                  {item.bundleServices && item.bundleServices.length > 0 && (
                                    <div style={{ marginTop: 4, fontSize: 11.5, color: '#4b5563', paddingLeft: 6, borderLeft: '2px solid #ddd' }}>
                                      Dịch vụ: {item.bundleServices.map(s => `${s.name} (+${fmt(s.price)}₫)`).join(', ')}
                                    </div>
                                  )}
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: '#0d1117' }}>{fmt(item.subtotal)}₫</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ borderTop: '1px solid #e9ecef', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {detail.orderStatus === 'AWAITING_CONFIRMATION' && (
                                <button onClick={() => showToast('Yêu cầu hủy đơn hàng đã được gửi đến cửa hàng.', 'success')} style={{ padding: '8px 14px', background: '#fef2f2', color: '#e11d48', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy đơn</button>
                              )}
                              {detail.orderStatus === 'COMPLETED' && (
                                <button onClick={() => showToast('Tính năng đánh giá đang được phát triển.', 'info')} style={{ padding: '8px 14px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Đánh giá</button>
                              )}
                              <button onClick={() => printInvoice(detail.orderId)} style={{ padding: '8px 14px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                Xem hóa đơn
                              </button>
                              <button onClick={() => handleDownloadPdf(detail.orderId)} style={{ padding: '8px 14px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                                📥 Tải PDF
                              </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                              {Number(detail.discountAmount) > 0 && (
                                <div style={{ fontSize: 13, color: '#e11d48' }}>Khuyến mãi: -{fmt(Number(detail.discountAmount))}₫</div>
                              )}
                              <div style={{ fontSize: 16, fontWeight: 900, color: '#0d1117' }}>Tổng: {fmt(Number(detail.finalAmount))}₫</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '14px 0', color: '#e11d48', fontSize: 13.5 }}>
                          Lỗi tải chi tiết đơn hàng.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
