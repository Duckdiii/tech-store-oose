import { useState, useMemo } from 'react';
import { Status, DataTable, EmptyState } from '../components/index';
import { initials, sortRows } from '../utils';

const LOGIN_LOG_STATUSES = ['Tất cả', 'Success', 'Failed'];
const LOGIN_LOG_ROLES    = ['Tất cả', 'Staff', 'Manager'];

const MOCK_LOGIN_LOGS = [
  { id: 'LL-001', time: '24/06/2026 09:12', email: 'duy.nguyen@techstore.vn',  role: 'Manager', status: 'Success' },
  { id: 'LL-002', time: '24/06/2026 08:55', email: 'ha.tran@techstore.vn',     role: 'Staff',   status: 'Success' },
  { id: 'LL-003', time: '23/06/2026 17:30', email: 'khoa.le@techstore.vn',     role: 'Staff',   status: 'Failed'  },
  { id: 'LL-004', time: '23/06/2026 14:02', email: 'ha.tran@techstore.vn',     role: 'Staff',   status: 'Success' },
  { id: 'LL-005', time: '23/06/2026 09:45', email: 'duy.nguyen@techstore.vn',  role: 'Manager', status: 'Success' },
  { id: 'LL-006', time: '22/06/2026 18:11', email: 'khoa.le@techstore.vn',     role: 'Staff',   status: 'Failed'  },
  { id: 'LL-007', time: '22/06/2026 08:03', email: 'ha.tran@techstore.vn',     role: 'Staff',   status: 'Success' },
];

function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', minWidth: 360, maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0d1117', margin: '0 0 10px' }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button>
          <button
            className="admin-button"
            style={danger ? { background: '#ef4444', color: '#fff' } : {}}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginLogTab() {
  const [filterEmail,  setFilterEmail]  = useState('');
  const [filterRole,   setFilterRole]   = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterDate,   setFilterDate]   = useState('');

  const rows = MOCK_LOGIN_LOGS.filter((log) => {
    if (filterEmail  && !log.email.toLowerCase().includes(filterEmail.toLowerCase())) return false;
    if (filterRole   !== 'Tất cả' && log.role   !== filterRole)   return false;
    if (filterStatus !== 'Tất cả' && log.status !== filterStatus) return false;
    if (filterDate   && !log.time.startsWith(filterDate.split('-').reverse().join('/'))) return false;
    return true;
  });

  const exportCsv = () => {
    const header = 'Thời gian,Email,Vai trò,Trạng thái';
    const body = rows.map((r) => `"${r.time}","${r.email}","${r.role}","${r.status}"`).join('\n');
    const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nhat-ky-dang-nhap.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const hasFilter = filterEmail || filterRole !== 'Tất cả' || filterStatus !== 'Tất cả' || filterDate;

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>Chỉ theo dõi tài khoản Staff và Manager</p>
          <h2>Nhật ký đăng nhập</h2>
        </div>
        <button className="admin-button admin-button--secondary" onClick={exportCsv}>Xuất nhật ký</button>
      </div>

      <article className="admin-card">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <input
            className="admin-status-select"
            style={{ minWidth: 180 }}
            placeholder="Tìm theo email..."
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary, #64748b)' }}>
            Vai trò
            <select className="admin-status-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              {LOGIN_LOG_ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary, #64748b)' }}>
            Trạng thái
            <select className="admin-status-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {LOGIN_LOG_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary, #64748b)' }}>
            Ngày
            <input type="date" className="admin-status-select" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </label>
          {hasFilter && (
            <button className="admin-row-action" onClick={() => { setFilterEmail(''); setFilterRole('Tất cả'); setFilterStatus('Tất cả'); setFilterDate(''); }}>
              Xóa bộ lọc
            </button>
          )}
        </div>

        <DataTable columns={['Thời gian', 'Email', 'Vai trò', 'Trạng thái']}>
          {rows.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '28px 0' }}>Không có bản ghi phù hợp</td></tr>
          ) : rows.map((log) => (
            <tr key={log.id}>
              <td style={{ color: '#64748b', fontSize: 12 }}>{log.time}</td>
              <td>{log.email}</td>
              <td><span className="admin-role">{log.role}</span></td>
              <td><Status>{log.status === 'Success' ? 'Active' : 'Đã khóa'}</Status></td>
            </tr>
          ))}
        </DataTable>
      </article>
    </>
  );
}

export function StaffPage({ staff, onToggle, onAdd, onDelete }) {
  const [tab,           setTab]           = useState('staff');
  const [blockConfirm,  setBlockConfirm]  = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortKey,       setSortKey]       = useState('');
  const [sortDir,       setSortDir]       = useState('asc');

  const activeCount = staff.filter((m) => m.active).length;

  const sortedStaff = useMemo(() => sortRows(staff, sortKey, sortDir), [staff, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid #e9ecef', marginBottom: 24 }}>
        {[['staff', 'Nhân viên'], ['login-log', 'Nhật ký đăng nhập']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '10px 22px',
              background: 'none',
              border: 'none',
              borderBottom: `2.5px solid ${tab === key ? '#0d1117' : 'transparent'}`,
              marginBottom: -1.5,
              fontSize: 14,
              fontWeight: tab === key ? 700 : 500,
              color: tab === key ? '#0d1117' : '#6b7280',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'staff' && (
        <>
          <div className="admin-page-intro">
            <div>
              <p>{activeCount} thành viên hoạt động</p>
              <h2>Nhân viên &amp; phân quyền</h2>
            </div>
            <button className="admin-button" onClick={onAdd}>+ Thêm nhân viên</button>
          </div>

          <article className="admin-card">
            <DataTable
              columns={[
                { label: 'Nhân viên',    key: 'name'     },
                'Mã NV',
                'Email',
                'Số điện thoại',
                { label: 'Ngày vào làm', key: 'hireDate' },
                { label: 'Vai trò',      key: 'role'     },
                { label: 'Trạng thái',   key: 'active'   },
                '',
              ]}
              sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
            >
              {sortedStaff.length === 0 ? (
                <EmptyState
                  message="Chưa có nhân viên nào"
                  hint="Thêm nhân viên đầu tiên để bắt đầu quản lý nhân sự."
                  actionLabel="+ Thêm nhân viên"
                  onAction={onAdd}
                />
              ) : sortedStaff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="admin-person">
                      <span>{initials(member.name)}</span>
                      <b>{member.name}</b>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>{member.staffCode || member.id}</td>
                  <td>{member.email}</td>
                  <td>{member.phone || '—'}</td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>{member.hireDate || '—'}</td>
                  <td><span className="admin-role">{member.role}</span></td>
                  <td><Status>{member.active ? 'Active' : 'Đã khóa'}</Status></td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-row-action"
                        onClick={() => setBlockConfirm(member)}
                      >
                        {member.active ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button
                        className="admin-row-action admin-row-action--danger"
                        onClick={() => setDeleteConfirm(member)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          </article>
        </>
      )}

      {tab === 'login-log' && <LoginLogTab />}

      {blockConfirm && (
        <ConfirmDialog
          title={blockConfirm.active ? 'Khóa tài khoản nhân viên?' : 'Mở khóa tài khoản?'}
          message={
            blockConfirm.active
              ? `Tài khoản của ${blockConfirm.name} (${blockConfirm.email}) sẽ bị vô hiệu hóa. Nhân viên này sẽ không thể đăng nhập hệ thống.`
              : `Tài khoản của ${blockConfirm.name} (${blockConfirm.email}) sẽ được kích hoạt lại.`
          }
          confirmLabel={blockConfirm.active ? 'Khóa tài khoản' : 'Mở khóa'}
          danger={blockConfirm.active}
          onConfirm={() => onToggle(blockConfirm.id)}
          onClose={() => setBlockConfirm(null)}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Xóa nhân viên?"
          message={`Hành động này sẽ xóa vĩnh viễn nhân viên ${deleteConfirm.name} (${deleteConfirm.email}) và toàn bộ tài khoản liên kết. Không thể hoàn tác.`}
          confirmLabel="Xóa vĩnh viễn"
          danger
          onConfirm={() => onDelete(deleteConfirm.id)}
          onClose={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
