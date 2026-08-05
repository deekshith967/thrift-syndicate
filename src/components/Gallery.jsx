import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/productsData';
import { Maximize2, X, Sparkles } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-24 bg-[#F8F8F8] relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white border border-neutral-200 px-3 py-1 rounded-full">
              Visual Atmosphere
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
              Inside The Syndicate <span className="text-neutral-400 font-light italic">Gallery</span>
            </h2>
            <p className="text-neutral-600 max-w-xl text-base">
              A glimpse inside our Daba Gardens store, vintage clothing racks, styling details, and real fashion vibes.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
          >
            <InstagramIcon size={16} />
            <span>@thriftsyndicate on IG</span>
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-neutral-900 shadow-md cursor-pointer aspect-[4/3] sm:aspect-[3/4]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              {/* Bottom Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">
                    {item.category}
                  </span>
                  <h3 className="font-display font-bold text-lg">{item.title}</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-neutral-400">{selectedImage.category}</span>
                <h3 className="font-display text-xl font-bold">{selectedImage.title}</h3>
              </div>
              <a
                href="#location"
                onClick={() => setSelectedImage(null)}
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                Visit Store To See More
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
