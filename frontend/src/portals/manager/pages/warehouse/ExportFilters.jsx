import { Field } from './components';

export function ExportFilters({
  products,
  brands,
  productFilter,
  brandFilter,
  minPrice,
  maxPrice,
  onChange,
}) {
  return (
    <div className="warehouse-export-filterbar">
      <Field label="Sản phẩm">
        <select value={productFilter} onChange={(event) => onChange('productFilter', event.target.value)}>
          <option value="">Tất cả</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name} · {product.id}</option>
          ))}
        </select>
      </Field>

      <Field label="Thương hiệu">
        <select value={brandFilter} onChange={(event) => onChange('brandFilter', event.target.value)}>
          <option value="">Tất cả</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Field label="Giá từ">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => onChange('minPrice', event.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Giá đến">
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => onChange('maxPrice', event.target.value)}
            placeholder="999.999.999"
          />
        </Field>
      </div>
    </div>
  );
}
