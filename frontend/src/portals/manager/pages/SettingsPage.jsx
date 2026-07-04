import { useEffect, useMemo, useState, useRef } from 'react';
import { recoveryApi } from '../../../api/recoveryApi';
import { Spinner, Skeleton, SkeletonLines } from '../components/index';

const SETTING_ROWS = [
  ['stockAlert', 'Cảnh báo tồn kho thấp', 'Gửi thông báo khi số lượng tồn xuống dưới mức tối thiểu.'],
  ['orderAlert', 'Thông báo đơn hàng mới', 'Hiển thị thông báo ngay khi có đơn đặt hàng mới.'],
  ['weeklyReport', 'Báo cáo hằng tuần', 'Gửi tóm tắt doanh thu và tồn kho vào mỗi thứ Hai.'],
];

const RESTORE_MESSAGES = {
  missing: 'The selected backup file is missing or corrupted. Please choose another recovery point',
  failed: 'Restore process failed due to a system error. The previous stable state has been recovered',
  incompatible: 'The restored backup is incompatible with the current application version',
};

const toneColor = {
  READY: { bg: '#dcfce7', fg: '#15803d', dot: '#16a34a' },
  INVALID: { bg: '#fee2e2', fg: '#b91c1c', dot: '#ef4444' },
  SUCCESS: { bg: '#dcfce7', fg: '#15803d', dot: '#16a34a' },
  FAILURE: { bg: '#fee2e2', fg: '#b91c1c', dot: '#ef4444' },
  WARNING: { bg: '#fef3c7', fg: '#a16207', dot: '#f59e0b' },
};

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.value)) return value.value;
  return [];
}

function formatDate(value) {
  if (!value) return 'Không có';
  return new Date(value).toLocaleString('vi-VN');
}

function formatBytes(value) {
  if (!value) return '0 KB';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function StatusPill({ value }) {
  const tone = toneColor[value] || toneColor.WARNING;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 999,
      background: tone.bg,
      color: tone.fg,
      padding: '5px 9px',
      fontSize: 10,
      fontWeight: 850,
      letterSpacing: '.04em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: tone.dot }} />
      {value}
    </span>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
      <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 850, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</span>
      <b style={{
        color: '#0d1117',
        fontSize: 12.5,
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' : 'inherit',
        wordBreak: 'break-word',
      }}>
        {value || '-'}
      </b>
    </div>
  );
}

function RestoreConfirmDialog({ point, restoreType, scope, onConfirm, onClose, restoring, success }) {
  const isFull = restoreType === 'FULL';
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Đang khởi tạo...');
  const terminalRef = useRef(null);

  const LOG_STEPS = useMemo(() => [
    { threshold: 5, text: '[INFO] Đang kích hoạt chế độ bảo trì hệ thống...' },
    { threshold: 12, text: '[INFO] Đang khóa tạm thời tất cả kết nối từ người dùng...' },
    { threshold: 20, text: '[INFO] Đang đọc metadata và kiểm tra checksum của bản backup...' },
    { threshold: 28, text: '[INFO] Khởi chạy pg_dump.exe để tạo bản backup dự phòng khẩn cấp...' },
    { threshold: 45, text: '[INFO] Đã tạo và lưu thành công bản backup dự phòng vào bộ nhớ RAM.' },
    { threshold: 52, text: '[INFO] Đọc file SQL payload và chuẩn bị ghi đè database...' },
    { threshold: 60, text: '[INFO] Khởi chạy psql.exe để nạp dữ liệu vào schema "public"...' },
    { threshold: 72, text: '[INFO] Đang xóa các bảng hiện tại và tái tạo lại cấu trúc mới...' },
    { threshold: 82, text: '[INFO] Đang import dữ liệu: products, orders, customers, inventory...' },
    { threshold: 88, text: '[INFO] Quá trình nhập dữ liệu psql hoàn thành thành công.' },
    { threshold: 92, text: '[INFO] Đang ghi chép lịch sử khôi phục vào audit-events.jsonl...' },
    { threshold: 96, text: '[INFO] Đang tắt chế độ bảo trì hệ thống...' },
    { threshold: 99, text: '[INFO] Đang đồng bộ hóa dữ liệu và chuẩn bị tải lại giao diện...' },
    { threshold: 100, text: '[SUCCESS] Khôi phục dữ liệu hoàn tất 100%! Đang tải lại trang...', isSuccess: true }
  ], []);

  useEffect(() => {
    if (!restoring && !success) {
      setProgress(0);
      return;
    }

    if (success) {
      setProgress(100);
      setStatusText('Khôi phục dữ liệu thành công! Đang làm mới hệ thống...');
      return;
    }

    setProgress(5);
    setStatusText('Đang kích hoạt chế độ bảo trì...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 25) {
          setStatusText('Đang bật chế độ bảo trì...');
          return prev + 3;
        } else if (prev < 60) {
          setStatusText('Đang tạo bản sao lưu khẩn cấp dự phòng...');
          return prev + 2;
        } else if (prev < 88) {
          setStatusText('Đang nạp dữ liệu SQL và ghi đè database...');
          return prev + 1.2;
        } else if (prev < 98) {
          setStatusText('Đang hoàn tất và kiểm tra tính toàn vẹn...');
          return prev + 0.3;
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [restoring, success]);

  const activeLogs = useMemo(() => {
    return LOG_STEPS.filter(step => {
      if (step.threshold === 100) return success;
      return progress >= step.threshold;
    });
  }, [progress, success, LOG_STEPS]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [activeLogs.length]);

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
      style={{ zIndex: 400 }}
    >
      <section
        className="admin-modal"
        style={{ width: 'min(760px, calc(100vw - 40px))' }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal__head">
          <div>
            <p>XÁC NHẬN KHÔI PHỤC</p>
            <h2>{isFull ? 'Khôi phục toàn bộ' : 'Khôi phục một phần'}</h2>
          </div>
          <button type="button" className="admin-close" onClick={onClose} disabled={restoring || success}>x</button>
        </div>

        {(restoring || success) ? (
          <div style={{ padding: '24px 12px', display: 'grid', gap: 20, justifyItems: 'center', textAlign: 'center' }}>
            <style>{`
              @keyframes admin-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes admin-pulse {
                0% { transform: scale(0.95); opacity: 0.5; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(0.95); opacity: 0.5; }
              }
            `}</style>
            <div style={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                animation: 'admin-pulse 2s infinite ease-in-out',
              }} />
              {success ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'admin-spin 2s linear infinite' }}>
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              )}
            </div>

            <div style={{ width: '100%', maxWidth: 500, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#334155' }}>
                <span>{statusText}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: success ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                  borderRadius: 999,
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease',
                }} />
              </div>
            </div>

            {/* Terminal Log Console */}
            <div 
              ref={terminalRef}
              style={{
                width: '100%',
                maxWidth: 550,
                height: 145,
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '12px 16px',
                overflowY: 'auto',
                textAlign: 'left',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: 11.5,
                lineHeight: 1.6,
                color: '#cbd5e1',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)'
              }}
            >
              {activeLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    color: log.isSuccess ? '#10b981' : '#f8fafc',
                    fontWeight: log.isSuccess ? 'bold' : 'normal'
                  }}
                >
                  {log.text}
                </div>
              ))}
            </div>
            
            <p style={{ color: '#64748b', fontSize: 12.5, margin: 0 }}>
              {success 
                ? 'Hệ thống đã phục hồi xong. Trang web sẽ tự làm mới sau giây lát...' 
                : 'Vui lòng giữ nguyên cửa sổ này, không tắt trình duyệt hoặc tải lại trang.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  <InfoRow label="Điểm phục hồi" value={formatDate(point.createdAt)} />
                  <InfoRow label="Phạm vi khôi phục" value={isFull ? 'FULL' : scope} />
                  <InfoRow label="Phiên bản ứng dụng" value={point.appVersion} />
                  <InfoRow label="Dung lượng backup" value={formatBytes(point.sizeBytes)} />
                </div>
                <InfoRow label="Checksum" value={point.checksum} mono />
              </div>

              <div style={{ border: '1px solid #fde68a', background: '#fffbeb', borderRadius: 10, padding: 14 }}>
                <b style={{ color: '#92400e', display: 'block', fontSize: 13, marginBottom: 8 }}>Cảnh báo thời gian gián đoạn</b>
                <div style={{ display: 'grid', gap: 7, color: '#92400e', fontSize: 12.5, lineHeight: 1.55 }}>
                  <span>Ứng dụng sẽ chuyển sang chế độ bảo trì trong lúc khôi phục.</span>
                  <span>Metadata và checksum của backup sẽ được kiểm tra trước khi thực thi.</span>
                  <span>Hệ thống sẽ tạo snapshot tạm thời trước khi thay thế dữ liệu.</span>
                  <span>{isFull ? 'Toàn bộ dữ liệu được hỗ trợ sẽ được khôi phục.' : 'Chỉ module đã chọn sẽ được khôi phục.'}</span>
                </div>
              </div>
            </div>

            <div className="admin-modal__actions">
              <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={restoring}>
                Hủy
              </button>
              <button type="button" className="admin-button" style={{ background: '#dc2626', borderColor: '#dc2626' }} onClick={onConfirm} disabled={restoring}>
                Bắt đầu khôi phục
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function BackupSection({ onToast }) {
  const [points, setPoints] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [restoreType, setRestoreType] = useState('FULL');
  const [scope, setScope] = useState('PRODUCT_CATALOG');
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [error, setError] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [recommendedPointId, setRecommendedPointId] = useState('');

  const selectedPoint = useMemo(
    () => points.find((point) => point.id === selected?.id) || selected,
    [points, selected],
  );

  const latestLog = auditLogs[0];
  const readyCount = points.filter((point) => point.status === 'READY').length;

  const loadRecoveryData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pointData, auditData] = await Promise.all([
        recoveryApi.getRecoveryPoints(),
        recoveryApi.getAuditLogs(),
      ]);
      const nextPoints = normalizeList(pointData);
      setPoints(nextPoints);
      setAuditLogs(normalizeList(auditData));
      if (selected) {
        setSelected(nextPoints.find((point) => point.id === selected.id) || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách recovery points.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecoveryData();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    setError('');
    setRecommendedPointId('');
    try {
      const point = await recoveryApi.createRecoveryPoint({
        label: `Manual Backup ${new Date().toLocaleString('vi-VN')}`,
        scope: 'FULL',
      });
      setSelected(point);
      onToast('Đã tạo recovery point mới');
      await loadRecoveryData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không tạo được backup.');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedPoint) return;
    setRestoring(true);
    setRestoreSuccess(false);
    setError('');
    setRecommendedPointId('');
    try {
      const response = await recoveryApi.restoreRecoveryPoint(selectedPoint.id, {
        restoreType,
        scope: restoreType === 'FULL' ? 'FULL' : scope,
      });
      setMaintenanceMode(response.maintenanceMode);
      setRestoreSuccess(true);
      onToast(response.message || 'Đã khôi phục dữ liệu thành công!');
      setTimeout(() => {
        localStorage.removeItem('techstore_admin_state');
        window.location.reload();
      }, 2000);
    } catch (err) {
      const data = err.response?.data;
      setMaintenanceMode(!!data?.maintenanceMode);
      setRecommendedPointId(data?.recommendedRecoveryPointId || '');
      setError(data?.message || RESTORE_MESSAGES.failed);
      setConfirm(false);
      setRestoreSuccess(false);
      await loadRecoveryData();
    } finally {
      setRestoring(false);
    }
  };

  return (
    <section style={{ display: 'grid', gap: 16, marginTop: 16 }}>
      <article className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 22, borderBottom: '1px solid #eef2f7', display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 850, letterSpacing: '1.1px', textTransform: 'uppercase' }}>SAO LƯU & KHÔI PHỤC</p>
            <h3 style={{ fontSize: 17, marginTop: 5 }}>Bảng điều khiển phục hồi</h3>
          </div>
          <div className="admin-button-group">
            <button className="admin-button admin-button--secondary" onClick={loadRecoveryData} disabled={loading}>
              {loading ? <Spinner label="Đang tải..." /> : 'Tải lại'}
            </button>
            <button className="admin-button" onClick={handleCreateBackup} disabled={creating}>
              {creating ? <Spinner label="Đang tạo..." /> : '+ Tạo backup'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: '#eef2f7' }}>
          {[
            ['Recovery points', points.length],
            ['Backup sẵn sàng', readyCount],
            ['Lần khôi phục gần nhất', latestLog ? latestLog.status : 'Chưa có'],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#fff', padding: '16px 20px' }}>
              <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 850, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</span>
              {loading ? (
                <Skeleton width={48} height={20} style={{ marginTop: 8 }} />
              ) : (
                <b style={{ display: 'block', marginTop: 6, color: '#0d1117', fontSize: 22, letterSpacing: '-.03em' }}>{value}</b>
              )}
            </div>
          ))}
        </div>

        {(maintenanceMode || error) && (
          <div style={{ padding: '16px 20px 0' }}>
            {maintenanceMode && (
              <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 10, padding: '11px 14px', marginBottom: 10, fontSize: 13, fontWeight: 750 }}>
                Chế độ bảo trì đang bật. Vui lòng kiểm tra trạng thái khôi phục trước khi vận hành bình thường.
              </div>
            )}
            {error && (
              <div style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', borderRadius: 10, padding: '11px 14px', fontSize: 13 }}>
                <b style={{ display: 'block', marginBottom: 4 }}>{error}</b>
                {recommendedPointId && <span>Recovery point được đề xuất: {recommendedPointId}</span>}
              </div>
            )}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 0,
          borderTop: '1px solid #eef2f7',
        }}>
          <div style={{ padding: 22, borderRight: '1px solid #eef2f7', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 14, color: '#0d1117' }}>Recovery points</h4>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{points.length} mục</span>
            </div>

            <div style={{ display: 'grid', gap: 10, maxHeight: 430, overflow: 'auto', paddingRight: 4 }}>
              {loading ? (
                <div style={{ padding: 18, border: '1px solid #eef2f7', borderRadius: 10 }}>
                  <SkeletonLines count={4} />
                </div>
              ) : points.length === 0 ? (
                <div style={{ padding: 18, color: '#6b7280', border: '1.5px dashed #dbe1e8', borderRadius: 10, fontSize: 13 }}>
                  Chưa có backup nào.
                </div>
              ) : points.map((point) => {
                const isSelected = selected?.id === point.id;
                return (
                  <button
                    type="button"
                    key={point.id}
                    onClick={() => setSelected(isSelected ? null : point)}
                    style={{
                      display: 'grid',
                      gap: 10,
                      padding: 14,
                      border: `1.5px solid ${isSelected ? '#0d1117' : '#e5e7eb'}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: isSelected ? '#f8fafc' : '#fff',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <b style={{ color: '#0d1117', fontSize: 13.5 }}>{point.label || 'Backup chưa đặt tên'}</b>
                      <StatusPill value={point.status} />
                    </div>
                    <span style={{ color: '#64748b', fontSize: 12 }}>{formatDate(point.createdAt)} · {point.scope} · {formatBytes(point.sizeBytes)}</span>
                    <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {point.checksum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: 22, display: 'grid', gap: 16, alignContent: 'start', minWidth: 0 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, color: '#0d1117' }}>Thiết lập khôi phục</h4>
              <p style={{ margin: '5px 0 0', color: '#94a3b8', fontSize: 12 }}>
                {selectedPoint ? 'Recovery point đã chọn sẵn sàng để xác nhận.' : 'Chọn một recovery point để tiếp tục.'}
              </p>
            </div>

            {selectedPoint ? (
              <>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <InfoRow label="Thời gian tạo" value={formatDate(selectedPoint.createdAt)} />
                  <InfoRow label="Người tạo" value={selectedPoint.createdBy} />
                  <InfoRow label="Phạm vi" value={selectedPoint.scope} />
                  <InfoRow label="Phiên bản" value={selectedPoint.appVersion} />
                  <InfoRow label="Checksum" value={selectedPoint.checksum} mono />
                  <InfoRow label="Dung lượng" value={formatBytes(selectedPoint.sizeBytes)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  {[
                    ['FULL', 'Khôi phục toàn bộ', 'Khôi phục toàn bộ snapshot được hỗ trợ.'],
                    ['PARTIAL', 'Khôi phục một phần', 'Chỉ khôi phục một module được hỗ trợ.'],
                  ].map(([value, label, desc]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRestoreType(value)}
                      style={{
                        padding: 16,
                        border: `1.5px solid ${restoreType === value ? '#0d1117' : '#e2e8f0'}`,
                        borderRadius: 10,
                        background: restoreType === value ? '#f8fafc' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                    >
                      <b style={{ color: '#0d1117', display: 'block', fontSize: 13.5 }}>{label}</b>
                      <span style={{ color: '#64748b', display: 'block', marginTop: 5, fontSize: 12, lineHeight: 1.45 }}>{desc}</span>
                    </button>
                  ))}
                </div>

                {restoreType === 'PARTIAL' && (
                  <label className="admin-field" style={{ maxWidth: 280 }}>
                    Module dữ liệu
                    <select value={scope} onChange={(event) => setScope(event.target.value)}>
                      <option value="PRODUCT_CATALOG">Product Catalog</option>
                    </select>
                  </label>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: 16, border: '1px solid #fde68a', background: '#fffbeb', borderRadius: 10 }}>
                  <span style={{ color: '#92400e', fontSize: 12.5, lineHeight: 1.5 }}>
                    Backup sẽ được kiểm tra, snapshot tạm thời sẽ được tạo, và kết quả khôi phục sẽ được ghi vào audit log.
                  </span>
                  <button
                    className="admin-button admin-button--danger"
                    onClick={() => setConfirm(true)}
                    disabled={restoring || selectedPoint.status === 'INVALID'}
                    style={{ whiteSpace: 'nowrap', marginTop: 0 }}
                  >
                    {restoring ? <Spinner label="Đang khôi phục..." /> : 'Khôi phục'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ border: '1.5px dashed #dbe1e8', borderRadius: 12, padding: 26, color: '#64748b', fontSize: 13, textAlign: 'center', overflowWrap: 'anywhere' }}>
                Chọn một recovery point bên trái để xem checksum, phạm vi và bắt đầu khôi phục.
              </div>
            )}

            <div style={{ borderTop: '1px solid #eef2f7', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <h4 style={{ margin: 0, fontSize: 14, color: '#0d1117' }}>Audit log</h4>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>{auditLogs.length} mục</span>
              </div>
              {auditLogs.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Chưa có hoạt động restore nào.</p>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr) auto', alignItems: 'center', gap: 12, border: '1px solid #eef2f7', borderRadius: 10, padding: '11px 14px' }}>
                      <StatusPill value={log.status} />
                      <div style={{ minWidth: 0 }}>
                        <b style={{ color: '#0d1117', fontSize: 12.5, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.message}</b>
                        <span style={{ color: '#64748b', fontSize: 11 }}>{log.restoreType} · {log.scope} · {log.actor}</span>
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: 11, whiteSpace: 'nowrap' }}>{formatDate(log.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {confirm && selectedPoint && (
        <RestoreConfirmDialog
          point={selectedPoint}
          restoreType={restoreType}
          scope={scope}
          restoring={restoring}
          success={restoreSuccess}
          onConfirm={handleRestore}
          onClose={() => !restoring && !restoreSuccess && setConfirm(false)}
        />
      )}
    </section>
  );
}

export function SettingsPage({ settings, onToggle }) {
  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>Thay đổi được lưu theo cấu hình hệ thống</p>
          <h2>Cài đặt hệ thống</h2>
        </div>
      </div>

      <article className="admin-card admin-settings" style={{ maxWidth: 'none', width: '100%' }}>
        <div className="admin-card__head">
          <div><p>THÔNG BÁO</p><h3>Tùy chọn nhận thông tin</h3></div>
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



      {toast && <div className="admin-toast">OK {toast}</div>}
    </>
  );
}
