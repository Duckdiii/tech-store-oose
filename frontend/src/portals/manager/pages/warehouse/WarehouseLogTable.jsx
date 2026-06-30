import { formatDate } from './utils';

const logTypeLabel = (type) => type === 'IMPORT' ? 'Nhập kho' : 'Xuất kho';
const statusLabel = (status) =>
  status === 'SUCCESS' ? 'Thành công' : status === 'PENDING' ? 'Đang xử lý' : 'Thất bại';

export function WarehouseLogTable({ logs, loading, onShowDetail }) {
  return (
    <article className="admin-card warehouse-log-table">
      <div className="admin-card__head">
        <div>
          <p>KẾT QUẢ TRA CỨU</p>
          <h3>{logs.length ? `${logs.length} phiếu nhập/xuất` : 'Chưa có nhật ký phù hợp'}</h3>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Loại phiếu</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Người thực hiện</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={`${log.logType}-${log.logId}`}>
                <td><b>{log.logId}</b></td>
                <td>{logTypeLabel(log.logType)}</td>
                <td>{log.productNames}</td>
                <td>{log.totalQuantity}</td>
                <td>{log.performedBy}</td>
                <td>{formatDate(log.occurredAt)}</td>
                <td>{statusLabel(log.status)}</td>
                <td>
                  <button className="admin-row-action" onClick={() => onShowDetail(log)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && logs.length === 0 && (
        <p className="warehouse-empty">Không tìm thấy phiếu nhập/xuất nào theo bộ lọc hiện tại.</p>
      )}
    </article>
  );
}

export { logTypeLabel, statusLabel };
