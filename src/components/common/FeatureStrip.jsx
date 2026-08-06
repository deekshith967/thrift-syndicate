import React from 'react';
import { Gem, Tag, Sparkles, Shirt } from 'lucide-react';

export default function FeatureStrip() {
  const features = [
    {
      icon: Gem,
      title: "Curated Vintage Collection",
      desc: "Handpicked 80s, 90s & Y2K authentic pieces inspected for maximum style & character."
    },
    {
      icon: Tag,
      title: "Affordable Prices",
      desc: "Luxury vintage look at budget-friendly student prices without compromising quality."
    },
    {
      icon: Shirt,
      title: "Premium Quality Fabrics",
      desc: "Heavyweight 100% cotton, genuine grain leather, and durable vintage denim."
    },
    {
      icon: Sparkles,
      title: "Unique Streetwear Styles",
      desc: "Stand out with rare drop-shoulder, boxy fits, varsity jackets, and 1-of-1 graphics."
    }
  ];

  return (
    <section id="feature-strip" className="py-12 bg-neutral-900 text-white relative z-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-neutral-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white text-neutral-900 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-md">
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-neutral-100">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
