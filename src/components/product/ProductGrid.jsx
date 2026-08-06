import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], onSelectProduct, onToggleSave, savedIds = [] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200">
        <p className="text-sm font-medium">No products match your selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        const isSaved = savedIds.includes(product.id);
        return (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
            onToggleSave={onToggleSave}
            isSaved={isSaved}
          />
        );
      })}
    </div>
  );
}
