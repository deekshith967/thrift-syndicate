import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWidgets from '../common/FloatingWidgets';
import ProductModal from '../product/ProductModal';
import SavedDrawer from '../product/SavedDrawer';

export default function MainLayout() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedIds, setSavedIds] = useState(['ts-001']);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  const toggleSave = (productId) => {
    setSavedIds((prev) => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const outletContext = {
    selectedProduct,
    setSelectedProduct,
    onSelectProduct: (product) => setSelectedProduct(product),
    savedIds,
    setSavedIds,
    onToggleSave: toggleSave,
    toggleSave,
    isSavedDrawerOpen,
    setIsSavedDrawerOpen,
    onOpenCart: () => setIsSavedDrawerOpen(true),
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#111111] selection:text-white font-sans">
      {/* Sticky Header Navbar */}
      <Navbar 
        onOpenCart={() => setIsSavedDrawerOpen(true)} 
        savedCount={savedIds.length} 
      />

      {/* Main Page Content via React Router */}
      <main>
        <Outlet context={outletContext} />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Sticky Mobile Bar & WhatsApp Floating Action */}
      <FloatingWidgets 
        onOpenCart={() => setIsSavedDrawerOpen(true)} 
        savedCount={savedIds.length} 
      />

      {/* Interactive Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleSave={toggleSave}
        isSaved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
      />

      {/* Saved Wishlist Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedIds={savedIds}
        onToggleSave={toggleSave}
        onSelectProduct={(product) => {
          setIsSavedDrawerOpen(false);
          setSelectedProduct(product);
        }}
      />
    </div>
  );
}
