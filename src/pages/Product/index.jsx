import React, { useState } from 'react';
import { useParams, Link, Navigate, useOutletContext } from 'react-router-dom';
import { useProducts, getProductById, getRelatedProducts } from '../../data/productService';
import ProductGrid from '../../components/product/ProductGrid';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  Heart,
  Store,
  Truck,
  Phone,
  MessageSquare,
  Star,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const products = useProducts();
  const product = getProductById(productId, products);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // If product not found or deleted, redirect to 404
  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const isWishlisted = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[activeImgIdx] || images[0];

  const relatedProducts = getRelatedProducts(product, 4, products);

  const whatsappMessage = encodeURIComponent(
    `Hi Thrift Syndicate! I would like to reserve/inquire about "${product.name}" (${product.size}) listed for ₹${product.price}.`
  );

  return (
    <div className="pt-28 pb-20 sm:pt-32 bg-white min-h-[85vh]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* 1. Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-black transition-colors flex items-center gap-1">
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-neutral-400 shrink-0" />
          <Link to="/collections" className="hover:text-black transition-colors">
            Collections
          </Link>
          <ChevronRight size={12} className="text-neutral-400 shrink-0" />
          <span className="text-neutral-700">{product.category}</span>
          <ChevronRight size={12} className="text-neutral-400 shrink-0" />
          <span className="text-neutral-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. Main Product Details View */}
        <div className="bg-[#F8F8F8] border border-neutral-200/90 rounded-3xl overflow-hidden shadow-lg p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Product Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
                  {product.badge && (
                    <span className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                      {product.badge}
                    </span>
                  )}
                  {product.era && (
                    <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-neutral-200 shadow-xs">
                      {product.era}
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImgIdx === idx ? 'border-[#111111] shadow-md scale-105' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase / Reserve Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                
                {/* Category, Rating, Stock */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-neutral-500 bg-white border border-neutral-200 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-neutral-400 font-mono">Brand: <strong className="text-neutral-800">{product.brand}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{product.rating} / 5.0</span>
                  </div>
                </div>

                {/* Name */}
                <h1 className="font-display font-black text-3xl sm:text-4xl text-[#111111] uppercase tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Stock Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                    product.stock === 0 ? 'bg-rose-500' : product.stock <= 2 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                  }`}></span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    product.stock === 0 ? 'text-rose-700' : product.stock <= 2 ? 'text-amber-800 font-extrabold' : 'text-emerald-700'
                  }`}>
                    {product.stock === 0 ? 'Out of Stock' : product.stock <= 2 ? `⚡ Only ${product.stock} Left In Stock!` : `✓ In Stock (${product.stock} available)`}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-xs font-medium text-neutral-600">{product.condition}</span>
                </div>

                {/* Price Strip */}
                <div className="flex flex-wrap items-baseline gap-4 py-3 border-y border-neutral-200">
                  <span className="font-display font-black text-4xl text-[#111111]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-neutral-400 line-through font-mono">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()} ({product.discount}% OFF)
                    </span>
                  )}
                </div>

                {/* Specs Table */}
                <div className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">Tag Size & Fit:</span>
                    <span className="font-bold text-neutral-900">{product.size} ({product.fit})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">Available Quantity:</span>
                    <span className={`font-bold ${product.stock === 0 ? 'text-rose-600' : product.stock <= 2 ? 'text-amber-700 font-extrabold' : 'text-emerald-700'}`}>
                      {product.stock === 0 ? '0 (Out of Stock)' : `${product.stock} units`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">Fabric Composition:</span>
                    <span className="font-bold text-neutral-900">{product.fabric}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500 font-medium">Authentication:</span>
                    <span className="font-bold text-emerald-700">✓ 100% Verified Vintage Piece</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-700 leading-relaxed italic">
                  "{product.description}"
                </p>

                {/* Delivery Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-neutral-200 text-neutral-800 font-medium">
                    <Store size={16} className="text-neutral-900 shrink-0" />
                    <span>In-Store Pickup (Daba Gardens, Vizag)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-neutral-200 text-neutral-800 font-medium">
                    <Truck size={16} className="text-neutral-900 shrink-0" />
                    <span>Express Home Delivery Available</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Add to Cart, Reserve & Wishlist */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <button
                  disabled={product.stock === 0}
                  onClick={() => product.stock > 0 && addToCart(product, 1)}
                  className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                    product.stock === 0
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-[#111111] hover:bg-black text-white shadow-lg hover:scale-[1.01]'
                  }`}
                >
                  <ShoppingBag size={18} />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
                </button>

                <a
                  href={`https://wa.me/919703989808?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <MessageSquare size={18} />
                  <span>Reserve Piece via WhatsApp</span>
                </a>

                <div className="flex gap-3">
                  <a
                    href="tel:+919703989808"
                    className="w-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone size={16} />
                    <span>Call Store (+91 97039 89808)</span>
                  </a>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`px-6 rounded-2xl border transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider ${
                      isWishlisted 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md' 
                        : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <Heart size={18} className={isWishlisted ? "fill-white text-white" : ""} />
                    <span>{isWishlisted ? "Wishlisted" : "Save"}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full inline-block">
                  Similar Vintage Drops
                </span>
                <h3 className="font-display text-3xl font-black uppercase text-[#111111] tracking-tight">
                  More From {product.category}
                </h3>
              </div>

              <Link
                to="/collections"
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-black transition-colors"
              >
                <span>View Full Catalog</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <ProductGrid products={relatedProducts} />
          </div>
        )}

      </div>
    </div>
  );
}
