import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureStrip from './components/FeatureStrip';
import AboutSection from './components/AboutSection';
import Collections from './components/Collections';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerReviews from './components/CustomerReviews';
import Gallery from './components/Gallery';
import ProcessSection from './components/ProcessSection';
import LocationSection from './components/LocationSection';
import ContactSection from './components/ContactSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import ProductModal from './components/ProductModal';
import SavedDrawer from './components/SavedDrawer';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedIds, setSavedIds] = useState(['ts-001']); // Pre-save 1 item for nice initial UX indicator
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
