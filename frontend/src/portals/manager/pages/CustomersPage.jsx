import { useState, useMemo } from 'react';
import { Status, DataTable, EmptyState } from '../components/index';
import { money, initials, sortRows } from '../utils';

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

export function CustomersPage({ customers, onToggle }) {
  const [blockConfirm, setBlockConfirm] = useState(null);
  const [sortKey,      setSortKey]      = useState('');
  const [sortDir,      setSortDir]      = useState('asc');

  const activeCount = customers.filter((c) => c.active).length;

  const visible = useMemo(() => sortRows(customers, sortKey, sortDir), [customers, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = [
    { label: 'Khách hàng',     key: 'name'   },
    'Email',
    { label: 'Số đơn',         key: 'orders' },
    { label: 'Tổng chi tiêu',  key: 'spent'  },
    { label: 'Hạng',           key: 'tier'   },
    { label: 'Trạng thái',     key: 'active' },
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{activeCount} khách hàng đang hoạt động</p>
          <h2>Khách hàng</h2>
        </div>
      </div>

      <article className="admin-card">
        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {visible.length === 0 ? (
            <EmptyState
              message="Chưa có khách hàng nào"
              hint="Khách hàng sẽ xuất hiện ở đây sau khi họ đăng ký tài khoản."
            />
          ) : visible.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="admin-person">
                  <span>{initials(customer.name)}</span>
                  <b>{customer.name}</b>
                </div>
              </td>
              <td>{customer.email}</td>
              <td>{customer.orders}</td>
              <td><b>{money(customer.spent)}</b></td>
              <td><span className="admin-tier">{customer.tier}</span></td>
              <td><Status>{customer.active ? 'Active' : 'Đã khóa'}</Status></td>
              <td>
                <button className="admin-row-action" onClick={() => setBlockConfirm(customer)}>
                  {customer.active ? 'Khóa' : 'Mở khóa'}
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </article>

      {blockConfirm && (
        <ConfirmDialog
          title={blockConfirm.active ? 'Khóa tài khoản khách hàng?' : 'Mở khóa tài khoản?'}
          message={
            blockConfirm.active
              ? `Tài khoản của ${blockConfirm.name} (${blockConfirm.email}) sẽ bị khóa. Khách hàng này sẽ không thể đăng nhập hoặc đặt hàng.`
              : `Tài khoản của ${blockConfirm.name} (${blockConfirm.email}) sẽ được kích hoạt trở lại.`
          }
          confirmLabel={blockConfirm.active ? 'Khóa tài khoản' : 'Mở khóa'}
          danger={blockConfirm.active}
          onConfirm={() => onToggle(blockConfirm.id)}
          onClose={() => setBlockConfirm(null)}
        />
      )}
    </>
  );
}
