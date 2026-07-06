import { createContext, useContext, useEffect, useState } from 'react';
import { httpClient } from '../../api/httpClient';
import { maintenanceBus } from '../maintenanceBus';

const MaintenanceContext = createContext(null);

const POLL_INTERVAL_MS = 30000;

export function MaintenanceProvider({ children }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkStatus = () => {
      httpClient.get('/system/maintenance-status')
        .then((response) => {
          if (!cancelled) setMaintenanceMode(!!response.data?.maintenanceMode);
        })
        .catch(() => {
          // Network hiccups shouldn't force the storefront into maintenance mode.
        });
    };

    checkStatus();
    const interval = setInterval(checkStatus, POLL_INTERVAL_MS);
    const unsubscribe = maintenanceBus.subscribe(() => setMaintenanceMode(true));

    return () => {
      cancelled = true;
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <MaintenanceContext.Provider value={{ maintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export const useMaintenance = () => useContext(MaintenanceContext);
