import { useEffect, useState } from 'react';
import { getApiError, getWarehouseInventory } from '../../../api/warehouseApi';
import { ExportFlow } from './warehouse/ExportFlow';
import { ImportFlow } from './warehouse/ImportFlow';
import { ApiMessage } from './warehouse/components';
import { WarehouseLogs } from './warehouse/WarehouseLogs';
import { WarehouseOverview } from './warehouse/WarehouseOverview';
import { warehouseStyles } from './warehouse/warehouseStyles';

export function WarehousePage({ view, navigate }) {
  const tabs = [['overview', 'Tổng quan'], ['import', 'Nhập kho'], ['export', 'Xuất kho'], ['logs', 'Nhật ký kho']];
  const [inventory, setInventory] = useState({ products: [], variants: [] });
  const [inventoryError, setInventoryError] = useState('');
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const loadInventory = async () => {
    setInventoryLoading(true);
    setInventoryError('');
    try {
      setInventory(await getWarehouseInventory());
    } catch (error) {
      setInventory({ products: [], variants: [] });
      setInventoryError(getApiError(error));
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return <>
    <style>{warehouseStyles}</style>
    <div className="warehouse-tabs">{tabs.map(([key, label]) => <button key={key} className={view === key ? 'is-active' : ''} onClick={() => navigate(`/manager/warehouse${key === 'overview' ? '' : `/${key}`}`)}>{label}</button>)}</div>
    {inventoryError && <ApiMessage error={inventoryError} />}
    {inventoryLoading && <ApiMessage>Đang tải dữ liệu kho...</ApiMessage>}
    {view === 'import' && <ImportFlow products={inventory.products} variants={inventory.variants} onInventoryChanged={loadInventory} />}
    {view === 'export' && <ExportFlow products={inventory.products} variants={inventory.variants} onInventoryChanged={loadInventory} />}
    {view === 'logs' && <WarehouseLogs />}
    {view === 'overview' && <WarehouseOverview navigate={navigate} products={inventory.products} variants={inventory.variants} />}
  </>;
}
