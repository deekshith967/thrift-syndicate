import React from 'react';
import { MapPin, Search, Sparkles, ShoppingBag } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: MapPin,
      title: "Visit the Store",
      desc: "Drop by our physical store at Ramalayam, Krishna Gardens Road, Daba Gardens, Visakhapatnam."
    },
    {
      number: "02",
      icon: Search,
      title: "Explore Curated Collections",
      desc: "Browse through racks of handpicked vintage jackets, graphic shirts, and oversized streetwear fits."
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Find Your Perfect Style",
      desc: "Try on 1-of-1 pieces, check fabric quality, and test your individual streetwear aesthetic."
    },
    {
      number: "04",
      icon: ShoppingBag,
      title: "Take It Home",
      desc: "Checkout at student-friendly prices with in-store pickup or get home delivery straight to your doorstep!"
    }
  ];

  return (
    <section className="py-24 bg-white relative border-y border-neutral-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3.5 py-1.5 rounded-full inline-block">
            Seamless Shopping Experience
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            How It Works
          </h2>
          <p className="text-neutral-600 text-base">
            Getting your hands on Vizag's rarest vintage clothing in 4 easy steps.
          </p>
        </div>

        {/* 4 Step Animated Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-[#F8F8F8] border border-neutral-200/90 rounded-2xl p-7 h-full flex flex-col justify-between hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                        <Icon size={22} />
                      </div>
                      <span className="font-display font-black text-3xl text-neutral-300 group-hover:text-neutral-900 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#111111] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-200/60 text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <span>Step {step.number}</span>
                    <span className="text-neutral-300">───</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
