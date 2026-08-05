import React, { useState } from 'react';
import { REVIEWS } from '../data/productsData';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CustomerReviews() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextReview = () => {
    setActiveIdx((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setActiveIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <section id="reviews" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <span>4.3 / 5 Rating • 19 Google Reviews</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Loved By Vizag’s <br />
            <span className="text-neutral-400 font-light italic">Fashion Community</span>
          </h2>
          <p className="text-neutral-600 text-base">
            See what real vintage enthusiasts, college students, and streetwear lovers say about their Thrift Syndicate experience.
          </p>
        </div>

        {/* Featured Testimonial Slider */}
        <div className="max-w-4xl mx-auto bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-8 sm:p-12 relative shadow-lg">
          <Quote size={48} className="text-neutral-300 absolute top-8 right-8 pointer-events-none opacity-50" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(REVIEWS[activeIdx].rating)].map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400" />
              ))}
            </div>

            <p className="font-display text-xl sm:text-2xl font-bold text-[#111111] leading-relaxed italic">
              "{REVIEWS[activeIdx].comment}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-lg">
                  {REVIEWS[activeIdx].name[0]}
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#111111] flex items-center gap-1.5">
                    <span>{REVIEWS[activeIdx].name}</span>
                    <ShieldCheck size={16} className="text-emerald-600" title="Verified Customer" />
                  </h4>
                  <p className="text-xs text-neutral-500">{REVIEWS[activeIdx].role} • {REVIEWS[activeIdx].date}</p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  className="w-10 h-10 rounded-full border border-neutral-300 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 transition-colors"
                  aria-label="Previous Review"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextReview}
                  className="w-10 h-10 rounded-full border border-neutral-300 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 transition-colors"
                  aria-label="Next Review"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {REVIEWS.map((review, idx) => (
            <div
              key={review.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                idx === activeIdx 
                  ? 'bg-[#111111] text-white border-black shadow-xl -translate-y-1' 
                  : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  idx === activeIdx ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {review.tag}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium line-clamp-3 mb-4 leading-relaxed italic">
                "{review.comment}"
              </p>
              <div className="pt-2 border-t border-neutral-200/40 flex items-center justify-between">
                <span className="font-display font-bold text-xs">{review.name}</span>
                <span className={`text-[10px] ${idx === activeIdx ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
