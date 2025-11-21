import { useState } from 'react';
import FilterSidebar from '../components/product/FilterSidebar';
import ProductGrid from '../components/product/ProductGrid';
import { Button } from '../components/ui';
import { useProductFilters } from '../hooks/useProductFilters';

const Clothes: React.FC = () => {
  const { 
    filteredProducts, 
    filters, 
    updateFilters, 
    clearFilters,
    sortBy,
    updateSort,
    isLoading 
  } = useProductFilters('clothes');

  const [clearCustomPriceTrigger, setClearCustomPriceTrigger] = useState(0);
  
  const handleClearAllFilters = () => {
    clearFilters();
    setClearCustomPriceTrigger((prev: number) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Clothes</h1>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => updateSort(e.target.value as 'newest' | 'price-low' | 'price-high' | 'name')}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                category="clothes"
                filters={filters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
                productCount={filteredProducts.length}
                key={clearCustomPriceTrigger}
              />
              
              {/* Clear Filters Button */}
              <div className="mt-6">
                <Button
                  onClick={handleClearAllFilters}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <ProductGrid 
              key={`clothes-${filteredProducts.length}`}
              products={filteredProducts}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Clothes;