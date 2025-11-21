import { useState } from 'react';
import type { ProductCategory, ProductColor, ClothingSize, ShoeSize } from '../../types';
import { Button, Checkbox } from '../ui';

interface FilterState {
  categories: string[];
  sizes: string[];
  colors: ProductColor[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  category: ProductCategory;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  productCount: number;
  onClearCustomPrice?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  filters,
  onFiltersChange,
  onClearFilters,
  productCount,
  onClearCustomPrice,
}) => {
  const [customMin, setCustomMin] = useState<string>('');
  const [customMax, setCustomMax] = useState<string>('');
  
  const categoryFilters = {
    clothes: [
      'All',
      'Dresses',
      'Denim',
      'Jeans',
      'Jumpsuits',
      'Tops',
      'Jackets and coats',
      'Pants',
      'Shorts',
      'Skirts',
      'Loungewear & underwear',
      'Leather',
      'Sweaters & knits',
    ],
    shoes: [
      'All',
      'Booties',
      'Flats',
      'Boots',
      'Sandals',
      'Sneakers',
      'Slides & Slippers',
      'Wedges',
      'Mules',
      'Party shoes',
      'Casual shoes',
      'Oxfords',
    ],
    accessories: [
      'All',
      'Bags',
      'Jewelry',
      'Hats',
      'Belts',
      'Scarves',
      'Sunglasses',
      'Watches',
    ],
  };

  const clothingSizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const shoeSizes: ShoeSize[] = [
    '35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', 
    '39', '39.5', '40', '40.5', '41', '41.5', '42', '42.5', 
    '43', '43.5', '44', '44.5', '45'
  ];

  const availableSizes = category === 'shoes' ? shoeSizes : clothingSizes;

  const colors: ProductColor[] = [
    'beige', 'blue', 'black', 'orange', 'green', 'brown',
    'purple', 'gold', 'taupe', 'white', 'pink', 'red'
  ];

  const priceRanges = [
    { label: '₦0', min: 0, max: 15000 },
    { label: '₦10,000 - ₦20,000', min: 10000, max: 20000 },
    { label: '₦20,000 - ₦50,000', min: 20000, max: 50000 },
    { label: '₦50,000 - ₦100,000', min: 50000, max: 100000 },
    { label: '₦100,000 - ₦200,000', min: 100000, max: 200000 },
  ];

  const handleCategoryChange = (selectedCategory: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, selectedCategory]
      : filters.categories.filter(c => c !== selectedCategory);
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleCustomPriceApply = () => {
    const min = parseFloat(customMin) || 0;
    const max = parseFloat(customMax) || Infinity;
    
    onFiltersChange({
      ...filters,
      priceRange: [min, max],
    });
  };

  const clearCustomPrice = () => {
    setCustomMin('');
    setCustomMax('');
  };

  const handleClearFilters = () => {
    clearCustomPrice();
    onClearCustomPrice?.();
    onClearFilters();
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...filters.sizes, size]
      : filters.sizes.filter(s => s !== size);
    
    onFiltersChange({
      ...filters,
      sizes: newSizes,
    });
  };

  const handleColorChange = (color: ProductColor, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter(c => c !== color);
    
    onFiltersChange({
      ...filters,
      colors: newColors,
    });
  };

  const handlePriceRangeChange = (min: number, max: number, checked: boolean) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        priceRange: [min, max],
      });
    } else {
      onFiltersChange({
        ...filters,
        priceRange: [0, Infinity],
      });
    }
  };

  const getColorStyle = (color: ProductColor) => {
    const colorMap: Record<ProductColor, string> = {
      white: '#FFFFFF',
      black: '#000000',
      brown: '#8B4513',
      beige: '#F5F5DC',
      blue: '#0000FF',
      green: '#008000',
      red: '#FF0000',
      pink: '#FFC0CB',
      purple: '#800080',
      orange: '#FFA500',
      gold: '#FFD700',
      taupe: '#483C32',
      grey: '#808080',
      gray: '#808080',
    };
    return colorMap[color] || '#CCCCCC';
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity);

  return (
    <div className="w-64 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-safari-pink hover:text-safari-pink-dark"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">CATEGORY</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categoryFilters[category].map((cat) => (
              <Checkbox
                key={cat}
                label={cat}
                checked={filters.categories.includes(cat)}
                onChange={(e) => handleCategoryChange(cat, e.target.checked)}
              />
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">SIZE</h3>
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => (
              <label
                key={size}
                className={`
                  flex items-center justify-center px-3 py-2 text-sm border rounded cursor-pointer transition-colors
                  ${filters.sizes.includes(size)
                    ? 'border-safari-pink bg-safari-pink font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.sizes.includes(size)}
                  onChange={(e) => handleSizeChange(size, e.target.checked)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">COLOR</h3>
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color) => (
              <label
                key={color}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`
                    w-8 h-8 rounded-full border-2 transition-transform group-hover:scale-110
                    ${filters.colors.includes(color)
                      ? 'border-safari-pink ring-2 ring-safari-pink ring-offset-2'
                      : 'border-gray-300'
                    }
                  `}
                  style={{ backgroundColor: getColorStyle(color) }}
                />
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.colors.includes(color)}
                  onChange={(e) => handleColorChange(color, e.target.checked)}
                />
                <span className="mt-1 text-xs text-gray-600 capitalize">
                  {color}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">PRICE</h3>
          <div className="space-y-2">
            {priceRanges.map(({ label, min, max }) => (
              <Checkbox
                key={`${min}-${max}`}
                label={label}
                checked={filters.priceRange[0] === min && filters.priceRange[1] === max}
                onChange={(e) => handlePriceRangeChange(min, max, e.target.checked)}
              />
            ))}
          </div>

          {/* Custom Price Range */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="₦"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-safari-pink focus:border-safari-pink"
              />
              <span className="text-xs text-gray-500">to</span>
              <input
                type="number"
                placeholder="₦"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-safari-pink focus:border-safari-pink"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs hover:bg-safari-pink hover:border-safari-pink"
                onClick={handleCustomPriceApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {productCount} product{productCount !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;