import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, wishlistCount, removeFromWishlist, moveToCart } = useWishlist();
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleMoveToCart = (item) => {
    if (!item.product) return;
    moveToCart(item.productId);
    showToast(`Moved "${item.product.name}" to your shopping cart!`);
  };

  const handleRemove = (productId, productName) => {
    removeFromWishlist(productId);
    if (productName) {
      showToast(`Removed "${productName}" from your wishlist.`);
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-32 bg-white min-h-[85vh]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Toast Feedback Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 animate-slide-up">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <Link to="/collections" className="hover:text-black transition-colors">Collections</Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-900 font-bold">My Wishlist</span>
        </nav>

        {/* Page Title & Count Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-black text-3xl sm:text-4xl uppercase text-[#111111] tracking-tight">
                Saved Wishlist
              </h1>
              {wishlistCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-3 py-1 rounded-full border border-rose-200">
                  {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Your handpicked 1-of-1 vintage drops and streetwear essentials.
            </p>
          </div>

          {wishlistCount > 0 && (
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black"
            >
              <span>Explore More Drops</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-6 animate-fade-in my-8">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              <Heart size={40} className="fill-rose-100 text-rose-500" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-2xl uppercase text-[#111111] tracking-tight">
                Your wishlist is empty.
              </h2>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Explore our curated vintage drops, oversized hoodies, graphic tees, and jackets to save your favorite 1-of-1 pieces.
              </p>
            </div>

            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Browse Vintage Collections</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid / List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const { product, isOrphan, productId } = item;

              if (isOrphan) {
                return (
                  <div key={productId} className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-3 text-rose-600">
                      <AlertCircle size={20} />
                      <span className="font-bold text-xs uppercase">Product Unavailable</span>
                    </div>
                    <p className="text-xs text-neutral-600 italic">
                      This product is no longer available in the catalog.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(productId)}
                      className="w-full border border-neutral-300 hover:bg-neutral-200 text-neutral-800 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Remove Entry</span>
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={product.id}
                  className="group bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Thumbnail & Image */}
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${
                        product.inStock ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Remove Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id, product.name)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-neutral-600 hover:text-rose-600 rounded-full shadow-md transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Product Metadata */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                        {product.category} • {product.brand}
                      </span>
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-display font-extrabold text-base text-[#111111] hover:text-neutral-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-lg text-[#111111]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through font-mono">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {product.size && (
                          <span className="ml-auto text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                            Size: {product.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Move to Cart CTA */}
                    <button
                      type="button"
                      disabled={!product.inStock}
                      onClick={() => handleMoveToCart(item)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                        product.inStock
                          ? 'bg-[#111111] hover:bg-black text-white shadow-md hover:scale-[1.01]'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag size={16} />
                      <span>{product.inStock ? 'Move to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
