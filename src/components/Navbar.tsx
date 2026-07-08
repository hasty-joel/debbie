/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { ShoppingBag, Heart, Sun, Moon, Sparkles, User, Menu, X, Shirt, Home, Compass, Globe, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenWishlist }) => {
  const { currentView, setCurrentView, cart, wishlist, theme, toggleTheme, isAdminLoggedIn } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navItems = [
    { label: 'Home', view: 'home' as const, icon: Home },
    { label: 'Catalog', view: 'catalog' as const, icon: Compass },
    { label: 'Outfit Creator', view: 'outfit-builder' as const, icon: Shirt },
    { label: 'Gemini Stylist', view: 'ai-stylist' as const, icon: Sparkles },
  ];

  const handleNavClick = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/40 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Debbie Fashion */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex cursor-pointer items-center space-x-2.5 group"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 transition-all duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="font-display text-xl font-bold tracking-widest">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold tracking-widest text-zinc-900 dark:text-white uppercase group-hover:text-luxury-gold transition-colors duration-300">Debbie</span>
            <span className="text-xxs font-mono tracking-widest text-luxury-gold dark:text-luxury-gold/90 uppercase font-medium">FASHION ATELIER</span>
          </div>
        </div>

        {/* Desktop Navigation Systems */}
        <nav className="hidden min-[700px]:flex space-x-8 items-center" id="nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`relative py-2 flex items-center space-x-1.5 text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'text-luxury-gold font-bold [text-shadow:0_0_10px_rgba(212,175,55,0.6)] dark:[text-shadow:0_0_12px_rgba(212,175,55,0.85)]' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white dark:hover:[text-shadow:0_0_8px_rgba(255,255,255,0.5)]'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-luxury-gold shadow-[0_0_10px_#D4AF37] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Toolbar and Interactive Actions */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          
          {/* Theme control switch */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Wishlist toggle */}
          <button 
            onClick={onOpenWishlist}
            className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Wishlist drawer"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-luxury-gold text-xxs font-semibold text-white px-1 shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-xxs font-semibold text-white px-1 dark:bg-white dark:text-zinc-950">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin panel gate */}
          <button 
            onClick={() => handleNavClick('admin')}
            className={`p-2 transition-all duration-300 rounded-lg cursor-pointer ${
              currentView === 'admin' 
                ? 'bg-zinc-100 dark:bg-slate-900 text-luxury-gold' 
                : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
            }`}
            title="Atelier Admin Portal"
          >
            <User className="h-4 w-4" />
            {isAdminLoggedIn && (
              <span className="inline-block h-1.5 w-1.5 bg-emerald-500 rounded-full ml-0.5 animate-pulse" />
            )}
          </button>

          {/* Mobile responsive toggle */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 min-[700px]:hidden text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Futuristic Mobile Side Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md min-[700px]:hidden"
            />

            {/* Sliding Drawer Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-900 text-stone-900 dark:text-white p-6 shadow-2xl flex flex-col justify-between min-[700px]:hidden opacity-100 transition-colors duration-450"
            >
              <div>
                {/* Header of Sidebar */}
                <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                      <span className="font-display text-base font-bold tracking-widest">D</span>
                    </div>
                    <span className="font-display text-sm font-semibold tracking-widest uppercase text-zinc-900 dark:text-white">Atelier</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
 
                {/* Staggered Navigation Items list */}
                <div className="mt-8 space-y-2">
                  <p className="text-xxxxs font-mono tracking-[0.3em] text-luxury-gold/80 uppercase mb-4 pl-3">SYSTEM SECTIONS</p>
                  {navItems.map((item, index) => {
                    const Icon = item.icon || Compass;
                    const isActive = currentView === item.view;
                    return (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        key={item.view}
                        onClick={() => handleNavClick(item.view)}
                        className={`w-full py-4 px-4 flex items-center space-x-3.5 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 border-l-2 cursor-pointer ${
                          isActive 
                            ? 'border-luxury-gold text-luxury-gold bg-zinc-100 dark:bg-slate-900/60 shadow-[inset_0_0_15px_rgba(212,175,55,0.05)]' 
                            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-slate-900/30'
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-luxury-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
 
              {/* Sidebar Footer Metadata & Brand coordinates */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center space-x-2 text-xxs font-mono text-zinc-500 tracking-wider">
                  <Globe className="h-3.5 w-3.5 text-luxury-gold animate-spin-slow" />
                  <span>PRESTIGE MODE // LOCAL SECURE</span>
                </div>
                <p className="text-xxxxs font-mono tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  © 2026 DEBBIE INC. ALL COUTURE BLUEPRINTS PROTECTED.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
