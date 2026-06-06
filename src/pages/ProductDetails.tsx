/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Star, ShoppingBag, Heart, ArrowLeft, ShieldAlert, Sparkles, MessageSquare, Plus, Check } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { 
    products, selectedProductId, setSelectedProductId, addToCart, toggleWishlist, 
    isInWishlist, currentView, setCurrentView, reviews, loadReviews, submitReview 
  } = useMarketplace();

  // Selected product
  const product = products.find(p => p.id === selectedProductId) || products[0];

  // Images state
  const [activeImage, setActiveImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // Attribute Selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load reviews on mount
  useEffect(() => {
    if (product) {
      loadReviews(product.id);
      setActiveImage(product.image_url);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || 'Standard');
      setQuantity(1);
    }
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-sm text-zinc-500">Retrieving garment details...</p>
      </div>
    );
  }

  // Related products from the same collection category
  const relatedProducts = products
    .filter(p => p.collection_id === product.collection_id && p.id !== product.id)
    .slice(0, 4);

  // Image zoom handler helper
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName) return;
    await submitReview(product.id, reviewerName, reviewRating, reviewComment);
    setReviewerName('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const productReviews = reviews[product.id] || [];
  const isFavorited = isInWishlist(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16 animate-fade-in" id="product-details-container">
      
      {/* Back button */}
      <div>
        <button 
          onClick={() => setCurrentView('catalog')}
          className="flex items-center space-x-2 text-xxs font-bold tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white uppercase transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog Collection</span>
        </button>
      </div>

      {/* Main product specification layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* MAGNIFIER GALLERY (COL-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div 
            className="aspect-[3/4] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={activeImage || product.image_url} 
              alt={product.title} 
              style={zoomStyle}
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-100 ease-out" 
            />
          </div>

          {/* Sibling Thumbnails cycle */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3.5">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => setActiveImage(img)}
                  className={`h-24 w-18 overflow-hidden border bg-zinc-100 rounded-sm ${
                    activeImage === img ? 'border-luxury-gold ring-1 ring-luxury-gold' : 'border-zinc-200/50 hover:border-zinc-400'
                  }`}
                >
                  <img src={img} alt={`Angle-${idx}`} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS COLUMN CONFIG (COL-span-6) */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Header titles */}
          <div className="space-y-2 border-b border-zinc-150 dark:border-zinc-900 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xxs font-bold tracking-widest text-luxury-gold uppercase font-mono">{product.brand}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-mono font-bold">{product.rating}</span>
                <span className="text-xxs text-zinc-400 font-sans">({product.reviews_count} reviews)</span>
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white uppercase leading-tight font-display">
              {product.title}
            </h1>
            <div className="flex items-baseline space-x-3 pt-1">
              <span className="text-xl font-bold font-mono text-zinc-955 dark:text-white">UGX {product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="text-xs text-zinc-405 line-through font-mono">UGX {product.original_price.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Description narrative body */}
          <div className="space-y-4">
            <h3 className="text-xxs font-bold text-luxury-gold tracking-widest uppercase font-mono">The Atelier Silhouette Blueprint</h3>
            <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed max-w-xl font-sans">
              {product.description}
            </p>
          </div>

          {/* Blueprint parameters: Fabric / material details */}
          <div className="grid grid-cols-2 gap-4 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-905/20 p-4 font-sans text-xs">
            <div className="space-y-0.5">
              <span className="text-zinc-400 block font-bold text-xxxxs uppercase tracking-wider font-mono">Materials composition</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{product.material}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-zinc-400 block font-bold text-xxxxs uppercase tracking-wider font-mono">Logistics stock level</span>
              <span className={`font-semibold ${product.stock <= 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                {product.stock <= 0 ? 'Out of Stock' : `${product.stock} items remaining`}
              </span>
            </div>
          </div>

          {/* Interactive variant selections selectors */}
          <div className="space-y-5 pt-4 border-t border-zinc-150 dark:border-zinc-900">
            
            {/* Color variants Selection */}
            <div className="space-y-2.5">
              <span className="text-xxs font-bold text-luxury-gold tracking-widest uppercase font-mono block">Weave Color Variant</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 text-xxs border rounded-sm font-semibold uppercase transition-all ${
                      selectedColor === col 
                        ? 'bg-zinc-950 border-transparent text-white dark:bg-white dark:text-zinc-950' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-450'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Size parameter Selection */}
            <div className="space-y-2.5">
              <span className="text-xxs font-bold text-luxury-gold tracking-widest uppercase font-mono block">Atelier Size Variant</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 min-w-[2.5rem] px-2 text-xxs font-mono rounded font-bold border cursor-pointer uppercase transition-all ${
                      selectedSize === size 
                        ? 'bg-zinc-950 border-transparent text-white dark:bg-white dark:text-zinc-950' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:border-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Incrementor + Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              
              {/* Incrementor counts */}
              <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 bg-zinc-55/40 p-2.5 sm:max-w-[7.5rem] w-full">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  &mdash;
                </button>
                <span className="font-mono text-xs font-semibold px-2">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="px-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  &#x2b;
                </button>
              </div>

              {/* Add to checkout Box CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center space-x-2.5 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{product.stock <= 0 ? 'SOLD OUT' : 'ADD TO COUTURE BOX'}</span>
              </button>

              {/* Toggle favorite */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`py-4 px-5 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                  isFavorited ? 'text-rose-500 bg-rose-50/20' : 'text-zinc-500 hover:text-rose-500'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

          </div>

          {/* Quality trust seal guarantees */}
          <div className="flex items-center space-x-2 text-xxs text-zinc-400 mt-2">
            <ShieldAlert className="h-3 w-3 text-luxury-gold" />
            <span>Priority Kampala shipping coordinated instantly after validation checks.</span>
          </div>

        </div>

      </div>

      {/* REVIEWS SEGMENT SUB-SECTION */}
      <section className="border-t border-zinc-150 dark:border-zinc-900 pt-12 space-y-12" id="reviews-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* List of customer opinions (COL-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 dark:text-white font-display border-b border-zinc-150 dark:border-zinc-900 pb-3 block">
              Atelier Opinions ({productReviews.length})
            </h3>

            {productReviews.length === 0 ? (
              <div className="p-8 text-center rounded border border-dashed border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-905/10">
                <MessageSquare className="h-6 w-6 text-zinc-300 mx-auto" />
                <h4 className="text-xs font-semibold mt-2 uppercase text-zinc-900 dark:text-white">Unreviewed Piece</h4>
                <p className="text-xxs text-zinc-500 mt-1">Be the first distinguished guest to share your alignment experience with this capsule.</p>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-zinc-150 dark:divide-zinc-900">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="pt-5 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xxs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">{rev.reviewer_name}</span>
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <span className="text-xxxxs text-zinc-400 font-mono tracking-wider block">
                      {new Date(rev.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Submission Form card bounds (COL-span-5) */}
          <div className="lg:col-span-5 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 rounded border border-zinc-150 dark:border-zinc-850 h-fit space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-display">Leave Guest review</h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Aesthetic Score</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => setReviewRating(stars)}
                      className="p-1 text-zinc-350 hover:text-amber-400 focus:outline-none transition-colors"
                    >
                      <Star className={`h-5 w-5 ${stars <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Guest Name</span>
                <input 
                  type="text" 
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Brenda Alinda"
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 px-3 py-2.5 rounded text-xs focus:outline-none focus:border-luxury-gold placeholder-zinc-500 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Review Comment</span>
                <textarea 
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share garment texture details, drape quality or sizing specifications..."
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-3 rounded text-xs focus:outline-none focus:border-luxury-gold placeholder-zinc-500 text-zinc-900 dark:text-white"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full text-center bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl py-3.5 text-xxs font-bold tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer shadow-md"
              >
                Submit Review Blueprint
              </button>

              {reviewSuccess && (
                <p className="text-xxs text-emerald-500 animate-pulse text-center font-semibold mt-1">Review indexed! Sizing metrics updated.</p>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* RELATED CARDS ROW DISPLAY */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-zinc-150 dark:border-zinc-900" id="related-sections">
          <h2 className="font-display text-sm tracking-widest font-bold uppercase text-luxury-gold text-center">Frequently bought together</h2>
          <h3 className="font-display text-center text-xl font-bold uppercase text-zinc-900 dark:text-white">Complete the Atelier Looks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {relatedProducts.map(p => (
              <div 
                key={p.id}
                onClick={() => { setSelectedProductId(p.id); setActiveImage(p.image_url); }}
                className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 overflow-hidden cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-zinc-100">
                  <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-500" />
                </div>
                <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30">
                  <h4 className="text-xxs font-semibold uppercase text-zinc-900 dark:text-white truncate">{p.title}</h4>
                  <p className="text-xxs text-luxury-gold font-mono mt-1">UGX {p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
