import { useState } from 'react';
import { confirmImport, getApiError, validateImport } from '../../../../api/warehouseApi';
import { ApiMessage, Field } from './components';
import { blankItem } from './utils';

const toNumberOrNull = (value) => value === '' ? null : Number(value);
const itemProductId = (item) => (item.productId || '').trim();

export function ImportFlow({ products = [], variants = [], onInventoryChanged }) {
  const [mode, setMode] = useState('existing');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', brandId: '', categoryId: '' });
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
        productId: mode === 'existing' ? current[current.length - 1]?.productId || '' : '',
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

  const requestPayload = () => ({
    productId: null,
    newProduct: mode === 'new'
      ? {
          ...newProduct,
          name: newProduct.name.trim(),
          description: newProduct.description.trim() || null,
          brandId: newProduct.brandId.trim(),
          categoryId: newProduct.categoryId.trim(),
        }
      : null,
    note: note.trim() || null,
    items: items.map((item) => ({
      productId: mode === 'existing' ? itemProductId(item) : null,
      serialId: item.serialId.trim(),
      ramGb: toNumberOrNull(item.ramGb),
      storageGb: toNumberOrNull(item.storageGb),
      color: item.color.trim() || null,
      price: Number(item.price),
      importPrice: Number(item.importPrice),
    })),
  });

  const isReady = () => {
    if (mode === 'new' && (!newProduct.name.trim() || !newProduct.brandId.trim() || !newProduct.categoryId.trim())) {
      return false;
    }
    if (mode === 'existing' && items.some((item) => !itemProductId(item))) {
      return false;
    }
    return items.length > 0 && items.every((item) =>
      item.serialId.trim() && Number(item.price) > 0 && Number(item.importPrice) > 0
    );
  };

  const validate = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!isReady()) {
      setError('Chọn sản phẩm, nhập mã máy, giá bán và giá nhập cho từng dòng trước khi kiểm tra.');
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
      setError(getApiError(requestError));
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
      setError(getApiError(requestError));
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
        <div className="warehouse-mode">
          <button type="button" className={mode === 'existing' ? 'is-active' : ''} onClick={() => { setMode('existing'); resetValidation(); }}>
            Sản phẩm có sẵn
          </button>
          <button type="button" className={mode === 'new' ? 'is-active' : ''} onClick={() => { setMode('new'); resetValidation(); }}>
            Sản phẩm mới
          </button>
        </div>

        {mode === 'new' && (
          <div className="admin-form-grid">
            <Field label="Tên sản phẩm" wide>
              <input value={newProduct.name} onChange={(event) => { setNewProduct({ ...newProduct, name: event.target.value }); resetValidation(); }} placeholder="Ví dụ: iPhone 16 Pro Max 256GB" />
            </Field>
            <Field label="Mã thương hiệu">
              <input value={newProduct.brandId} onChange={(event) => { setNewProduct({ ...newProduct, brandId: event.target.value }); resetValidation(); }} placeholder="Ví dụ: BRAND-APPLE" />
            </Field>
            <Field label="Mã danh mục">
              <input value={newProduct.categoryId} onChange={(event) => { setNewProduct({ ...newProduct, categoryId: event.target.value }); resetValidation(); }} placeholder="Ví dụ: CAT-PHONE" />
            </Field>
            <Field label="Mô tả" wide>
              <input value={newProduct.description} onChange={(event) => { setNewProduct({ ...newProduct, description: event.target.value }); resetValidation(); }} placeholder="Mô tả ngắn hiển thị cho sản phẩm" />
            </Field>
          </div>
        )}

        <div className="warehouse-section-head">
          <div>
            <p>PHIẾU NHẬP · {items.length}</p>
            <h3>Danh sách sản phẩm nhập kho</h3>
            <small>
              {mode === 'existing'
                ? 'Mỗi dòng có thể chọn một sản phẩm khác nhau. Mỗi mã máy là một sản phẩm vật lý riêng.'
                : 'Sản phẩm mới được tạo một lần, các mã máy bên dưới sẽ thuộc sản phẩm đó.'}
            </small>
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

        {mode === 'existing' && selectedProductIds.length > 0 && (
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

                {mode === 'existing' && (
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
                )}

                {mode === 'existing' && selectedProduct && (
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
          <span>{preview.newProduct ? 'Sản phẩm mới' : 'Sản phẩm đã có'} · số lượng nhập: {preview.importQuantity}</span>
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
