import { useState } from 'react';
import { Spinner } from './index';
import { SOStatusBadge, supplyOrderTotal, SO_STATUS_LABEL } from '../pages/SupplyOrdersPage';
import { money } from '../utils';

const NEXT_STATUS = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'SHIPPING',
  SHIPPING: 'DELIVERED',
};

export function SupplyOrderDetailModal({ supplyOrder, onUpdateStatus, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = supplyOrderTotal(supplyOrder);
  const next = NEXT_STATUS[supplyOrder.status];
  const isFinal = !next;

  const handleUpdate = async () => {
    setError('');
    setLoading(true);
    try {
      await onUpdateStatus(supplyOrder.id, next);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <h2>Chi tiết đơn nhập hàng</h2>
          <button className="admin-close" onClick={onClose}>×</button>
        </div>

        <div className="admin-form-grid" style={{ marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px' }}>NHÀ CUNG CẤP</p>
            <b>{supplyOrder.supplierName}</b>
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px' }}>NGÀY DỰ KIẾN GIAO</p>
            <b>{supplyOrder.orderDate || '—'}</b>
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px' }}>TRẠNG THÁI HIỆN TẠI</p>
            <SOStatusBadge status={supplyOrder.status} />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px' }}>TỔNG GIÁ TRỊ</p>
            <b>{money(total)}</b>
          </div>
        </div>

        <table className="admin-table" style={{ marginBottom: 14 }}>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(supplyOrder.items || []).map((item) => (
              <tr key={item.id}>
                <td>{item.productVariantName}</td>
                <td>{item.quantity}</td>
                <td>{money(item.unitPrice)}</td>
                <td>{money(Number(item.quantity) * Number(item.unitPrice))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {supplyOrder.notes && (
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>Ghi chú: {supplyOrder.notes}</p>
        )}

        {error && (
          <div className="warehouse-message warehouse-message--error" style={{ marginBottom: 12 }}>{error}</div>
        )}

        <div className="admin-modal__actions">
          <button className="admin-button admin-button--secondary" onClick={onClose} disabled={loading}>Đóng</button>
          {!isFinal && (
            <button className="admin-button" onClick={handleUpdate} disabled={loading}>
              {loading ? <Spinner label="Đang cập nhật..." /> : `Cập nhật sang: ${SO_STATUS_LABEL[next]}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
