import { useState, useMemo, useCallback } from 'react';
import type { ProductCategory, ProductColor } from '../types';
import { getProductsByCategory } from '../data';

interface FilterState {
  categories: string[];
  sizes: string[];
  colors: ProductColor[];
  priceRange: [number, number];
}

type SortOption = 'popular' | 'price-low' | 'price-high' | 'newest' | 'name';

export const useProductFilters = (category: ProductCategory) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, Infinity],
  });

  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [isLoading, setIsLoading] = useState(true);

  // Get all products for the category
  const allProducts = useMemo(() => {
    const products = getProductsByCategory(category);
    
    setTimeout(() => setIsLoading(false), 800);
    
    return products;
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (filters.categories.length > 0 && !filters.categories.includes('All')) {
      filtered = filtered.filter(product => 
        filters.categories.some(cat => 
          product.subcategory.toLowerCase().includes(cat.toLowerCase()) ||
          product.name.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        filters.colors.some(color => product.colors.includes(color))
      );
    }

    // Apply price filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.reverse();
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [allProducts, filters, sortBy]);

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, Infinity],
    });
  }, []);

  const updateSort = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
  }, []);

  return {
    filters,
    sortBy,
    filteredProducts,
    allProducts,
    isLoading,
    updateFilters,
    clearFilters,
    updateSort,
  };
};