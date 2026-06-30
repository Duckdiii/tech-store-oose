import { DataTable } from '../../components/index';
import { formatDate, formatMoney } from './utils';
import { logTypeLabel, statusLabel } from './WarehouseLogTable';

export function WarehouseLogDetail({ detail, onClose }) {
  if (!detail) return null;

  return (
    <article className="admin-card warehouse-detail">
      <div className="admin-card__head">
        <div>
          <p>CHI TIẾT {logTypeLabel(detail.logType).toUpperCase()}</p>
          <h3>{detail.logId}</h3>
        </div>
        <button className="admin-text-button" onClick={onClose}>Đóng</button>
      </div>

      <div className="warehouse-detail__meta">
        <span>Người thực hiện: <b>{detail.performedBy}</b></span>
        <span>Thời gian: <b>{formatDate(detail.occurredAt)}</b></span>
        <span>Trạng thái: <b>{statusLabel(detail.status)}</b></span>
        <span>
          {detail.logType === 'IMPORT' ? 'Ghi chú nhập kho' : 'Lý do xuất kho'}:{' '}
          <b>{detail.note || detail.reason || '-'}</b>
        </span>
      </div>

      <DataTable columns={['Mã máy', 'Sản phẩm', 'Số lượng', 'Giá nhập']}>
        {detail.items.map((item) => (
          <tr key={item.productVariantId}>
            <td><b>{item.productVariantId}</b></td>
            <td>{item.productName}</td>
            <td>{item.quantity}</td>
            <td>{item.importPrice == null ? '-' : `${formatMoney(item.importPrice)}đ`}</td>
          </tr>
        ))}
      </DataTable>
    </article>
  );
}
