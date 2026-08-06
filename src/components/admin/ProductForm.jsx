import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function ProductForm({ initialProduct = null, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    category: initialProduct?.category || 'Vintage Jackets',
    brand: initialProduct?.brand || 'Thrift Syndicate',
    price: initialProduct?.price || '',
    originalPrice: initialProduct?.originalPrice || '',
    size: initialProduct?.size || 'L / XL',
    condition: initialProduct?.condition || '9.5/10 Pristine Thrift Condition',
    badge: initialProduct?.badge || '1-of-1 Original',
    image: initialProduct?.image || '/images/jackets.png',
    description: initialProduct?.description || '',
    inStock: initialProduct?.inStock !== false,
    featured: Boolean(initialProduct?.featured),
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required.';
    if (!formData.category.trim()) newErrors.category = 'Category is required.';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required.';
    if (!formData.size.trim()) newErrors.size = 'Size is required.';
    if (!formData.condition.trim()) newErrors.condition = 'Condition is required.';
    if (!formData.image.trim()) newErrors.image = 'Product image is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 my-8" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 bg-[#111111] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles size={20} className="text-emerald-400" />
            <h3 className="font-display font-extrabold text-xl uppercase tracking-tight">
              {initialProduct ? 'Edit Vintage Product' : 'Add New Vintage Product'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Image Upload Component with Instant Preview */}
          <ImageUpload
            value={formData.image}
            onChange={(base64Url) => handleChange({ target: { name: 'image', value: base64Url } })}
            error={errors.image}
          />

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-neutral-700">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. 90s Heavyweight Leather Biker Jacket"
              className={`w-full bg-neutral-50 border rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none ${
                errors.name ? 'border-rose-500' : 'border-neutral-200'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 font-semibold">{errors.name}</p>}
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
              >
                <option value="Vintage Jackets">Vintage Jackets</option>
                <option value="Graphic Shirts">Graphic Shirts</option>
                <option value="Oversized Fits">Oversized Fits</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Retro Essentials">Retro Essentials</option>
                <option value="Limited Finds">Limited Finds</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-700">Brand / Era *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Thrift Syndicate Vintage"
                className={`w-full bg-neutral-50 border rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none ${
                  errors.brand ? 'border-rose-500' : 'border-neutral-200'
                }`}
              />
              {errors.brand && <p className="text-[11px] text-rose-500 font-semibold">{errors.brand}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-700">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2499"
                className={`w-full bg-neutral-50 border rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none ${
                  errors.price ? 'border-rose-500' : 'border-neutral-200'
                }`}
              />
              {errors.price && <p className="text-[11px] text-rose-500 font-semibold">{errors.price}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-700">Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="7999"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
              />
            </div>
          </div>

          {/* Size & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-700">Tag Size *</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. L / XL"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-700">Badge Tag</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. 1-of-1 Original"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-neutral-700">Condition Description *</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="e.g. 9.5/10 Pristine Thrift Condition"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-neutral-700">Description *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of vintage item..."
              className={`w-full bg-neutral-50 border rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#111111] focus:outline-none ${
                errors.description ? 'border-rose-500' : 'border-neutral-200'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-500 font-semibold">{errors.description}</p>}
          </div>

          {/* Switches */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-neutral-800">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 accent-[#111111]"
              />
              <span>In Stock</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-neutral-800">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#111111]"
              />
              <span>Featured Drop</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              {initialProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
