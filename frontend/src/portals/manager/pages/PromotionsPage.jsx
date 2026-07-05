import { useEffect, useState } from 'react';
import { promotionApi } from '../../../api/promotionApi';
import { productApi } from '../../../api/productApi';
import { Spinner, SkeletonTableRows, Skeleton } from '../components/index';

const STATUS_FILTERS = [
  ['ALL', 'Tất cả'],
  ['ACTIVE', 'Đang bật'],
  ['INACTIVE', 'Đã tắt'],
];

const RESTRICTED_FIELDS = ['code', 'discountType', 'discountValue', 'startAt', 'productIds'];
const DISCOUNT_TYPES = [
  ['PERCENTAGE', '% giảm giá'],
  ['FIXED_AMOUNT', 'Số tiền cố định'],
  ['FREE_SHIPPING', 'Miễn phí vận chuyển'],
];

function defaultDateTime(offsetHours = 0) {
  const value = new Date();
  value.setHours(value.getHours() + offsetHours, 0, 0, 0);
  return toInputDateTime(value);
}

function toInputDateTime(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const pad = (item) => String(item).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function normalizeDiscountType(value, discountValue = 0) {
  if (value) return String(value).toUpperCase();
  return Number(discountValue || 0) > 100 ? 'FIXED_AMOUNT' : 'PERCENTAGE';
}

function discountValueOf(promotion) {
  return Number(promotion?.discountValue ?? promotion?.discountPercent ?? 0);
}

function formatPromotionDiscount(promotion) {
  const value = discountValueOf(promotion);
  const type = normalizeDiscountType(promotion?.discountType, value);
  if (type === 'FREE_SHIPPING') return 'Freeship';
  if (type === 'FIXED_AMOUNT') return formatMoney(value);
  return `${value}%`;
}

function normalizePromotion(item) {
  return {
    ...item,
    code: item?.code || item?.promotionCode || item?.couponCode || '',
    name: item?.name || item?.promotionName || '',
    discountType: normalizeDiscountType(item?.discountType, item?.discountValue ?? item?.discountPercent ?? 0),
    discountValue: item?.discountValue ?? item?.discountPercent ?? 0,
    productIds: Array.isArray(item?.productIds) ? item.productIds : [],
  };
}

function promotionApiErrorMessage(err) {
  const status = err.response?.status;
  if (status === 401) {
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại bằng tài khoản Manager.';
  }
  if (status === 403) {
    return 'Tài khoản hiện tại không có quyền Manager để xem danh sách khuyến mãi.';
  }
  if (status === 404) {
    return 'Backend đang chạy bản cũ hoặc chưa có endpoint /api/promotions. Hãy restart backend bằng Maven.';
  }
  return err.response?.data?.message || 'Không tải được danh sách khuyến mãi.';
}

function blankForm() {
  return {
    code: '',
    name: '',
    discountType: 'PERCENTAGE',
    discountValue: '10',
    startAt: defaultDateTime(),
    endAt: defaultDateTime(24 * 7),
    active: true,
    usageLimit: '',
    selectedProducts: [],
  };
}

function formFromPromotion(promotion) {
  return {
    code: promotion.code || '',
    name: promotion.name || '',
    discountType: normalizeDiscountType(promotion.discountType, discountValueOf(promotion)),
    discountValue: String(discountValueOf(promotion)),
    startAt: toInputDateTime(promotion.startAt),
    endAt: toInputDateTime(promotion.endAt),
    active: Boolean(promotion.active),
    usageLimit: promotion.usageLimit != null ? String(promotion.usageLimit) : '',
    // Hydrated asynchronously in openEdit() with product names/thumbnails once fetched.
    selectedProducts: (promotion.productIds || []).map((id) => ({ id, name: id })),
  };
}

function StatusPill({ active }) {
  return (
    <span style={{
      display: 'inline-flex',
      justifyContent: 'center',
      minWidth: 62,
      borderRadius: 999,
      padding: '4px 8px',
      background: active ? '#dcfce7' : '#f1f5f9',
      color: active ? '#15803d' : '#64748b',
      fontSize: 10,
      fontWeight: 850,
      letterSpacing: '.04em',
    }}>
      {active ? 'ACTIVE' : 'Tắt'}
    </span>
  );
}

function PromotionModal({
  mode,
  promotion,
  form,
  setField,
  onClose,
  onSubmit,
  submitting,
  error,
  notice,
  productQuery,
  setProductQuery,
  productResults,
  searchingProducts,
  productsLoading,
  onAddProduct,
  onRemoveProduct,
}) {
  const isEdit = mode === 'update';
  const now = new Date();
  const isActiveEdit = isEdit && Boolean(promotion?.active)
    && promotion?.startAt && new Date(promotion.startAt) <= now
    && promotion?.endAt && now <= new Date(promotion.endAt);
  const hasStarted = isEdit && promotion?.startAt && new Date(promotion.startAt) <= now;
  const lockRestricted = (field) => {
    if (field === 'startAt') return hasStarted;
    return isActiveEdit && RESTRICTED_FIELDS.includes(field);
  };

  const disabledStyle = {
    opacity: 0.72,
    cursor: 'not-allowed',
    background: '#f8fafc',
  };

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
      style={{ zIndex: 420 }}
    >
      <section
        className="admin-modal"
        onMouseDown={(event) => event.stopPropagation()}
        style={{ width: 'min(960px, calc(100vw - 36px))', maxHeight: 'calc(100vh - 42px)', overflow: 'auto' }}
      >
        <div className="admin-modal__head">
          <div>
            <p>{isEdit ? 'UPDATE PROMOTION' : 'CREATE PROMOTION'}</p>
            <h2>{isEdit ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi'}</h2>
          </div>
          <button type="button" className="admin-close" onClick={onClose} disabled={submitting}>x</button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          {isActiveEdit && (
            <div style={{
              border: '1px solid #fde68a',
              background: '#fffbeb',
              color: '#92400e',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12.5,
              lineHeight: 1.45,
            }}>
              <b style={{ display: 'block', marginBottom: 4 }}>Some fields cannot be edited while the promotion is active</b>
              Mã, loại giảm giá và giá trị giảm đã bị khóa vì promotion đang ACTIVE. Bạn chỉ có thể sửa ngày kết thúc, giới hạn sử dụng, hoặc tắt promotion trước khi sửa các field này.
            </div>
          )}

          {error && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '10px 12px', fontSize: 12.5, fontWeight: 750 }}>
              {error}
            </div>
          )}

          {notice && (
            <div style={{
              background: notice.type === 'warning' ? '#fffbeb' : '#dcfce7',
              border: `1px solid ${notice.type === 'warning' ? '#fde68a' : '#bbf7d0'}`,
              color: notice.type === 'warning' ? '#92400e' : '#15803d',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12.5,
              lineHeight: 1.45,
            }}>
              <b style={{ display: 'block' }}>{notice.message}</b>
              {notice.restrictedFields?.length > 0 && (
                <span>Field bị giới hạn: {notice.restrictedFields.join(', ')}</span>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <label className="admin-field">
              Mã khuyến mãi
              <input
                value={form.code}
                onChange={(event) => setField('code', event.target.value.toUpperCase())}
                placeholder="VD: SUMMER2026"
                maxLength={80}
                disabled={lockRestricted('code')}
                style={lockRestricted('code') ? disabledStyle : undefined}
              />
            </label>

            <label className="admin-field">
              Tên chương trình
              <input
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="VD: Ưu đãi hè 2026"
                maxLength={150}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 0.9fr) minmax(220px, 1fr) minmax(220px, 1fr) minmax(220px, 1fr)', gap: 12 }}>
            <label className="admin-field">
              Loại khuyến mãi
              <select
                value={form.discountType}
                onChange={(event) => {
                  const nextType = event.target.value;
                  setField('discountType', nextType);
                  if (nextType === 'FREE_SHIPPING') setField('discountValue', '0');
                }}
                disabled={lockRestricted('discountType')}
                style={lockRestricted('discountType') ? disabledStyle : undefined}
              >
                {DISCOUNT_TYPES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            {form.discountType !== 'FREE_SHIPPING' ? (
            <label className="admin-field">
              {form.discountType === 'FIXED_AMOUNT' ? 'Số tiền giảm (VNĐ)' : 'Giảm giá (%)'}
              <input
                type="number"
                min={form.discountType === 'FIXED_AMOUNT' ? '1' : '0'}
                max={form.discountType === 'FIXED_AMOUNT' ? undefined : '100'}
                step="0.1"
                value={form.discountValue}
                onChange={(event) => setField('discountValue', event.target.value)}
                disabled={lockRestricted('discountValue')}
                style={lockRestricted('discountValue') ? disabledStyle : undefined}
              />
            </label>
            ) : (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 10px', background: '#f8fafc', color: '#16a34a', fontSize: 12.5, fontWeight: 750 }}>
              Mã này sẽ miễn toàn bộ phí vận chuyển.
            </div>
            )}

            <label className="admin-field">
              Bắt đầu
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(event) => setField('startAt', event.target.value)}
                disabled={lockRestricted('startAt')}
                style={lockRestricted('startAt') ? disabledStyle : undefined}
              />
            </label>

            <label className="admin-field">
              Kết thúc
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(event) => setField('endAt', event.target.value)}
                disabled={lockRestricted('endAt')}
                style={lockRestricted('endAt') ? disabledStyle : undefined}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <label className="admin-field">
              Giới hạn lượt dùng
              <input
                type="number"
                min="1"
                step="1"
                value={form.usageLimit}
                onChange={(event) => setField('usageLimit', event.target.value)}
                placeholder="Không giới hạn"
              />
            </label>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 10 }}>
            <div>
              <b style={{ display: 'block', color: '#0d1117', fontSize: 14 }}>Sản phẩm áp dụng</b>
              <span style={{ display: 'block', color: '#64748b', marginTop: 3, fontSize: 12 }}>
                Tìm và chọn sản phẩm để áp dụng khuyến mãi này. Không chọn sản phẩm nào thì khuyến mãi sẽ không hiển thị giảm giá trên trang sản phẩm.
              </span>
            </div>

            <input
              value={productQuery}
              onChange={(event) => setProductQuery(event.target.value)}
              placeholder="Tìm theo tên sản phẩm..."
              style={{ padding: '8px 9px', fontSize: 11.5, borderRadius: 7, border: '1px solid #e5e7eb' }}
            />

            {productQuery.trim() && (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, maxHeight: 180, overflow: 'auto', background: '#fff' }}>
                {searchingProducts ? (
                  <div style={{ padding: 10, color: '#64748b', fontSize: 12 }}><Spinner label="Đang tìm..." /></div>
                ) : productResults.length === 0 ? (
                  <div style={{ padding: 10, color: '#64748b', fontSize: 12 }}>Không tìm thấy sản phẩm phù hợp.</div>
                ) : productResults.map((product) => {
                  const alreadySelected = form.selectedProducts.some((item) => item.id === product.id);
                  return (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 10px',
                        borderBottom: '1px solid #f1f5f9',
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: '#0d1117' }}>{product.name}</span>
                      <button
                        type="button"
                        className="admin-row-action"
                        disabled={alreadySelected}
                        onClick={() => onAddProduct(product)}
                        style={{ flexShrink: 0 }}
                      >
                        {alreadySelected ? 'Đã thêm' : '+ Thêm'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {productsLoading ? (
                <span style={{ color: '#64748b', fontSize: 12 }}><Spinner label="Đang tải sản phẩm..." /></span>
              ) : form.selectedProducts.length === 0 ? (
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Chưa chọn sản phẩm nào.</span>
              ) : form.selectedProducts.map((product) => {
                return (
                  <span
                    key={product.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: 999,
                      padding: '4px 6px 4px 10px',
                      fontSize: 12,
                      color: '#0d1117',
                    }}
                  >
                    {product.name}
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(product.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontWeight: 800,
                        padding: '0 4px',
                        lineHeight: 1,
                      }}
                    >
                      x
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {isEdit && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            background: '#f8fafc',
            flexWrap: 'wrap',
          }}>
            <div>
              <b style={{ display: 'block', color: '#0d1117', fontSize: 14 }}>Trạng thái hoạt động</b>
              <span style={{ display: 'block', color: '#64748b', marginTop: 4, fontSize: 12.5 }}>
                Tắt promotion nếu cần mở khóa toàn bộ field ở lần sửa tiếp theo.
              </span>
            </div>
            <button
              type="button"
              className={`admin-toggle ${form.active ? 'is-on' : ''}`}
              aria-pressed={form.active}
              onClick={() => setField('active', !form.active)}
            >
              <span />
            </button>
          </div>
          )}

          {!isEdit && (
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: '10px 12px',
            background: '#f8fafc',
            color: '#64748b',
            fontSize: 12.5,
            lineHeight: 1.45,
          }}>
            Trạng thái ACTIVE/INACTIVE sẽ được hệ thống tự động thiết lập dựa trên thời gian bắt đầu.
          </div>
          )}

          <div className="admin-modal__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="admin-button" disabled={submitting}>
              {submitting ? <Spinner label="Đang lưu..." /> : isEdit ? 'Lưu thay đổi' : '+ Tạo khuyến mãi'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function RemovePromotionDialog({ promotion, onClose, onConfirm, onDeactivate, removing, deactivating, error, canDeactivate }) {
  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
      style={{ zIndex: 430 }}
    >
      <section
        className="admin-modal"
        onMouseDown={(event) => event.stopPropagation()}
        style={{ width: 'min(500px, calc(100vw - 36px))' }}
      >
        <div className="admin-modal__head">
          <div>
            <p>REMOVE PROMOTION</p>
            <h2>Xóa khuyến mãi</h2>
          </div>
          <button type="button" className="admin-close" onClick={onClose} disabled={removing || deactivating}>x</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 6 }}>
            <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 850, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Promotion đã chọn
            </span>
            <b style={{ color: '#0d1117', fontSize: 15 }}>{promotion.code}</b>
            <span style={{ color: '#64748b', fontSize: 12.5 }}>{promotion.name}</span>
          </div>

          <div style={{ border: '1px solid #fecaca', background: '#fff1f2', color: '#991b1b', borderRadius: 10, padding: 12, fontSize: 12.5, lineHeight: 1.45 }}>
            <b style={{ display: 'block', marginBottom: 4 }}>Are you sure you want to remove this promotion? This action cannot be undone</b>
            Nếu promotion đã được dùng trong đơn hàng, thao tác xóa sẽ bị chặn để giữ lịch sử đơn hàng.
          </div>

          {error && (
            <div style={{ border: '1px solid #fecdd3', background: '#fff1f2', color: '#be123c', borderRadius: 10, padding: 10, fontSize: 12.5, fontWeight: 750, lineHeight: 1.5 }}>
              {error}
              {canDeactivate && (
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={onDeactivate}
                    disabled={deactivating}
                    style={{ fontWeight: 700 }}
                  >
                    {deactivating ? <Spinner label="Đang tắt..." /> : 'Tắt promotion (Deactivate)'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="admin-modal__actions">
          <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={removing || deactivating}>
            Hủy
          </button>
          <button type="button" className="admin-button admin-button--danger" onClick={onConfirm} disabled={removing || deactivating}>
            {removing ? <Spinner label="Đang xóa..." /> : 'Xóa khuyến mãi'}
          </button>
        </div>
      </section>
    </div>
  );
}

const PAGE_SIZE = 10;

export function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, inactive: 0 });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotionToRemove, setPromotionToRemove] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [productQuery, setProductQuery] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState('');
  const [removeError, setRemoveError] = useState('');
  const [removeErrorIsInUse, setRemoveErrorIsInUse] = useState(false);
  const [notice, setNotice] = useState(null);
  const [pageNotice, setPageNotice] = useState(null);

  const showPageNotice = (message, type = 'success') => {
    setPageNotice({ message, type });
    setTimeout(() => setPageNotice(null), 4000);
  };

  const loadPromotions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await promotionApi.searchPromotions({
        keyword: query.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page,
        size: PAGE_SIZE,
      });
      const list = Array.isArray(data.content) ? data.content : [];
      setPromotions(list.map(normalizePromotion));
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(promotionApiErrorMessage(err));
      setPromotions([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    setMetricsLoading(true);
    try {
      const counts = await promotionApi.getStatusCounts(query.trim() || undefined);
      setMetrics({
        total: counts.all ?? 0,
        active: counts.active ?? 0,
        inactive: counts.inactive ?? 0,
      });
    } catch (err) {
      console.error('Failed to fetch promotion status counts', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Đổi bộ lọc/tìm kiếm thì quay về trang đầu.
  useEffect(() => { setPage(0); }, [query, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPromotions();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMetrics();
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!modalMode || !productQuery.trim()) {
      setProductResults([]);
      return;
    }
    setSearchingProducts(true);
    const timer = setTimeout(async () => {
      try {
        const data = await productApi.searchManagerCatalog({ keyword: productQuery.trim(), page: 0, size: 8 });
        setProductResults(Array.isArray(data.content) ? data.content : []);
      } catch (err) {
        setProductResults([]);
      } finally {
        setSearchingProducts(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [productQuery, modalMode]);

  const openCreate = () => {
    setSelectedPromotion(null);
    setModalMode('create');
    setForm(blankForm());
    setProductQuery('');
    setProductResults([]);
    setError('');
    setNotice(null);
  };

  const openEdit = (promotion) => {
    const normalized = normalizePromotion(promotion);
    setSelectedPromotion(normalized);
    setModalMode('update');
    setForm(formFromPromotion(normalized));
    setProductQuery('');
    setProductResults([]);
    setError('');
    setNotice(null);

    const ids = normalized.productIds || [];
    if (ids.length > 0) {
      setProductsLoading(true);
      Promise.all(ids.map((id) => productApi.getManagerProductDetail(id).catch(() => ({ id, name: id }))))
        .then((details) => {
          setForm((prev) => ({
            ...prev,
            selectedProducts: details.map((product) => ({
              id: product.id,
              name: product.name || product.id,
            })),
          }));
        })
        .finally(() => setProductsLoading(false));
    }
  };

  const addProductToForm = (product) => {
    setForm((prev) => {
      if (prev.selectedProducts.some((item) => item.id === product.id)) return prev;
      return { ...prev, selectedProducts: [...prev.selectedProducts, { id: product.id, name: product.name }] };
    });
  };

  const removeProductFromForm = (productId) => {
    setForm((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((item) => item.id !== productId),
    }));
  };

  const openRemove = (promotion) => {
    setPromotionToRemove(promotion);
    setRemoveError('');
    setRemoveErrorIsInUse(false);
  };

  const closeRemove = () => {
    if (removing || deactivating) return;
    setPromotionToRemove(null);
    setRemoveError('');
    setRemoveErrorIsInUse(false);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalMode(null);
    setSelectedPromotion(null);
    setProductQuery('');
    setProductResults([]);
    setError('');
    setNotice(null);
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
    setNotice(null);
  };

  const validate = () => {
    if (!form.code.trim() || !form.name.trim() || !form.startAt || !form.endAt) {
      return 'Please fill in all required fields';
    }
    const discountType = normalizeDiscountType(form.discountType);
    const discount = Number(form.discountValue);
    if (discountType !== 'FREE_SHIPPING') {
      if (Number.isNaN(discount) || discount <= 0 || (discountType === 'PERCENTAGE' && discount > 100)) {
        return 'Invalid discount value';
      }
    }
    const start = new Date(form.startAt);
    const end = new Date(form.endAt);
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startsInPast = modalMode === 'create' && startDay < today;
    if (end <= start || startsInPast) {
      return 'Invalid promotion date range';
    }
    return '';
  };

  const requestPayload = () => ({
    code: form.code.trim(),
    name: form.name.trim(),
    discountType: normalizeDiscountType(form.discountType),
    discountValue: normalizeDiscountType(form.discountType) === 'FREE_SHIPPING' ? 0 : Number(form.discountValue),
    discountPercent: normalizeDiscountType(form.discountType) === 'FREE_SHIPPING' ? 0 : Number(form.discountValue),
    startAt: form.startAt,
    endAt: form.endAt,
    active: form.active,
    usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
    productIds: form.selectedProducts.map((product) => product.id),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice(null);
    try {
      if (modalMode === 'update' && selectedPromotion) {
        const response = await promotionApi.updatePromotion(selectedPromotion.id, requestPayload());
        setNotice({
          type: response.restrictedFields?.length ? 'warning' : 'success',
          message: response.message || 'Promotion updated successfully',
          restrictedFields: response.restrictedFields || [],
        });
      } else {
        await promotionApi.createPromotion(requestPayload());
        setNotice({ type: 'success', message: 'Promotion created successfully', restrictedFields: [] });
      }
      await Promise.all([loadPromotions(), loadMetrics()]);
      setModalMode(null);
      setSelectedPromotion(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Không lưu được chương trình khuyến mãi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!promotionToRemove) return;
    setRemoving(true);
    setRemoveError('');
    setRemoveErrorIsInUse(false);
    try {
      await promotionApi.removePromotion(promotionToRemove.id);
      await Promise.all([loadPromotions(), loadMetrics()]);
      setPromotionToRemove(null);
      showPageNotice('Promotion removed successfully', 'success');
    } catch (err) {
      setRemoveError(err.response?.data?.message || 'Không xóa được khuyến mãi.');
      setRemoveErrorIsInUse(err.response?.status === 409);
    } finally {
      setRemoving(false);
    }
  };

  const handleDeactivateFromRemove = async () => {
    if (!promotionToRemove) return;
    setDeactivating(true);
    setRemoveError('');
    try {
      const normalized = normalizePromotion(promotionToRemove);
      await promotionApi.updatePromotion(normalized.id, {
        code: normalized.code,
        name: normalized.name,
        discountType: normalized.discountType,
        discountValue: discountValueOf(normalized),
        discountPercent: discountValueOf(normalized),
        startAt: normalized.startAt,
        endAt: normalized.endAt,
        active: false,
        usageLimit: normalized.usageLimit ?? null,
        productIds: normalized.productIds || [],
      });
      await Promise.all([loadPromotions(), loadMetrics()]);
      setPromotionToRemove(null);
      showPageNotice('Promotion deactivated successfully', 'success');
    } catch (err) {
      setRemoveError(err.response?.data?.message || 'Không tắt được khuyến mãi.');
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <>
      <style>{`
        .promotion-page .admin-page-intro { margin-bottom: 16px; }
        .promotion-page .admin-page-intro h2 { font-size: 22px; margin-top: 3px; }
        .promotion-page .admin-button { padding: 8px 12px; font-size: 12px; }
        .promotion-page .admin-filter { padding: 5px 8px; font-size: 10.5px; }
        .promotion-page .admin-field { gap: 4px; font-size: 10.5px; }
        .promotion-page .admin-field input,
        .promotion-page .admin-field select,
        .promotion-page .admin-field textarea { padding: 8px 9px; font-size: 11.5px; border-radius: 7px; }
        .promotion-page .promotion-table-shell { padding: 16px 20px 20px; overflow-x: auto; }
        .promotion-page .admin-table th { padding: 0 10px 10px; font-size: 9.5px; letter-spacing: .7px; }
        .promotion-page .admin-table td { padding: 13px 10px; font-size: 11.5px; }
        .promotion-page .promotion-detail-row td { padding: 0 10px 14px; border-top: 0; }
        .promotion-page .admin-row-action { font-size: 11px; }
        .promotion-page .admin-modal { padding: 20px; border-radius: 12px; }
        .promotion-page .admin-modal__head { margin-bottom: 16px; }
        .promotion-page .admin-modal h2 { font-size: 18px; }
        .promotion-page .admin-modal__actions { margin-top: 16px; }
      `}</style>
      <div className="promotion-page">
      <div className="admin-page-intro">
        <div>
          <p>Manager / Khuyến mãi</p>
          <h2>Khuyến mãi</h2>
        </div>
        <button className="admin-button" onClick={openCreate}>
          + Tạo mới
        </button>
      </div>

      {pageNotice && (
        <div style={{
          marginBottom: 12,
          background: pageNotice.type === 'success' ? '#dcfce7' : '#fff1f2',
          border: `1px solid ${pageNotice.type === 'success' ? '#bbf7d0' : '#fecdd3'}`,
          color: pageNotice.type === 'success' ? '#15803d' : '#be123c',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 13,
          fontWeight: 700,
        }}>
          {pageNotice.message}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 10,
        marginBottom: 12,
      }}>
        {[
          ['Tổng chương trình', metrics.total],
          ['Đang bật', metrics.active],
          ['Đã tắt', metrics.inactive],
        ].map(([label, value]) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#94a3b8', fontSize: 9.5, fontWeight: 850, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</span>
            {metricsLoading ? (
              <Skeleton width={40} height={20} style={{ marginTop: 6 }} />
            ) : (
              <b style={{ display: 'block', marginTop: 4, color: '#0d1117', fontSize: 20, letterSpacing: '-.02em' }}>{value}</b>
            )}
          </div>
        ))}
      </div>

      <article className="admin-card" style={{ padding: 0, overflow: 'hidden', width: '100%' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #eef2f7',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 10, fontWeight: 850, letterSpacing: '1.1px', textTransform: 'uppercase' }}>
              PROMOTION LIST
            </p>
            <h3 style={{ margin: '6px 0 0', color: '#0d1117', fontSize: 20 }}>Danh sách khuyến mãi</h3>
            <span style={{ display: 'block', marginTop: 5, color: '#64748b', fontSize: 12.5 }}>
              Hiển thị {promotions.length} trong {totalElements} chương trình
            </span>
          </div>
          <button className="admin-button admin-button--secondary" onClick={() => { loadPromotions(); loadMetrics(); }} disabled={loading}>
            {loading ? <Spinner label="Đang tải..." /> : 'Tải lại'}
          </button>
        </div>

        <div style={{
          padding: '12px 20px',
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 1fr) auto',
          gap: 10,
          alignItems: 'center',
          borderBottom: '1px solid #eef2f7',
          background: '#fbfcfe',
        }}>
          <label className="admin-field" style={{ margin: 0 }}>
            Tìm kiếm
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo mã hoặc tên chương trình..."
            />
          </label>
          <div style={{ display: 'flex', gap: 6, alignSelf: 'end', flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`admin-filter ${statusFilter === value ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && !modalMode && (
          <div style={{
            margin: '12px 20px',
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderLeft: '4px solid #f97316',
            color: '#9a3412',
            borderRadius: 9,
            padding: '10px 12px',
            fontSize: 12.5,
            lineHeight: 1.45,
          }}>
            <b style={{ display: 'block', marginBottom: 3 }}>Không tải được dữ liệu</b>
            <span>{error}</span>
          </div>
        )}

        <div className="promotion-table-shell">
          <table className="admin-table" style={{ width: '100%', minWidth: 930, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th>Mã khuyến mãi</th>
                <th>Tên chương trình</th>
                <th>Giảm giá</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableRows columns={6} />
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 22, color: '#64748b', textAlign: 'center' }}>
                    Không có khuyến mãi phù hợp.
                  </td>
                </tr>
              ) : promotions.map((promotion) => {
                return (
                <tr key={promotion.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#0d1117',
                      padding: '4px 7px',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                      fontSize: 11,
                      fontWeight: 850,
                    }}>
                      {promotion.code || 'Chưa có mã'}
                    </span>
                  </td>
                  <td>
                    <b style={{ color: '#0d1117' }}>{promotion.name || 'Chưa đặt tên'}</b>
                    <span style={{ display: 'block', marginTop: 3, color: '#94a3b8', fontSize: 11 }}>
                      {promotion.productIds.length > 0
                        ? `Áp dụng ${promotion.productIds.length} sản phẩm`
                        : 'Chưa chọn sản phẩm'}
                    </span>
                  </td>
                  <td><b style={{ color: '#6d28d9' }}>{formatPromotionDiscount(promotion)}</b></td>
                  <td style={{ color: '#64748b', lineHeight: 1.35, fontSize: 12.5 }}>
                    <span style={{ display: 'block' }}>{formatDateTime(promotion.startAt)}</span>
                    <span style={{ display: 'block' }}>{formatDateTime(promotion.endAt)}</span>
                  </td>
                  <td><StatusPill active={promotion.active} /></td>
                  <td>
                    <div className="admin-row-actions" style={{ justifyContent: 'flex-end', gap: 6 }}>
                      <button type="button" className="admin-row-action admin-row-action--primary" onClick={() => openEdit(promotion)}>
                        Sửa
                      </button>
                      <button type="button" className="admin-row-action admin-row-action--danger" onClick={() => openRemove(promotion)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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

      {modalMode && (
        <PromotionModal
          mode={modalMode}
          promotion={selectedPromotion}
          form={form}
          setField={setField}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          notice={notice}
          productQuery={productQuery}
          setProductQuery={setProductQuery}
          productResults={productResults}
          searchingProducts={searchingProducts}
          productsLoading={productsLoading}
          onAddProduct={addProductToForm}
          onRemoveProduct={removeProductFromForm}
        />
      )}

      {promotionToRemove && (
        <RemovePromotionDialog
          promotion={promotionToRemove}
          onClose={closeRemove}
          onConfirm={handleRemove}
          onDeactivate={handleDeactivateFromRemove}
          removing={removing}
          deactivating={deactivating}
          error={removeError}
          canDeactivate={removeErrorIsInUse}
        />
      )}

      </div>
    </>
  );
}
