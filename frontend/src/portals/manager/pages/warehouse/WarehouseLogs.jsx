import { useEffect, useState } from 'react';
import { downloadWarehouseLogs, getApiError, getWarehouseLogDetail, getWarehouseLogs, saveDownload } from '../../../../api/warehouseApi';
import { ApiMessage, Field } from './components';
import { formatDate, formatMoney } from './utils';

export function WarehouseLogs() {
  const [filters, setFilters] = useState({ from: '', to: '', logType: '', status: '', performedBy: '' });
  const [logs, setLogs] = useState([]);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (event) => {
    event?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await getWarehouseLogs(filters);
      setLogs(response.logs || []);
      setDetail(null);
    } catch (requestError) {
      setLogs([]);
      setError(getApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const showDetail = async (log) => {
    setError('');
    try {
      setDetail(await getWarehouseLogDetail(log.logType, log.logId));
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  };

  const exportLogs = async (format) => {
    setError('');
    try {
      saveDownload(await downloadWarehouseLogs(filters, format));
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  };

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logTypeLabel = (type) => type === 'IMPORT' ? 'Nhập kho' : 'Xuất kho';
  const statusLabel = (status) => status === 'SUCCESS' ? 'Thành công' : status === 'PENDING' ? 'Đang xử lý' : 'Thất bại';

  return <section className="warehouse-flow"><div className="admin-page-intro"><div><p>THEO DÕI NHẬP XUẤT</p><h2>Nhật ký kho</h2></div><div className="admin-button-group"><button className="admin-button admin-button--secondary" onClick={() => exportLogs('CSV')}>Xuất file CSV</button><button className="admin-button admin-button--secondary" onClick={() => exportLogs('EXCEL')}>Xuất file Excel</button></div></div><form onSubmit={load} className="admin-card warehouse-filter-grid"><Field label="Từ ngày"><input type="datetime-local" value={filters.from} onChange={(event) => update('from', event.target.value)} /></Field><Field label="Đến ngày"><input type="datetime-local" value={filters.to} onChange={(event) => update('to', event.target.value)} /></Field><Field label="Loại phiếu"><select value={filters.logType} onChange={(event) => update('logType', event.target.value)}><option value="">Tất cả</option><option value="IMPORT">Phiếu nhập</option><option value="EXPORT">Phiếu xuất</option></select></Field><Field label="Trạng thái"><select value={filters.status} onChange={(event) => update('status', event.target.value)}><option value="">Tất cả</option><option value="SUCCESS">Thành công</option><option value="PENDING">Đang xử lý</option><option value="FAILURE">Thất bại</option></select></Field><Field label="Người thực hiện" wide><input value={filters.performedBy} onChange={(event) => update('performedBy', event.target.value)} placeholder="Nhập email hoặc mã nhân viên" /></Field><div className="warehouse-actions"><button className="admin-button" disabled={loading}>{loading ? 'Đang tải...' : 'Lọc nhật ký'}</button></div></form><ApiMessage error={error} />
    <article className="admin-card warehouse-log-table"><div className="admin-card__head"><div><p>KẾT QUẢ TRA CỨU</p><h3>{logs.length ? `${logs.length} phiếu nhập/xuất` : 'Chưa có nhật ký phù hợp'}</h3></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã phiếu</th><th>Loại phiếu</th><th>Sản phẩm</th><th>Số lượng</th><th>Người thực hiện</th><th>Thời gian</th><th>Trạng thái</th><th /></tr></thead><tbody>{logs.map((log) => <tr key={`${log.logType}-${log.logId}`}><td><b>{log.logId}</b></td><td>{logTypeLabel(log.logType)}</td><td>{log.productNames}</td><td>{log.totalQuantity}</td><td>{log.performedBy}</td><td>{formatDate(log.occurredAt)}</td><td>{statusLabel(log.status)}</td><td><button className="admin-row-action" onClick={() => showDetail(log)}>Xem chi tiết</button></td></tr>)}</tbody></table></div>{!loading && logs.length === 0 && <p className="warehouse-empty">Không tìm thấy phiếu nhập/xuất nào theo bộ lọc hiện tại.</p>}</article>
    {detail && <article className="admin-card warehouse-detail"><div className="admin-card__head"><div><p>CHI TIẾT {logTypeLabel(detail.logType).toUpperCase()}</p><h3>{detail.logId}</h3></div><button className="admin-text-button" onClick={() => setDetail(null)}>Đóng</button></div><div className="warehouse-detail__meta"><span>Người thực hiện: <b>{detail.performedBy}</b></span><span>Thời gian: <b>{formatDate(detail.occurredAt)}</b></span><span>Trạng thái: <b>{statusLabel(detail.status)}</b></span><span>{detail.logType === 'IMPORT' ? 'Ghi chú nhập kho' : 'Lý do xuất kho'}: <b>{detail.note || detail.reason || '-'}</b></span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã máy</th><th>Sản phẩm</th><th>Số lượng</th><th>Giá nhập</th></tr></thead><tbody>{detail.items.map((item) => <tr key={item.productVariantId}><td><b>{item.productVariantId}</b></td><td>{item.productName}</td><td>{item.quantity}</td><td>{item.importPrice == null ? '-' : `${formatMoney(item.importPrice)}đ`}</td></tr>)}</tbody></table></div></article>}
  </section>;
}
