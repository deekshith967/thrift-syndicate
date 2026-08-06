import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MapPin, Phone, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-neutral-800 relative z-20">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-neutral-800">
          
          {/* Logo & Info */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white text-black p-2 rounded-md">
                <Sparkles size={20} />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tighter uppercase">
                THRIFT<span className="text-neutral-500 font-light ml-1">SYNDICATE</span>
              </span>
            </Link>

            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              Curated vintage & thrift clothing store in Visakhapatnam. Specializing in handpicked jackets, graphic tees, oversized streetwear, and 1-of-1 fashion pieces.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-white hover:text-black text-neutral-300 flex items-center justify-center transition-colors"
                title="Follow on Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="tel:+919703989808"
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-white hover:text-black text-neutral-300 flex items-center justify-center transition-colors"
                title="Call +91 97039 89808"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300 font-medium">
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact & Directions</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Landing</Link>
              </li>
            </ul>
          </div>

          {/* Store Hours & Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-400">
              Visit & Contact
            </h4>
            <div className="space-y-2 text-xs text-neutral-300">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-neutral-500 shrink-0 mt-0.5" />
                <span>Ramalayam, Krishna Gardens Road, Behind Street, Daba Gardens, Mahaarajupeta, Visakhapatnam, AP 530020</span>
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Phone size={16} className="text-neutral-500 shrink-0" />
                <a href="tel:+919703989808" className="font-bold text-white hover:underline">+91 97039 89808</a>
              </p>
              <p className="pt-2 text-neutral-400">
                <strong className="text-white">Store Hours:</strong> Mon - Sun: 11:00 AM - 9:30 PM
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Thrift Syndicate. All Rights Reserved. Visakhapatnam, Andhra Pradesh.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
}
