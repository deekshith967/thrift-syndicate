import React from 'react';
import { useOutletContext } from 'react-router-dom';
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

export default function Home() {
  const context = useOutletContext() || {};
  const { onSelectProduct, onToggleSave, savedIds = [] } = context;

  return (
    <>
      <Hero />
      <FeatureStrip />
      <AboutSection />
      <Collections 
        onSelectProduct={onSelectProduct} 
        onToggleSave={onToggleSave}
        savedIds={savedIds}
      />
      <WhyChooseUs />
      <CustomerReviews />
      <Gallery />
      <ProcessSection />
      <LocationSection />
      <ContactSection />
      <CtaBanner />
    </>
  );
}
