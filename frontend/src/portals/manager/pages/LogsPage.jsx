const MOCK_LOGS = [
  ['10:42',   'Đơn hàng TS20250615002 chuyển sang Đang giao',     'Đơn hàng'],
  ['09:12',   'Nhập kho 12 sản phẩm iPhone 15 Pro Max',           'Kho hàng'],
  ['08:45',   'Nguyễn Đức Duy cập nhật sản phẩm SP-001',          'Sản phẩm'],
  ['Hôm qua', 'Báo cáo doanh thu tháng 05 được xuất',             'Báo cáo'],
  ['Hôm qua', 'Tài khoản Phạm Quốc Bảo được khóa',               'Tài khoản'],
];

export function LogsPage({ onExport }) {
  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>Hoạt động quản trị hệ thống</p>
          <h2>Nhật ký hệ thống</h2>
        </div>
        <button className="admin-button admin-button--secondary" onClick={onExport}>
          Xuất nhật ký
        </button>
      </div>

      <article className="admin-card">
        <div className="admin-log-list">
          {MOCK_LOGS.map(([time, content, type]) => (
            <div key={content}>
              <span>{time}</span>
              <p><b>{type}</b>{content}</p>
              <small>Ghi nhận</small>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
