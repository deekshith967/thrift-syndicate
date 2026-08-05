import React from 'react';
import { Heart, ShieldCheck, Flame, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#F8F8F8] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-neutral-200 group">
              <img
                src="/images/store.png"
                alt="Thrift Syndicate Store Interior Visakhapatnam"
                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Overlaid Badge */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 inline-block mb-1">
                  Located in Daba Gardens, Vizag
                </span>
                <p className="font-display font-bold text-xl">The Fashion Community Hub</p>
                <p className="text-xs text-neutral-300">Hand-curated with passion for individuality</p>
              </div>
            </div>

            {/* Overlapping Floating Metric Card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-neutral-200 hidden sm:block max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-lg">
                  ♻️
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Sustainable Fashion</p>
                  <p className="text-xs text-neutral-500">Reducing textile waste, elevating authentic style.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-neutral-200/70 text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <Flame size={14} className="text-orange-600" />
              <span>Our Story & Philosophy</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight leading-tight">
              More Than Just <br />
              <span className="text-neutral-400 font-light italic">A Thrift Store.</span>
            </h2>

            <p className="text-lg text-neutral-700 leading-relaxed font-normal">
              <strong className="text-neutral-900 font-semibold">Thrift Syndicate</strong> brings together carefully selected vintage and thrift clothing for people who value originality, quality, and sustainable fashion. Every item in our Daba Gardens store is individually handpicked to offer unique style, premium comfort, and exceptional value.
            </p>

            <p className="text-neutral-600 leading-relaxed">
              We started with a simple belief: <em className="text-neutral-800 font-medium">"Your outfit should tell your story."</em> Instead of mass-produced fast fashion that looks the same on everyone, we curate 1-of-1 oversized hoodies, retro graphic tees, vintage varsity jackets, and classic denim pieces that let your true personality shine.
            </p>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-neutral-800 font-medium text-sm">
                <CheckCircle2 size={18} className="text-neutral-900 shrink-0" />
                <span>100% Inspected & Fabric Quality Verified</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-800 font-medium text-sm">
                <CheckCircle2 size={18} className="text-neutral-900 shrink-0" />
                <span>LGBTQ+ Friendly Safe Space</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-800 font-medium text-sm">
                <CheckCircle2 size={18} className="text-neutral-900 shrink-0" />
                <span>Student-Budget Friendly Pricing</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-800 font-medium text-sm">
                <CheckCircle2 size={18} className="text-neutral-900 shrink-0" />
                <span>Weekly Curated Inventory Drops</span>
              </div>
            </div>

            {/* Stat Counter Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div>
                <p className="font-display text-3xl font-extrabold text-[#111111]">1000+</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Unique Items</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-[#111111]">4.3 ★</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Customer Rating</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-[#111111]">100%</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Original Vibe</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#collections"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-neutral-600 transition-colors border-b-2 border-[#111111] pb-1 group"
              >
                <span>Explore Curated Collections</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
