import { useState, useRef, useEffect } from 'react';
import { fmt } from '../../../utils/format';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { httpClient } from '../../../api/httpClient';
import { membershipApi } from '../../../api/membershipApi';



const SAVED_ADDRESSES = [
  { id: 1, tag: 'Nhà riêng', name: 'Nguyễn Văn An', phone: '0901 234 567', address: '123 Lê Lợi, P. Bến Nghé, Q.1', province: 'TP. Hồ Chí Minh', isDefault: true },
  { id: 2, tag: 'Công ty',   name: 'Nguyễn Văn An', phone: '0901 234 567', address: '456 Nguyễn Huệ, P. Bến Thành, Q.1', province: 'TP. Hồ Chí Minh', isDefault: false },
];

const PROVINCES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Biên Hòa', 'Nha Trang'];

function PaymentIcon({ id }) {
  const normalizedId = String(id).toLowerCase();
  if (normalizedId === 'cod') return (
    <div style={{ width: 48, height: 34, background: '#fef9c3', border: '1.5px solid #fde047', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="20" height="20" fill="none" stroke="#854d0e" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>
        <path d="M6 12h.01M18 12h.01"/>
      </svg>
    </div>
  );
  if (normalizedId === 'momo') return (
    <div style={{ width: 48, height: 34, background: '#be185d', border: '1.5px solid #9d174d', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontWeight: 900, fontSize: 12, color: '#fff', fontFamily: 'Arial' }}>MoMo</span>
    </div>
  );
  if (normalizedId === 'vnpay') return (
    <div style={{ width: 48, height: 34, background: '#1d4ed8', border: '1.5px solid #1e40af', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', lineHeight: 1.15, flexShrink: 0 }}>
      <span style={{ fontWeight: 900, fontSize: 9, color: '#fff', fontFamily: 'Arial' }}>VN</span>
      <span style={{ fontWeight: 900, fontSize: 9, color: '#4ade80', fontFamily: 'Arial' }}>PAY</span>
    </div>
  );
  return (
    <div style={{ width: 48, height: 34, background: '#ede9fe', border: '1.5px solid #ddd6fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="20" height="18" fill="none" stroke="#5b21b6" strokeWidth="1.8" viewBox="0 0 24 22">
        <path d="M3 10l9-7 9 7"/><path d="M5 10v7M9 10v7M15 10v7M19 10v7"/>
        <line x1="3" y1="17" x2="21" y2="17"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    </div>
  );
}

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [method, setMethod] = useState('');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotionCode, setAppliedPromotionCode] = useState('');
  const [promotionMessage, setPromotionMessage] = useState('');
  const [tierInfo, setTierInfo] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [showAddrPicker, setShowAddrPicker] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const addrRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [summary, setSummary] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
    address: '', province: '', note: '',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Fetch Checkout Summary on mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const customerId = user?.id || '1';
        const response = await httpClient.get(`/payments/checkout/summary?customerId=${customerId}`);
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching checkout summary:', error);
      }
    };
    fetchSummary();
  }, [user]);

  useEffect(() => {
    const fetchMembershipOffers = async () => {
      try {
        const [tierData, voucherData] = await Promise.all([
          membershipApi.getMyTier(),
          membershipApi.getMyVouchers(),
        ]);
        setTierInfo(tierData);
        setVouchers(voucherData || []);
      } catch (error) {
        console.error('Error fetching membership offers:', error);
      }
    };
    fetchMembershipOffers();
  }, []);

  useEffect(() => {
    const promo = searchParams.get('promo');
    if (!promo) return;

    const normalizedPromo = promo.trim().toUpperCase();
    setPromotionCode(normalizedPromo);
    setAppliedPromotionCode(normalizedPromo);
  }, [searchParams]);

  // Set default method when summary loads
  useEffect(() => {
    if (summary?.availablePaymentMethods?.length > 0) {
      setMethod(summary.availablePaymentMethods[0].id);
    }
  }, [summary]);

  // Check online payment redirect return parameters
  const isVnPayReturn = searchParams.has('vnp_TxnRef');
  const isMomoReturn = searchParams.has('partnerCode');

  useEffect(() => {
    const verifyPayment = async () => {
      const params = Object.fromEntries(searchParams.entries());
      setVerifyingPayment(true);
      try {
        let response;
        if (isVnPayReturn) {
          response = await httpClient.get('/payments/vnpay/return', { params });
        } else if (isMomoReturn) {
          response = await httpClient.get('/payments/momo/return', { params });
        }

        if (response && response.data.success) {
          const result = response.data;
          const customerId = user?.id || '1';
          clearCart();

          // Fetch full order details
          const orderResponse = await httpClient.get(`/orders/${result.orderId}?customerId=${customerId}`);
          const orderDetail = orderResponse.data;

          setSuccess({
            orderId: orderDetail.orderId,
            items: orderDetail.items.map(item => ({
              name: item.productName + (item.variantDisplay ? ` - ${item.variantDisplay}` : ''),
              qty: item.quantity,
              price: item.unitPrice
            })),
            total: Number(orderDetail.originalAmount),
            finalTotal: Number(orderDetail.finalAmount),
            method: orderDetail.paymentMethod,
            address: 'Địa chỉ đăng ký',
            name: user?.name || ''
          });
        } else {
          alert(response?.data?.message || 'Thanh toán trực tuyến thất bại hoặc đã bị hủy.');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        alert('Có lỗi xảy ra khi xác nhận giao dịch thanh toán.');
      } finally {
        setVerifyingPayment(false);
        setSearchParams({});
      }
    };

    if (isVnPayReturn || isMomoReturn) {
      verifyPayment();
    }
  }, [isVnPayReturn, isMomoReturn, user]);

  const checkoutTotal = summary ? summary.subtotal : total;
  const membershipDiscountRate = Number(tierInfo?.discountPercentage || 0);
  const membershipDiscount = Math.round((checkoutTotal * membershipDiscountRate) / 100);
  const currentTierName = tierInfo?.tierName || tierInfo?.currentTierName || '';
  const appliedVoucher = vouchers.find((voucher) => voucher.code === appliedPromotionCode);
  const appliedVoucherType = String(appliedVoucher?.discountType || 'PERCENTAGE').toUpperCase();
  const appliedVoucherValue = Number(appliedVoucher?.discountValue ?? appliedVoucher?.discountPercent ?? 0);
  const canUseAppliedVoucher = Boolean(appliedVoucher?.usableNow);
  const isNewMemberVoucherAllowed = appliedPromotionCode !== 'NEWMEM50K'
    || String(currentTierName).toUpperCase() === 'STANDARD';
  const isTech10Allowed = appliedPromotionCode !== 'TECH10OFF' || checkoutTotal >= 5000000;
  const appliedVoucherValid = canUseAppliedVoucher && isNewMemberVoucherAllowed && isTech10Allowed;
  const promotionDiscount = appliedVoucherValid && appliedVoucherType === 'FIXED_AMOUNT'
    ? Math.min(appliedVoucherValue, Math.max(0, checkoutTotal - membershipDiscount))
    : appliedVoucherValid && appliedVoucherType === 'PERCENTAGE'
      ? Math.round((checkoutTotal * appliedVoucherValue) / 100)
      : 0;
  const freeShippingByTier = Boolean(tierInfo?.freeShipping);
  const freeShippingByVoucher = appliedVoucherValid && appliedVoucherType === 'FREE_SHIPPING';
  const shipping = checkoutTotal >= 500000 || freeShippingByTier || freeShippingByVoucher ? 0 : 30000;
  const finalTotal = Math.max(0, checkoutTotal - membershipDiscount - promotionDiscount) + shipping;

  useEffect(() => {
    const handler = e => {
      if (addrRef.current && !addrRef.current.contains(e.target)) setShowAddrPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pickAddress = addr => {
    setSelectedAddr(addr);
    setForm(f => ({ ...f, name: addr.name, phone: addr.phone }));
    setShowAddrPicker(false);
  };

  const handleApplyPromotion = () => {
    const code = promotionCode.trim().toUpperCase();
    if (!code) {
      setAppliedPromotionCode('');
      setPromotionMessage('');
      return;
    }

    const voucher = vouchers.find((item) => item.code === code);
    if (!voucher) {
      setAppliedPromotionCode('');
      setPromotionMessage('Ma giam gia khong ton tai.');
      return;
    }
    if (!voucher.usableNow) {
      setAppliedPromotionCode('');
      setPromotionMessage('Ma giam gia da het han hoac chua duoc kich hoat.');
      return;
    }
    if (code === 'TECH10OFF' && checkoutTotal < 5000000) {
      setAppliedPromotionCode('');
      setPromotionMessage('TECH10OFF chi ap dung cho don tu 5.000.000d.');
      return;
    }
    if (code === 'NEWMEM50K' && String(currentTierName).toUpperCase() !== 'STANDARD') {
      setAppliedPromotionCode('');
      setPromotionMessage('NEWMEM50K chi ap dung cho thanh vien STANDARD.');
      return;
    }
    setAppliedPromotionCode(code);
    const voucherType = String(voucher.discountType || 'PERCENTAGE').toUpperCase();
    setPromotionMessage(voucherType === 'FREE_SHIPPING' ? 'Da ap dung mien phi van chuyen.' : 'Da ap dung ma giam gia.');
  };

  const handleOrder = async () => {
    const addrStr = selectedAddr
      ? `${selectedAddr.address}, ${selectedAddr.province}`
      : `${form.address}${form.province ? ', ' + form.province : ''}`;
    if (!form.name || !form.phone || (!selectedAddr && !form.address)) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }
    
    setPlacing(true);
    try {
      const customerId = user?.id || '1';
      const addressId = String(selectedAddr?.id || '1');
      const selectedCartItemIds = summary?.items?.map(item => item.id) || [];

      const payload = {
        addressId,
        paymentMethodId: method,
        selectedCartItemIds,
        promotionCode: appliedPromotionCode || null
      };

      const response = await httpClient.post(`/payments/checkout?customerId=${customerId}`, payload);
      const initResponse = response.data;
      const paymentType = initResponse.paymentType || initResponse.type;

      if (paymentType === 'COD') {
        const orderId = initResponse.orderId;
        const methodLabel = summary?.availablePaymentMethods?.find(m => m.id === method)?.name || 'COD';
        
        clearCart();
        setSuccess({
          orderId,
          items: summary.items.map(item => ({
            name: item.productName + (item.variantDisplayName ? ` - ${item.variantDisplayName}` : ''),
            qty: item.quantity,
            price: item.unitPrice
          })),
          total: summary.subtotal,
          finalTotal,
          method: methodLabel,
          address: addrStr,
          name: form.name
        });
      } else if (paymentType === 'REDIRECT') {
        window.location.href = initResponse.paymentUrl || initResponse.redirectUrl; // Redirect to payment gateway
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Đặt hàng không thành công. Vui lòng thử lại.');
    } finally {
      setPlacing(false);
    }
  };

  const printInvoice = async () => {
    if (!success) return;
    try {
      const response = await httpClient.get(`/invoices/order/${success.orderId}`);
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
  <div class="ib"><h4>Khách hàng</h4><p><strong>${success.name}</strong></p></div>
  <div class="ib"><h4>Địa chỉ giao hàng</h4><p>${success.address}</p></div>
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
      alert('Không thể lấy thông tin hóa đơn từ máy chủ.');
    }
  };

  if (verifyingPayment) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56, animation: 'spin 2s linear infinite' }}>🔄</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Đang xác thực giao dịch...</h2>
        <p style={{ fontSize: 14, color: '#6b7280' }}>Vui lòng không đóng hoặc tải lại trang web này.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '48px 32px 80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 580, width: '100%' }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', padding: '40px 36px', marginBottom: 14 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 72, height: 72, background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <svg width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5, marginBottom: 8 }}>Đặt hàng thành công!</h1>
              <p style={{ fontSize: 14, color: '#6b7280' }}>Cảm ơn bạn đã tin tưởng mua sắm tại TechStore</p>
            </div>
            <div style={{ background: '#f4f5f7', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Mã đơn hàng</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0d1117', marginTop: 3 }}>#{success.orderId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Ngày đặt</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1117', marginTop: 3 }}>{new Date().toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Sản phẩm</div>
              {success.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < success.items.length - 1 ? '1px solid #f4f5f7' : 'none' }}>
                  <span style={{ fontSize: 13.5, color: '#374151' }}>{item.name} <span style={{ color: '#9ca3af' }}>×{item.qty}</span></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117' }}>{fmt(item.price * item.qty)}₫</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#f8f9fa', borderRadius: 10, padding: '14px 16px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { label: 'Phương thức thanh toán', value: success.method },
                { label: 'Địa chỉ giao hàng', value: success.address },
                { label: 'Phí vận chuyển', value: success.finalTotal - success.total === 0 ? 'Miễn phí' : fmt(success.finalTotal - success.total) + '₫', green: success.finalTotal === success.total },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: row.green ? '#16a34a' : '#374151', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #e9ecef', paddingTop: 10, marginTop: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0d1117' }}>Tổng cộng</span>
                <span style={{ fontSize: 17, fontWeight: 900, color: '#0d1117' }}>{fmt(success.finalTotal)}₫</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={printInvoice}
                style={{ flex: 1, height: 46, background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Xem hóa đơn
              </button>
              <button onClick={() => window.open(`/api/invoices/order/${success.orderId}/pdf`, '_blank')}
                style={{ flex: 1, height: 46, background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                📥 Tải PDF
              </button>
              <Link to="/orders"
                style={{ flex: 1, height: 46, background: '#0d1117', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, textDecoration: 'none' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
                Lịch sử đơn hàng
              </Link>
            </div>
          </div>
          <Link to="/" style={{ display: 'block', textAlign: 'center', fontSize: 13.5, color: '#9ca3af', textDecoration: 'none' }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56 }}>🛒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Giỏ hàng trống</h2>
        <Link to="/products" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const Field = ({ label, ...rest }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{label}</label>
      <input {...rest} style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', ...(rest.style || {}) }}/>
    </div>
  );

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to="/cart" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Giỏ hàng</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Thanh toán</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1117', letterSpacing: -0.3 }}>📦 Thông tin giao hàng</h2>
                <div ref={addrRef} style={{ position: 'relative' }}>
                  <button onClick={() => setShowAddrPicker(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f4f5f7', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Chọn địa chỉ
                    <svg width="11" height="11" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24"
                      style={{ transform: showAddrPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  {showAddrPicker && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 14, boxShadow: '0 12px 36px rgba(0,0,0,0.13)', minWidth: 340, zIndex: 200, overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f3f5' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0d1117' }}>Địa chỉ đã lưu</span>
                      </div>
                      {SAVED_ADDRESSES.map(addr => (
                        <div key={addr.id} onClick={() => pickAddress(addr)}
                          style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #f4f5f7', background: selectedAddr?.id === addr.id ? '#f0fdf4' : '#fff', transition: 'background 0.1s' }}
                          onMouseEnter={e => { if (selectedAddr?.id !== addr.id) e.currentTarget.style.background = '#f4f5f7'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = selectedAddr?.id === addr.id ? '#f0fdf4' : '#fff'; }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, background: '#0d1117', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{addr.tag}</span>
                            {addr.isDefault && <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Mặc định</span>}
                            {selectedAddr?.id === addr.id && (
                              <svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117' }}>{addr.name} · {addr.phone}</div>
                          <div style={{ fontSize: 12.5, color: '#6b7280', marginTop: 3 }}>{addr.address}, {addr.province}</div>
                        </div>
                      ))}
                      <button
                        onClick={() => { setSelectedAddr(null); setForm(f => ({ ...f, address: '', province: '' })); setShowAddrPicker(false); }}
                        style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', textAlign: 'left' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Nhập địa chỉ mới
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectedAddr && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '14px 16px', marginBottom: 18, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#0d1117', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{selectedAddr.tag}</span>
                      <svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Đã chọn</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1117', marginBottom: 3 }}>{selectedAddr.name} · {selectedAddr.phone}</div>
                    <div style={{ fontSize: 13, color: '#374151' }}>{selectedAddr.address}, {selectedAddr.province}</div>
                  </div>
                  <button onClick={() => setShowAddrPicker(true)}
                    style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 7, padding: '6px 11px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    Thay đổi
                  </button>
                </div>
              )}

              <Field label="Họ và tên *" placeholder="Nguyễn Văn An" value={form.name} onChange={set('name')}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Số điện thoại *" placeholder="0901 234 567" value={form.phone} onChange={set('phone')}/>
                <Field label="Email" placeholder="ten@email.com" value={form.email} onChange={set('email')}/>
              </div>

              {!selectedAddr && (
                <>
                  <Field label="Địa chỉ *" placeholder="Số nhà, tên đường, phường/xã" value={form.address} onChange={set('address')}/>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Tỉnh / Thành phố</label>
                    <select value={form.province} onChange={set('province')}
                      style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#374151', outline: 'none', background: '#fff' }}>
                      <option value="">Chọn tỉnh / thành phố</option>
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Ghi chú đơn hàng</label>
                <textarea value={form.note} onChange={set('note')} placeholder="Ghi chú thêm (tùy chọn)..."
                  style={{ width: '100%', height: 80, padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}/>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1117', marginBottom: 20, letterSpacing: -0.3 }}>💳 Phương thức thanh toán</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(summary?.availablePaymentMethods || []).map(m => (
                  <label key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: `1.5px solid ${method === m.id ? '#0d1117' : '#e9ecef'}`, borderRadius: 11, cursor: 'pointer', background: method === m.id ? '#f8f9fa' : '#fff', transition: 'all 0.15s' }}>
                    <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} style={{ accentColor: '#0d1117', width: 16, height: 16 }}/>
                    <PaymentIcon id={m.type}/>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0d1117' }}>{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px', position: 'sticky', top: 88 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1117', marginBottom: 18, letterSpacing: -0.3 }}>Đơn hàng của bạn</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {(summary?.items || []).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, background: '#f4f5f7', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                    <svg width="24" height="40" viewBox="0 0 72 120" fill="none"><rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/><rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/></svg>
                    <span style={{ position: 'absolute', top: -6, right: -6, background: '#0d1117', color: '#fff', fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0d1117', lineHeight: 1.3, marginBottom: 2 }}>{item.productName}</div>
                    {item.variantDisplayName && <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>{item.variantDisplayName}</div>}
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{fmt(item.unitPrice)}₫ × {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0d1117', flexShrink: 0 }}>{fmt(item.subtotal)}₫</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: '#f1f3f5', marginBottom: 16 }}/>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={promotionCode}
                onChange={(event) => setPromotionCode(event.target.value.toUpperCase())}
                style={{ flex: 1, height: 40, padding: '0 12px', border: '1.5px solid #e9ecef', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
              />
              <button
                type="button"
                onClick={handleApplyPromotion}
                style={{ padding: '0 14px', height: 40, background: '#f4f5f7', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}
              >
                Áp dụng
              </button>
            </div>
            {promotionMessage && (
              <div style={{ marginTop: -8, marginBottom: 12, fontSize: 12.5, color: appliedVoucherValid ? '#15803d' : '#b45309', fontWeight: 700 }}>
                {promotionMessage}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Tạm tính</span><span style={{ fontWeight: 600, color: '#374151' }}>{fmt(checkoutTotal)}₫</span>
              </div>
              {membershipDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#15803d' }}>
                  <span>Ưu đãi hạng {currentTierName}</span>
                  <span style={{ fontWeight: 700 }}>-{fmt(membershipDiscount)}₫</span>
                </div>
              )}
              {promotionDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#15803d' }}>
                  <span>Mã {appliedPromotionCode}</span>
                  <span style={{ fontWeight: 700 }}>-{fmt(promotionDiscount)}₫</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Vận chuyển</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#16a34a' : '#374151' }}>{shipping === 0 ? 'Miễn phí' : fmt(shipping) + '₫'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: '#0d1117', fontWeight: 900, borderTop: '1px solid #f1f3f5', paddingTop: 12 }}>
                <span>Tổng cộng</span><span>{fmt(finalTotal)}₫</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={placing}
              style={{ width: '100%', padding: '14px', background: placing ? '#374151' : '#0d1117', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {placing ? 'Đang xử lý...' : 'Đặt hàng ngay →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12, lineHeight: 1.6 }}>
              Bằng cách đặt hàng, bạn đồng ý với <a href="#" style={{ color: '#374151' }}>Điều khoản sử dụng</a> của TechStore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
