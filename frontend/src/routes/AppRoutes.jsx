import { Route, Routes } from 'react-router-dom';
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
import { ManagerPortal } from '../portals/manager/ManagerPortal';
import { ProductDetailPage } from '../portals/customer/pages/ProductDetailPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — standalone (no navbar/footer) */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/manager/*" element={<ManagerPortal />} />

      {/* Customer pages — with navbar/footer */}
      <Route element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListingPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
