import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Phone, Menu, X, Heart, ArrowUpRight, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';

export default function Navbar({ onOpenCart, savedCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collections', href: '#collections' },
    { name: 'About', href: '#about' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar Banner */}
      <div className="bg-[#111111] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-between overflow-x-auto whitespace-nowrap border-b border-neutral-800">
        <div className="container mx-auto flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Visakhapatnam's #1 Curated Vintage & Streetwear Store</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-neutral-300">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-neutral-400" /> Daba Gardens, Visakhapatnam
            </span>
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-neutral-400" /> +91 97039 89808
            </span>
            <span className="bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              ⭐ 4.3 (19 Reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-neutral-200' 
          : 'bg-white/80 backdrop-blur-sm py-4 border-b border-neutral-100'
      }`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="group flex items-center gap-2">
            <div className="bg-[#111111] text-white p-2 rounded-md transition-transform group-hover:scale-105">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl md:text-2xl tracking-tighter text-[#111111] leading-none uppercase">
                THRIFT<span className="font-light text-neutral-500 ml-1">SYNDICATE</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
                Premium Vintage • Vizag
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-700 hover:text-[#111111] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#111111] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-all"
              title="Follow us on Instagram"
            >
              <InstagramIcon size={20} />
            </a>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-neutral-700 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-all"
              title="Saved Items / Reserved"
            >
              <Heart size={20} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {savedCount}
                </span>
              )}
            </button>

            <a
              href="#location"
              className="hidden md:inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span>Visit Store</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-3 sm:hidden">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-neutral-800"
            >
              <Heart size={22} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-900 rounded-md focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-neutral-200 px-6 py-6 space-y-4 shadow-xl animate-fade-in">
            <div className="flex flex-col space-y-3 pb-4 border-b border-neutral-100">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-neutral-800 hover:text-black py-1"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#111111] text-white text-center py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span>Visit Store in Daba Gardens</span>
                <ArrowUpRight size={16} />
              </a>
              <a
                href="tel:+919703989808"
                className="w-full border border-neutral-300 text-neutral-800 text-center py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                <span>Call +91 97039 89808</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
