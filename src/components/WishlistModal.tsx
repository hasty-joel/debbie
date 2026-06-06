/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Heart, X, ShoppingCart, Eye } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart, setCurrentView, setSelectedProductId } = useMarketplace();

  if (!isOpen) return null;

  const handleInspect = (pId: string) => {
    setSelectedProductId(pId);
    setCurrentView('product-details');
    onClose();
  };

  const handleQuickAdd = (p: any) => {
    addToCart(p, p.sizes[0] || 'M', p.colors[0] || 'Standard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="wishlist-drawer-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={onClose} 
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300"
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto h-full w-screen max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200/50 dark:border-zinc-800/50 flex flex-col shadow-2xl animate-slide-in">
            
            {/* Wishlist Header */}
            <div className="px-6 py-6 border-b border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Heart className="h-4 w-4 text-luxury-gold fill-luxury-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Bespoke Wishlist</h2>
                <span className="text-xxs font-mono text-zinc-400">({wishlist.length})</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                  <Heart className="h-8 w-8 text-zinc-200 animate-pulse" />
                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-zinc-900 dark:text-white text-sm">Wishlist is empty</h3>
                    <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">As you explore, click the heart iconic badges on designer pieces to queue your look inspiration.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {wishlist.map((p) => (
                    <div key={p.id} className="flex p-3 rounded bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-850 group relative">
                      <div className="h-24 w-18 shrink-0 overflow-hidden rounded-sm bg-zinc-200">
                        <img 
                          src={p.image_url} 
                          alt={p.title} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center" 
                        />
                      </div>
                      
                      <div className="ml-4 flex flex-1 flex-col justify-between py-1">
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-900 dark:text-white line-clamp-1">{p.title}</h4>
                          <h5 className="text-xxs text-luxury-gold uppercase mt-0.5 tracking-wider font-semibold">{p.brand}</h5>
                          <p className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-200 mt-2">UGX {p.price.toLocaleString()}</p>
                        </div>

                        {/* Interactive triggers */}
                        <div className="flex items-center space-x-3.5 mt-2">
                          <button 
                            onClick={() => handleInspect(p.id)}
                            className="flex items-center space-x-1.5 text-xxs tracking-wider uppercase font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Details</span>
                          </button>
                          <button 
                            onClick={() => handleQuickAdd(p)}
                            className="flex items-center space-x-1.5 text-xxs tracking-wider uppercase font-semibold text-luxury-gold hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            <span>Add Box</span>
                          </button>
                        </div>
                      </div>

                      {/* Remove absolute cross button */}
                      <button 
                        onClick={() => toggleWishlist(p)}
                        className="absolute top-2 right-2 p-1 text-zinc-300 hover:text-rose-500 transition-colors duration-300"
                        title="Remove from wishlist"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="border-t border-zinc-150 dark:border-zinc-900 px-6 py-6 bg-zinc-50/60 dark:bg-zinc-960">
              <button 
                onClick={() => { onClose(); setCurrentView('catalog'); }}
                className="w-full text-center bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg"
              >
                Explore Full Collection
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
