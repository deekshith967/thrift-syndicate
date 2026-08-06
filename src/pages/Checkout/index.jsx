import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../data/orderService';
import { getProductById } from '../../data/productService';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  CreditCard,
  QrCode,
  Truck,
  Store,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Customer Information Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530020'
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Order Submission State
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formError, setFormError] = useState('');

  // Calculations
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 1999 ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setFormError('Your cart is empty. Add items before placing an order.');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      setFormError('Please fill in all required shipping fields (Name, Phone, Address).');
      return;
    }

    const generatedId = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderPayload = {
      orderId: generatedId,
      items: cartItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          size: item.product.size,
          category: item.product.category,
          image: item.product.images?.[0] || item.product.image
        },
        quantity: item.quantity
      })),
      subtotal,
      deliveryFee,
      total: grandTotal,
      customer: { ...formData },
      paymentMethod,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const savedOrder = createOrder(orderPayload);
      setOrderDetails(savedOrder);
      setIsOrderSubmitted(true);
      clearCart();
    } catch (err) {
      console.error('Order creation failed:', err);
      setFormError('Could not save your order. Please try again or clear storage.');
    }
  };

  // If Order is Placed: Render Professional Order Success Page
  if (isOrderSubmitted && orderDetails) {
    const whatsappMessage = encodeURIComponent(
      `Hi Thrift Syndicate! I have placed Order #${orderDetails.id} for ₹${orderDetails.total.toLocaleString()}.\nCustomer: ${orderDetails.customer.fullName} (${orderDetails.customer.phone}).\nPlease confirm delivery/pickup!`
    );

    return (
      <div className="pt-24 pb-20 bg-[#F8F8F8] min-h-[85vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 sm:p-12 text-center space-y-8 animate-fade-in">
            
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={48} />
            </div>

            {/* Header */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Order Confirmed & Saved
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl uppercase text-[#111111] tracking-tight">
                Thank You For Your Order!
              </h1>
              <p className="text-sm text-neutral-600">
                Your order has been saved in our system. We will contact you shortly regarding delivery or store pickup in Daba Gardens, Vizag.
              </p>
            </div>

            {/* Order Summary ID Badge */}
            <div className="bg-[#111111] text-white p-4 rounded-2xl flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order Reference</span>
                <p className="font-display font-extrabold text-xl font-mono text-emerald-400">#{orderDetails.id}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Amount</span>
                <p className="font-display font-extrabold text-xl">₹{orderDetails.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Shipping & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
              <div className="space-y-1">
                <span className="font-bold uppercase text-neutral-400 text-[10px]">Customer & Shipping</span>
                <p className="font-bold text-neutral-900">{orderDetails.customer.fullName}</p>
                <p className="text-neutral-600">{orderDetails.customer.phone}</p>
                <p className="text-neutral-600">{orderDetails.customer.address}, {orderDetails.customer.city}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase text-neutral-400 text-[10px]">Payment Method & Status</span>
                <p className="font-bold text-neutral-900 uppercase">
                  {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery / Pickup' : orderDetails.paymentMethod === 'upi' ? 'UPI Instant Payment' : 'Card Payment'}
                </p>
                <p className="text-neutral-500 pt-1">Status: <strong className="text-amber-600 uppercase font-bold">{orderDetails.status}</strong></p>
              </div>
            </div>

            {/* Itemized Purchased List */}
            <div className="text-left space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-500">Ordered Items ({orderDetails.items.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {orderDetails.items.map(({ product, quantity }) => {
                  const activeProd = getProductById(product.id);
                  const displayImg = activeProd?.images?.[0] || activeProd?.image || product.image || '/images/hero.png';
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-xl text-xs">
                      <div className="flex items-center gap-3">
                        <img src={displayImg} alt={product.name} className="w-10 h-12 object-cover rounded-lg" />
                        <div>
                          <p className="font-bold text-neutral-900">{product.name}</p>
                          <p className="text-[10px] text-neutral-500">Qty: {quantity} • Size: {product.size}</p>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900">₹{(product.price * quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <a
                href={`https://wa.me/919703989808?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare size={16} />
                <span>Confirm Order via WhatsApp</span>
              </a>

              <Link
                to="/collections"
                className="w-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center transition-colors block"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <Link to="/collections" className="hover:text-black transition-colors">Collections</Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-900 font-bold">Checkout</span>
        </nav>

        <div className="mb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase text-[#111111] tracking-tight">
            Checkout & Order Summary
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Complete your shipping address and payment preference to place your vintage order.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold">
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Customer Info & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Customer Information */}
            <div className="bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                <User size={18} className="text-neutral-900" />
                <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-[#111111]">
                  1. Shipping & Customer Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Sid Verma"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 97000 00000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 uppercase">Street Address / Landmark *</label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="House no., Street, Area, Landmark"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 uppercase">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                <CreditCard size={18} className="text-neutral-900" />
                <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-[#111111]">
                  2. Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                
                {/* Option 1: COD / Store Pickup */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'bg-white border-black shadow-md' : 'bg-white/60 border-neutral-200 hover:bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-black"
                    />
                    <div>
                      <p className="font-display font-bold text-xs uppercase text-[#111111]">Cash on Delivery / In-Store Pickup</p>
                      <p className="text-[11px] text-neutral-500">Pay when you receive the item or pick up at Daba Gardens store.</p>
                    </div>
                  </div>
                  <Store size={18} className="text-neutral-500" />
                </label>

                {/* Option 2: UPI */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'bg-white border-black shadow-md' : 'bg-white/60 border-neutral-200 hover:bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-black"
                    />
                    <div>
                      <p className="font-display font-bold text-xs uppercase text-[#111111]">UPI Instant Payment</p>
                      <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm, or BHIM UPI.</p>
                    </div>
                  </div>
                  <QrCode size={18} className="text-neutral-500" />
                </label>

                {/* Option 3: Card */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'bg-white border-black shadow-md' : 'bg-white/60 border-neutral-200 hover:bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-black"
                    />
                    <div>
                      <p className="font-display font-bold text-xs uppercase text-[#111111]">Credit / Debit Card</p>
                      <p className="text-[11px] text-neutral-500">Visa, Mastercard, RuPay cards supported.</p>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-neutral-500" />
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Cart Breakdown & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-[#111111]">
                  Order Items ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>
                <Link to="/collections" className="text-xs font-bold text-neutral-500 hover:text-black">
                  Edit Cart
                </Link>
              </div>

              {/* Items List */}
              {cartItems.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <ShoppingBag size={32} className="mx-auto text-neutral-300" />
                  <p className="text-xs text-neutral-500 font-medium">Your cart is empty.</p>
                  <Link to="/collections" className="inline-block text-xs font-bold text-[#111111] underline">
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-neutral-200">
                      <img src={product.images?.[0] || product.image} alt={product.name} className="w-12 h-14 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-xs text-neutral-900 truncate">{product.name}</p>
                        <p className="text-[10px] text-neutral-500">Size: {product.size}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-0.5 border rounded hover:bg-neutral-100"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-0.5 border rounded hover:bg-neutral-100"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-xs">₹{(product.price * quantity).toLocaleString()}</p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-400 hover:text-rose-500 text-[10px] mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-200 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-neutral-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 1999 && (
                  <p className="text-[10px] text-neutral-500 italic">
                    Add ₹{(1999 - subtotal).toLocaleString()} more for Free Delivery!
                  </p>
                )}
                <div className="flex justify-between text-base font-black text-[#111111] pt-3 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit / Place Order Button */}
              <button
                type="submit"
                disabled={cartItems.length === 0}
                className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                  cartItems.length === 0
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-[#111111] hover:bg-black text-white shadow-lg hover:scale-[1.01]'
                }`}
              >
                <ShieldCheck size={18} />
                <span>Place Vintage Order</span>
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
