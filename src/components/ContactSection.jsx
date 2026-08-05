import React, { useState } from 'react';
import { Send, Phone, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Vintage Jackets',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({
        name: '',
        phone: '',
        email: '',
        category: 'Vintage Jackets',
        message: ''
      });
    }, 4000);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hi Thrift Syndicate! I'm interested in finding ${formState.category}. My name is ${formState.name || 'a fashion lover'}.`
    );
    window.open(`https://wa.me/919703989808?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="max-w-5xl mx-auto bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-8 sm:p-14 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-full inline-block">
                Inquire & Order
              </span>

              <h2 className="font-display text-4xl font-black uppercase tracking-tight text-[#111111] leading-tight">
                Got a Vintage <br />
                <span className="text-neutral-400 font-light italic">Piece in Mind?</span>
              </h2>

              <p className="text-neutral-600 text-sm leading-relaxed">
                Looking for a specific jacket size, oversized hoodie, or retro graphic tee? Send us a quick inquiry or message us directly on WhatsApp.
              </p>

              {/* Direct Phone Call Card */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Direct Hotline</p>
                <div className="flex items-center justify-between">
                  <div>
                    <a href="tel:+919703989808" className="font-display font-extrabold text-xl text-[#111111] hover:underline">
                      +91 97039 89808
                    </a>
                    <p className="text-[11px] text-neutral-500">Available 11 AM - 9:30 PM Daily</p>
                  </div>
                  <a
                    href="tel:+919703989808"
                    className="p-3 bg-[#111111] text-white rounded-xl hover:bg-black transition-colors"
                    title="Call Now"
                  >
                    <Phone size={18} />
                  </a>
                </div>
              </div>

              {/* WhatsApp Fast Track Button */}
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white p-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare size={18} />
                <span>Chat Instantly on WhatsApp</span>
              </button>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#111111]">Inquiry Received!</h3>
                  <p className="text-neutral-600 text-sm max-w-sm mx-auto">
                    Thank you for reaching out to Thrift Syndicate. Our team will contact you shortly via phone/WhatsApp with available vintage options.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display font-bold text-xl text-[#111111] mb-2">Send Us an Inquiry</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formState.phone}
                        onChange={(e) => setFormState({...formState, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Looking For</label>
                      <select
                        value={formState.category}
                        onChange={(e) => setFormState({...formState, category: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F8F8F8] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors font-medium text-neutral-800"
                      >
                        <option value="Vintage Jackets">Vintage Jackets</option>
                        <option value="Graphic Shirts">Graphic Shirts</option>
                        <option value="Oversized Fits">Oversized Hoodies & Fits</option>
                        <option value="Streetwear">Streetwear & Cargos</option>
                        <option value="Retro Essentials">Retro Essentials</option>
                        <option value="In-Store Pickup Inquiry">In-Store Pickup Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Message / Specific Request</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what size, brand, or style you are searching for..."
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#111111] hover:bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send size={16} />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
