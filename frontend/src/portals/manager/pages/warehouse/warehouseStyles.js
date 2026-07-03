export const warehouseStyles = `
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
  .warehouse-metric--clickable { cursor: pointer; transition: box-shadow 0.2s ease, border-color 0.2s ease; }
  .warehouse-metric--clickable:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06); }
  .warehouse-metric--active { border-color: #b45309; box-shadow: 0 0 0 2px rgba(180, 83, 9, 0.15); }
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
  .warehouse-hint { padding: 12px 14px; border: 1px solid #dbeafe; border-radius: 12px; background: #eff6ff; color: #1e3a8a; font-size: 12px; font-weight: 600; line-height: 1.5; }
  .warehouse-hint a { color: #0d1117; font-weight: 800; text-decoration: none; }
  .warehouse-hint a:hover { text-decoration: underline; }
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
