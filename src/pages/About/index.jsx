import React from 'react';
import AboutSection from '../../components/home/AboutSection';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import ProcessSection from '../../components/home/ProcessSection';
import CtaBanner from '../../components/common/CtaBanner';

export default function AboutPage() {
  return (
    <div className="pt-20">
      <AboutSection />
      <WhyChooseUs />
      <ProcessSection />
      <CtaBanner />
    </div>
  );
}
