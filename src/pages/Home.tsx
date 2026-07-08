/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Sparkles, ArrowRight, Star, Clock, Flame, ChevronRight, CornerDownRight, Mail, Check, 
  Layers, ShoppingBag, Eye, Heart, EyeOff, Play, Info, MessageSquare, Volume2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { defaultHomepageConfig, HomepageConfig } from '../utils/defaultHomepageConfig';

interface HomeProps {
  previewConfig?: HomepageConfig;
}

export const Home: React.FC<HomeProps> = ({ previewConfig }) => {
  const { 
    products, collections, banners, posts, settings, setCurrentView, 
    setSelectedCollectionSlug, setSelectedProductId, subscribeNewsletter 
  } = useMarketplace();

  // Pick up configuration (preview prop vs saved setting vs seeded default)
  const activeConfig: HomepageConfig = previewConfig || (settings as any)?.homepage_config || defaultHomepageConfig;

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  // Newsletter subscription on homepage
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'err'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('err');
      return;
    }
    setNewsletterStatus('loading');
    const ok = await subscribeNewsletter(newsletterEmail);
    if (ok) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 4000);
    } else {
      setNewsletterStatus('err');
    }
  };

  const handleCollectionSelect = (slug: string) => {
    setSelectedCollectionSlug(slug);
    setCurrentView('catalog');
  };

  // High-end parallax scroll config for the Hero element
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "52%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Map section order IDs to their layout components
  const renderSections = () => {
    const sectionsToRender = activeConfig.section_order || defaultHomepageConfig.section_order;

    return sectionsToRender.map((sectId, index) => {
      switch (sectId) {
        
        // ----------------- 1. HERO SECTION -----------------
        case 'hero': {
          if (!activeConfig.hero?.enabled) return null;
          const isVideo = activeConfig.hero.video_url && activeConfig.hero.video_url.trim().length > 0;
          return (
            <section 
              key="sect-hero" 
              ref={heroRef} 
              className="relative h-[85vh] w-full overflow-hidden bg-zinc-950 flex items-center"
              id="sect_hero"
            >
              <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 w-full h-full">
                {isVideo ? (
                  <video 
                    src={activeConfig.hero.video_url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="h-full w-full object-cover opacity-70"
                  />
                ) : (
                  <img 
                    src={activeConfig.hero.image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600"} 
                    alt="Debbie Fashion Hero" 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center opacity-70 transition-transform duration-[12s]" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/40 to-transparent"></div>
              </motion.div>

              <motion.div 
                style={{ y: yText, opacity: opacityText }}
                className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-start space-y-6"
              >
                <div className="flex items-center space-x-2">
                  <span className="h-1 w-8 bg-luxury-gold inline-block"></span>
                  <span className="text-xxs font-mono tracking-widest font-bold uppercase text-luxury-gold">Kampala Autumn-Winter Drop</span>
                </div>
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase max-w-4xl leading-none">
                  {activeConfig.hero.title}
                </h1>
                <p className="text-sm sm:text-lg text-zinc-350 max-w-xl leading-relaxed font-sans">
                  {activeConfig.hero.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setCurrentView(activeConfig.hero.cta_link as any || 'catalog')}
                    className="px-8 py-4 bg-white/95 hover:bg-luxury-gold text-zinc-950 hover:text-white font-bold font-sans tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center space-x-2.5 rounded cursor-pointer shadow-lg hover:shadow-white/10 border-none"
                  >
                    <span>{activeConfig.hero.cta_text || 'SHOP NOW'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => setCurrentView('ai-stylist')}
                    className="px-8 py-4 bg-transparent border border-white/60 hover:bg-white hover:text-zinc-950 hover:border-transparent text-white font-bold tracking-widest uppercase text-xs transition-all duration-350 flex items-center justify-center space-x-2.5 rounded cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-luxury-gold" />
                    <span>Ask Gemini Stylist</span>
                  </button>
                </div>
              </motion.div>

              {/* Floating coordination vectors */}
              <div className="absolute bottom-8 right-8 hidden lg:flex flex-col space-y-1 text-right text-white/50 font-mono text-xxs">
                <span>LAT: 0.3476&bull;N &bull; LNG: 32.5825&bull;E</span>
                <span>KAMPALA ATELIER STYLED</span>
              </div>
            </section>
          );
        }

        // ----------------- 2. FLASH SALE -----------------
        case 'flash_sale': {
          return (
            <section key="sect-flash-sale" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10" id="sect_flash_sale">
              <div className="bg-zinc-950 dark:bg-zinc-900 text-white rounded p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-850">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-luxury-gold/15">
                    <Flame className="h-6 w-6 text-luxury-gold animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-luxury-gold">TEMPORARY FLASH SALE DROP</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">20% automatic reduction checkout on vintage denim bombers and tailored suit selections.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <div className="flex space-x-1.5 text-xs font-mono">
                    <span className="w-10 text-center py-2.5 bg-zinc-900 rounded font-bold">{formatNum(timeLeft.hours)}</span>
                    <span className="py-2.5">:</span>
                    <span className="w-10 text-center py-2.5 bg-zinc-900 rounded font-bold">{formatNum(timeLeft.minutes)}</span>
                    <span className="py-2.5">:</span>
                    <span className="w-10 text-center py-2.5 bg-zinc-900 rounded font-bold font-mono text-luxury-gold">{formatNum(timeLeft.seconds)}</span>
                  </div>
                  <button 
                    onClick={() => setCurrentView('catalog')}
                    className="text-xxs font-bold tracking-widest uppercase text-luxury-gold hover:text-white px-3.5 py-2 border border-luxury-gold/40 hover:border-white bg-transparent transition-colors duration-200 cursor-pointer"
                  >
                    Get items
                  </button>
                </div>
              </div>
            </section>
          );
        }

        // ----------------- 3. LIFESTYLE COLLECTIONS -----------------
        case 'collections': {
          if (!activeConfig.collections_manager?.enabled) return null;
          
          // Reorder or filter cards
          const displayCards = activeConfig.collections_manager.cards || defaultHomepageConfig.collections_manager.cards;
          return (
            <section key="sect-collections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-8" id="sect_collections">
              <div className="flex items-end justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                    {activeConfig.collections_manager.title || "Thematic Collections"}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {activeConfig.collections_manager.subtitle || "Uniquely engineered garment drop sequences matching lifestyle expressions."}
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="hidden sm:flex items-center space-x-1 text-xxs font-bold tracking-widest text-luxury-gold hover:text-zinc-950 dark:hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Collections Cards Grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayCards.map((card) => {
                  return (
                    <div 
                      key={card.id || card.name}
                      onClick={() => {
                        // Attempt to extract collection identifier
                        if (card.link && card.link.includes('=')) {
                          const id = card.link.split('=').pop() || '';
                          setSelectedCollectionSlug(id);
                        }
                        setCurrentView('catalog');
                      }}
                      className="group relative h-90 rounded overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900"
                    >
                      <div className="absolute inset-0">
                        <img 
                          src={card.image || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600"} 
                          alt={card.name} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center transition-transform duration-[4.5s] group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end space-y-1">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-luxury-gold uppercase block">THEME DIRECTIVE</span>
                        <h3 className="font-display text-md font-bold text-white uppercase group-hover:text-luxury-gold transition-colors">{card.name}</h3>
                        <p className="text-xxs text-zinc-300 leading-snug line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // ----------------- 4. TRENDING PRODUCTS -----------------
        case 'trending': {
          if (!activeConfig.trending?.enabled) return null;

          // Determine products to show
          let displayProducts = products.filter(p => p.is_trending);
          if (activeConfig.trending.product_ids && activeConfig.trending.product_ids.length > 0) {
            displayProducts = activeConfig.trending.product_ids
              .map(id => products.find(p => p.id === id))
              .filter((p): p is typeof products[0] => !!p);
          }

          // Filter out explicitly hidden product ids from CMS builder
          if (activeConfig.trending.hidden_product_ids && activeConfig.trending.hidden_product_ids.length > 0) {
            displayProducts = displayProducts.filter(p => !activeConfig.trending.hidden_product_ids.includes(p.id));
          }

          // Limit to maximum 4
          const finalTrending = displayProducts.slice(0, 4);

          return (
            <section key="sect-trending" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-8" id="sect_trending">
              <div className="flex items-end justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                    {activeConfig.trending.title || "Trending This Week"}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {activeConfig.trending.subtitle || "The absolute highpoints of our recent lookbook curation."}
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="flex items-center space-x-1 text-xxs font-bold tracking-widest text-luxury-gold hover:text-zinc-950 dark:hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span>Explore catalogue</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {finalTrending.length === 0 ? (
                <p className="py-12 text-center text-xs text-zinc-400 italic">No trending products matching criteria.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {finalTrending.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          );
        }

        // ----------------- 5. OUTFIT CREATOR TEASER BUTTONS -----------------
        case 'outfit_teaser': {
          return (
            <section key="sect-outfit-teaser" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8" id="sect_outfit_teaser">
              <div className="bg-stone-50 dark:bg-zinc-950 rounded p-8 sm:p-12 border border-stone-200 dark:border-zinc-850 flex flex-col lg:flex-row items-center justify-between gap-12 transition-colors">
                <div className="space-y-4 max-w-xl">
                  <span className="text-xxs font-mono font-bold tracking-widest text-luxury-gold uppercase bg-luxury-gold/10 px-3.5 py-1 rounded">Interactive Lookbook Desk</span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white uppercase leading-tight">Create Complete Styles Instantly</h2>
                  <p className="text-xs text-zinc-505 leading-relaxed font-sans">
                    Why browse isolated clothing items? Use our designated Outfit Builder workspace to stack cardigans, bottom cargos, utility garments, and high-top sneakers, matching your specific size grids on one singular checkout deck.
                  </p>
                  <div className="flex flex-col space-y-1 text-xxs font-mono text-zinc-400 leading-relaxed uppercase">
                    <span className="flex items-center gap-1.5"><CornerDownRight className="h-3 w-3 text-luxury-gold shrink-0" /> Step I: Pair tops and custom bottoms</span>
                    <span className="flex items-center gap-1.5"><CornerDownRight className="h-3 w-3 text-luxury-gold shrink-0" /> Step II: Anchor with Italian calfskins</span>
                    <span className="flex items-center gap-1.5"><CornerDownRight className="h-3 w-3 text-luxury-gold shrink-0" /> Step III: Check out all components in single-clicks</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={() => setCurrentView('outfit-builder')}
                    className="px-8 py-4 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white font-bold tracking-widest uppercase text-xs transition-all duration-300 cursor-pointer text-center rounded border-none"
                  >
                    Launch Outfit Builder
                  </button>
                  <button 
                    onClick={() => setCurrentView('ai-stylist')}
                    className="px-8 py-3.5 bg-transparent hover:bg-zinc-150 dark:hover:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xxs tracking-widest uppercase transition-colors text-center rounded cursor-pointer"
                  >
                    Consult Gemini AI Stylist
                  </button>
                </div>
              </div>
            </section>
          );
        }

        // ----------------- 6. NEW ARRIVALS -----------------
        case 'new_arrivals': {
          if (!activeConfig.new_arrivals?.enabled) return null;

          // Target products to display
          let customArrivals = products.filter(p => p.is_new);
          if (activeConfig.new_arrivals.product_ids && activeConfig.new_arrivals.product_ids.length > 0) {
            customArrivals = activeConfig.new_arrivals.product_ids
              .map(id => products.find(p => p.id === id))
              .filter((p): p is typeof products[0] => !!p);
          }

          const displayArrivals = customArrivals.slice(0, 4);
          const layoutStyle = activeConfig.new_arrivals.display_style || 'grid';

          return (
            <section key="sect-new-arrivals" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-8" id="sect_new_arrivals">
              <div className="flex items-end justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                    {activeConfig.new_arrivals.title || "New Arrivals"}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {activeConfig.new_arrivals.subtitle || "Fresh lookbook introductions, immediately ready for custom dispatch."}
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="flex items-center space-x-1 text-xxs font-bold tracking-widest text-luxury-gold hover:text-zinc-950 dark:hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span>Explore All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {displayArrivals.length === 0 ? (
                <p className="py-12 text-center text-xs text-zinc-400 italic">No new arrivals loaded currently.</p>
              ) : (
                <div className={`
                  ${layoutStyle === 'bento' && displayArrivals.length >= 3 
                    ? 'grid grid-cols-1 md:grid-cols-3 gap-6' 
                    : 'grid grid-cols-2 md:grid-cols-4 gap-6'
                  }
                `}>
                  {displayArrivals.map((p, idx) => {
                    const isBentoFirst = layoutStyle === 'bento' && idx === 0;
                    return (
                      <div 
                        key={p.id} 
                        className={`
                          ${isBentoFirst ? 'md:col-span-2 md:row-span-2' : ''}
                        `}
                      >
                        <ProductCard product={p} />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        }

        // ----------------- 7. PROMOTIONAL BANNERS -----------------
        case 'promo_banners': {
          const promoBanners = activeConfig.promotional_banners || [];
          const activePromos = promoBanners.filter(b => b.enabled);

          if (activePromos.length === 0) return null;

          return (
            <section key="sect-promo-banners" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-8" id="sect_promo_banners">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activePromos.map((banner) => {
                  return (
                    <div 
                      key={banner.id}
                      className="relative h-96 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-850 flex flex-col justify-end p-8 bg-zinc-900 group shadow"
                    >
                      {/* Image backdrop layer */}
                      <div className="absolute inset-0">
                        <img 
                          src={banner.image_url || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200"} 
                          alt={banner.title} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20"></div>
                      </div>

                      {/* Scheduling Badge */}
                      {banner.start_date && banner.end_date && (
                        <span className="absolute top-4 right-4 bg-luxury-gold/90 text-zinc-950 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                          Promo: {new Date(banner.start_date).toLocaleDateString()} - {new Date(banner.end_date).toLocaleDateString()}
                        </span>
                      )}

                      <div className="relative space-y-3 max-w-md">
                        <span className="text-[10px] font-mono tracking-widest text-luxury-gold uppercase block font-bold">OUTLET OFFER</span>
                        <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">{banner.title}</h3>
                        <p className="text-xxs text-zinc-300 leading-snug">{banner.description}</p>
                        
                        <button 
                          onClick={() => {
                            if (banner.cta_link) {
                              setCurrentView(banner.cta_link as any);
                            } else {
                              setCurrentView('catalog');
                            }
                          }}
                          className="px-5 py-2.5 bg-white text-zinc-950 hover:bg-luxury-gold hover:text-white text-[10px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-colors border-none rounded"
                        >
                          {banner.cta_text || "Acquire Offer"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // ----------------- 8. FASHION LOOKBOOK INSPIRATION SECTION -----------------
        case 'fashion_inspiration': {
          const pubPosts = posts.filter(p => p.status === 'published');
          if (pubPosts.length === 0) return null;

          return (
            <section key="sect-fashion-inspiration" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-8" id="sect_fashion_inspiration">
              <div className="text-center space-y-2">
                <span className="text-xxs font-mono font-bold tracking-widest text-luxury-gold uppercase block">LOOKBOOK STREAM</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                  Fashion Lookbook Inspirations
                </h2>
                <p className="text-xs text-zinc-500 max-w-xl mx-auto">
                  Vibrantly curated styles and look directions from Kampala trendsetters, complete with catalog reference links.
                </p>
              </div>

              {/* Pinterest-style dynamic grid */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 pt-4 select-none">
                {pubPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="break-inside-avoid bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col mb-6"
                  >
                    <div className="relative overflow-hidden w-full h-auto">
                      <img 
                        src={post.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800"} 
                        alt={post.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      {post.is_featured && (
                        <div className="absolute top-3 left-3 bg-luxury-gold text-zinc-950 text-[8px] font-bold tracking-widest px-2 py-0.5 rounded font-mono uppercase">
                          Editor Feature
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-2 flex-grow bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
                      <h4 className="font-display font-bold uppercase text-[11px] tracking-wide text-zinc-900 dark:text-white leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xxs text-zinc-500 leading-normal italic">
                        {post.caption}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {post.tags.map((tag, idx) => (
                            <span key={idx} className="text-[8px] font-mono font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-150 dark:border-zinc-850 uppercase">
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // ----------------- 9. TESTIMONIALS -----------------
        case 'testimonials': {
          if (!activeConfig.testimonials?.enabled) return null;

          const testItems = activeConfig.testimonials.items || defaultHomepageConfig.testimonials.items;

          return (
            <section key="sect-testimonials" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 pt-12" id="sect_testimonials">
              <div className="text-center space-y-1">
                <h2 className="font-display text-sm tracking-widest font-bold uppercase text-luxury-gold">Testimonials</h2>
                <h3 className="font-display text-2xl font-bold tracking-wide uppercase text-zinc-900 dark:text-white max-w-xl mx-auto leading-tight">
                  {activeConfig.testimonials.title || "What the Kampala Fashion Leaders Say"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {testItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-stone-50 dark:bg-zinc-950 p-6 border border-stone-200 dark:border-zinc-850 space-y-4 rounded shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex space-x-0.5">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-350 italic leading-relaxed">
                        "{item.comment}"
                      </p>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-900 pt-3 mt-4 flex items-center space-x-3">
                      {item.photo_url && (
                        <div className="h-9 w-9 rounded-full select-none overflow-hidden shrink-0 border border-zinc-150">
                          <img src={item.photo_url} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div>
                        <span className="text-xxs font-bold uppercase tracking-wider text-zinc-900 dark:text-white block font-sans">{item.name}</span>
                        <span className="text-xxxxs text-zinc-400 font-mono tracking-widest block uppercase">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // ----------------- 10. standalone newsletter box -----------------
        case 'newsletter': {
          if (!activeConfig.newsletter?.enabled) return null;

          return (
            <section key="sect-newsletters-box" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4" id="sect_newsletter">
              <div className="bg-zinc-950 border border-zinc-850 text-white rounded-xl p-8 sm:p-12 text-center space-y-6">
                <span className="text-xxs font-mono tracking-widest text-luxury-gold font-bold uppercase block">NEWSLETTER ACCESS</span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide">
                  {activeConfig.newsletter.title || "The Weekly Atelier Dossier"}
                </h3>
                <p className="text-xs text-zinc-450 max-w-md mx-auto leading-relaxed">
                  {activeConfig.newsletter.description || "Gain premier access to lookbook drops, private capsule introductions, and stylist-curated editorials. No spam, only luxury."}
                </p>

                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    required 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                    placeholder="Provide your luxury email"
                    className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-luxury-gold px-4 py-3 text-xs text-white rounded placeholder-zinc-650 focus:outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                    className="px-6 py-3 bg-white hover:bg-luxury-gold text-zinc-950 hover:text-white font-mono text-xxs font-bold uppercase rounded tracking-widest transition-colors cursor-pointer border-none"
                  >
                    {newsletterStatus === 'loading' ? 'COMMITTING...' : newsletterStatus === 'success' ? 'INVITATION SENT' : 'PREMIER ACCESS'}
                  </button>
                </form>

                {newsletterStatus === 'success' && (
                  <p className="text-xxs text-emerald-400 font-sans italic">Success! You are added to the list of verified Debbie recipients.</p>
                )}
                {newsletterStatus === 'err' && (
                  <p className="text-xxs text-rose-500 font-sans italic">Please verify your email syntax and credentials.</p>
                )}
              </div>
            </section>
          );
        }

        default:
          return null;
      }
    });
  };

  return (
    <div className="space-y-16 pb-16 animate-fade-in" id="homepage-container">
      {renderSections()}
    </div>
  );
};
