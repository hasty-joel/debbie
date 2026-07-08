/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, AlertCircle } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { 
    products, categories, collections, 
    selectedCollectionSlug, setSelectedCollectionSlug 
  } = useMarketplace();

  // Active Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [sortBy, setSortBy] = useState<string>('trending');

  // Slide toggle sidebar for mobile views
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync selection if triggered from another scene (like home collections select)
  useEffect(() => {
    if (selectedCollectionSlug) {
      const matchCol = collections.find(c => c.slug === selectedCollectionSlug);
      if (matchCol) {
        setSelectedCollection(matchCol.id);
      }
      // Consume token
      setSelectedCollectionSlug(null);
    }
  }, [selectedCollectionSlug, collections]);

  // Derive static list of filters from active catalogue
  const allBrands = useMemo(() => {
    const brands = products.map(p => p.brand);
    return ['all', ...Array.from(new Set(brands))];
  }, [products]);

  const allColors = useMemo(() => {
    return ['all', 'Black', 'White', 'Beige', 'Green', 'Yellow', 'Ruby', 'Blue', 'Gold', 'Indigo'];
  }, []);

  const allSizes = useMemo(() => {
    return ['all', 'S', 'M', 'L', 'XL', '40', '41', '42', '43', '44'];
  }, []);

  // Core Filtering System logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = query === '' || 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query);

      // 2. Category Filter
      const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory;

      // 3. Collection Filter
      const matchCollection = selectedCollection === 'all' || p.collection_id === selectedCollection;

      // 4. Size Filter
      const matchSize = selectedSize === 'all' || p.sizes.includes(selectedSize);

      // 5. Color Filter
      const matchColor = selectedColor === 'all' || p.colors.some(col => col.toLowerCase().includes(selectedColor.toLowerCase()));

      // 6. Brand Filter
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;

      // 7. Price Filter
      const matchPrice = p.price <= maxPrice;

      return matchQuery && matchCategory && matchCollection && matchSize && matchColor && matchBrand && matchPrice;
    }).sort((a, b) => {
      // Sorting Options
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
      return (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0); // default 'trending'
    });
  }, [products, searchQuery, selectedCategory, selectedCollection, selectedSize, selectedColor, selectedBrand, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSelectedBrand('all');
    setMaxPrice(500000);
    setSortBy('trending');
  };

  const isFiltered = 
    searchQuery !== '' || 
    selectedCategory !== 'all' || 
    selectedCollection !== 'all' || 
    selectedSize !== 'all' || 
    selectedColor !== 'all' || 
    selectedBrand !== 'all' || 
    maxPrice !== 500000;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in" id="catalog-container">
      
      {/* 1. EDITORIAL TITLE */}
      <div className="space-y-1.5 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">Catalog</h1>
          <p className="text-xs text-zinc-500 font-sans">Locate premium garments tailored to your specific lifestyle coordinates.</p>
        </div>
        <span className="text-xxs font-mono tracking-widest font-semibold text-luxury-gold uppercase px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 self-start md:self-auto">
          {filteredProducts.length} PIECES DISCOVERED
        </span>
      </div>

      {/* 2. TOP INTERACTIVE CONTROL RAIL */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between" id="catalog-controls">
        
        {/* Search Input Bar with autocomplete */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop tops, luxury cargos, high-tops..."
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs placeholder-zinc-400 focus:outline-none focus:border-luxury-gold dark:text-white transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Triggers */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          
          {/* Sorting */}
          <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 rounded-xl text-xs text-zinc-650 dark:text-zinc-350 shadow-sm">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:outline-none cursor-pointer pr-4 font-semibold text-xxs tracking-wider uppercase text-zinc-800 dark:text-white"
            >
              <option value="trending">Featured Triggers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Filter toggle mobile drawer */}
          <button 
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-905 px-4 py-2.5 text-xs font-bold tracking-widest uppercase text-zinc-800 dark:text-white hover:border-luxury-gold transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-luxury-gold" />
            <span>Customize Filter</span>
            {isFiltered && (
              <span className="h-2 w-2 bg-luxury-gold rounded-full" />
            )}
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 3. MULTI-FILTER CONTROL SIDEBAR DETAILED PANEL */}
        <aside className={`lg:block ${filterDrawerOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6 pt-1`}>
          <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 p-5 rounded space-y-6">
            
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-display">Filter parameters</h3>
              {isFiltered && (
                <button 
                  onClick={handleResetFilters}
                  className="text-xxxxs text-luxury-gold hover:text-zinc-950 dark:hover:text-white tracking-widest font-bold uppercase"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* A. CATEGORIES */}
            <div className="space-y-2">
              <h4 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest font-mono">Category Classification</h4>
              <div className="flex flex-col space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`text-left py-1 hover:text-zinc-950 dark:hover:text-white font-semibold transition-colors ${selectedCategory === 'all' ? 'text-luxury-gold' : ''}`}
                >
                  &mdash; View All Categories
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left py-1 hover:text-zinc-950 dark:hover:text-white transition-colors capitalize ${selectedCategory === cat.id ? 'text-luxury-gold font-bold border-l-2 border-luxury-gold pl-2' : 'pl-2'}`}
                  >
                    &middot; {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* B. COLLECTIONS LIFESTYLES */}
            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <h4 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest font-mono">Lifestyle themes</h4>
              <div className="flex flex-col space-y-1 text-xs text-zinc-650 dark:text-zinc-400">
                <button 
                  onClick={() => setSelectedCollection('all')}
                  className={`text-left py-1 hover:text-zinc-950 dark:hover:text-white font-semibold transition-colors ${selectedCollection === 'all' ? 'text-luxury-gold' : ''}`}
                >
                  &mdash; View All Lifestyles
                </button>
                {collections.map((col) => (
                  <button 
                    key={col.id}
                    onClick={() => setSelectedCollection(col.id)}
                    className={`text-left py-1 hover:text-zinc-950 dark:hover:text-white transition-colors ${selectedCollection === col.id ? 'text-luxury-gold font-bold border-l-2 border-luxury-gold pl-2' : 'pl-2'}`}
                  >
                    &middot; {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* C. SIZE SPECIFICATION */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <h4 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest font-mono">Size parameters</h4>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-8 min-w-[2.25rem] text-xxs font-mono rounded font-bold border cursor-pointer uppercase transition-all ${
                      selectedSize === size 
                        ? 'bg-zinc-950 border-transparent text-white dark:bg-white dark:text-zinc-950' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-450'
                    }`}
                  >
                    {size === 'all' ? 'ALL' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* D. COLOR SWATCHES */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <h4 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest font-mono">Color palette</h4>
              <div className="flex flex-wrap gap-1.5">
                {allColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xxs rounded-sm border cursor-pointer uppercase font-semibold transition-all ${
                      selectedColor === color 
                        ? 'bg-luxury-gold text-white border-transparent' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                    }`}
                  >
                    {color === 'all' ? 'ALL' : color}
                  </button>
                ))}
              </div>
            </div>

            {/* E. BUDGET ALLOCATION SLIDER */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex justify-between items-center text-xxs font-bold text-luxury-gold tracking-widest uppercase font-mono">
                <span>Value max allocation</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">UGX {maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={50000} 
                max={500000} 
                step={25000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-luxury-gold h-1 cursor-pointer"
              />
              <div className="flex justify-between text-xxxxs font-mono text-zinc-400 uppercase">
                <span>UGX 50K</span>
                <span>UGX 500K</span>
              </div>
            </div>

            {/* F. BRAND ACCENTS */}
            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <h4 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest font-mono">Designer tag</h4>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-xxs tracking-widest uppercase rounded focus:outline-none dark:text-white"
              >
                {allBrands.map(b => (
                  <option key={b} value={b}>{b === 'all' ? 'View All Designers' : b}</option>
                ))}
              </select>
            </div>

          </div>
        </aside>

        {/* 4. MAIN COUTURE SELECTIONS GRID */}
        <main className="lg:col-span-3">
          
          {filteredProducts.length === 0 ? (
            <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850 p-12 text-center rounded-2xl max-w-lg mx-auto space-y-4 shadow-xl">
              <div className="mx-auto h-16 w-16 bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800">
                <AlertCircle className="h-6 w-6 text-luxury-gold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-zinc-900 dark:text-white text-base uppercase">Pieces currently unaligned</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-sans">
                  We could not discover any matching couture items within your exact query classification parameters. Please expand your price selectors or clear active criteria.
                </p>
              </div>
              <button 
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xxs font-bold tracking-widest uppercase transition-colors cursor-pointer shadow-md"
              >
                Clear all active filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
