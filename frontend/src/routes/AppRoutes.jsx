import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CustomerLayout } from '../portals/customer/layout/CustomerLayout';
import { HomePage } from '../portals/customer/pages/HomePage';
import { ProductListingPage } from '../portals/customer/pages/ProductListingPage';
import { CartPage } from '../portals/customer/pages/CartPage';
import { CheckoutPage } from '../portals/customer/pages/CheckoutPage';
import { OrdersPage } from '../portals/customer/pages/OrdersPage';
import { ProfilePage } from '../portals/customer/pages/ProfilePage';
import { SignInPage } from '../portals/customer/pages/SignInPage';
import { SignUpPage } from '../portals/customer/pages/SignUpPage';
import { NotFoundPage } from '../portals/customer/pages/NotFoundPage';
import { ProductDetailPage } from '../portals/customer/pages/ProductDetailPage';
import { GuestOnly, RequireRole } from './RouteGuards';

const ManagerPortal = lazy(() =>
  import('../portals/manager/ManagerPortal').then((module) => ({ default: module.ManagerPortal }))
);

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — standalone (no navbar/footer) */}
      <Route path="/sign-in" element={<GuestOnly><SignInPage /></GuestOnly>} />
      <Route path="/sign-up" element={<GuestOnly><SignUpPage /></GuestOnly>} />
      <Route
        path="/manager/*"
        element={
          <RequireRole roles={['MANAGER', 'STAFF']} fallback="/">
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Đang tải trang quản lý...</div>}>
              <ManagerPortal />
            </Suspense>
          </RequireRole>
        }
      />

      {/* Customer pages — with navbar/footer */}
      <Route element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListingPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<RequireRole roles={['CUSTOMER']}><CartPage /></RequireRole>} />
        <Route path="checkout" element={<RequireRole roles={['CUSTOMER']}><CheckoutPage /></RequireRole>} />
        <Route path="orders" element={<RequireRole roles={['CUSTOMER']}><OrdersPage /></RequireRole>} />
        <Route path="profile" element={<RequireRole roles={['CUSTOMER']}><ProfilePage /></RequireRole>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
