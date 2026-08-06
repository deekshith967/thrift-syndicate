import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onSelectProduct, onToggleSave, isSaved }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : product.image;
  const badgeText = product.badge || (product.featured ? "Featured" : product.newArrival ? "New Arrival" : null);
  const productUrl = `/products/${product.id}`;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <Link to={productUrl} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {badgeText && (
            <span className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              {badgeText}
            </span>
          )}
          {product.size && (
            <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-neutral-200">
              {product.size}
            </span>
          )}
        </div>

        {/* Top Right Save / Heart Button */}
        <button
          onClick={() => onToggleSave && onToggleSave(product.id)}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 shadow-md ${
            isSaved
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
        >
          <Heart size={16} className={isSaved ? "fill-white" : ""} />
        </button>

        {/* Hover Quick Action Overlay Buttons */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 bg-[#111111] hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-[1.02]"
            title="Add item to Cart"
          >
            <ShoppingBag size={14} />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={() => onSelectProduct && onSelectProduct(product)}
            className="p-2.5 bg-white/95 hover:bg-white text-neutral-900 rounded-xl text-xs font-bold shadow-lg transition-transform hover:scale-[1.02]"
            title="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>{product.category}</span>
            <span className="font-mono text-[11px] text-neutral-400">{product.era || product.brand}</span>
          </div>
          <Link to={productUrl} className="block">
            <h3 className="font-display font-bold text-base text-[#111111] group-hover:text-neutral-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-xl text-[#111111]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold uppercase">In-Store / Delivery</p>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="bg-neutral-100 hover:bg-[#111111] hover:text-white text-neutral-800 p-2.5 rounded-xl transition-colors"
            title="Add to Cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
