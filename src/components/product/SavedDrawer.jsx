import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, MessageSquare, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SavedDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    cartCount,
    subtotal,
    couponDiscount,
    total,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    closeCart
  } = useCart();
  const navigate = useNavigate();

  const handleClose = onClose || closeCart;

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    const itemLines = cartItems
      .map((item) => `• ${item.product.name} (Qty: ${item.quantity}) - ₹${(item.product.price * item.quantity).toLocaleString()}`)
      .join('\n');
    const couponLine = appliedCoupon ? `\nPromo Code (${appliedCoupon.code}): -₹${couponDiscount.toLocaleString()}` : '';
    const text = encodeURIComponent(
      `Hi Thrift Syndicate! I would like to place an order for the following items:\n${itemLines}${couponLine}\n\nTotal Amount: ₹${total.toLocaleString()}.\nPlease confirm stock & delivery details!`
    );
    window.open(`https://wa.me/919703989808?text=${text}`, '_blank');
  };

  const handleGoToCheckoutPage = () => {
    handleClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    handleClose();
    navigate('/collections');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#111111] text-white p-2 rounded-xl">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-[#111111]">
                Shopping Cart
              </h3>
              <span className="text-[11px] font-semibold text-neutral-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <ShoppingBag size={32} />
              </div>
              <h4 className="font-display font-bold text-lg text-neutral-800">Your Shopping Cart is Empty</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our handpicked vintage jackets, graphic tees, and streetwear to add items to your cart.
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => {
              const imageUrl = product.images?.[0] || product.image || "/images/hero.png";
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors"
                >
                  {/* Item Image */}
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-xl shrink-0 border border-neutral-200"
                  />

                  {/* Details & Controls */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-400">
                      <span>{product.category}</span>
                      <span>{product.size}</span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#111111] truncate">{product.name}</h4>
                    
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs font-black text-neutral-900">
                        ₹{(product.price * quantity).toLocaleString()}
                      </p>

                      {/* Quantity Selector (- qty +) */}
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-900 min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
                          title="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-neutral-400 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-[#F8F8F8] space-y-3">
            
            <div className="space-y-1.5 text-xs pb-1">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Subtotal Amount:</span>
                <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Promo Discount ({appliedCoupon.code})</span>
                  </span>
                  <span>-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm font-black text-[#111111] pt-1.5 border-t border-neutral-200">
                <span>Est. Order Total:</span>
                <span className="font-display text-xl text-[#111111]">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleGoToCheckoutPage}
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShieldCheck size={16} />
                <span>Proceed to Order Checkout</span>
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full border border-emerald-700 text-emerald-800 hover:bg-emerald-50 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center transition-colors"
              >
                <MessageSquare size={16} />
                <span>Quick WhatsApp Checkout</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
