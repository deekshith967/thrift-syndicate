import React from 'react';
import LocationSection from '../../components/home/LocationSection';
import ContactSection from '../../components/home/ContactSection';
import CtaBanner from '../../components/common/CtaBanner';

export default function ContactPage() {
  return (
    <div className="pt-20">
      <LocationSection />
      <ContactSection />
      <CtaBanner />
    </div>
  );
}
