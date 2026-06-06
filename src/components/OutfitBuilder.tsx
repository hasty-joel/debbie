/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Product } from '../types';
import { Plus, Check, ShoppingBag, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';

export const OutfitBuilder: React.FC = () => {
  const { products, addToCart, setCurrentView } = useMarketplace();
  
  // Categorize local outfit zones
  const tops = products.filter(p => p.category_id === 'cat-1');
  const bottoms = products.filter(p => p.category_id === 'cat-2');
  const shoesAcc = products.filter(p => p.category_id === 'cat-3');

  // Currently curated outfit pieces
  const [selectedTop, setSelectedTop] = useState<Product | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(null);
  const [selectedShoesAcc, setSelectedShoesAcc] = useState<Product | null>(null);

  // Styling selections
  const [topConfig, setTopConfig] = useState({ size: 'M', color: '' });
  const [bottomConfig, setBottomConfig] = useState({ size: 'M', color: '' });
  const [shoesConfig, setShoesConfig] = useState({ size: '42', color: '' });

  // Addition feedback
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Set default items once loaded to make the board look beautiful immediately
  useEffect(() => {
    if (products.length > 0) {
      if (!selectedTop && tops.length > 0) {
        setSelectedTop(tops[0]);
        setTopConfig({ size: tops[0].sizes[0] || 'M', color: tops[0].colors[0] || '' });
      }
      if (!selectedBottom && bottoms.length > 0) {
        setSelectedBottom(bottoms[0]);
        setBottomConfig({ size: bottoms[0].sizes[0] || 'M', color: bottoms[0].colors[0] || '' });
      }
      if (!selectedShoesAcc && shoesAcc.length > 0) {
        setSelectedShoesAcc(shoesAcc[0]);
        setShoesConfig({ size: shoesAcc[0].sizes[0] || '42', color: shoesAcc[0].colors[0] || '' });
      }
    }
  }, [products]);

  // Adjust defaults when item changes
  const selectTopItem = (p: Product) => {
    setSelectedTop(p);
    setTopConfig({ size: p.sizes[0] || 'M', color: p.colors[0] || '' });
  };
  const selectBottomItem = (p: Product) => {
    setSelectedBottom(p);
    setBottomConfig({ size: p.sizes[0] || 'M', color: p.colors[0] || '' });
  };
  const selectShoesItem = (p: Product) => {
    setSelectedShoesAcc(p);
    setShoesConfig({ size: p.sizes[0] || '42', color: p.colors[0] || '' });
  };

  const handleReset = () => {
    if (tops.length > 0) selectTopItem(tops[0]);
    if (bottoms.length > 0) selectBottomItem(bottoms[0]);
    if (shoesAcc.length > 0) selectShoesItem(shoesAcc[0]);
  };

  const currentTotal = 
    (selectedTop ? selectedTop.price : 0) + 
    (selectedBottom ? selectedBottom.price : 0) + 
    (selectedShoesAcc ? selectedShoesAcc.price : 0);

  const activeItemsCount = 
    (selectedTop ? 1 : 0) + 
    (selectedBottom ? 1 : 0) + 
    (selectedShoesAcc ? 1 : 0);

  const handleAddOutfitToCart = () => {
    if (selectedTop) {
      addToCart(selectedTop, topConfig.size, topConfig.color || selectedTop.colors[0] || 'Standard');
    }
    if (selectedBottom) {
      addToCart(selectedBottom, bottomConfig.size, bottomConfig.color || selectedBottom.colors[0] || 'Standard');
    }
    if (selectedShoesAcc) {
      addToCart(selectedShoesAcc, shoesConfig.size, shoesConfig.color || selectedShoesAcc.colors[0] || 'Standard');
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in" id="outfit-builder-container">
      
      {/* Intro banner */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <span className="text-xxs font-bold tracking-widest text-luxury-gold uppercase px-3 py-1 bg-luxury-gold/10 rounded-full">Atelier Lookbook Desk</span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">Outfit Creator</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Unleash your creative stylist. Combine premium tees, heavy cargo options, and high-top sneakers. Sync sizing configurations, review pricing tallies, and request the entire look with an instant click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Curated Outfit Canvas Columns (Zones Representation) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ZONE 1: TOPS */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850 p-4 rounded flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
                <span className="text-xxs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">ZONE I &bull; KNITS & TOPS</span>
                {selectedTop && <Check className="h-3.5 w-3.5 text-luxury-gold" />}
              </div>

              {selectedTop ? (
                <div className="space-y-3">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-sm">
                    <img 
                      src={selectedTop.image_url} 
                      alt={selectedTop.title} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1">{selectedTop.title}</h3>
                    <p className="font-mono text-xxs text-luxury-gold mt-1">UGX {selectedTop.price.toLocaleString()}</p>
                  </div>
                  {/* Size Config */}
                  <div className="grid grid-cols-2 gap-2 text-xxs font-semibold">
                    <div className="space-y-1">
                      <span className="text-zinc-400">SIZE:</span>
                      <select 
                        value={topConfig.size} 
                        onChange={(e) => setTopConfig(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full text-xxs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus:outline-none"
                      >
                        {selectedTop.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-400">COLOR:</span>
                      <select 
                        value={topConfig.color} 
                        onChange={(e) => setTopConfig(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full text-xxs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus:outline-none"
                      >
                        {selectedTop.colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950">
                  <span className="text-xxs font-semibold text-zinc-400 tracking-wider">SELECT A TOP</span>
                </div>
              )}
            </div>

            {/* ZONE 2: BOTTOMS */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850 p-4 rounded flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
                <span className="text-xxs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">ZONE II &bull; TAILORED BOTTOMS</span>
                {selectedBottom && <Check className="h-3.5 w-3.5 text-luxury-gold" />}
              </div>

              {selectedBottom ? (
                <div className="space-y-3">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-sm">
                    <img 
                      src={selectedBottom.image_url} 
                      alt={selectedBottom.title} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1">{selectedBottom.title}</h3>
                    <p className="font-mono text-xxs text-luxury-gold mt-1">UGX {selectedBottom.price.toLocaleString()}</p>
                  </div>
                  {/* Size Config */}
                  <div className="grid grid-cols-2 gap-2 text-xxs font-semibold">
                    <div className="space-y-1">
                      <span className="text-zinc-400">SIZE:</span>
                      <select 
                        value={bottomConfig.size} 
                        onChange={(e) => setBottomConfig(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full text-xxs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus:outline-none"
                      >
                        {selectedBottom.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-400">COLOR:</span>
                      <select 
                        value={bottomConfig.color} 
                        onChange={(e) => setBottomConfig(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full text-xxs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus:outline-none"
                      >
                        {selectedBottom.colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950">
                  <span className="text-xxs font-semibold text-zinc-400 tracking-wider">SELECT A BOTTOM</span>
                </div>
              )}
            </div>

            {/* ZONE 3: SNEAKERS & ACC */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850 p-4 rounded flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
                <span className="text-xxs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">ZONE III &bull; SOLES & ACCESSORY</span>
                {selectedShoesAcc && <Check className="h-3.5 w-3.5 text-luxury-gold" />}
              </div>

              {selectedShoesAcc ? (
                <div className="space-y-3">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-sm">
                    <img 
                      src={selectedShoesAcc.image_url} 
                      alt={selectedShoesAcc.title} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1">{selectedShoesAcc.title}</h3>
                    <p className="font-mono text-xxs text-luxury-gold mt-1">UGX {selectedShoesAcc.price.toLocaleString()}</p>
                  </div>
                  {/* Size Config */}
                  <div className="grid grid-cols-2 gap-2 text-xxs font-semibold">
                    <div className="space-y-1">
                      <span className="text-zinc-400">SIZE:</span>
                      <select 
                        value={shoesConfig.size} 
                        onChange={(e) => setShoesConfig(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full text-xxs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus:outline-none"
                      >
                        {selectedShoesAcc.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-400">COLOR:</span>
                      <select 
                        value={shoesConfig.color} 
                        onChange={(e) => setShoesConfig(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full text-xxs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus:outline-none"
                      >
                        {selectedShoesAcc.colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950">
                  <span className="text-xxs font-semibold text-zinc-400 tracking-wider">SELECT FOOTWEAR</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Aggregate Pricing summary drawer & look controller */}
        <div className="lg:col-span-4 bg-zinc-950 text-white rounded p-6 space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 h-40 w-40 bg-zinc-900 rounded-full blur-3xl -z-10"></div>
          
          <div className="space-y-2 pb-4 border-b border-zinc-850">
            <h2 className="text-sm tracking-widest font-semibold uppercase font-display text-luxury-gold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Couture Aggregation</span>
            </h2>
            <p className="text-xxs text-zinc-400">Combined and configured specifically in Debbie Atelier closets.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-zinc-450 border-b border-zinc-900 pb-3">
              <span>Items Bundled</span>
              <span className="font-mono font-bold text-white">{activeItemsCount} Items</span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-zinc-450 border-b border-zinc-900 pb-3">
              <span>Delivery Dispatch</span>
              <span className="font-mono font-bold text-emerald-400 uppercase tracking-widest text-xxs">FREE KAMPALA PRIORITY</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs uppercase font-bold tracking-wider text-luxury-gold">Total Look Value</span>
              <span className="text-lg font-bold font-display text-white font-mono">UGX {currentTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={handleAddOutfitToCart}
              disabled={activeItemsCount === 0 || addedSuccess}
              className={`w-full flex items-center justify-center space-x-2 rounded-sm py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                addedSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-zinc-950 hover:bg-luxury-gold hover:text-white'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{addedSuccess ? 'COMPLETE OUTFIT ADDED!' : 'ADD ENTIRE LOOK TO BOX'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleReset}
                className="py-3 px-2 border border-zinc-800 hover:border-zinc-650 hover:text-white rounded-sm text-center text-xxs font-semibold tracking-wider uppercase text-zinc-400 transition-colors duration-200"
              >
                Reset Default
              </button>
              <button 
                onClick={() => setCurrentView('checkout')}
                className="py-3 px-2 bg-zinc-900 hover:bg-zinc-850 rounded-sm text-center text-xxs font-semibold tracking-wider uppercase text-zinc-200 transition-colors duration-250 font-mono"
              >
                Instant Buy
              </button>
            </div>
          </div>

          {addedSuccess && (
            <p className="text-xxs text-emerald-400 text-center animate-pulse pt-2 font-semibold">
              Look aggregated! Go to Your Box in the header to checkout.
            </p>
          )}
        </div>

      </div>

      {/* Selector Catalog (Bottom Carousels) */}
      <div className="space-y-8 bg-zinc-50/40 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 p-6 rounded transition-colors" id="outfit-builder-selector-section">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3 font-display">
          Customize Look Components
        </h2>

        {/* Crop Tops & Custom Knits Selector */}
        <div className="space-y-3">
          <h3 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest">Select Crop Tops & Heavy Knits</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin">
            {tops.map(p => (
              <div 
                key={p.id}
                onClick={() => selectTopItem(p)}
                className={`flex-none w-44 p-2 rounded cursor-pointer border transition-all duration-300 bg-white dark:bg-zinc-900 ${
                  selectedTop?.id === p.id 
                    ? 'border-luxury-gold bg-zinc-50 dark:bg-zinc-850 ring-1 ring-luxury-gold/50' 
                    : 'border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-400'
                }`}
              >
                <div className="aspect-square w-full rounded overflow-hidden">
                  <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                </div>
                <h4 className="text-xxs font-semibold mt-2 text-zinc-900 dark:text-white line-clamp-1">{p.title}</h4>
                <p className="text-xxs text-zinc-400 font-mono mt-0.5">UGX {p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tailored Bottoms Selector */}
        <div className="space-y-3 pt-4 border-t border-zinc-200/30 dark:border-zinc-800/20">
          <h3 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest">Select Premium Trousers & Cargo Pants</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin">
            {bottoms.map(p => (
              <div 
                key={p.id}
                onClick={() => selectBottomItem(p)}
                className={`flex-none w-44 p-2 rounded cursor-pointer border transition-all duration-300 bg-white dark:bg-zinc-900 ${
                  selectedBottom?.id === p.id 
                    ? 'border-luxury-gold bg-zinc-50 dark:bg-zinc-850 ring-1 ring-luxury-gold/50' 
                    : 'border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-400'
                }`}
              >
                <div className="aspect-square w-full rounded overflow-hidden">
                  <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                </div>
                <h4 className="text-xxs font-semibold mt-2 text-zinc-900 dark:text-white line-clamp-1">{p.title}</h4>
                <p className="text-xxs text-zinc-400 font-mono mt-0.5">UGX {p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footwear & Bags Selector */}
        <div className="space-y-3 pt-4 border-t border-zinc-200/30 dark:border-zinc-800/20">
          <h3 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest">Select Grained Footwear & Handcrafted Leather</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin">
            {shoesAcc.map(p => (
              <div 
                key={p.id}
                onClick={() => selectShoesItem(p)}
                className={`flex-none w-44 p-2 rounded cursor-pointer border transition-all duration-300 bg-white dark:bg-zinc-900 ${
                  selectedShoesAcc?.id === p.id 
                    ? 'border-luxury-gold bg-zinc-50 dark:bg-zinc-850 ring-1 ring-luxury-gold/50' 
                    : 'border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-400'
                }`}
              >
                <div className="aspect-square w-full rounded overflow-hidden">
                  <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                </div>
                <h4 className="text-xxs font-semibold mt-2 text-zinc-900 dark:text-white line-clamp-1">{p.title}</h4>
                <p className="text-xxs text-zinc-400 font-mono mt-0.5">UGX {p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
