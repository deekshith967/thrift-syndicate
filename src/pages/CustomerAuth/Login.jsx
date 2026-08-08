import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';

export default function CustomerLogin() {
  const { login, isLoggedIn } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to profile or home
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);

    const result = login(formData.email, formData.password);

    if (result.success) {
      // Redirect to home or redirect target
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password.');
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
            Welcome Back
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Log in to your Thrift Syndicate customer account to manage your orders and profile.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-shake">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 pl-10 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:bg-white focus:outline-none transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-neutral-300"
          >
            <span>{loading ? 'Logging in...' : 'Sign In to Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Links */}
        <div className="pt-4 border-t border-neutral-100 text-center space-y-3 text-xs">
          <p className="text-neutral-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#111111] hover:underline inline-flex items-center gap-1"
            >
              <span>Create Account</span>
              <UserPlus size={14} />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
