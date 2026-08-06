import React from 'react';
import { MapPin, Phone, Sparkles, ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-24 bg-[#111111] text-white relative overflow-hidden">
      {/* Background Subtle Accent circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-neutral-800 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neutral-800 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl space-y-8">
        
        <div className="inline-flex items-center gap-2 bg-neutral-800 text-neutral-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider border border-neutral-700">
          <Sparkles size={14} className="text-yellow-400" />
          <span>Visakhapatnam's Premier Thrift Destination</span>
        </div>

        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]">
          Ready to Upgrade <br />
          <span className="text-neutral-400 font-light italic">Your Wardrobe?</span>
        </h2>

        <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Discover premium vintage fashion, unique streetwear pieces, and 1-of-1 thrift finds waiting just for you in Daba Gardens, Visakhapatnam.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#location"
            className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-xl"
          >
            <MapPin size={18} />
            <span>Visit Store in Daba Gardens</span>
          </a>

          <a
            href="tel:+919703989808"
            className="w-full sm:w-auto border-2 border-neutral-700 hover:border-white text-white px-8 py-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Phone size={18} />
            <span>Call +91 97039 89808</span>
          </a>
        </div>

        <div className="pt-6 text-xs text-neutral-400 flex flex-wrap items-center justify-center gap-6">
          <span>✓ LGBTQ+ Friendly</span>
          <span>•</span>
          <span>✓ Delivery & Pickup Available</span>
          <span>•</span>
          <span>✓ Rated 4.3 ★ (19 Reviews)</span>
        </div>

      </div>
    </section>
  );
}
