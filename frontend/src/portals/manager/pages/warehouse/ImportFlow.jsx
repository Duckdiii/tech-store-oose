import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { confirmImport, getApiError, validateImport } from '../../../../api/warehouseApi';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { ApiMessage, Field } from './components';
import { blankItem } from './utils';

const toNumberOrNull = (value) => value === '' ? null : Number(value);
const itemProductId = (item) => (item.productId || '').trim();

export function ImportFlow({ products = [], variants = [], suppliers = [], onInventoryChanged }) {
  const { t } = useTheme();
  const location = useLocation();
  const initialProductId = new URLSearchParams(location.search).get('productId') || '';
  const [supplierId, setSupplierId] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([blankItem()]);
  const [preview, setPreview] = useState(null);
  const [validatedPayload, setValidatedPayload] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetValidation = () => {
    setPreview(null);
    setValidatedPayload(null);
    setResult(null);
    setError('');
  };

  useEffect(() => {
    if (!initialProductId || !products.some((product) => product.id === initialProductId)) return;
    setItems((current) => {
      if (current.some((item) => itemProductId(item))) return current;
      return current.map((item, index) => index === 0 ? { ...item, productId: initialProductId } : item);
    });
  }, [initialProductId, products]);

  const updateItem = (index, key, value) => {
    setItems((current) => current.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item
    ));
    resetValidation();
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        ...blankItem(),
        productId: current[current.length - 1]?.productId || '',
        ramGb: current[0]?.ramGb || '',
        storageGb: current[0]?.storageGb || '',
        color: current[0]?.color || '',
        price: current[0]?.price || '',
        importPrice: current[0]?.importPrice || '',
      },
    ]);
    resetValidation();
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    resetValidation();
  };

  const applyFirstItemToAll = () => {
    setItems((current) => {
      if (current.length < 2) return current;
      const sharedInfo = {
        ramGb: current[0].ramGb,
        storageGb: current[0].storageGb,
        color: current[0].color,
        price: current[0].price,
        importPrice: current[0].importPrice,
      };
      return current.map((item, index) => index === 0 ? item : { ...item, ...sharedInfo });
    });
    resetValidation();
  };

  const selectedProductIds = [...new Set(items.map(itemProductId).filter(Boolean))];
  const selectedSupplier = suppliers.find((supplier) => String(supplier.id) === String(supplierId));

  const importNote = () => {
    const cleanNote = note.trim();
    if (!selectedSupplier) return cleanNote || null;
    const supplierText = `Nhập hàng từ nhà cung cấp ${selectedSupplier.name}`;
    return cleanNote ? `${supplierText}. ${cleanNote}` : supplierText;
  };

  const requestPayload = () => ({
    productId: null,
    note: importNote(),
    items: items.map((item) => ({
      productId: itemProductId(item),
      serialId: item.serialId.trim(),
      ramGb: toNumberOrNull(item.ramGb),
      storageGb: toNumberOrNull(item.storageGb),
      color: item.color.trim() || null,
      price: Number(item.price),
      importPrice: Number(item.importPrice),
    })),
  });

  const isReady = () => {
    if (items.some((item) => !itemProductId(item))) return false;
    return items.length > 0 && items.every((item) =>
      item.serialId.trim() && Number(item.price) > 0 && Number(item.importPrice) > 0
    );
  };

  const validate = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!isReady()) {
      setError('Chọn sản phẩm đã có, nhập mã máy, giá bán và giá nhập cho từng dòng trước khi kiểm tra.');
      return;
    }

    const serials = items.map((item) => item.serialId.trim()).filter(Boolean).map((serial) => serial.toUpperCase());
    const dupInList = serials.filter((serial, index) => serials.indexOf(serial) !== index);
    if (dupInList.length) {
      setError(`Mã máy bị trùng trong phiếu nhập: ${[...new Set(dupInList)].join(', ')}`);
      return;
    }

    const existing = new Set((variants || []).map((variant) =>
      String(variant.id || variant.productVariantId || '').toUpperCase()
    ));
    const colliding = serials.filter((serial) => existing.has(serial));
    if (colliding.length) {
      setError(`Mã máy đã tồn tại trong kho: ${[...new Set(colliding)].join(', ')}`);
      return;
    }

    setLoading(true);
    const payload = requestPayload();
    try {
      setPreview(await validateImport(payload));
      setValidatedPayload(payload);
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
      setResult(await confirmImport(validatedPayload));
      setPreview(null);
      setValidatedPayload(null);
      await onInventoryChanged?.();
    } catch (requestError) {
      setError(t(getApiError(requestError)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="warehouse-flow">
      <div className="admin-page-intro">
        <div>
          <p>NHẬP HÀNG VÀO KHO</p>
          <h2>Lập phiếu nhập sản phẩm</h2>
        </div>
      </div>

      <form onSubmit={validate} className="admin-card warehouse-form">
        <div className="warehouse-hint">
          Chỉ nhập hàng cho sản phẩm đã có trong danh mục. Nếu cần nhập sản phẩm mới, hãy tạo sản phẩm ở trang Sản phẩm trước.
          <Link to="/manager/products"> Quản lý sản phẩm →</Link>
        </div>

        <Field label="Nhà cung cấp" wide>
          <select value={supplierId} onChange={(event) => { setSupplierId(event.target.value); resetValidation(); }}>
            <option value="">Không chọn nhà cung cấp</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
                {supplier.email ? ` · ${supplier.email}` : ''}
                {supplier.phone ? ` · ${supplier.phone}` : ''}
              </option>
            ))}
          </select>
        </Field>

        <div className="warehouse-section-head">
          <div>
            <p>PHIẾU NHẬP · {items.length}</p>
            <h3>Danh sách sản phẩm nhập kho</h3>
            <small>Mỗi dòng có thể chọn một sản phẩm khác nhau. Mỗi mã máy là một sản phẩm vật lý riêng.</small>
          </div>
          <div className="warehouse-section-actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={applyFirstItemToAll} disabled={items.length < 2}>
              Áp dụng thông số cho tất cả
            </button>
            <button type="button" className="admin-button admin-button--secondary" onClick={addItem}>
              + Thêm sản phẩm
            </button>
          </div>
        </div>

        {selectedProductIds.length > 0 && (
          <div className="warehouse-product-summary">
            <div>
              <span>SẢN PHẨM ĐÃ CHỌN</span>
              <b>{selectedProductIds.length} sản phẩm trong phiếu nhập</b>
              <small>{items.length} mã máy đang được khai báo</small>
            </div>
          </div>
        )}

        <div className="warehouse-item-list">
          {items.map((item, index) => {
            const selectedProduct = products.find((product) => product.id === itemProductId(item));
            const selectedProductStock = selectedProduct
              ? variants.filter((variant) => variant.productId === selectedProduct.id && variant.status === 'AVAILABLE').length
              : 0;

            return (
              <div className="warehouse-item" key={index}>
                <div className="warehouse-item__head">
                  <b>Sản phẩm nhập kho #{index + 1}</b>
                  {items.length > 1 && (
                    <button type="button" className="warehouse-remove" onClick={() => removeItem(index)}>
                      Xóa sản phẩm
                    </button>
                  )}
                </div>

                <Field label="Sản phẩm trong danh mục" wide>
                  <select value={item.productId} onChange={(event) => updateItem(index, 'productId', event.target.value)}>
                    <option value="">Chọn sản phẩm cho dòng này</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {product.id}
                      </option>
                    ))}
                  </select>
                </Field>

                {selectedProduct && (
                  <div className="warehouse-product-summary" style={{ gridColumn: '1 / -1', margin: '0 0 4px' }}>
                    <div>
                      <span>SẢN PHẨM</span>
                      <b>{selectedProduct.name}</b>
                      <small>{selectedProduct.id} · {selectedProduct.brand || 'Chưa cập nhật thương hiệu'} · {selectedProduct.category || 'Chưa phân loại'}</small>
                    </div>
                    <div>
                      <span>TỒN HIỆN TẠI</span>
                      <b>{selectedProductStock}</b>
                      <small>Có thể bán ngay</small>
                    </div>
                  </div>
                )}

                <Field label="Mã máy">
                  <input value={item.serialId} onChange={(event) => updateItem(index, 'serialId', event.target.value)} placeholder="VD: IP15PM-004" />
                </Field>
                <Field label="Giá bán (VND)">
                  <input type="number" min="1" value={item.price} onChange={(event) => updateItem(index, 'price', event.target.value)} placeholder="34990000" />
                </Field>
                <Field label="Giá nhập (VND)">
                  <input type="number" min="1" value={item.importPrice} onChange={(event) => updateItem(index, 'importPrice', event.target.value)} placeholder="30000000" />
                </Field>
                <Field label="RAM (GB)">
                  <input type="number" min="0" value={item.ramGb} onChange={(event) => updateItem(index, 'ramGb', event.target.value)} placeholder="8" />
                </Field>
                <Field label="Bộ nhớ (GB)">
                  <input type="number" min="0" value={item.storageGb} onChange={(event) => updateItem(index, 'storageGb', event.target.value)} placeholder="256" />
                </Field>
                <Field label="Màu sắc">
                  <input value={item.color} onChange={(event) => updateItem(index, 'color', event.target.value)} placeholder="Titanium Blue" />
                </Field>
              </div>
            );
          })}
        </div>

        <Field label="Ghi chú phiếu nhập" wide>
          <input value={note} onChange={(event) => { setNote(event.target.value); resetValidation(); }} placeholder="Ví dụ: nhập hàng từ nhà cung cấp Apple Việt Nam" />
        </Field>

        <div className="warehouse-actions">
          <button className="admin-button" disabled={loading}>
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra phiếu nhập'}
          </button>
        </div>
      </form>

      <ApiMessage error={error} />

      {preview && (
        <div className="warehouse-preview">
          <p>PHIẾU NHẬP HỢP LỆ</p>
          <h3>{preview.productName}</h3>
          <span>Sản phẩm đã có · số lượng nhập: {preview.importQuantity}</span>
          <div>
            <button className="admin-button" disabled={loading} onClick={confirm}>
              {loading ? 'Đang lưu...' : 'Xác nhận nhập kho'}
            </button>
            <button className="admin-button admin-button--secondary" onClick={() => setPreview(null)}>
              Quay lại chỉnh sửa
            </button>
          </div>
        </div>
      )}

      {result && (
        <ApiMessage success={`Đã nhập ${result.importedQuantity} sản phẩm vào kho. Mã phiếu nhập: ${result.importLogId}.`} />
      )}
    </section>
  );
}
