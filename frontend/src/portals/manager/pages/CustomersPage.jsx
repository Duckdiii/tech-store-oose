import { useEffect, useState } from 'react';
import { ConfirmDialog, Status, DataTable, EmptyState, Spinner } from '../components/index';
import { money, initials } from '../utils';
import { customerApi } from '../../../api/customerApi';

const PAGE_SIZE = 10;

const MEMBERSHIP_TIER_LABEL = {
  STANDARD: 'Member',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  DIAMOND: 'Diamond',
};

export function CustomersPage({ refreshToken, onToggle }) {
  const [blockConfirm, setBlockConfirm] = useState(null);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [visible, setVisible] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const isFiltering = search.trim() !== '';

  // Đổi từ khóa tìm kiếm thì quay về trang đầu.
  useEffect(() => { setPage(0); }, [search]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await customerApi.search({
          keyword: search.trim() || undefined,
          page,
          size: PAGE_SIZE,
          sort: `${sortKey},${sortDir}`,
        });
        const mapped = (data.content || []).map((c) => ({
          id: c.customerId,
          accountId: c.accountId,
          name: c.name,
          email: c.email,
          phone: c.phone,
          orders: Number(c.totalOrders || 0),
          spent: Number(c.totalSpent || 0),
          tier: MEMBERSHIP_TIER_LABEL[c.tier] || c.tier,
          active: c.active,
        }));
        setVisible(mapped);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Failed to fetch customers', err);
        setVisible([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, sortKey, sortDir, refreshToken]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = [
    { label: 'Khách hàng',     key: 'name'   },
    { label: 'Email',          key: 'email'  },
    'Số đơn',
    'Tổng chi tiêu',
    { label: 'Hạng',           key: 'tier'   },
    'Trạng thái',
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{totalElements} khách hàng{isFiltering ? ' phù hợp' : ''}</p>
          <h2>Khách hàng</h2>
        </div>
      </div>

      <article className="admin-card">
        <div className="admin-filterbar" style={{ marginBottom: 12 }}>
          <input
            type="text"
            className="admin-status-select"
            placeholder="Tìm theo tên, email hoặc số điện thoại"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </div>

        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {loading ? (
            <tr>
              <td colSpan={99} style={{ padding: '48px 20px', textAlign: 'center' }}>
                <Spinner label="Đang tải khách hàng..." />
              </td>
            </tr>
          ) : visible.length === 0 ? (
            <EmptyState
              message={isFiltering ? 'Không có khách hàng nào phù hợp' : 'Chưa có khách hàng nào'}
              hint={isFiltering ? 'Thử từ khóa khác.' : 'Khách hàng sẽ xuất hiện ở đây sau khi họ đăng ký tài khoản.'}
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

        {!loading && totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-button admin-button--secondary"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ‹ Trước
            </button>
            <span>Trang {page + 1} / {totalPages}</span>
            <button
              className="admin-button admin-button--secondary"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Sau ›
            </button>
          </div>
        )}
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
          onConfirm={() => onToggle(blockConfirm)}
          onClose={() => setBlockConfirm(null)}
        />
      )}
    </>
  );
}
