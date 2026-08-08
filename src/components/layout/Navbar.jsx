import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Phone, Menu, X, Heart, ArrowUpRight, Sparkles, User, LogOut } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { customer, isLoggedIn, logout } = useCustomerAuth();

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
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
          <Link to="/" className="group flex items-center gap-2">
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
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-neutral-700 hover:text-[#111111] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#111111] hover:after:w-full after:transition-all flex items-center gap-1.5"
              >
                <span>{link.name}</span>
                {link.name === 'Wishlist' && wishlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-all"
              title="Follow us on Instagram"
            >
              <InstagramIcon size={20} />
            </a>

            {/* Wishlist Link Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-neutral-700 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-all block"
              title="Saved Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-neutral-900 bg-neutral-100 hover:bg-[#111111] hover:text-white rounded-full transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Authentication: Login/Signup vs Profile/Logout */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-1.5 pl-1">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                  title="My Profile"
                >
                  <User size={14} />
                  <span className="max-w-[80px] truncate">{customer?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Logout Customer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-1">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black px-3 py-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button
              onClick={openCart}
              className="relative p-2 text-neutral-900"
              title="Shopping Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              to="/wishlist"
              className="relative p-2 text-neutral-800 block"
              title="Wishlist"
            >
              <Heart size={22} className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
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
            
            {/* Customer Authentication (Mobile) */}
            <div className="pb-3 border-b border-neutral-100">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-neutral-700" />
                      <span>Profile ({customer?.name || 'Account'})</span>
                    </div>
                    <ArrowUpRight size={14} />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full border border-neutral-300 text-neutral-800 text-center py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-[#111111] text-white text-center py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3 pb-4 border-b border-neutral-100">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-neutral-800 hover:text-black py-1 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.name === 'Wishlist' && wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#111111] text-white text-center py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span>Visit Store in Daba Gardens</span>
                <ArrowUpRight size={16} />
              </Link>
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
