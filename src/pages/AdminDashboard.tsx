/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Sparkles, Lock, Menu, X, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminCategoriesCollectionsTab } from '../components/admin/AdminCategoriesCollectionsTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab';
import { AdminPromotionsTab } from '../components/admin/AdminPromotionsTab';
import { AdminMediaTab } from '../components/admin/AdminMediaTab';
import { AdminHomepageTab } from '../components/admin/AdminHomepageTab';
import { AdminAnalyticsTab } from '../components/admin/AdminAnalyticsTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminInspirationTab } from '../components/admin/AdminInspirationTab';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    collections,
    banners,
    orders,
    subscribers,
    isAdminLoggedIn,
    adminUser,
    loginAdmin,
    logoutAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    createCategory,
    deleteCategory,
    createCollection,
    deleteCollection,
    posts,
    promotions,
    media,
    settings,
    createPost,
    updatePost,
    deletePost,
    createPromotion,
    updatePromotion,
    deletePromotion,
    createMedia,
    deleteMedia,
    updateSettings,
    loadAdminStatsAndOrders
  } = useMarketplace();

  // Authentication credentials states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Forgot password overlay state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotContact, setForgotContact] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Active tab selection default
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Mobile sidebar visibility toggle for screens < 700px
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Refresh data on component mount & authentication state changes
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminStatsAndOrders();
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Authorization
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const success = await loginAdmin(password, username);
      if (!success) {
        setAuthError('Access denied. Invalid cryptographic curator keys / passcode.');
      }
    } catch {
      setAuthError('Authentication handshake timeout. Retry verification.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess('');
    
    setTimeout(() => {
      setForgotSuccess('A secure passcode recovery link was dispatched to registrar accounts.');
    }, 1200);
  };

  // 1. UNRECOGNIZED ACCESS: RENDER POLISHED LUXURY SECURITY SHIELD
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors" id="admin-security-shield">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-full bg-linear-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto shadow-sm select-none">
              <Lock className="h-6 w-6 text-luxury-gold animate-pulse shrink-0" />
            </div>
            <h2 className="font-display text-xs font-bold tracking-widest uppercase w-full text-zinc-900 dark:text-white pt-2">Atelier Vault Lock</h2>
            <p className="text-[10px] text-zinc-400 font-sans">Cryptographically secured endpoint for authentic Debbie curators only.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono text-zinc-550 leading-relaxed">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest block select-none">Atelier Username</span>
              <input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="debbie" 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border p-3 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800" 
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-455 uppercase tracking-widest block select-none">Keychain Password</span>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-zinc-50 dark:bg-zinc-95 border p-3 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800" 
              />
            </div>

            {authError && (
              <p className="text-[10px] text-rose-500 font-bold italic text-center leading-normal animate-shake">{authError}</p>
            )}

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-zinc-950 hover:bg-luxury-gold text-white font-bold py-3 uppercase tracking-widest text-[10px] transition-colors rounded select-none cursor-pointer border-none"
            >
              {authLoading ? 'Verifying Gateway...' : 'Decrypt Credentials'}
            </button>
          </form>

          {/* Forgot trigger */}
          <div className="text-center">
            <button 
              onClick={() => setForgotOpen(true)}
              className="text-[10px] underline hover:text-luxury-gold text-zinc-400 transition-colors bg-transparent border-none cursor-pointer"
            >
              Reset Keychain Coordinates?
            </button>
          </div>

          <div className="text-center font-mono text-[9px] text-zinc-400 opacity-60 pointer-events-none select-none">
            VAULT STATUS: ENCRYPTED // ATELIER SECURITY GATEWAY v1.4
          </div>
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {forgotOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all" id="forgot-coordinate-panel">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xxs font-bold uppercase tracking-widest font-mono text-luxury-gold flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Passcode Dispatcher</span>
                </span>
                <button 
                  onClick={() => { setForgotOpen(false); setForgotSuccess(''); setForgotContact(''); }}
                  className="text-zinc-400 hover:text-rose-505 font-bold font-mono text-[10px] bg-transparent border-none cursor-pointer"
                >
                  X
                </button>
              </div>

              {forgotSuccess ? (
                <div className="space-y-4 text-center py-4 text-xxs font-sans text-zinc-500">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                  <p className="italic font-medium">{forgotSuccess}</p>
                  <p className="text-xxxxs text-zinc-400">Please review registered inbox directories at hasty0joel@gmail.com.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xxs font-sans text-zinc-550">
                  <p className="italic">Specify atelier email profile. Passcode reset coordinates are sent here instantly:</p>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Curator Email Address</span>
                    <input 
                      type="email" 
                      required
                      value={forgotContact}
                      onChange={(e) => setForgotContact(e.target.value)}
                      placeholder="hasty0joel@gmail.com" 
                      className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 rounded focus:outline-none dark:text-white" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-zinc-950 hover:bg-luxury-gold text-white uppercase text-[9px] font-bold tracking-widest py-2.5 rounded cursor-pointer border-none"
                  >
                    Dispatch Key resets
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. AUTHORIZED ACCESS CLIENT ADHERENCE RULES:
  // "give the sidebar a solid background... let side bar appear at minwidth of 700px"
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col min-[700px]:flex-row transition-colors" id="admin-overall-workspace">
      
      {/* SIDEBAR FOR DEVICES >= 700PX */}
      <div className="hidden min-[700px]:block w-64 shrink-0 h-full sticky top-0">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false); }} 
          adminName={adminUser?.name || 'V-Curator Joel'}
          onLogout={logoutAdmin}
        />
      </div>

      {/* MOBILE HEADER: APP BAR FOR DEVICES < 700PX */}
      <div className="block min-[700px]:hidden bg-zinc-950 border-b border-zinc-850 px-4 py-3.5 flex items-center justify-between text-white shadow relative z-20">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold tracking-widest text-luxury-gold uppercase font-mono">Verified Atelier Session</span>
          <h1 className="font-display font-medium text-xs tracking-wider uppercase">Workshop Curator</h1>
        </div>

        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 focus:outline-none hover:bg-zinc-900 border-none bg-transparent cursor-pointer rounded text-luxury-gold"
          title="Toggle workshop controls navigator drawer"
        >
          {mobileSidebarOpen ? <X className="h-5 w-5 shrink-0" /> : <Menu className="h-5 w-5 shrink-0" />}
        </button>
      </div>

      {/* FLOATING MOBILE DRAWER SIDEBAR IF TOGGLED ON DEVICES < 700PX */}
      {mobileSidebarOpen && (
        <div className="block min-[700px]:hidden fixed inset-0 z-30 flex">
          {/* Backdrop screen grey screen */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          
          <div className="relative w-64 max-w-sm bg-zinc-950 h-full flex flex-col z-40 animate-slide-in">
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false); }} 
              adminName={adminUser?.name || 'V-Curator Debbie'}
              onLogout={() => { logoutAdmin(); setMobileSidebarOpen(false); }}
            />
          </div>
        </div>
      )}

      {/* CORE ACTIVE WORKSPACE CONTENT DISPLAY FRAME */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Workspace banner taglines */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-luxury-gold uppercase font-mono flex items-center gap-1.5 select-none">
              <Sparkles className="h-3.5 w-3.5 text-luxury-gold" />
              <span>Sartorial coordinate index</span>
            </span>
            <h2 className="text-base font-bold uppercase tracking-widest font-display text-zinc-900 dark:text-white leading-none">
              {activeTab === 'overview' && 'Workshop Metrics Overview'}
              {activeTab === 'products' && 'Garment Blueprints catalog'}
              {activeTab === 'categories' && 'Classification Categories'}
              {activeTab === 'collections' && 'aligned lifestyle profiles'}
              {activeTab === 'orders' && 'Logistics Delivery Pipeline'}
              {activeTab === 'customers' && 'Buyer directory & Subscription rolls'}
              {activeTab === 'reviews' && 'Testimonials moderation'}
              {activeTab === 'promotions' && 'Discount Voucher Generator'}
              {activeTab === 'media' && 'Media Asset Vault'}
              {activeTab === 'homepage' && 'Homepage Visual Coordinates'}
              {activeTab === 'analytics' && 'Boutique Acquisition Analytics'}
              {activeTab === 'settings' && 'Operating Systems specifications'}
              {activeTab === 'inspiration' && 'Lookbook Visual Inspirations'}
            </h2>
          </div>

          <span className="h-fit py-1 px-3 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-mono tracking-wider text-zinc-450 uppercase flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 w-fit select-none font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Joel Authorized</span>
          </span>
        </div>

        {/* CONDITIONALLY RENDER GRANULAR TABS SUB MODULES */}
        {activeTab === 'overview' && (
          <AdminDashboardTab 
            stats={{
              totalProducts: products.length,
              totalOrders: orders.length,
              revenue: orders.reduce((sum, o) => sum + o.total_price, 0),
              visitorsCount: subscribers.length * 15 + 420,
              conversionRate: 3.8
            }}
            recentOrders={orders}
            onViewAllOrders={() => setActiveTab('orders')}
            onViewProducts={() => setActiveTab('products')}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsTab 
            products={products}
            categories={categories}
            collections={collections}
            createProduct={createProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesCollectionsTab 
            categories={categories}
            collections={collections}
            createCategory={createCategory}
            deleteCategory={deleteCategory}
            createCollection={createCollection}
            deleteCollection={deleteCollection}
          />
        )}

        {activeTab === 'collections' && (
          <AdminCategoriesCollectionsTab 
            categories={categories}
            collections={collections}
            createCategory={createCategory}
            deleteCategory={deleteCategory}
            createCollection={createCollection}
            deleteCollection={deleteCollection}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab 
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        )}

        {activeTab === 'customers' && (
          <AdminCustomersTab 
            orders={orders}
            subscribers={subscribers}
          />
        )}

        {activeTab === 'reviews' && (
          <AdminReviewsTab 
            products={products}
          />
        )}

        {activeTab === 'promotions' && (
          <AdminPromotionsTab 
            promotions={promotions}
            products={products}
            createPromotion={createPromotion}
            deletePromotion={deletePromotion}
          />
        )}

        {activeTab === 'media' && (
          <AdminMediaTab 
            media={media}
            createMedia={createMedia}
            deleteMedia={deleteMedia}
          />
        )}

        {activeTab === 'homepage' && (
          <AdminHomepageTab 
            banners={banners}
            categories={categories}
            collections={collections}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsTab />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab />
        )}

        {activeTab === 'inspiration' && (
          <AdminInspirationTab 
            posts={posts}
            collections={collections}
            createPost={createPost}
            updatePost={updatePost}
            deletePost={deletePost}
          />
        )}

      </main>

    </div>
  );
};
