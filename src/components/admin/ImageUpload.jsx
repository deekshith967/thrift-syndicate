import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link as LinkIcon } from 'lucide-react';

export default function ImageUpload({ value, onChange, error }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value || '');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 650;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress image to lightweight, fully serializable JPEG Data URL (~25KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
        onChange(compressedDataUrl);
      };

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-neutral-700">Product Image *</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-neutral-500 hover:text-black flex items-center gap-1"
        >
          <LinkIcon size={12} />
          <span>{showUrlInput ? 'Use File Upload' : 'Enter URL / Path'}</span>
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlValue}
            onChange={(e) => {
              setUrlValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="e.g. /images/jackets.png or https://..."
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
          />
        </div>
      ) : value ? (
        /* Image Preview Box */
        <div className="relative aspect-[4/3] w-full max-w-xs mx-auto bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 group shadow-sm">
          <img
            src={value}
            alt="Product Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-neutral-900 px-3 py-1.5 rounded-xl text-xs font-bold uppercase shadow-md hover:bg-neutral-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-rose-600 text-white p-2 rounded-xl text-xs shadow-md hover:bg-rose-700"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#111111] bg-neutral-100 scale-[1.01]'
              : error
              ? 'border-rose-400 bg-rose-50/50'
              : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100/70 hover:border-neutral-400'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto text-neutral-600 mb-2 shadow-xs">
            <Upload size={20} />
          </div>
          <p className="text-xs font-bold text-neutral-800 uppercase">
            Click to upload or drag & drop image
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            PNG, JPG, WEBP up to 5MB (Auto-optimized for instant storage)
          </p>
        </div>
      )}

      {error && <p className="text-[11px] text-rose-500 font-semibold">{error}</p>}
    </div>
  );
}
