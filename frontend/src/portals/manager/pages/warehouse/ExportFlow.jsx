import { useState } from 'react';
import { confirmExport, downloadReceipt, getApiError, saveDownload, validateExport } from '../../../../api/warehouseApi';
import { ApiMessage, Field } from './components';
import { formatMoney } from './utils';

export function ExportFlow({ products = [], variants = [], onInventoryChanged }) {
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
  const validate = async (event) => { event.preventDefault(); setError(''); setResult(null); const request = payload(); if (!request.serialIds.length) { setError('Chọn ít nhất một sản phẩm còn trong kho để xuất hàng.'); return; } setLoading(true); try { setPreview(await validateExport(request)); setValidatedPayload(request); } catch (requestError) { setPreview(null); setValidatedPayload(null); setError(getApiError(requestError)); } finally { setLoading(false); } };
  const confirm = async () => { setError(''); setLoading(true); try { setResult(await confirmExport(validatedPayload)); setPreview(null); setSelectedSerials([]); setExpandedProduct(null); await onInventoryChanged?.(); } catch (requestError) { setError(getApiError(requestError)); } finally { setLoading(false); } };
  const getReceipt = async () => { if (!result?.receipt?.id) return; setError(''); try { saveDownload(await downloadReceipt(result.receipt.id)); } catch (requestError) { setError(getApiError(requestError)); } };
  const selectedCount = payload().serialIds.length;

  return (
    <section className="warehouse-flow">
      <div className="admin-page-intro"><div><p>XUẤT HÀNG KHỎI KHO</p><h2>Lập phiếu xuất sản phẩm</h2></div></div>
      <form onSubmit={validate} className="admin-card warehouse-form warehouse-export-panel">
        <div className="warehouse-export-picker">
          <div className="warehouse-export-summary"><div><span>{selectedCount === 0 ? 'Chưa chọn sản phẩm nào' : `Đã chọn ${selectedCount}`}</span><strong>{selectedCount}</strong><small>Chỉ những sản phẩm còn trong kho mới được xuất hàng</small></div><div><small>{filteredVariants.length} có thể xuất</small></div></div>
          <div className="warehouse-export-filterbar">
            <Field label="Sản phẩm"><select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}><option value="">Tất cả</option>{filteredProducts.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.id}</option>)}</select></Field>
            <Field label="Thương hiệu"><select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}><option value="">Tất cả</option>{uniqueBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></Field>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}><span className="admin-status" style={{ whiteSpace: 'nowrap' }}>{productVariants.length} còn hàng</span><span style={{ fontSize: '18px', fontWeight: '900', color: '#0d1117', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span></div>
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
                            <div className="warehouse-export-serial-meta">Còn trong kho</div>
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
            {filteredVariants.length === 0 && <div className="warehouse-export-empty">Không có sản phẩm còn hàng phù hợp bộ lọc hiện tại.</div>}
          </div>
        </div>
        <div className="warehouse-export-selected-list">
          {selectedVariantRows.length > 0 ? <button type="button" className="admin-button admin-button--secondary" onClick={() => setShowSelectedModal(true)} style={{ width: '100%', marginBottom: '16px' }}>Xem danh sách xuất hàng ({selectedVariantRows.length})</button> : <div className="warehouse-export-empty">Chưa chọn sản phẩm nào để xuất.</div>}
        </div>
        <Field label="Lý do xuất kho" wide><input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Ví dụ: xuất theo đơn hàng TS20250615001" /></Field>
        <div className="warehouse-actions"><button className="admin-button" disabled={loading}>{loading ? 'Đang kiểm tra...' : 'Kiểm tra phiếu xuất'}</button></div>
      </form>
      <ApiMessage error={error} />
      {preview && <div className="warehouse-preview"><p>PHIẾU XUẤT HỢP LỆ</p><h3>Số lượng xuất: {preview.exportQuantity}</h3><span>Hệ thống đã xác nhận các sản phẩm đang còn trong kho.</span><div><button className="admin-button" disabled={loading} onClick={confirm}>{loading ? 'Đang xuất...' : 'Xác nhận xuất kho'}</button><button className="admin-button admin-button--secondary" onClick={() => setPreview(null)}>Quay lại chỉnh sửa</button></div></div>}
      {result && <div className="warehouse-result"><ApiMessage success={`${result.message}. Mã phiếu xuất: ${result.exportLogId}.`} />{result.receipt && <button className="admin-button admin-button--secondary" onClick={getReceipt}>Tải phiếu xuất</button>}{result.inventoryStatuses?.length > 0 && <div className="warehouse-status-list">{result.inventoryStatuses.map((status) => <div key={status.productId}><b>{status.productName}</b><span>Còn {status.availableQuantity} · đã cập nhật tồn kho</span></div>)}</div>}{result.warnings?.map((warning) => <ApiMessage key={warning} error={warning} />)}</div>}
      {showSelectedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' }}>
          <div style={{ background: 'white', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #edf1f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}><div><p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>DANH SÁCH XUẤT KHO</p><h3 style={{ margin: 0, color: '#0d1117', fontSize: '18px' }}>Số lượng chọn: {selectedVariantRows.length}</h3></div><button type="button" onClick={() => setShowSelectedModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b', padding: '4px 8px' }}>✕</button></div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
              {selectedVariantRows.map((variant, index) => { const product = products.find((item) => item.id === variant.productId); return (<div key={variant.id} style={{ padding: '12px 0', borderBottom: index < selectedVariantRows.length - 1 ? '1px solid #edf1f5' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}><div style={{ flex: 1 }}><b style={{ display: 'block', color: '#0d1117', marginBottom: '4px' }}>{variant.id}</b><small style={{ color: '#64748b', fontSize: '12px', display: 'block', lineHeight: '1.5' }}>{product?.name || variant.productId} · {variant.ramGb} GB RAM / {variant.storageGb} GB · {variant.color}</small></div><div style={{ textAlign: 'right', flexShrink: 0 }}><div style={{ fontWeight: '600', color: '#0d1117' }}>{formatMoney(variant.price)}đ</div><small style={{ color: '#64748b', fontSize: '11px' }}>Còn trong kho</small></div></div>); })}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #edf1f5', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexShrink: 0 }}><button type="button" onClick={() => setShowSelectedModal(false)} className="admin-button admin-button--secondary">Đóng</button></div>
          </div>
        </div>
      )}
    </section>
  );
}
