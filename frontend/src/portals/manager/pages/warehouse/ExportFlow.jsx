import { useState } from 'react';
import { confirmExport, downloadReceipt, getApiError, saveDownload, validateExport } from '../../../../api/warehouseApi';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { ApiMessage, Field } from './components';
import { ExportFilters } from './ExportFilters';
import { ExportProductList } from './ExportProductList';
import { SelectedExportModal } from './SelectedExportModal';

const sameSerial = (left, right) => left.toLowerCase() === right.toLowerCase();

export function ExportFlow({ products = [], variants = [], onInventoryChanged }) {
  const { t } = useTheme();
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
  const brands = Array.from(new Set(products.map((product) => product.brand).filter(Boolean)));

  const filteredProducts = products.filter((product) => {
    const matchesProduct = !productFilter || product.id === productFilter;
    const matchesBrand = !brandFilter || product.brand === brandFilter;
    return matchesProduct && matchesBrand;
  });

  const filteredVariants = availableVariants.filter((variant) => {
    const product = products.find((item) => item.id === variant.productId);
    const matchesProduct = !productFilter || variant.productId === productFilter;
    const matchesBrand = !brandFilter || product?.brand === brandFilter;
    const matchesPrice = (!minPrice || variant.price >= Number(minPrice))
      && (!maxPrice || variant.price <= Number(maxPrice));
    return matchesProduct && matchesBrand && matchesPrice;
  });

  const selectedVariantRows = selectedSerials
    .map((serial) => availableVariants.find((variant) => sameSerial(variant.id, serial)))
    .filter(Boolean);

  const selectedCount = selectedSerials.length;
  const requestPayload = () => ({ serialIds: selectedSerials, reason: reason.trim() || null });

  const updateFilter = (key, value) => {
    const setters = {
      productFilter: setProductFilter,
      brandFilter: setBrandFilter,
      minPrice: setMinPrice,
      maxPrice: setMaxPrice,
    };
    setters[key]?.(value);
  };

  const toggleProduct = (productId) => {
    setExpandedProduct((current) => (current === productId ? null : productId));
  };

  const toggleSerial = (serialId) => {
    setSelectedSerials((current) => (
      current.some((serial) => sameSerial(serial, serialId))
        ? current.filter((serial) => !sameSerial(serial, serialId))
        : [...current, serialId]
    ));
    setPreview(null);
    setValidatedPayload(null);
    setResult(null);
  };

  const validate = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    const request = requestPayload();
    if (!request.serialIds.length) {
      setError('Chọn ít nhất một sản phẩm còn trong kho để xuất hàng.');
      return;
    }

    setLoading(true);
    try {
      setPreview(await validateExport(request));
      setValidatedPayload(request);
    } catch (requestError) {
      setPreview(null);
      setValidatedPayload(null);
      setError(t(getApiError(requestError)));
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    setError('');
    setLoading(true);
    try {
      setResult(await confirmExport(validatedPayload));
      setPreview(null);
      setSelectedSerials([]);
      setExpandedProduct(null);
      await onInventoryChanged?.();
    } catch (requestError) {
      setError(t(getApiError(requestError)));
    } finally {
      setLoading(false);
    }
  };

  const getReceipt = async () => {
    if (!result?.receipt?.id) return;
    setError('');
    try {
      saveDownload(await downloadReceipt(result.receipt.id));
    } catch (requestError) {
      setError(t(getApiError(requestError)));
    }
  };

  return (
    <section className="warehouse-flow">
      <div className="admin-page-intro">
        <div>
          <p>XUẤT HÀNG KHỎI KHO</p>
          <h2>Lập phiếu xuất sản phẩm</h2>
        </div>
      </div>

      <form onSubmit={validate} className="admin-card warehouse-form warehouse-export-panel">
        <div className="warehouse-export-picker">
          <div className="warehouse-export-summary">
            <div>
              <span>{selectedCount === 0 ? 'Chưa chọn sản phẩm nào' : `Đã chọn ${selectedCount}`}</span>
              <strong>{selectedCount}</strong>
              <small>Chỉ những sản phẩm còn trong kho mới được xuất hàng</small>
            </div>
            <div>
              <small>{filteredVariants.length} có thể xuất</small>
            </div>
          </div>

          <ExportFilters
            products={filteredProducts}
            brands={brands}
            productFilter={productFilter}
            brandFilter={brandFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={updateFilter}
          />

          <ExportProductList
            products={filteredProducts}
            variants={filteredVariants}
            selectedSerials={selectedSerials}
            expandedProduct={expandedProduct}
            onToggleProduct={toggleProduct}
            onToggleSerial={toggleSerial}
          />
        </div>

        <div className="warehouse-export-selected-list">
          {selectedVariantRows.length > 0 ? (
            <button
              type="button"
              className="admin-button admin-button--secondary"
              onClick={() => setShowSelectedModal(true)}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              Xem danh sách xuất hàng ({selectedVariantRows.length})
            </button>
          ) : (
            <div className="warehouse-export-empty">Chưa chọn sản phẩm nào để xuất.</div>
          )}
        </div>

        <Field label="Lý do xuất kho" wide>
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ví dụ: xuất theo đơn hàng TS20250615001"
          />
        </Field>

        <div className="warehouse-actions">
          <button className="admin-button" disabled={loading}>
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra phiếu xuất'}
          </button>
        </div>
      </form>

      <ApiMessage error={error} />

      {preview && (
        <div className="warehouse-preview">
          <p>PHIẾU XUẤT HỢP LỆ</p>
          <h3>Số lượng xuất: {preview.exportQuantity}</h3>
          <span>Hệ thống đã xác nhận các sản phẩm đang còn trong kho.</span>
          <div>
            <button className="admin-button" disabled={loading} onClick={confirm}>
              {loading ? 'Đang xuất...' : 'Xác nhận xuất kho'}
            </button>
            <button className="admin-button admin-button--secondary" onClick={() => setPreview(null)}>
              Quay lại chỉnh sửa
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="warehouse-result">
          <ApiMessage success={`${result.message}. Mã phiếu xuất: ${result.exportLogId}.`} />
          {result.receipt && (
            <button className="admin-button admin-button--secondary" onClick={getReceipt}>
              Tải phiếu xuất
            </button>
          )}
          {result.inventoryStatuses?.length > 0 && (
            <div className="warehouse-status-list">
              {result.inventoryStatuses.map((status) => (
                <div key={status.productId}>
                  <b>{status.productName}</b>
                  <span>Còn {status.availableQuantity} · đã cập nhật tồn kho</span>
                </div>
              ))}
            </div>
          )}
          {result.warnings?.map((warning) => <ApiMessage key={warning} error={t(warning)} />)}
        </div>
      )}

      <SelectedExportModal
        open={showSelectedModal}
        rows={selectedVariantRows}
        products={products}
        onClose={() => setShowSelectedModal(false)}
      />
    </section>
  );
}
