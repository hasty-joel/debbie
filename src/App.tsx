/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketplaceProvider, useMarketplace } from './contexts/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { WishlistModal } from './components/WishlistModal';
import { Preloader } from './components/Preloader';
import { AnimatePresence, motion } from 'motion/react';

// Pages and major view blocks
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { AIStylist } from './components/AIStylist';
import { OutfitBuilder } from './components/OutfitBuilder';
import { AdminDashboard } from './pages/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentView, theme, toasts } = useMarketplace();

  // Preloader visibility gate
  const [preloaderVisible, setPreloaderVisible] = useState(true);

  // Drawer modal toggle states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Smooth-scroll viewport to top upon dynamic screen transition
  useEffect(() => {
    if (!preloaderVisible) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentView, preloaderVisible]);

  // Render view engine
  const renderMainView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'catalog':
        return <Catalog />;
      case 'product-details':
        return <ProductDetails />;
      case 'checkout':
        return <Checkout />;
      case 'success':
        return <Success />;
      case 'ai-stylist':
        return <AIStylist />;
      case 'outfit-builder':
        return <OutfitBuilder />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <AnimatePresence mode="wait">
        {preloaderVisible && (
          <Preloader key="preloader" onComplete={() => setPreloaderVisible(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen luxury-black-gold-bg text-stone-900 dark:luxury-black-gold-bg-dark dark:text-zinc-100 transition-colors duration-500 font-sans flex flex-col justify-between">
        
        {/* Core Header Navigation block */}
        <Navbar 
          onOpenCart={() => setCartOpen(true)} 
          onOpenWishlist={() => setWishlistOpen(true)} 
        />

        {/* Dynamic slides panel drawer coordinates */}
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <WishlistModal isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />

        {/* Primary application dynamic viewer stage */}
        <motion.main 
          className="flex-grow pt-20"
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={!preloaderVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderMainView()}
        </motion.main>

        {/* Global luxury-themed footer brand DNA block */}
        <Footer />

      </div>

      {/* Elegant HUD Toast Feedback System */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full sm:w-auto">
        <AnimatePresence>
          {toasts && toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`p-3.5 rounded bg-white/95 dark:bg-zinc-950/95 shadow-xl border flex items-center gap-3 pointer-events-auto select-none ${
                toast.type === 'success' 
                  ? 'border-emerald-500/40 text-emerald-950 dark:text-emerald-200' 
                  : toast.type === 'error' 
                  ? 'border-rose-500/40 text-rose-950 dark:text-rose-200' 
                  : 'border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
              }`}
            >
              <div className="shrink-0">
                {toast.type === 'success' && (
                  <svg className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {toast.type === 'error' && (
                  <svg className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {toast.type === 'info' && (
                  <svg className="h-4.5 w-4.5 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="text-[11px] font-mono font-medium tracking-widest uppercase">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainAppContent />
    </MarketplaceProvider>
  );
}
