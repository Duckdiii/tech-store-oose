import { Route, Routes } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { HomePage } from '../pages/HomePage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminPortal } from '../admin/AdminPortal';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — standalone (no navbar/footer) */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/admin/*" element={<AdminPortal />} />

      {/* Customer pages — with navbar/footer */}
      <Route element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListingPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
