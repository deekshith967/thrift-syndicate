import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /admin
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(res.error);
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@thriftsyndicate.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="pt-24 pb-20 bg-[#F8F8F8] min-h-[85vh] flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 sm:p-10 space-y-8 animate-fade-in">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles size={28} className="text-emerald-400" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Thrift Syndicate Console
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase text-[#111111] tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-xs text-neutral-500">
                Enter your credentials to manage products, catalog, and orders.
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-700 uppercase text-[10px] flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" /> Default Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] font-extrabold text-[#111111] hover:underline uppercase"
              >
                Auto-Fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-neutral-600 space-y-0.5">
              <p>Email: <strong className="text-neutral-900">admin@thriftsyndicate.com</strong></p>
              <p>Password: <strong className="text-neutral-900">admin123</strong></p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2 text-left">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-neutral-700">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                  placeholder="admin@thriftsyndicate.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-neutral-700">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-10 py-3 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Console'}</span>
              <ArrowRight size={16} />
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
