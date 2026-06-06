/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart, setCurrentView, setSelectedProductId } = useMarketplace();
  const [hovered, setHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const primaryImage = product.image_url;
  const secondaryImage = product.images && product.images[1] ? product.images[1] : primaryImage;

  const handleInspect = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-details');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleInstantSizeAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, size, product.colors[0] || 'Standard');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div 
      className="group relative flex flex-col bg-white dark:bg-zinc-950/80 dark:backdrop-blur-md border border-zinc-100 dark:border-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-luxury-gold/5 hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInspect}
    >
      
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden rounded-t-2xl">
        
        {/* Main/Hover fade-over images */}
        <img 
          src={primaryImage} 
          alt={product.title} 
          referrerPolicy="no-referrer"
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            hovered ? 'scale-105 opacity-0' : 'opacity-100'
          }`} 
        />
        {secondaryImage !== primaryImage && (
          <img 
            src={secondaryImage} 
            alt={`${product.title} alternative model angle`}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              hovered ? 'scale-100 opacity-100' : 'opacity-0 scale-95'
            }`} 
          />
        )}

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {product.is_trending && (
            <span className="flex items-center space-x-1 bg-luxury-gold py-1 px-2.5 text-xxs font-bold tracking-widest text-white uppercase rounded-md shadow-sm">
              <Sparkles className="h-2.5 w-2.5" />
              <span>TRENDING</span>
            </span>
          )}
          {product.is_new && (
            <span className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-1 px-2.5 text-xxs font-bold tracking-widest uppercase rounded-md shadow-sm">
              NEW LINE
            </span>
          )}
        </div>

        {/* Favorite Heart trigger */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 p-1.5 text-zinc-500 hover:text-rose-500 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart className={`h-4.5 w-4.5 transition-colors ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* INSTANT SIZE SELECTOR OVERLAY ON HOVER - conversion driving feature */}
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-transparent p-4 flex flex-col justify-end space-y-2 z-10 transition-all duration-500 ease-out transform ${
          hovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}>
          <p className="text-xxs font-semibold tracking-wider text-white text-center uppercase">Instant Add To Box</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleInstantSizeAdd(e, size)}
                className="h-8 min-w-[2.5rem] bg-white/95 hover:bg-luxury-gold hover:text-white text-zinc-950 font-mono text-xxs font-bold uppercase transition-colors duration-200 border-none rounded-md px-1.5 focus:outline-none"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Level Out Of Stock warning */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xxs flex items-center justify-center">
            <span className="text-white text-xs tracking-widest font-bold uppercase border-2 border-white px-4 py-2">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Product Content Specifications */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors">
        
        <div className="space-y-1">
          {/* Brand & Stars */}
          <div className="flex items-center justify-between">
            <span className="text-xxs font-bold tracking-widest uppercase text-luxury-gold dark:text-luxury-gold/90">{product.brand}</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xxs font-mono font-bold text-zinc-650 dark:text-zinc-300">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-luxury-gold transition-colors duration-300">
            {product.title}
          </h3>
        </div>

        {/* Pricing tag & added feedback status */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
              UGX {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="font-mono text-xxs text-zinc-400 line-through">
                UGX {product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            {addedAnimation ? (
              <span className="text-xxs text-emerald-500 font-bold tracking-wide animate-bounce font-mono">ADDED!</span>
            ) : (
              <span className="text-xxs text-zinc-400 font-mono tracking-wider group-hover:text-luxury-gold transition-colors duration-300">
                View Spec
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
