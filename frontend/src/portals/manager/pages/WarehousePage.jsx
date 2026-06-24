import { useState } from 'react';
import {
  confirmExport,
  confirmImport,
  downloadReceipt,
  downloadWarehouseLogs,
  getApiError,
  getWarehouseLogDetail,
  getWarehouseLogs,
  saveDownload,
  validateExport,
  validateImport,
} from '../../../api/mockWarehouseData';

const blankItem = () => ({ serialId: '', ramGb: '', storageGb: '', color: '', price: '', importPrice: '' });
const formatMoney = (value) => new Intl.NumberFormat('vi-VN').format(value || 0);
const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN') : '-';

const warehouseStyles = `
  .warehouse-expand-btn {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .warehouse-expand-btn:active {
    transform: scale(0.9);
  }
  .warehouse-details-row {
    animation: slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .warehouse-variants-table {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .warehouse-variants-table table tbody tr {
    transition: background-color 0.2s ease;
  }
  .warehouse-variants-table table tbody tr:hover {
    background-color: #f8f9fa;
  }
  .warehouse-overview-metrics { margin-bottom: 16px; }
  .warehouse-metric { background: #fff; border: 1px solid #e7e9ed; border-radius: 13px; padding: 17px 20px; display: grid; gap: 4px; }
  .warehouse-metric span { color: #64748b; font-size: 11px; font-weight: 700; }
  .warehouse-metric strong { color: #172033; font-size: 25px; line-height: 1; }
  .warehouse-metric small { color: #94a3b8; font-size: 10px; }
  .warehouse-metric--success strong { color: #15803d; }
  .warehouse-metric--danger strong { color: #b45309; }
  .warehouse-overview-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
  .warehouse-overview-controls .admin-filterbar { margin: 0; padding: 0; border: 0; }
  .warehouse-serial-search { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 11px; font-weight: 700; }
  .warehouse-serial-search input { width: 210px; border: 1px solid #dbe1e8; border-radius: 7px; padding: 8px 10px; color: #172033; font: inherit; font-size: 11px; outline: 0; }
  .warehouse-serial-search input:focus { border-color: #0d1117; }
  .warehouse-product-row { cursor: pointer; }
  .warehouse-product-row:hover { background: #fafbfc; }
  .warehouse-product-row td:first-child button { color: #0d1117; font-weight: 900; }
  .warehouse-export-panel { display: grid; gap: 14px; }
  .warehouse-export-picker { display: grid; gap: 12px; }
  .warehouse-export-filterbar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; align-items: end; }
  .warehouse-export-filterbar .admin-field { margin: 0; }
  .warehouse-export-grid { display: grid; gap: 12px; }
  .warehouse-export-summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border: 1px solid #e7e9ed; border-radius: 12px; background: linear-gradient(180deg, #fff, #fbfcfe); }
  .warehouse-export-summary strong { display: block; color: #0d1117; font-size: 20px; line-height: 1.1; }
  .warehouse-export-summary span { color: #64748b; font-size: 12px; }
  .warehouse-export-summary small { color: #94a3b8; font-size: 11px; }
  .warehouse-export-selected-list { display: grid; gap: 8px; }
  .warehouse-export-selected-item { display: flex; justify-content: space-between; gap: 12px; padding: 10px 12px; border: 1px solid #e9edf3; border-radius: 10px; background: #fff; }
  .warehouse-export-selected-item b { display: block; color: #172033; font-size: 13px; }
  .warehouse-export-selected-item span { display: block; color: #64748b; font-size: 11px; margin-top: 2px; }
  .warehouse-export-selected-item small { color: #94a3b8; font-size: 11px; text-align: right; }
  .warehouse-export-product-card { border: 1px solid #e7e9ed; border-radius: 14px; background: #fff; overflow: hidden; }
  .warehouse-export-product-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 12px 14px; background: #f9fafb; border-bottom: 1px solid #edf1f5; }
  .warehouse-export-product-head b { display: block; color: #0d1117; }
  .warehouse-export-product-head small { color: #94a3b8; font-size: 11px; }
  .warehouse-export-product-body { display: grid; }
  .warehouse-export-serial-row { display: grid; grid-template-columns: 28px minmax(0, 1.05fr) 120px 100px 140px 110px; gap: 10px; align-items: center; padding: 12px 14px; border-top: 1px solid #f1f4f7; }
  .warehouse-export-serial-row:hover { background: #fafbfc; }
  .warehouse-export-serial-row:first-child { border-top: 0; }
  .warehouse-export-serial-main { min-width: 0; }
  .warehouse-export-serial-main b { display: block; color: #172033; font-size: 13px; word-break: break-word; }
  .warehouse-export-serial-main small { display: block; color: #64748b; font-size: 11px; margin-top: 2px; }
  .warehouse-export-serial-meta { color: #475569; font-size: 12px; }
  .warehouse-export-serial-price { text-align: right; font-weight: 700; color: #172033; }
  .warehouse-export-empty { padding: 18px; color: #94a3b8; text-align: center; }
  .warehouse-export-note { color: #64748b; font-size: 11px; line-height: 1.45; }
  .warehouse-export-quick { display: grid; gap: 8px; }
  .warehouse-export-quick textarea { min-height: 110px; resize: vertical; }
  @media (max-width: 700px) { .warehouse-overview-controls { align-items: stretch; flex-direction: column; }.warehouse-serial-search { display: grid; }.warehouse-serial-search input { width: 100%; }.warehouse-metric { padding: 15px; }.warehouse-export-filterbar { grid-template-columns: repeat(2, 1fr); }.warehouse-export-summary { flex-direction: column; align-items: flex-start; }.warehouse-export-serial-row { grid-template-columns: 28px minmax(0, 1fr); }.warehouse-export-serial-meta, .warehouse-export-serial-price, .warehouse-export-serial-row .admin-status { grid-column: 2; text-align: left; } }
  @keyframes slideDown {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 800px; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

function Field({ label, children, wide = false }) {
  return <label className={`admin-field ${wide ? 'admin-field--wide' : ''}`}>{label}{children}</label>;
}

function ApiMessage({ error, success, children }) {
  if (!error && !success && !children) return null;
  return <div className={`warehouse-message ${error ? 'warehouse-message--error' : 'warehouse-message--success'}`}>
    {error || success || children}
  </div>;
}

function MetricBox({ label, value, hint, tone = 'default' }) {
  return <article className={`warehouse-metric warehouse-metric--${tone}`}><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>;
}

export function WarehousePage({ view, navigate, products = [], variants = [] }) {
  const tabs = [['overview', 'Tổng quan'], ['import', 'Nhập kho'], ['export', 'Xuất kho'], ['logs', 'Warehouse Log']];

  return <>
    <style>{warehouseStyles}</style>
    <div className="warehouse-tabs">{tabs.map(([key, label]) => <button key={key} className={view === key ? 'is-active' : ''} onClick={() => navigate(`/manager/warehouse${key === 'overview' ? '' : `/${key}`}`)}>{label}</button>)}</div>
    {view === 'import' && <ImportFlow products={products} variants={variants} />}
    {view === 'export' && <ExportFlow products={products} variants={variants} />}
    {view === 'logs' && <WarehouseLogs />}
    {view === 'overview' && <WarehouseOverview navigate={navigate} products={products} variants={variants} />}
  </>;
}

function WarehouseOverview({ navigate, products = [], variants = [] }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serialQuery, setSerialQuery] = useState('');
  const getProductVariants = (productId) => variants.filter((v) => v.productId === productId);
  const getProductStock = (productId) => {
    const productVariants = getProductVariants(productId);
    return productVariants.filter((v) => v.status === 'AVAILABLE').length;
  };
  const getInventoryStatus = (productId) => {
    const stock = getProductStock(productId);
    if (stock === 0) return { label: 'Hết hàng', tone: 'danger' };
    if (stock < 6) return { label: 'Sắp hết', tone: 'warning' };
    return { label: 'Đủ hàng', tone: 'success' };
  };
  const normalizedQuery = serialQuery.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const productVariants = getProductVariants(product.id);
    const stock = getProductStock(product.id);
    const statusMatch = statusFilter === 'ALL'
      || (statusFilter === 'AVAILABLE' && stock > 0)
      || (statusFilter === 'LOW' && stock > 0 && stock < 6)
      || (statusFilter === 'OUT' && stock === 0);
    const queryMatch = !normalizedQuery
      || product.name.toLowerCase().includes(normalizedQuery)
      || product.id.toLowerCase().includes(normalizedQuery)
      || productVariants.some((variant) => variant.id.toLowerCase().includes(normalizedQuery));
    return statusMatch && queryMatch;
  });

  const containerStyle = { padding: '20px', backgroundColor: '#fff', border: '1px solid #e7e9ed', borderRadius: '13px' };
  const tableHeaderStyle = { backgroundColor: '#f8f9fa', fontWeight: '700', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.85px' };

  return <>
    <div className="admin-page-intro"><div><p>QUẢN LÝ KHO</p><h2>Tổng quan</h2></div><button className="admin-button admin-button--secondary" onClick={() => navigate('/manager/products')}>Quản lý Product →</button></div>
    {products.length > 0 ? (
      <><div className="admin-metrics admin-metrics--three warehouse-overview-metrics">
        <MetricBox label="Tồn kho" value={variants.length} hint="ProductVariant vật lý" />
        <MetricBox label="Có sẵn" value={variants.filter((variant) => variant.status === 'AVAILABLE').length} hint="Đang AVAILABLE" tone="success" />
        <MetricBox label="Sắp hết / hết" value={products.filter((product) => getProductStock(product.id) < 6).length} hint="Cần chú ý" tone="danger" />
      </div><article className="admin-card">
        <div className="warehouse-overview-controls">
          <div className="admin-filterbar">{[['ALL', 'Tất cả'], ['AVAILABLE', 'Còn hàng'], ['LOW', 'Sắp hết'], ['OUT', 'Hết hàng']].map(([key, label]) => <button key={key} className={`admin-filter ${statusFilter === key ? 'is-active' : ''}`} onClick={() => setStatusFilter(key)}>{label}</button>)}</div>
          <label className="warehouse-serial-search"><span>Tìm sản phẩm</span><input value={serialQuery} onChange={(event) => setSerialQuery(event.target.value)} placeholder="Serial ID, mã hoặc tên Product" /></label>
        </div>
        <div style={containerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: '50px', padding: '10px 12px', textAlign: 'center' }}></th>
                <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Sản phẩm</th>
                <th style={{ ...tableHeaderStyle, width: '100px', padding: '10px 12px', textAlign: 'center' }}>Còn hàng</th>
                <th style={{ ...tableHeaderStyle, width: '100px', padding: '10px 12px', textAlign: 'center' }}>Tồn kho</th>
                <th style={{ ...tableHeaderStyle, width: '110px', padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ ...tableHeaderStyle, width: '90px', padding: '10px 12px', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => {
                const productVariants = getProductVariants(product.id);
                const stock = getProductStock(product.id);
                const productStatus = getInventoryStatus(product.id);
                const isExpanded = expandedProduct === product.id;
                const displayedVariants = normalizedQuery ? productVariants.filter((variant) => variant.id.toLowerCase().includes(normalizedQuery)) : productVariants;
                return (
                  <>
                    <tr key={product.id} className="warehouse-product-row" style={{ borderTop: '1px solid #f0f1f3', transition: 'background-color 0.2s' }} onClick={() => setExpandedProduct(isExpanded ? null : product.id)}>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button onClick={(event) => { event.stopPropagation(); setExpandedProduct(isExpanded ? null : product.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          {isExpanded ? '⌄' : '›'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', color: '#172033' }}><b style={{ display: 'block', marginBottom: '4px' }}>{product.name}</b><small style={{ color: '#94a3b8', fontSize: '10px' }}>{product.id}</small></td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#172033', fontWeight: '700' }}>{stock} serial</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{productVariants.length}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}><span className={`admin-status admin-status--${productStatus.tone}`}>{productStatus.label}</span></td>
                      <td style={{ padding: '12px', textAlign: 'right' }}><button className="admin-row-action" onClick={(event) => { event.stopPropagation(); navigate('/manager/products'); }}>Quản lý</button></td>
                    </tr>
                    {isExpanded && (
                      <tr key={`details-${product.id}`} style={{ animation: 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards', borderTop: '1px solid #e7e9ed' }}>
                        <td colSpan="6" style={{ padding: '20px 12px' }}>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f1f5f9' }}>
                                  <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Serial ID</th>
                                  <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>RAM</th>
                                  <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Bộ nhớ</th>
                                  <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Màu sắc</th>
                                  <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'right' }}>Giá bán</th>
                                  <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayedVariants.length > 0 ? displayedVariants.map((variant) => {
                                  const isAvailable = String(variant.status).toLowerCase() === 'available';
                                  return (
                                    <tr key={variant.id} style={{ borderTop: '1px solid #eee', fontSize: '12px' }}>
                                      <td style={{ padding: '10px 12px', fontWeight: '600', color: '#172033' }}>{variant.id}</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{variant.ramGb} GB</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{variant.storageGb} GB</td>
                                      <td style={{ padding: '10px 12px', color: '#475569' }}>{variant.color}</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#172033' }}>{variant.price.toLocaleString('vi-VN')}đ</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', backgroundColor: isAvailable ? '#d4edda' : '#fff1f0', color: isAvailable ? '#155724' : '#9b1c1c', border: isAvailable ? '1px solid rgba(21,87,36,0.08)' : '1px solid rgba(139, 18, 18, 0.06)' }}>
                                          {isAvailable ? 'Có sẵn' : 'Đã bán'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }) : (
                                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Không có serial phù hợp</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </article></>
    ) : null}
  </>;
}

function ImportFlow({ products = [], variants = [] }) {
  const [mode, setMode] = useState('existing');
  const [productId, setProductId] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', brandId: '', categoryId: '' });
  const [note, setNote] = useState('');
  const [items, setItems] = useState([blankItem()]);
  const [preview, setPreview] = useState(null);
  const [validatedPayload, setValidatedPayload] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateItem = (index, key, value) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const selectedProduct = products.find((product) => product.id === productId);
  const selectedProductStock = selectedProduct ? variants.filter((variant) => variant.productId === selectedProduct.id && variant.status === 'AVAILABLE').length : 0;
  const addSerial = () => { setItems((current) => [...current, { ...blankItem(), ramGb: current[0]?.ramGb || '', storageGb: current[0]?.storageGb || '', color: current[0]?.color || '', price: current[0]?.price || '', importPrice: current[0]?.importPrice || '' }]); };
  const applyFirstSerialToAll = () => { setItems((current) => { if (current.length < 2) return current; const { serialId, ...sharedInfo } = current[0]; return current.map((item, index) => index === 0 ? item : { ...item, ...sharedInfo }); }); };
  const requestPayload = () => ({ productId: mode === 'existing' ? productId.trim() || null : null, newProduct: mode === 'new' ? { ...newProduct, name: newProduct.name.trim(), description: newProduct.description.trim() || null, brandId: newProduct.brandId.trim(), categoryId: newProduct.categoryId.trim() } : null, note: note.trim() || null, items: items.map((item) => ({ serialId: item.serialId.trim(), ramGb: item.ramGb === '' ? null : Number(item.ramGb), storageGb: item.storageGb === '' ? null : Number(item.storageGb), color: item.color.trim() || null, price: Number(item.price), importPrice: Number(item.importPrice) })) });
  const isReady = () => { if (mode === 'existing' && !productId.trim()) return false; if (mode === 'new' && (!newProduct.name.trim() || !newProduct.brandId.trim() || !newProduct.categoryId.trim())) return false; return items.length > 0 && items.every((item) => item.serialId.trim() && Number(item.price) > 0 && Number(item.importPrice) > 0); };
  const validate = async (event) => { event.preventDefault(); setError(''); setResult(null); if (!isReady()) { setError('Nhập đủ thông tin sản phẩm, serial ID, giá bán và giá nhập trước khi validate.'); return; } const serials = items.map((it) => it.serialId.trim()).filter(Boolean).map((s) => s.toUpperCase()); const dupInList = serials.filter((s, idx) => serials.indexOf(s) !== idx); if (dupInList.length) { setError(`Serial ID trùng trong danh sách: ${[...new Set(dupInList)].join(', ')}`); return; } const existing = new Set((variants || []).map((v) => String(v.id || v.productVariantId || '').toUpperCase())); const colliding = serials.filter((s) => existing.has(s)); if (colliding.length) { setError(`Serial ID đã tồn tại trong kho: ${[...new Set(colliding)].join(', ')}`); return; } setLoading(true); const payload = requestPayload(); try { setPreview(await validateImport(payload)); setValidatedPayload(payload); } catch (requestError) { setPreview(null); setValidatedPayload(null); setError(getApiError(requestError)); } finally { setLoading(false); } };
  const confirm = async () => { setError(''); setLoading(true); try { setResult(await confirmImport(validatedPayload)); setPreview(null); } catch (requestError) { setError(getApiError(requestError)); } finally { setLoading(false); } };

  return <section className="warehouse-flow"><div className="admin-page-intro"><div><p>IMPORT PRODUCTS</p><h2>Nhập kho</h2></div></div>
    <form onSubmit={validate} className="admin-card warehouse-form"><div className="warehouse-mode"><button type="button" className={mode === 'existing' ? 'is-active' : ''} onClick={() => { setMode('existing'); setPreview(null); }}>Sản phẩm có sẵn</button><button type="button" className={mode === 'new' ? 'is-active' : ''} onClick={() => { setMode('new'); setPreview(null); }}>Sản phẩm mới</button></div>
      {mode === 'existing' ? <>
        <Field label="Chọn sản phẩm cần nhập"><select value={productId} onChange={(event) => { setProductId(event.target.value); setPreview(null); }}><option value="">Chọn Product từ danh mục</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.id}</option>)}</select></Field>
        {selectedProduct && <div className="warehouse-product-summary"><div><span>SẢN PHẨM ĐÃ CHỌN</span><b>{selectedProduct.name}</b><small>{selectedProduct.id} · {selectedProduct.brand || 'Chưa cập nhật thương hiệu'} · {selectedProduct.category || 'Chưa phân loại'}</small></div><div><span>TỒN HIỆN TẠI</span><b>{selectedProductStock} serial</b><small>Có thể bán ngay</small></div></div>}
      </> : <div className="admin-form-grid"><Field label="Tên sản phẩm" wide><input value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} /></Field><Field label="Brand ID"><input value={newProduct.brandId} onChange={(event) => setNewProduct({ ...newProduct, brandId: event.target.value })} /></Field><Field label="Category ID"><input value={newProduct.categoryId} onChange={(event) => setNewProduct({ ...newProduct, categoryId: event.target.value })} /></Field><Field label="Mô tả" wide><input value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} /></Field></div>}
      <div className="warehouse-section-head"><div><p>NHẬP KHO · {items.length} SERIAL</p><h3>Thông tin serial</h3><small>Mỗi serial là một sản phẩm riêng.</small></div><div className="warehouse-section-actions"><button type="button" className="admin-button admin-button--secondary" onClick={applyFirstSerialToAll} disabled={items.length < 2}>Áp dụng cho tất cả</button><button type="button" className="admin-button admin-button--secondary" onClick={addSerial}>+ Thêm serial</button></div></div>
      <div className="warehouse-item-list">{items.map((item, index) => <div className="warehouse-item" key={index}><div className="warehouse-item__head"><b>Serial vật lý #{index + 1}</b>{items.length > 1 && <button type="button" className="warehouse-remove" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Xóa serial</button>}</div><Field label="Serial ID"><input value={item.serialId} onChange={(event) => updateItem(index, 'serialId', event.target.value)} placeholder="VD: IP15PM-004" /></Field><Field label="Giá bán (VND)"><input type="number" min="1" value={item.price} onChange={(event) => updateItem(index, 'price', event.target.value)} placeholder="34.990.000" /></Field><Field label="Giá nhập (VND)"><input type="number" min="1" value={item.importPrice} onChange={(event) => updateItem(index, 'importPrice', event.target.value)} placeholder="30.000.000" /></Field><Field label="RAM (GB)"><input type="number" min="0" value={item.ramGb} onChange={(event) => updateItem(index, 'ramGb', event.target.value)} placeholder="8" /></Field><Field label="Bộ nhớ (GB)"><input type="number" min="0" value={item.storageGb} onChange={(event) => updateItem(index, 'storageGb', event.target.value)} placeholder="256" /></Field><Field label="Màu sắc"><input value={item.color} onChange={(event) => updateItem(index, 'color', event.target.value)} placeholder="Titanium Blue" /></Field></div>)}</div>
      <Field label="Ghi chú cho phiếu nhập" wide><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Không bắt buộc" /></Field><div className="warehouse-actions"><button className="admin-button" disabled={loading}>{loading ? 'Đang kiểm tra...' : 'Kiểm tra trước khi nhập'}</button></div>
    </form><ApiMessage error={error} />
    {preview && <div className="warehouse-preview"><p>VALIDATE THÀNH CÔNG</p><h3>{preview.productName}</h3><span>{preview.newProduct ? 'Sản phẩm mới' : 'Sản phẩm có sẵn'} · {preview.importQuantity} serial hợp lệ</span><div><button className="admin-button" disabled={loading} onClick={confirm}>{loading ? 'Đang lưu...' : 'Confirm import'}</button><button className="admin-button admin-button--secondary" onClick={() => setPreview(null)}>Quay lại chỉnh sửa</button></div></div>}
    {result && <ApiMessage success={`Đã nhập ${result.importedQuantity} sản phẩm. Mã ImportLog: ${result.importLogId}.`} />}
  </section>;
}

function ExportFlow({ products = [], variants = [] }) {
  const [selectedSerials, setSelectedSerials] = useState([]);
  const [reason, setReason] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productFilter, setProductFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [preview, setPreview] = useState(null);
  const [validatedPayload, setValidatedPayload] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSelectedModal, setShowSelectedModal] = useState(false);

  const availableVariants = variants.filter((variant) => String(variant.status).toLowerCase() === 'available');
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  const filteredProducts = products.filter((product) => { const matchesProduct = !productFilter || product.id === productFilter; const matchesBrand = !brandFilter || product.brand === brandFilter; return matchesProduct && matchesBrand; });
  const filteredVariants = availableVariants.filter((variant) => { const product = products.find((p) => p.id === variant.productId); const matchesProduct = !productFilter || variant.productId === productFilter; const matchesBrand = !brandFilter || product?.brand === brandFilter; const matchesPrice = (!minPrice || variant.price >= Number(minPrice)) && (!maxPrice || variant.price <= Number(maxPrice)); return matchesProduct && matchesBrand && matchesPrice; });
  const selectedVariantRows = selectedSerials.map((serial) => availableVariants.find((variant) => variant.id.toLowerCase() === serial.toLowerCase())).filter(Boolean);
  const payload = () => ({ serialIds: selectedSerials, reason: reason.trim() || null });
  const validate = async (event) => { event.preventDefault(); setError(''); setResult(null); const request = payload(); if (!request.serialIds.length) { setError('Chọn ít nhất một serial AVAILABLE để xuất kho.'); return; } setLoading(true); try { setPreview(await validateExport(request)); setValidatedPayload(request); } catch (requestError) { setPreview(null); setValidatedPayload(null); setError(getApiError(requestError)); } finally { setLoading(false); } };
  const confirm = async () => { setError(''); setLoading(true); try { setResult(await confirmExport(validatedPayload)); setPreview(null); setSelectedSerials([]); setExpandedProduct(null); } catch (requestError) { setError(getApiError(requestError)); } finally { setLoading(false); } };
  const getReceipt = async () => { if (!result?.receipt?.id) return; setError(''); try { saveDownload(await downloadReceipt(result.receipt.id)); } catch (requestError) { setError(getApiError(requestError)); } };
  const selectedCount = payload().serialIds.length;

  return (
    <section className="warehouse-flow">
      <div className="admin-page-intro"><div><p>EXPORT PRODUCTS</p><h2>Xuất kho</h2></div></div>
      <form onSubmit={validate} className="admin-card warehouse-form warehouse-export-panel">
        <div className="warehouse-export-picker">
          <div className="warehouse-export-summary"><div><span>{selectedCount === 0 ? 'Chưa chọn sản phẩm nào' : `Đã chọn: ${selectedCount} serial`}</span><strong>{selectedCount}</strong><small>Sản phẩm được chọn từ danh sách AVAILABLE</small></div><div><small>{filteredVariants.length} sản phẩm có thể xuất</small></div></div>
          <div className="warehouse-export-filterbar">
            <Field label="Sản phẩm"><select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}><option value="">Tất cả</option>{filteredProducts.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.id}</option>)}</select></Field>
            <Field label="Brand"><select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}><option value="">Tất cả</option>{uniqueBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}><Field label="Giá từ"><input type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="0" /></Field><Field label="Giá đến"><input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="999.999.999" /></Field></div>
          </div>
          <div className="warehouse-export-grid">
            {filteredProducts.map((product) => {
              const productVariants = filteredVariants.filter((variant) => variant.productId === product.id);
              const isExpanded = expandedProduct === product.id;
              if (productVariants.length === 0) return null;
              return (
                <article key={product.id} className="warehouse-export-product-card">
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px 14px', width: '100%', borderBottom: isExpanded ? '1px solid #edf1f5' : 'none' }} onClick={() => setExpandedProduct(isExpanded ? null : product.id)}>
                    <div style={{ textAlign: 'left' }}><b style={{ display: 'block', color: '#0d1117' }}>{product.name}</b><small style={{ color: '#94a3b8', fontSize: '11px' }}>{product.id} · {product.brand || 'Chưa cập nhật thương hiệu'}</small></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}><span className="admin-status" style={{ whiteSpace: 'nowrap' }}>{productVariants.length} serial AVAILABLE</span><span style={{ fontSize: '18px', fontWeight: '900', color: '#0d1117', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span></div>
                  </button>
                  {isExpanded && (
                    <div className="warehouse-export-product-body">
                      {productVariants.map((variant) => {
                        const checked = selectedSerials.some((serial) => serial.toLowerCase() === variant.id.toLowerCase());
                        return (
                          <label key={variant.id} className="warehouse-export-serial-row">
                            <input type="checkbox" checked={checked} onChange={() => setSelectedSerials((current) => current.some((serial) => serial.toLowerCase() === variant.id.toLowerCase()) ? current.filter((serial) => serial.toLowerCase() !== variant.id.toLowerCase()) : [...current, variant.id])} />
                            <div className="warehouse-export-serial-main"><b>{variant.id}</b><small>{variant.ramGb} GB RAM · {variant.storageGb} GB · {variant.color}</small></div>
                            <div className="warehouse-export-serial-meta">{product.name}</div>
                            <div className="warehouse-export-serial-meta">AVAILABLE</div>
                            <div className="warehouse-export-serial-price">{formatMoney(variant.price)}đ</div>
                            <span className="admin-status admin-status--success">Có sẵn</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })}
            {filteredVariants.length === 0 && <div className="warehouse-export-empty">Không có serial AVAILABLE phù hợp bộ lọc hiện tại.</div>}
          </div>
        </div>
        <div className="warehouse-export-selected-list">
          {selectedVariantRows.length > 0 ? <button type="button" className="admin-button admin-button--secondary" onClick={() => setShowSelectedModal(true)} style={{ width: '100%', marginBottom: '16px' }}>📋 Xem danh sách xuất hàng ({selectedVariantRows.length} serial)</button> : <div className="warehouse-export-empty">Chưa chọn sản phẩm nào.</div>}
        </div>
        <Field label="Lý do xuất kho" wide><input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Ví dụ: xuất theo đơn hàng TS20250615001" /></Field>
        <div className="warehouse-actions"><button className="admin-button" disabled={loading}>{loading ? 'Đang kiểm tra...' : 'Kiểm tra trước khi xuất'}</button></div>
      </form>
      <ApiMessage error={error} />
      {preview && <div className="warehouse-preview"><p>KIỂM TRA XUẤT KHO THÀNH CÔNG</p><h3>{preview.exportQuantity} serial sẵn sàng xuất</h3><span>Backend xác nhận các ProductVariant đều đang AVAILABLE.</span><div><button className="admin-button" disabled={loading} onClick={confirm}>{loading ? 'Đang xuất...' : 'Confirm export'}</button><button className="admin-button admin-button--secondary" onClick={() => setPreview(null)}>Quay lại chỉnh sửa</button></div></div>}
      {result && <div className="warehouse-result"><ApiMessage success={`${result.message}. Mã ExportLog: ${result.exportLogId}.`} />{result.receipt && <button className="admin-button admin-button--secondary" onClick={getReceipt}>Tải receipt</button>}{result.inventoryStatuses?.length > 0 && <div className="warehouse-status-list">{result.inventoryStatuses.map((status) => <div key={status.productId}><b>{status.productName}</b><span>{status.availableQuantity} AVAILABLE · {status.status}</span></div>)}</div>}{result.warnings?.map((warning) => <ApiMessage key={warning} error={warning} />)}</div>}
      {showSelectedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' }}>
          <div style={{ background: 'white', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #edf1f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}><div><p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>DANH SÁCH XÁC NHẬN</p><h3 style={{ margin: 0, color: '#0d1117', fontSize: '18px' }}>{selectedVariantRows.length} sản phẩm xuất hàng</h3></div><button type="button" onClick={() => setShowSelectedModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b', padding: '4px 8px' }}>✕</button></div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
              {selectedVariantRows.map((variant, index) => { const product = products.find((item) => item.id === variant.productId); return (<div key={variant.id} style={{ padding: '12px 0', borderBottom: index < selectedVariantRows.length - 1 ? '1px solid #edf1f5' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}><div style={{ flex: 1 }}><b style={{ display: 'block', color: '#0d1117', marginBottom: '4px' }}>{variant.id}</b><small style={{ color: '#64748b', fontSize: '12px', display: 'block', lineHeight: '1.5' }}>{product?.name || variant.productId} · {variant.ramGb} GB RAM / {variant.storageGb} GB · {variant.color}</small></div><div style={{ textAlign: 'right', flexShrink: 0 }}><div style={{ fontWeight: '600', color: '#0d1117' }}>{formatMoney(variant.price)}đ</div><small style={{ color: '#64748b', fontSize: '11px' }}>AVAILABLE</small></div></div>); })}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #edf1f5', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexShrink: 0 }}><button type="button" onClick={() => setShowSelectedModal(false)} className="admin-button admin-button--secondary">Đóng</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

function WarehouseLogs() {
  const [filters, setFilters] = useState({ from: '', to: '', logType: '', status: '', performedBy: '' }); const [logs, setLogs] = useState([]); const [detail, setDetail] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const load = async (event) => { event?.preventDefault(); setError(''); setLoading(true); try { const response = await getWarehouseLogs(filters); setLogs(response.logs || []); setDetail(null); } catch (requestError) { setLogs([]); setError(getApiError(requestError)); } finally { setLoading(false); } };
  const showDetail = async (log) => { setError(''); try { setDetail(await getWarehouseLogDetail(log.logType, log.logId)); } catch (requestError) { setError(getApiError(requestError)); } };
  const exportLogs = async (format) => { setError(''); try { saveDownload(await downloadWarehouseLogs(filters, format)); } catch (requestError) { setError(getApiError(requestError)); } };
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return <section className="warehouse-flow"><div className="admin-page-intro"><div><p>MANAGER ONLY</p><h2>Warehouse Log</h2></div><div className="admin-button-group"><button className="admin-button admin-button--secondary" onClick={() => exportLogs('CSV')}>Xuất CSV</button><button className="admin-button admin-button--secondary" onClick={() => exportLogs('EXCEL')}>Xuất Excel</button></div></div><form onSubmit={load} className="admin-card warehouse-filter-grid"><Field label="Từ ngày"><input type="datetime-local" value={filters.from} onChange={(event) => update('from', event.target.value)} /></Field><Field label="Đến ngày"><input type="datetime-local" value={filters.to} onChange={(event) => update('to', event.target.value)} /></Field><Field label="Loại log"><select value={filters.logType} onChange={(event) => update('logType', event.target.value)}><option value="">Tất cả</option><option value="IMPORT">Import</option><option value="EXPORT">Export</option></select></Field><Field label="Trạng thái"><select value={filters.status} onChange={(event) => update('status', event.target.value)}><option value="">Tất cả</option><option value="SUCCESS">Success</option><option value="PENDING">Pending</option><option value="FAILURE">Failure</option></select></Field><Field label="Người thực hiện" wide><input value={filters.performedBy} onChange={(event) => update('performedBy', event.target.value)} placeholder="Email hoặc tên theo dữ liệu backend" /></Field><div className="warehouse-actions"><button className="admin-button" disabled={loading}>{loading ? 'Đang tải...' : 'Tải warehouse log'}</button></div></form><ApiMessage error={error} />
    <article className="admin-card warehouse-log-table"><div className="admin-card__head"><div><p>KẾT QUẢ</p><h3>{logs.length ? `${logs.length} log phù hợp` : 'Chưa tải log'}</h3></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã log</th><th>Loại</th><th>Sản phẩm</th><th>Số lượng</th><th>Thực hiện</th><th>Thời gian</th><th>Trạng thái</th><th /></tr></thead><tbody>{logs.map((log) => <tr key={`${log.logType}-${log.logId}`}><td><b>{log.logId}</b></td><td>{log.logType}</td><td>{log.productNames}</td><td>{log.totalQuantity}</td><td>{log.performedBy}</td><td>{formatDate(log.occurredAt)}</td><td>{log.status}</td><td><button className="admin-row-action" onClick={() => showDetail(log)}>Chi tiết</button></td></tr>)}</tbody></table></div>{!loading && logs.length === 0 && <p className="warehouse-empty">Chọn bộ lọc rồi bấm "Tải warehouse log".</p>}</article>
    {detail && <article className="admin-card warehouse-detail"><div className="admin-card__head"><div><p>CHI TIẾT {detail.logType}</p><h3>{detail.logId}</h3></div><button className="admin-text-button" onClick={() => setDetail(null)}>Đóng</button></div><div className="warehouse-detail__meta"><span>Người thực hiện: <b>{detail.performedBy}</b></span><span>Thời gian: <b>{formatDate(detail.occurredAt)}</b></span><span>Trạng thái: <b>{detail.status}</b></span><span>{detail.logType === 'IMPORT' ? 'Ghi chú' : 'Lý do'}: <b>{detail.note || detail.reason || '-'}</b></span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Serial ID</th><th>Sản phẩm</th><th>Số lượng</th><th>Giá nhập</th></tr></thead><tbody>{detail.items.map((item) => <tr key={item.productVariantId}><td><b>{item.productVariantId}</b></td><td>{item.productName}</td><td>{item.quantity}</td><td>{item.importPrice == null ? '-' : `${formatMoney(item.importPrice)}đ`}</td></tr>)}</tbody></table></div></article>}
  </section>;
}
