import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MaintenanceNotice } from './MaintenanceNotice';
import { useMaintenance } from '../../../shared/context/MaintenanceContext';

export function CustomerLayout() {
  const { maintenanceMode } = useMaintenance();

  if (maintenanceMode) {
    return <MaintenanceNotice />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
