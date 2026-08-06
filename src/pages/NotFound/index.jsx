import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-[#111111] text-white">
          <Sparkles size={36} />
        </div>
        <h1 className="font-display text-6xl font-black uppercase text-[#111111] tracking-tight">
          404
        </h1>
        <h2 className="font-display text-2xl font-bold uppercase text-neutral-800">
          Page Not Found
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          The vintage piece or page you are looking for doesn't exist or has moved. Explore our curated collections back on the main page.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
