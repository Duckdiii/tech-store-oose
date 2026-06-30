import { useEffect, useState } from 'react';
import {
  downloadWarehouseLogs,
  getApiError,
  getWarehouseLogDetail,
  getWarehouseLogs,
  saveDownload,
} from '../../../../api/warehouseApi';
import { ApiMessage } from './components';
import { WarehouseLogDetail } from './WarehouseLogDetail';
import { WarehouseLogFilters } from './WarehouseLogFilters';
import { WarehouseLogTable } from './WarehouseLogTable';

const initialFilters = { from: '', to: '', logType: '', status: '', performedBy: '' };

export function WarehouseLogs() {
  const [filters, setFilters] = useState(initialFilters);
  const [logs, setLogs] = useState([]);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const loadLogs = async (event) => {
    event?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await getWarehouseLogs(filters);
      setLogs(response.logs || []);
      setDetail(null);
    } catch (requestError) {
      setLogs([]);
      setError(getApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const showDetail = async (log) => {
    setError('');
    try {
      setDetail(await getWarehouseLogDetail(log.logType, log.logId));
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  };

  const exportLogs = async (format) => {
    setError('');
    try {
      saveDownload(await downloadWarehouseLogs(filters, format));
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="warehouse-flow">
      <div className="admin-page-intro">
        <div>
          <p>THEO DÕI NHẬP XUẤT</p>
          <h2>Nhật ký kho</h2>
        </div>
        <div className="admin-button-group">
          <button className="admin-button admin-button--secondary" onClick={() => exportLogs('CSV')}>
            Xuất file CSV
          </button>
          <button className="admin-button admin-button--secondary" onClick={() => exportLogs('EXCEL')}>
            Xuất file Excel
          </button>
        </div>
      </div>

      <WarehouseLogFilters
        filters={filters}
        loading={loading}
        onChange={updateFilter}
        onSubmit={loadLogs}
      />
      <ApiMessage error={error} />
      <WarehouseLogTable logs={logs} loading={loading} onShowDetail={showDetail} />
      <WarehouseLogDetail detail={detail} onClose={() => setDetail(null)} />
    </section>
  );
}
