/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Sparkles, ArrowRight, RotateCcw, AlertCircle, ShoppingBag, Eye, HelpCircle } from 'lucide-react';

export const AIStylist: React.FC = () => {
  const { 
    products, addToCart, aiResult, aiLoading, 
    getAIRecommendation, clearAIRecommendation, setCurrentView, setSelectedProductId 
  } = useMarketplace();

  // Questionnaire States
  const [gender, setGender] = useState('Unisex');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [style, setStyle] = useState('Luxury Couture');
  const [budget, setBudget] = useState(300000);
  const [occasion, setOccasion] = useState('Kampala VIP Nightlife');

  // Interactive UI Helpers
  const colorsList = ['Black', 'White', 'Beige', 'Emerald Green', 'Marigold Yellow', 'Crimson Ruby', 'Vintage Indigo'];
  const stylesList = [
    'Streetwear', 'CEO Mode / Tailoring', 'Campus Drip', 'Weekend Loungewear', 'Romantic Date Night', 'Luxury Couture', 'Summer Resort'
  ];
  const occasionsList = [
    'Kampala VIP Nightlife', 'Boardroom Executive Meeting', 'Acacia Mall Afternoon Coffee', 'Kololo Private Dinner', 'Kampala Fashion Panel', 'University Lecture', 'Speke Resort Weekend Getaway'
  ];

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getAIRecommendation(gender, selectedColors, style, budget, occasion);
  };

  const handleInspectProduct = (pId: string) => {
    setSelectedProductId(pId);
    setCurrentView('product-details');
  };

  // Find actual products matching recommended IDs
  const matchingProducts = products.filter(p => 
    aiResult?.matching_product_ids?.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in" id="ai-stylist-container">
      
      {/* Intro Editorial Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center space-x-1.5 text-xxs font-bold tracking-widest text-luxury-gold uppercase px-3 py-1 bg-luxury-gold/10 rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>Debbie Styling Intelligence</span>
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">Gemini Custom Consult</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Step into a bespoke consultation powered by Google Gemini. Our design neurons evaluate your silhouette preferences, color palette harmonies, and budgets to synthesize the perfect garments.
        </p>
      </div>

      {!aiResult && !aiLoading && (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 p-6 sm:p-8 rounded shadow-xl space-y-8">
          
          {/* SECTION 1: GENDER IDENTIFIER */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">I. Silhouette Selection</label>
            <div className="grid grid-cols-3 gap-3">
              {['Female', 'Male', 'Unisex'].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3.5 text-xxs font-bold tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                    gender === g 
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent' 
                      : 'border-zinc-200 text-zinc-500 dark:border-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: THE COLOR PALETTE */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">II. Tonal Color Harmonies</label>
            <p className="text-xxs text-zinc-400 mt-0.5">Select up to three preferred tones to weave into your recommend line.</p>
            <div className="flex flex-wrap gap-2">
              {colorsList.map((col) => {
                const isSelected = selectedColors.includes(col);
                return (
                  <button
                    type="button"
                    key={col}
                    onClick={() => handleColorToggle(col)}
                    className={`py-2 px-3 text-xxs rounded-full border transition-all duration-350 cursor-pointer ${
                      isSelected 
                        ? 'bg-luxury-gold border-transparent text-white ring-2 ring-luxury-gold/35' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: STYLE PREFERENCE */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 font-display">III. Aesthetic Style DNA</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stylesList.map((stl) => (
                <button
                  type="button"
                  key={stl}
                  onClick={() => setStyle(stl)}
                  className={`py-3 px-4 rounded-sm text-left text-xxs font-semibold tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                    style === stl 
                      ? 'border-luxury-gold text-luxury-gold bg-zinc-50 dark:bg-zinc-900 ring-1 ring-luxury-gold/40' 
                      : 'border-zinc-150 dark:border-zinc-850 text-zinc-500 hover:border-zinc-400'
                  }`}
                >
                  {stl}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: BUDGET SLIDER */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">IV. Allocation Budget Cap</label>
              <span className="font-mono text-xs font-bold text-luxury-gold">UGX {budget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min={100000} 
              max={1000000} 
              step={50000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-luxury-gold h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xxs font-mono text-zinc-400">
              <span>UGX 100K</span>
              <span>UGX 500K</span>
              <span>UGX 1M</span>
            </div>
          </div>

          {/* SECTION 5: OCCASION */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">V. The Occasion Backdrop</label>
            <div className="relative">
              <select 
                value={occasion} 
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 px-4 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-luxury-gold"
              >
                {occasionsList.map(occ => <option key={occ} value={occ}>{occ}</option>)}
              </select>
            </div>
          </div>

          {/* CTA SUBMISSION BUTTON */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2.5 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl py-4 text-xs font-bold tracking-widest uppercase transition-all duration-400 border-none cursor-pointer shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Customized Recommendation</span>
            <ArrowRight className="h-4 w-4" />
          </button>

        </form>
      )}

      {/* LUXURY LOADING SEQUENCE ANIMATION */}
      {aiLoading && (
        <div className="mx-auto max-w-lg bg-zinc-950 rounded border border-zinc-850 p-8 text-center space-y-6 shadow-2xl">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 border-2 border-dashed border-luxury-gold rounded-full animate-spin"></div>
            <div className="absolute inset-2 border border-dotted border-white rounded-full animate-pulse flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-luxury-gold" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-white text-base tracking-widest font-semibold uppercase">Atelier Consultation Engaged</h3>
            <p className="text-xxs text-luxury-gold tracking-widest font-mono">DETERMINING HARMONIC OUTLINE...</p>
          </div>
          
          <div className="text-xxs text-zinc-500 font-mono space-y-1 pt-4 text-left max-w-xs mx-auto border-t border-zinc-900 leading-relaxed">
            <p className="animate-pulse">&bull; Mapping {gender} silhouette vectors...</p>
            <p className="animate-pulse delay-500">&bull; Organizing optimal {style} alignments...</p>
            <p className="animate-pulse delay-1000">&bull; Validating stock allocations near Acacia Hills...</p>
          </div>
        </div>
      )}

      {/* CONSULTATION RESULTS BOX */}
      {aiResult && !aiLoading && (
        <div className="space-y-12 animate-slide-in">
          
          {/* Certificate signed design */}
          <div className="max-w-3xl mx-auto bg-stone-50 dark:bg-zinc-900 border-2 border-stone-200/55 dark:border-zinc-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-zinc-900 dark:text-white">
            
            <div className="absolute top-0 left-0 h-10 w-10 border-t-2 border-l-2 border-luxury-gold m-4"></div>
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-luxury-gold m-4"></div>
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-luxury-gold m-4"></div>
            <div className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-luxury-gold m-4"></div>

            <div className="text-center space-y-6">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xxs tracking-widest text-luxury-gold font-bold">DOSSIER REF: DEB-STYL-AI-9</span>
                <h2 className="font-display text-2xl font-bold tracking-tight uppercase text-zinc-900 dark:text-zinc-100 pt-2">ATELIER DIRECTIVE</h2>
              </div>

              {/* The Verdict */}
              <p className="font-display font-medium text-base sm:text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 italic max-w-2xl mx-auto">
                "{aiResult.stylist_verdict}"
              </p>

              {/* Styling Bullet tips */}
              <div className="text-left max-w-md mx-auto space-y-3 pt-6 border-t border-stone-200/60 dark:border-zinc-800">
                <h4 className="text-xxs font-bold text-luxury-gold uppercase tracking-widest font-mono">Expert Carrying Instructions:</h4>
                <ul className="space-y-2 text-xs text-zinc-655 dark:text-zinc-300 leading-relaxed">
                  {aiResult.styling_tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-luxury-gold font-bold font-mono shrink-0 pt-0.5">{idx + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signature */}
              <div className="pt-8 text-center">
                <div className="font-display text-xl text-luxury-gold inline-block italic border-b border-stone-300 dark:border-zinc-700 px-6 pb-2">
                  Debbie Alinda
                </div>
                <p className="text-xxs text-zinc-400 font-mono tracking-widest uppercase mt-1">Master Curator & Stylist</p>
              </div>

              {/* Back CTA */}
              <div className="pt-4 flex justify-center">
                <button 
                  onClick={clearAIRecommendation}
                  className="flex items-center space-x-2 text-xxs font-semibold tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Request Another Fitting</span>
                </button>
              </div>

            </div>
          </div>

          {/* Recommended Product Showroom */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-900 dark:text-white text-center font-display">
              Curated Atelier Matches For You
            </h3>

            {matchingProducts.length === 0 ? (
              <div className="p-8 text-center rounded border border-dashed border-zinc-200 dark:border-zinc-800 max-w-md mx-auto">
                <AlertCircle className="h-6 w-6 text-luxury-gold mx-auto" />
                <h4 className="text-xs font-semibold mt-2 uppercase tracking-wide text-zinc-900 dark:text-white">Curated selection sold out</h4>
                <p className="text-xxs text-zinc-500 mt-1">Our master recommended specific couture elements that are currently being restocked.</p>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="mt-4 text-xxs font-bold uppercase tracking-wider text-luxury-gold hover:text-white"
                >
                  View full catalog &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {matchingProducts.map((p) => {
                  const hasSize = p.sizes[0] || 'M';
                  const hasColor = p.colors[0] || 'Standard';
                  return (
                    <div 
                      key={p.id} 
                      className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 relative">
                        <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        
                        {/* Quick Hover inspect overlay */}
                        <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleInspectProduct(p.id)}
                            className="bg-white hover:bg-luxury-gold text-zinc-950 hover:text-white px-3 py-1.5 rounded-sm shadow-md text-xxs font-bold tracking-widest uppercase flex items-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>INSPECT</span>
                          </button>
                          <button 
                            onClick={() => addToCart(p, hasSize, hasColor)}
                            className="bg-zinc-950 hover:bg-luxury-gold text-white px-3 py-1.5 rounded-sm shadow-md text-xxs font-bold tracking-widest uppercase flex items-center space-x-1"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>BOX</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-zinc-50/50 dark:bg-zinc-905/30">
                        <div className="space-y-0.5">
                          <span className="text-xxs font-bold uppercase text-luxury-gold">{p.brand}</span>
                          <h4 className="text-xs font-semibold uppercase text-zinc-900 dark:text-white tracking-tight text-ellipsis line-clamp-1">{p.title}</h4>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200">UGX {p.price.toLocaleString()}</span>
                          <span className="text-xxs text-zinc-400 font-mono">Size {hasSize}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
