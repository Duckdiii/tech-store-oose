import { formatMoney } from './utils';

export function SelectedExportModal({ open, rows, products, onClose }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #edf1f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              DANH SÁCH XUẤT KHO
            </p>
            <h3 style={{ margin: 0, color: '#0d1117', fontSize: '18px' }}>Số lượng chọn: {rows.length}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b', padding: '4px 8px' }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          {rows.map((variant, index) => {
            const product = products.find((item) => item.id === variant.productId);
            return (
              <div
                key={variant.id}
                style={{
                  padding: '12px 0',
                  borderBottom: index < rows.length - 1 ? '1px solid #edf1f5' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <b style={{ display: 'block', color: '#0d1117', marginBottom: '4px' }}>{variant.id}</b>
                  <small style={{ color: '#64748b', fontSize: '12px', display: 'block', lineHeight: '1.5' }}>
                    {product?.name || variant.productId} · {variant.ramGb} GB RAM / {variant.storageGb} GB · {variant.color}
                  </small>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: '600', color: '#0d1117' }}>{formatMoney(variant.price)}đ</div>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>Còn trong kho</small>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #edf1f5', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <button type="button" onClick={onClose} className="admin-button admin-button--secondary">Đóng</button>
        </div>
      </div>
    </div>
  );
}
