import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero';
import FeatureStrip from '../../components/common/FeatureStrip';
import AboutSection from '../../components/home/AboutSection';
import Collections from '../../components/product/Collections';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import CustomerReviews from '../../components/home/CustomerReviews';
import Gallery from '../../components/home/Gallery';
import ProcessSection from '../../components/home/ProcessSection';
import LocationSection from '../../components/home/LocationSection';
import ContactSection from '../../components/home/ContactSection';
import CtaBanner from '../../components/common/CtaBanner';
import Footer from '../../components/layout/Footer';
import FloatingWidgets from '../../components/common/FloatingWidgets';
import ProductModal from '../../components/product/ProductModal';
import SavedDrawer from '../../components/product/SavedDrawer';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#111111] selection:text-white font-sans">
      {/* Sticky Header Navbar */}
      <Navbar 
        onOpenCart={() => setIsSavedDrawerOpen(true)} 
        savedCount={savedIds.length} 
      />

      {/* Main Page Sections */}
      <main>
        <Hero />
        <FeatureStrip />
        <AboutSection />
        <Collections 
          onSelectProduct={(product) => setSelectedProduct(product)} 
          onToggleSave={toggleSave}
          savedIds={savedIds}
        />
        <WhyChooseUs />
        <CustomerReviews />
        <Gallery />
        <ProcessSection />
        <LocationSection />
        <ContactSection />
        <CtaBanner />
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
