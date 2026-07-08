/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, setCurrentView } = useMarketplace();

  if (!isOpen) return null;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutClick = () => {
    onClose();
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <div 
          onClick={onClose} 
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300"
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          {/* Cart Drawer */}
          <div className="pointer-events-auto h-full w-screen max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200/50 dark:border-zinc-800/50 flex flex-col shadow-2xl animate-slide-in">
            
            {/* Header */}
            <div className="px-6 py-6 border-b border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="h-4 w-4 text-luxury-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-white">Your Atelier Box</h2>
                <span className="text-xxs font-mono text-zinc-400">({totalCount})</span>
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
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/40 dark:border-zinc-850">
                    <ShoppingBag className="h-6 w-6 text-zinc-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-zinc-900 dark:text-white text-sm">Your box is uncurated</h3>
                    <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">No designer items have been selected yet. Head back to the atelier collection.</p>
                  </div>
                  <button 
                    onClick={() => { onClose(); setCurrentView('catalog'); }}
                    className="mt-2 text-xs tracking-widest uppercase font-semibold text-luxury-gold hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                  >
                    View Catalog &rarr;
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-150 dark:divide-zinc-900">
                  {cart.map((cartItem, idx) => {
                    const { product, quantity, selectedSize, selectedColor } = cartItem;
                    return (
                      <div key={`${product.id}-${selectedSize}-${selectedColor}-${idx}`} className="flex py-5 first:pt-0">
                        <div className="h-24 w-18 shrink-0 overflow-hidden rounded-sm border border-zinc-200/50 dark:border-zinc-850">
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" 
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold tracking-tight text-zinc-900 dark:text-white">
                              <h3 className="line-clamp-1">{product.title}</h3>
                              <p className="ml-4 font-mono text-luxury-gold">UGX {(product.price * quantity).toLocaleString()}</p>
                            </div>
                            <p className="text-xxs font-mono text-zinc-400">
                              {selectedColor} &bull; Size {selectedSize}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-905 p-0.5">
                              <button 
                                onClick={() => updateCartQuantity(idx, quantity - 1)}
                                className="p-1 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              <span className="px-2 text-xs font-mono text-zinc-800 dark:text-zinc-200">{quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(idx, quantity + 1)}
                                className="p-1 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </button>
                            </div>

                            {/* Trash button */}
                            <button 
                              onClick={() => removeFromCart(idx)}
                              className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-rose-500 transition-colors duration-300"
                              title="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-150 dark:border-zinc-900 px-6 py-6 bg-zinc-50/60 dark:bg-zinc-960 space-y-4">
                <div className="flex justify-between text-xs tracking-wider uppercase font-semibold text-zinc-900 dark:text-white">
                  <span>Investment Subtotal</span>
                  <span className="font-mono text-luxury-gold text-sm">UGX {cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xxs text-zinc-400">Order verification and priority logistics arranged upon checkout handoff.</p>
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center space-x-2.5 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <span>Request Atelier Handoff</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-2 text-center text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xxs font-semibold tracking-wider uppercase transition-colors duration-200"
                >
                  Continue Curating
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
