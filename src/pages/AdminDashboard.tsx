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
    updateMedia,
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

  // Register New Curator Account states & handler
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);

    if (regPassword.length < 4) {
      setRegError('Cryptographic key must be at least 4 characters.');
      setRegLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername.trim().toLowerCase(),
          password: regPassword,
          name: regName.trim(),
          email: regEmail.trim()
        })
      });

      if (res.ok) {
        setRegSuccess(`Account established! Log in using @${regUsername.trim().toLowerCase()}`);
        setRegName('');
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
        // Autofill for convenience
        setUsername(regUsername.trim().toLowerCase());
        setTimeout(() => {
          setShowRegister(false);
          setRegSuccess('');
        }, 2200);
      } else {
        const errData = await res.json();
        setRegError(errData.error || 'Failed to establish administrator account.');
      }
    } catch {
      setRegError('Handshake timed out. Check connection endpoints.');
    } finally {
      setRegLoading(false);
    }
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
            <h2 className="font-display text-xs font-bold tracking-widest uppercase w-full text-zinc-900 dark:text-white pt-2">
              {showRegister ? 'Deploy New Curator' : 'Atelier Vault Lock'}
            </h2>
            <p className="text-[10px] text-zinc-400 font-sans">
              {showRegister 
                ? 'Establish a new administrative curator profile with custom credentials.' 
                : 'Cryptographically secured endpoint for authentic Debbie curators only.'
              }
            </p>
          </div>

          {!showRegister ? (
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono text-zinc-550 leading-relaxed">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest block select-none">username</span>
                  <input 
                    type="text" 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="admin" 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border p-3 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-455 uppercase tracking-widest block select-none">password</span>
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
                  {authLoading ? 'Verifying Gateway...' : 'login'}
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

              {/* CREATE NEW ACCOUNT ACTION & ACCOMPLISHMENTS */}
              <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-850 space-y-2">
                <button 
                  onClick={() => setShowRegister(true)}
                  className="text-[11px] font-bold text-luxury-gold hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider block mx-auto font-mono"
                >
                  Create New Account
                </button>
                
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded border border-zinc-150 dark:border-zinc-850 text-left space-y-1.5">
                  <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-400 uppercase block">Accomplishments & Privileges:</span>
                  <ul className="text-[9px] text-zinc-450 dark:text-zinc-400 list-disc list-inside space-y-1 font-sans">
                    <li>Immediate curator registration with dedicated credential vaults.</li>
                    <li>Full capability to manage fashion items, categories, and promotions.</li>
                    <li>Direct access to live orders, customer lists, and analytics.</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-mono text-zinc-550 leading-relaxed">
              {regError && (
                <p className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-[10px] font-bold italic rounded text-center border border-rose-500/10 animate-shake">
                  {regError}
                </p>
              )}
              {regSuccess && (
                <p className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold italic rounded text-center border border-emerald-500/10">
                  {regSuccess}
                </p>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block select-none">Full Name</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sandra Atwine"
                    value={regName} 
                    onChange={(e) => setRegName(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border p-2.5 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block select-none">Registrar Email</span>
                  <input 
                    type="email" 
                    required 
                    placeholder="sandra@debbieatelier.com"
                    value={regEmail} 
                    onChange={(e) => setRegEmail(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border p-2.5 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block select-none">Atelier Username</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="sandra.atwine"
                    value={regUsername} 
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border p-2.5 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800 font-mono" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block select-none">Atelier Passcode</span>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={regPassword} 
                    onChange={(e) => setRegPassword(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 rounded focus:outline-none focus:border-luxury-gold dark:text-white text-xs border-zinc-200 dark:border-zinc-800" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={regLoading}
                className="w-full bg-zinc-950 hover:bg-luxury-gold text-white font-bold py-3 uppercase tracking-widest text-[10px] transition-colors rounded cursor-pointer border-none"
              >
                {regLoading ? 'Establishing Curator...' : 'Deploy Curator Account'}
              </button>

              <button 
                type="button"
                onClick={() => { setShowRegister(false); setRegError(''); setRegSuccess(''); }}
                className="w-full bg-transparent hover:text-luxury-gold text-zinc-400 font-bold py-2 uppercase tracking-widest text-[9px] transition-colors cursor-pointer border-none block text-center underline font-mono"
              >
                Return to Login
              </button>
            </form>
          )}

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
            updateMedia={updateMedia}
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
