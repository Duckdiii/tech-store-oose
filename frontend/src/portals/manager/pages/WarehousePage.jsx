import { useEffect, useState } from 'react';
import { getApiError, getWarehouseInventory } from '../../../api/warehouseApi';
import { ExportFlow } from './warehouse/ExportFlow';
import { ImportFlow } from './warehouse/ImportFlow';
import { ApiMessage } from './warehouse/components';
import { WarehouseLogs } from './warehouse/WarehouseLogs';
import { WarehouseOverview } from './warehouse/WarehouseOverview';
import { warehouseStyles } from './warehouse/warehouseStyles';
import { SkeletonMetricCard, SkeletonTableRows } from '../components/index';

function WarehouseSkeleton() {
  return (
    <>
      <div className="admin-metrics admin-metrics--three" aria-hidden="true">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>
      <article className="admin-card">
        <table className="admin-table" style={{ width: '100%' }}>
          <tbody><SkeletonTableRows columns={6} /></tbody>
        </table>
      </article>
    </>
  );
}

export function WarehousePage({ view, navigate, suppliers = [], onOpenProduct }) {
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

  // Chỉ chặn nội dung bằng skeleton ở lần tải đầu tiên (chưa có dữ liệu kho nào);
  // các lần tải lại sau (sau khi nhập/xuất kho) giữ nguyên nội dung cũ để không mất
  // trạng thái đang nhập của form Nhập/Xuất kho.
  const isInitialLoad = inventoryLoading && inventory.products.length === 0 && !inventoryError;

  return <>
    <style>{warehouseStyles}</style>
    <div className="warehouse-tabs">{tabs.map(([key, label]) => <button key={key} className={view === key ? 'is-active' : ''} onClick={() => navigate(`/manager/warehouse${key === 'overview' ? '' : `/${key}`}`)}>{label}</button>)}</div>
    {inventoryError && <ApiMessage error={inventoryError} />}
    {view !== 'logs' && isInitialLoad ? (
      <WarehouseSkeleton />
    ) : (
      <>
        {view === 'import' && <ImportFlow products={inventory.products} variants={inventory.variants} suppliers={suppliers} onInventoryChanged={loadInventory} />}
        {view === 'export' && <ExportFlow products={inventory.products} variants={inventory.variants} onInventoryChanged={loadInventory} />}
        {view === 'overview' && <WarehouseOverview navigate={navigate} products={inventory.products} variants={inventory.variants} onOpenProduct={onOpenProduct} />}
      </>
    )}
    {view === 'logs' && <WarehouseLogs />}
  </>;
}
