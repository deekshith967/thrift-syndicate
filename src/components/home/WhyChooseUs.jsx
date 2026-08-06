import React from 'react';
import { 
  Sparkles, 
  Tag, 
  Award, 
  CheckCircle, 
  Shirt, 
  Recycle, 
  Smile, 
  Truck 
} from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: Sparkles,
      title: "Handpicked Premium Pieces",
      desc: "Every single piece is individually curated by fashion passionates—no random bales or filler clothing."
    },
    {
      icon: Tag,
      title: "Affordable Fashion",
      desc: "High-end vintage look and international brand aesthetics at budget-friendly student prices."
    },
    {
      icon: Award,
      title: "Unique One-of-One Finds",
      desc: "Stand out with rare clothing that nobody else in Visakhapatnam owns. Zero cookie-cutter outfits."
    },
    {
      icon: CheckCircle,
      title: "Quality Checked",
      desc: "Rigorous quality inspection for zipper functionality, fabric integrity, stitching, and hygiene."
    },
    {
      icon: Shirt,
      title: "Comfortable Fabrics",
      desc: "Authentic heavyweight cotton, natural wool, genuine leather, and soft vintage washes."
    },
    {
      icon: Recycle,
      title: "Sustainable Shopping",
      desc: "Support circular fashion and combat textile waste by extending the lifecycle of premium vintage garments."
    },
    {
      icon: Smile,
      title: "Friendly Shopping Experience",
      desc: "Warm, welcoming, LGBTQ+ friendly vibe with styling assistance in a stylish Daba Gardens boutique."
    },
    {
      icon: Truck,
      title: "Delivery Available",
      desc: "Can't visit in-person? We offer fast local doorstep delivery across Visakhapatnam and courier across India."
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-[#F8F8F8] relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-full inline-block">
            The Syndicate Difference
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Why Fashion Lovers <br />
            <span className="text-neutral-400 font-light italic">Choose Thrift Syndicate</span>
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed">
            Unlike ordinary clothing stores that sell mass-produced fast fashion, we offer handpicked vintage apparel crafted to elevate your style while respecting your wallet.
          </p>
        </div>

        {/* 8 Pillar Icon Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-7 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#111111] mb-2 group-hover:text-neutral-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <span>Pillar 0{index + 1}</span>
                  <span className="text-emerald-600">✓ Verified</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
