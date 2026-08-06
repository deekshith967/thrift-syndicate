import React from 'react';
import { PRODUCTS } from '../../data/productService';
import { X, Trash2, MessageSquare, Phone, ArrowRight, ShoppingBag } from 'lucide-react';

export default function SavedDrawer({ isOpen, onClose, savedIds, onToggleSave, onSelectProduct }) {
  if (!isOpen) return null;

  const savedProducts = PRODUCTS.filter(p => savedIds.includes(p.id));
  const totalPrice = savedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleWhatsAppBatch = () => {
    const itemNames = savedProducts.map(p => `• ${p.name} (₹${p.price})`).join('\n');
    const text = encodeURIComponent(
      `Hi Thrift Syndicate! I have saved the following vintage items to reserve:\n${itemNames}\nTotal Value: ₹${totalPrice}.\nPlease confirm availability at your Daba Gardens store!`
    );
    window.open(`https://wa.me/919703989808?text=${text}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-neutral-900" />
            <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-[#111111]">
              Saved Wishlist ({savedProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <ShoppingBag size={32} />
              </div>
              <h4 className="font-display font-bold text-lg text-neutral-800">Your Wishlist is Empty</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Click the heart icon on any vintage item to save it for quick reservation or in-store pickup.
              </p>
              <button
                onClick={onClose}
                className="bg-[#111111] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            savedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors"
              >
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  className="w-16 h-20 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">{product.category}</span>
                  <h4 className="font-display font-bold text-sm text-[#111111] truncate">{product.name}</h4>
                  <p className="text-xs font-bold text-neutral-900 mt-1">₹{product.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => onToggleSave(product.id)}
                  className="p-2 text-neutral-400 hover:text-rose-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & WhatsApp CTA */}
        {savedProducts.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-[#F8F8F8] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 font-medium">Estimated Total Value:</span>
              <span className="font-display font-black text-xl text-[#111111]">₹{totalPrice.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleWhatsAppBatch}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare size={16} />
                <span>Reserve Saved Items via WhatsApp</span>
              </button>

              <a
                href="tel:+919703989808"
                className="w-full border border-neutral-900 text-neutral-900 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center"
              >
                <Phone size={14} />
                <span>Call Store (+91 97039 89808)</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
