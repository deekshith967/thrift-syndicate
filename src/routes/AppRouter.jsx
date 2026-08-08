import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import CollectionsPage from '../pages/Collections';
import ProductDetailsPage from '../pages/Product';
import CheckoutPage from '../pages/Checkout';
import WishlistPage from '../pages/Wishlist';
import CustomerLoginPage from '../pages/CustomerAuth/Login';
import CustomerSignupPage from '../pages/CustomerAuth/Signup';
import CustomerProfilePage from '../pages/Profile';
import AdminDashboard from '../pages/Admin';
import AdminLoginPage from '../pages/Admin/Login';
import ProtectedRoute from './ProtectedRoute';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import NotFoundPage from '../pages/NotFound';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="products/:productId" element={<ProductDetailsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="login" element={<CustomerLoginPage />} />
          <Route path="signup" element={<CustomerSignupPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
