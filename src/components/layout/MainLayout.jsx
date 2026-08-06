import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWidgets from '../common/FloatingWidgets';

export default function MainLayout({ onOpenCart, savedCount }) {
  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#111111] selection:text-white font-sans">
      <Navbar onOpenCart={onOpenCart} savedCount={savedCount} />
      <main>
        <Outlet context={{ onOpenCart, savedCount }} />
      </main>
      <Footer />
      <FloatingWidgets onOpenCart={onOpenCart} savedCount={savedCount} />
    </div>
  );
}
