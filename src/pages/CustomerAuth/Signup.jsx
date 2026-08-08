import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles, AlertCircle, CheckCircle2, LogIn } from 'lucide-react';

export default function CustomerSignup() {
  const { register, isLoggedIn } = useCustomerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const { name, email, phone, password, confirmPassword } = formData;

    // 1. Required fields
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    // 2. Email format validation
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // 3. Password minimum 6 characters
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // 4. Passwords must match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    const result = register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password
    });

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 pt-28 pb-16 sm:pt-32 sm:pb-20 bg-[#F8F8F8]">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#111111] text-white rounded-2xl mb-2 shadow-xs">
            <Sparkles size={24} className="text-emerald-400" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#111111]">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Join Thrift Syndicate for priority vintage drops, orders tracking, and wishlist synchronization.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-shake">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <User size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <Mail size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98480 12345"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <Phone size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Password (Min. 6 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-neutral-300 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Links */}
        <div className="pt-4 border-t border-neutral-100 text-center space-y-3 text-xs">
          <p className="text-neutral-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#111111] hover:underline inline-flex items-center gap-1"
            >
              <span>Sign In</span>
              <LogIn size={14} />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
