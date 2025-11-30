import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { Product } from '../../types';
import ProductCard from './ProductCard';
import { Loading, Button } from '../ui';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
  productsPerPage?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading = false, 
  className = '',
  productsPerPage = 9
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  
  // Check for highlighted product from search
  const highlightId = new URLSearchParams(location.search).get('highlight') || 
    localStorage.getItem('safari-search-highlight');
  
  const totalPages = Math.ceil(products.length / productsPerPage);
  const effectiveCurrentPage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
  
  // Recalculate with effective current page
  const effectiveStartIndex = (effectiveCurrentPage - 1) * productsPerPage;
  const effectiveEndIndex = effectiveStartIndex + productsPerPage;
  const displayProducts = useMemo(() => 
    products.slice(effectiveStartIndex, effectiveEndIndex), 
    [products, effectiveStartIndex, effectiveEndIndex]
  );
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center min-h-[400px] ${className}`}>
        <Loading text="Loading products..." size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
        <svg 
          className="w-16 h-16 text-gray-300 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500 text-center max-w-sm">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            isHighlighted={product.id === highlightId}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={effectiveCurrentPage === 1}
            className="text-sm"
          >
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={effectiveCurrentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm ${
                  effectiveCurrentPage === page 
                    ? 'bg-safari-pink text-white border-safari-pink' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={effectiveCurrentPage === totalPages}
            className="text-sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;