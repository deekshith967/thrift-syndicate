import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWidgets from '../common/FloatingWidgets';
import ProductModal from '../product/ProductModal';
import SavedDrawer from '../product/SavedDrawer'; // Cart Drawer
import WishlistDrawer from '../product/WishlistDrawer';
import { useCart } from '../../context/CartContext';

export default function MainLayout() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedIds, setSavedIds] = useState(['ts-001']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { isCartOpen, closeCart, openCart } = useCart();

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
    isWishlistOpen,
    setIsWishlistOpen,
    onOpenWishlist: () => setIsWishlistOpen(true),
    onOpenCart: openCart,
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#111111] selection:text-white font-sans">
      {/* Sticky Header Navbar */}
      <Navbar 
        onOpenCart={openCart} 
        onOpenWishlist={() => setIsWishlistOpen(true)}
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
        onOpenCart={openCart}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        savedCount={savedIds.length} 
      />

      {/* Interactive Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleSave={toggleSave}
        isSaved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
      />

      {/* Shopping Cart Drawer */}
      <SavedDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
      />

      {/* Saved Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        savedIds={savedIds}
        onToggleSave={toggleSave}
      />
    </div>
  );
}
