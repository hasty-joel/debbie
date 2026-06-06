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
  const { currentView, theme } = useMarketplace();

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

      <div className="min-h-screen bg-slate-50 text-zinc-800 dark:bg-slate-950 dark:text-zinc-200 transition-colors duration-500 font-sans flex flex-col justify-between">
        
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
