import { useState } from 'react';
import { Spinner } from '../components/index';

const SETTING_ROWS = [
  ['stockAlert',   'Cảnh báo tồn kho thấp',  'Gửi thông báo khi số lượng tồn xuống dưới mức tối thiểu.'],
  ['orderAlert',   'Thông báo đơn hàng mới',  'Hiển thị thông báo ngay khi có đơn đặt hàng mới.'],
  ['weeklyReport', 'Báo cáo hàng tuần',       'Gửi tóm tắt doanh thu và tồn kho vào mỗi thứ Hai.'],
];

const RECOVERY_POINTS = [
  { id: 'RP-001', timestamp: '24/06/2026 02:00', type: 'Auto',   label: 'Full Backup',    size: '128 MB' },
  { id: 'RP-002', timestamp: '23/06/2026 02:00', label: 'Full Backup',    type: 'Auto',   size: '126 MB' },
  { id: 'RP-003', timestamp: '22/06/2026 14:35', label: 'Partial Backup', type: 'Manual', size: '18 MB'  },
  { id: 'RP-004', timestamp: '21/06/2026 02:00', label: 'Full Backup',    type: 'Auto',   size: '124 MB' },
  { id: 'RP-005', timestamp: '20/06/2026 09:12', label: 'Partial Backup', type: 'Manual', size: '15 MB'  },
];

function RestoreConfirmDialog({ point, restoreType, onConfirm, onClose }) {
  const isFull = restoreType === 'full';
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', minWidth: 400, maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
            ⚠
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0d1117', margin: '0 0 4px' }}>
              Xác nhận {isFull ? 'Full Restore' : 'Partial Restore'}
            </h3>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Recovery point: <b>{point.timestamp}</b> · {point.label}</p>
          </div>
        </div>

        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#713f12', margin: '0 0 6px', fontWeight: 600 }}>Cảnh báo downtime</p>
          <ul style={{ fontSize: 12.5, color: '#713f12', margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
            {isFull ? (
              <>
                <li>Hệ thống sẽ <b>ngừng hoạt động</b> trong quá trình khôi phục (ước tính 5–10 phút).</li>
                <li>Toàn bộ dữ liệu hiện tại sẽ bị <b>ghi đè</b> bằng dữ liệu tại điểm phục hồi.</li>
                <li>Các thay đổi sau thời điểm backup sẽ <b>bị mất vĩnh viễn</b>.</li>
              </>
            ) : (
              <>
                <li>Chỉ khôi phục dữ liệu được chọn, dữ liệu khác được giữ nguyên.</li>
                <li>Hệ thống có thể <b>gián đoạn ngắn</b> trong quá trình restore (ước tính 1–3 phút).</li>
                <li>Dữ liệu trùng trong phạm vi restore sẽ bị <b>ghi đè</b>.</li>
              </>
            )}
          </ul>
        </div>

        <p style={{ fontSize: 13, color: '#374151', marginBottom: 24 }}>
          Hành động này <b>không thể hoàn tác</b>. Bạn có chắc chắn muốn tiếp tục?
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button>
          <button
            className="admin-button"
            style={{ background: '#ef4444', color: '#fff' }}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {isFull ? 'Bắt đầu Full Restore' : 'Bắt đầu Partial Restore'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BackupSection({ onToast }) {
  const [selected,    setSelected]    = useState(null);
  const [restoreType, setRestoreType] = useState('full');
  const [confirm,     setConfirm]     = useState(false);
  const [restoring,   setRestoring]   = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    await new Promise((r) => setTimeout(r, 1200));
    onToast(`Đã khởi động ${restoreType === 'full' ? 'Full' : 'Partial'} Restore — ${selected.timestamp}`);
    setSelected(null);
    setRestoring(false);
  };

  return (
    <article className="admin-card">
      <div className="admin-card__head">
        <div><p>SAO LƯU & KHÔI PHỤC</p><h3>Recovery Points</h3></div>
        <button
          className="admin-button admin-button--secondary"
          style={{ fontSize: 12 }}
          onClick={() => onToast('Đã tạo backup thủ công mới')}
        >
          + Tạo backup ngay
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {RECOVERY_POINTS.map((rp) => (
          <div
            key={rp.id}
            onClick={() => setSelected(selected?.id === rp.id ? null : rp)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 16px',
              border: `1.5px solid ${selected?.id === rp.id ? '#0d1117' : '#e9ecef'}`,
              borderRadius: 10,
              cursor: 'pointer',
              background: selected?.id === rp.id ? '#f8fafc' : '#fff',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: selected?.id === rp.id ? '#0d1117' : '#e2e8f0',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13.5, color: '#0d1117' }}>{rp.timestamp}</b>
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 10 }}>{rp.label}</span>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12,
              background: rp.type === 'Auto' ? '#eff6ff' : '#f0fdf4',
              color: rp.type === 'Auto' ? '#1d4ed8' : '#15803d',
            }}>
              {rp.type}
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af', width: 52, textAlign: 'right' }}>{rp.size}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ borderTop: '1.5px solid #e9ecef', paddingTop: 16 }}>
          <p style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>
            Loại khôi phục cho điểm <b>{selected.timestamp}</b>:
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['full', 'Full Restore', 'Khôi phục toàn bộ hệ thống về điểm này'], ['partial', 'Partial Restore', 'Chỉ khôi phục một phần dữ liệu được chọn']].map(([val, label, desc]) => (
              <div
                key={val}
                onClick={() => setRestoreType(val)}
                style={{
                  flex: 1, minWidth: 180, padding: '12px 16px',
                  border: `1.5px solid ${restoreType === val ? '#0d1117' : '#e2e8f0'}`,
                  borderRadius: 10, cursor: 'pointer',
                  background: restoreType === val ? '#f8fafc' : '#fff',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${restoreType === val ? '#0d1117' : '#cbd5e1'}`,
                    background: restoreType === val ? '#0d1117' : 'transparent',
                  }} />
                  <b style={{ fontSize: 13.5 }}>{label}</b>
                </div>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, paddingLeft: 24 }}>{desc}</p>
              </div>
            ))}
          </div>
          <button
            className="admin-button admin-button--danger"
            onClick={() => setConfirm(true)}
            disabled={restoring}
          >
            {restoring ? <Spinner label="Đang khôi phục..." /> : `Khôi phục về ${selected.timestamp}`}
          </button>
        </div>
      )}

      {confirm && selected && (
        <RestoreConfirmDialog
          point={selected}
          restoreType={restoreType}
          onConfirm={handleRestore}
          onClose={() => setConfirm(false)}
        />
      )}
    </article>
  );
}

export function SettingsPage({ settings, onToggle }) {
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600); };

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>Thay đổi được lưu trên trình duyệt</p>
          <h2>Cài đặt hệ thống</h2>
        </div>
      </div>

      <article className="admin-card admin-settings">
        <div className="admin-card__head">
          <div><p>THÔNG BÁO</p><h3>Tuỳ chọn nhận thông tin</h3></div>
        </div>
        {SETTING_ROWS.map(([key, name, description]) => (
          <div className="admin-setting" key={key}>
            <div>
              <b>{name}</b>
              <p>{description}</p>
            </div>
            <button
              className={`admin-toggle ${settings[key] ? 'is-on' : ''}`}
              aria-pressed={settings[key]}
              onClick={() => onToggle(key)}
            >
              <span />
            </button>
          </div>
        ))}
      </article>

      <BackupSection onToast={showToast} />

      <article className="admin-card admin-danger-zone">
        <div>
          <p>VÙNG QUẢN TRỊ</p>
          <h3>Đặt lại dữ liệu mock</h3>
          <span>Chỉ dùng khi bạn muốn khôi phục dữ liệu quản trị ban đầu trên trình duyệt này.</span>
          <button
            className="admin-button admin-button--danger"
            onClick={() => { localStorage.removeItem('techstore_admin_state'); window.location.reload(); }}
          >
            Khôi phục dữ liệu
          </button>
        </div>
      </article>

      {toast && <div className="admin-toast">✓ {toast}</div>}
    </>
  );
}
