import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWidgets from '../common/FloatingWidgets';
import ProductModal from '../product/ProductModal';
import SavedDrawer from '../product/SavedDrawer'; // Cart Drawer
import WishlistDrawer from '../product/WishlistDrawer';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function MainLayout() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { isCartOpen, closeCart, openCart } = useCart();
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist();

  const handleToggleSave = (productId) => {
    toggleWishlist(productId);
  };

  const outletContext = {
    selectedProduct,
    setSelectedProduct,
    onSelectProduct: (product) => setSelectedProduct(product),
    onToggleSave: handleToggleSave,
    toggleSave: handleToggleSave,
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
        savedCount={wishlistCount} 
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
        savedCount={wishlistCount} 
      />

      {/* Interactive Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleSave={handleToggleSave}
        isSaved={selectedProduct ? isInWishlist(selectedProduct.id) : false}
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
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
