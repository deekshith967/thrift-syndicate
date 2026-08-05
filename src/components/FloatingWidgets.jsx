import React from 'react';
import { Phone, MapPin, MessageCircle, Heart } from 'lucide-react';

export default function FloatingWidgets({ onOpenCart, savedCount = 0 }) {
  const whatsappUrl = `https://wa.me/919703989808?text=${encodeURIComponent("Hi Thrift Syndicate! I want to inquire about vintage clothing in store.")}`;

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-20 right-5 z-40 hidden sm:block">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={26} />
          <span className="absolute right-full mr-3 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
            Chat on WhatsApp (+91 97039 89808)
          </span>
        </a>
      </div>

      {/* Mobile Bottom Sticky Conversion Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 sm:hidden shadow-2xl flex items-center gap-2">
        <a
          href="tel:+919703989808"
          className="w-1/2 border border-neutral-900 text-neutral-900 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          <Phone size={16} />
          <span>Call Now</span>
        </a>

        <a
          href="#location"
          className="w-1/2 bg-[#111111] text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
        >
          <MapPin size={16} />
          <span>Visit Store</span>
        </a>
      </div>
    </>
  );
}
