import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Collections from '../../components/product/Collections';
import CtaBanner from '../../components/common/CtaBanner';

export default function CollectionsPage() {
  const context = useOutletContext() || {};
  const { onSelectProduct, onToggleSave, savedIds = [] } = context;

  return (
    <div className="pt-20">
      <Collections 
        onSelectProduct={onSelectProduct} 
        onToggleSave={onToggleSave}
        savedIds={savedIds}
      />
      <CtaBanner />
    </div>
  );
}
