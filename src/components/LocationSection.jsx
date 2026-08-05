import React from 'react';
import { MapPin, Phone, Clock, Navigation, Star, ShieldCheck, Copy, Check } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function LocationSection() {
  const [copied, setCopied] = React.useState(false);

  const fullAddress = "Ramalayam, Krishna Gardens Road, Behind Street, Daba Gardens, Mahaarajupeta, Visakhapatnam, Andhra Pradesh 530020";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Thrift Syndicate Daba Gardens Visakhapatnam")}`;

  return (
    <section id="location" className="py-24 bg-[#F8F8F8] relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-full inline-block">
            Visit Our Store
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Located In The Heart Of <br />
            <span className="text-neutral-400 font-light italic">Visakhapatnam</span>
          </h2>
          <p className="text-neutral-600 text-base">
            Drop by Daba Gardens to experience Vizag’s favorite curated vintage clothing hub in person.
          </p>
        </div>

        {/* Store Location Info & Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Store Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-[#111111] uppercase tracking-tight">
                    THRIFT SYNDICATE
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Daba Gardens Boutique</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Open Today
                </span>
              </div>

              {/* Address Detail */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-900 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-0.5 leading-snug">
                      Ramalayam, Krishna Gardens Road, Behind Street, Daba Gardens, Mahaarajupeta, Visakhapatnam, Andhra Pradesh 530020
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="ml-11 inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black font-semibold underline decoration-neutral-300"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-600">Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Full Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Phone Detail */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-900 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone & WhatsApp</p>
                  <a href="tel:+919703989808" className="text-base font-extrabold text-[#111111] hover:underline">
                    +91 97039 89808
                  </a>
                  <p className="text-[11px] text-neutral-500">Call for item availability & directions</p>
                </div>
              </div>

              {/* Hours Detail */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-900 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Store Hours</p>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">
                    Monday – Sunday: 11:00 AM – 9:30 PM
                  </p>
                  <p className="text-[11px] text-neutral-500">Open 7 days a week</p>
                </div>
              </div>

            </div>

            {/* Bottom Buttons */}
            <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Navigation size={16} />
                <span>Get Google Maps Directions</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-full border border-neutral-300 hover:border-black text-neutral-800 py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <InstagramIcon size={16} />
                <span>Instagram</span>
              </a>
            </div>

          </div>

          {/* Right Map Embed Column */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 bg-neutral-200 min-h-[400px] lg:min-h-full relative">
            <iframe
              title="Thrift Syndicate Visakhapatnam Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.851965902175!2d83.3005!3d17.7126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQyJzQ1LjQiTiA4M8KwMTgnMDEuOCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '420px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
            ></iframe>

            {/* Overlaid Location Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-neutral-200 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
                📍
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Visakhapatnam, Andhra Pradesh</p>
                <p className="text-[10px] text-neutral-500">Daba Gardens • Behind Street</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
