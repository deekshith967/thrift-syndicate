import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import CollectionsPage from '../pages/Collections';
import ProductDetailsPage from '../pages/Product';
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
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
