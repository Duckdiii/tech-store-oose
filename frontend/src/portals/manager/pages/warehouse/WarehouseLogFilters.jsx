import { Field } from './components';

export function WarehouseLogFilters({ filters, loading, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="admin-card warehouse-filter-grid">
      <Field label="Từ ngày">
        <input
          type="datetime-local"
          value={filters.from}
          onChange={(event) => onChange('from', event.target.value)}
        />
      </Field>
      <Field label="Đến ngày">
        <input
          type="datetime-local"
          value={filters.to}
          onChange={(event) => onChange('to', event.target.value)}
        />
      </Field>
      <Field label="Loại phiếu">
        <select value={filters.logType} onChange={(event) => onChange('logType', event.target.value)}>
          <option value="">Tất cả</option>
          <option value="IMPORT">Phiếu nhập</option>
          <option value="EXPORT">Phiếu xuất</option>
        </select>
      </Field>
      <Field label="Trạng thái">
        <select value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">Tất cả</option>
          <option value="SUCCESS">Thành công</option>
          <option value="PENDING">Đang xử lý</option>
          <option value="FAILURE">Thất bại</option>
        </select>
      </Field>
      <Field label="Người thực hiện" wide>
        <input
          value={filters.performedBy}
          onChange={(event) => onChange('performedBy', event.target.value)}
          placeholder="Nhập email hoặc mã nhân viên"
        />
      </Field>
      <div className="warehouse-actions">
        <button className="admin-button" disabled={loading}>
          {loading ? 'Đang tải...' : 'Lọc nhật ký'}
        </button>
      </div>
    </form>
  );
}
