import React from 'react';
import { X, Heart, ShieldCheck, Truck, Store, Phone, MessageSquare, Check, Sparkles } from 'lucide-react';

export default function ProductModal({ product, onClose, onToggleSave, isSaved }) {
  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Hi Thrift Syndicate! I would like to reserve/inquire about "${product.name}" (${product.size}) listed for ₹${product.price}.`
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-neutral-900 flex items-center justify-center hover:bg-black hover:text-white transition-colors border border-neutral-200"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Product Image Column */}
          <div className="md:col-span-6 relative aspect-[4/5] bg-neutral-100">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow">
                {product.badge}
              </span>
              <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-neutral-200">
                {product.era}
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span>{product.category}</span>
                  <span className="text-emerald-700 font-semibold">{product.condition}</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-[#111111] leading-snug">
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-neutral-100">
                <span className="font-display font-black text-3xl text-[#111111]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through font-mono">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Tag Size & Fit:</span>
                  <span className="font-bold text-neutral-900">{product.size} ({product.fit})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Fabric Composition:</span>
                  <span className="font-bold text-neutral-900">{product.fabric}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Authentication:</span>
                  <span className="font-bold text-emerald-700">✓ Handpicked & Quality Checked</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed italic">
                "{product.description}"
              </p>

              {/* Delivery options */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-lg text-neutral-700 font-medium">
                  <Store size={14} className="text-neutral-900" />
                  <span>In-Store Pickup (Daba Gardens)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-lg text-neutral-700 font-medium">
                  <Truck size={14} className="text-neutral-900" />
                  <span>Home Delivery Available</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <a
                href={`https://wa.me/919703989808?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare size={16} />
                <span>Reserve via WhatsApp</span>
              </a>

              <div className="flex gap-2">
                <a
                  href="tel:+919703989808"
                  className="w-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone size={14} />
                  <span>Call Store</span>
                </a>

                <button
                  onClick={() => onToggleSave(product.id)}
                  className={`px-4 rounded-xl border transition-colors flex items-center justify-center ${
                    isSaved 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                  title={isSaved ? "Saved" : "Save Item"}
                >
                  <Heart size={16} className={isSaved ? "fill-white" : ""} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
