import React from 'react';
import { ArrowDown, ShoppingBag, MapPin, Star, ShieldCheck, Truck, Store, Sparkles, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-28 pb-16 flex items-center justify-center bg-white overflow-hidden">
      {/* Background Decorative Subtle Gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Content Left Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider uppercase">
                <Sparkles size={13} className="text-yellow-400" />
                Curated Vintage & Streetwear
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>4.3 / 5</span>
                <span className="text-amber-700 font-normal">(19 Google Reviews)</span>
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#111111] uppercase leading-[0.92]">
                Own The Style. <br />
                <span className="text-neutral-400 font-light italic">Not The Price.</span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-neutral-600 font-normal max-w-2xl leading-relaxed">
              Discover handpicked vintage fashion, rare streetwear, oversized jackets, graphic tees, and unique wardrobe pieces in <strong className="text-neutral-900 font-semibold">Visakhapatnam</strong> that express your individuality without overspending.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#collections"
                className="bg-[#111111] hover:bg-black text-white px-8 py-4 rounded-xl text-base font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
              >
                <span>Shop Collection</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#location"
                className="border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 px-8 py-4 rounded-xl text-base font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <MapPin size={18} />
                <span>Visit Our Store</span>
              </a>
            </div>

            {/* Key Trust Signals Bar */}
            <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-900">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 uppercase">Delivery Available</p>
                  <p className="text-[11px] text-neutral-500">Across Vizag & India</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-900">
                  <Store size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 uppercase">In-Store Pickup</p>
                  <p className="text-[11px] text-neutral-500">Daba Gardens Store</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-900">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 uppercase">100% Curated</p>
                  <p className="text-[11px] text-neutral-500">Quality Checked</p>
                </div>
              </div>
            </div>

          </div>

          {/* Media / Visual Right Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Card with Floating Badges */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 group border border-neutral-200">
                <img
                  src="/images/hero.png"
                  alt="Thrift Syndicate Premium Vintage Streetwear Collection"
                  className="w-full h-[520px] lg:h-[600px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Overlaid Bottom Card */}
                <div className="absolute bottom-6 left-6 right-6 glass-dark p-4 rounded-2xl text-white backdrop-blur-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium">New Drops Every Week</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold">Visakhapatnam's Fashion Destination</h3>
                  <p className="text-xs text-neutral-300 mt-0.5">Daba Gardens • LGBTQ+ Friendly • Community Hub</p>
                </div>
              </div>

              {/* Decorative Pill Top Right */}
              <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-neutral-100 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  1-1
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">One-of-a-Kind Finds</p>
                  <p className="text-[10px] text-neutral-500">No mass production</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#feature-strip"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
}
