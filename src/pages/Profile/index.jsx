import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { User, Mail, Phone, Calendar, LogOut, ShoppingBag, Heart, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function CustomerProfile() {
  const { customer, isLoggedIn, logout } = useCustomerAuth();
  const navigate = useNavigate();

  // Protect route: redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn || !customer) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, customer, navigate]);

  if (!isLoggedIn || !customer) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-[85vh] pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-display font-black text-2xl uppercase shadow-sm">
                {customer.name?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mt-1">
                  Welcome, {customer.name}
                </h1>
                <p className="text-xs text-neutral-500 font-mono">
                  Customer ID: {customer.id}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-center"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                <Mail size={14} className="text-neutral-700" />
                <span>Email Address</span>
              </div>
              <p className="font-bold text-neutral-900 truncate">{customer.email}</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                <Phone size={14} className="text-neutral-700" />
                <span>Phone Number</span>
              </div>
              <p className="font-bold text-neutral-900">{customer.phone}</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                <Calendar size={14} className="text-neutral-700" />
                <span>Member Since</span>
              </div>
              <p className="font-bold text-neutral-900">
                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Active Member'}
              </p>
            </div>
          </div>

          {/* Placeholder Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles size={16} className="text-amber-600" />
              <span>Customer Account Active</span>
            </div>
            <p className="text-amber-800/90 leading-relaxed">
              Your customer authentication profile is successfully active. Order history, saved shipping addresses, and preference settings will sync automatically with your account.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              to="/collections"
              className="p-4 bg-[#111111] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-xs transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-emerald-400" />
                <span>Browse Vintage Catalog</span>
              </div>
              <ExternalLink size={16} />
            </Link>

            <Link
              to="/wishlist"
              className="p-4 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-900 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-rose-500" />
                <span>View Saved Wishlist</span>
              </div>
              <ExternalLink size={16} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
