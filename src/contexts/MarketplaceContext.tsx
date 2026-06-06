/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, Category, Collection, Banner, CartItem, Order, 
  DashboardStats, OrderStatus, Review,
  Post, Promotion, MediaItem, StoreSettings, NewsletterSubscriber
} from '../types';

interface MarketplaceContextType {
  // Live Store data
  products: Product[];
  categories: Category[];
  collections: Collection[];
  banners: Banner[];
  loading: boolean;
  error: string | null;

  // Active Routing/Views
  currentView: 'home' | 'catalog' | 'product-details' | 'outfit-builder' | 'ai-stylist' | 'admin' | 'checkout' | 'success';
  setCurrentView: (view: 'home' | 'catalog' | 'product-details' | 'outfit-builder' | 'ai-stylist' | 'admin' | 'checkout' | 'success') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCollectionSlug: string | null;
  setSelectedCollectionSlug: (slug: string | null) => void;

  // Shopping Cart State
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist State
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // AI Stylist Recommendations
  aiResult: { stylist_verdict: string; styling_tips: string[]; matching_product_ids: string[] } | null;
  aiLoading: boolean;
  getAIRecommendation: (gender: string, colors: string[], preferred_style: string, budget: number, occasion: string) => Promise<void>;
  clearAIRecommendation: () => void;

  // Dark/Light Theme Control
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Checkout and Orders
  checkoutDetails: any; // Order details after submission
  placeOrder: (formData: { customer_name: string; customer_phone: string; customer_email: string; delivery_location: string; notes?: string }) => Promise<boolean>;

  // Customer reviews
  reviews: Record<string, Review[]>;
  loadReviews: (productId: string) => Promise<void>;
  submitReview: (productId: string, name: string, rating: number, comment: string) => Promise<void>;

  // Admin Dashboard State
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string; token: string } | null;
  loginAdmin: (password: string, username?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  adminOrders: any[];
  adminStats: DashboardStats | null;
  loadAdminStatsAndOrders: () => Promise<void>;

  // Admin Core Management
  createProduct: (pData: Partial<Product>) => Promise<boolean>;
  updateProduct: (id: string, pData: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  createCategory: (cData: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  createCollection: (coData: Partial<Collection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  createBanner: (bData: Partial<Banner>) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;

  // Newsletter Signup
  subscribeNewsletter: (email: string) => Promise<boolean>;

  // Extra Lookbook & Management elements
  posts: Post[];
  promotions: Promotion[];
  media: MediaItem[];
  settings: StoreSettings | null;
  subscribers: NewsletterSubscriber[];

  createPost: (data: Partial<Post>) => Promise<boolean>;
  updatePost: (id: string, data: Partial<Post>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  createPromotion: (data: Partial<Promotion>) => Promise<boolean>;
  updatePromotion: (id: string, data: Partial<Promotion>) => Promise<boolean>;
  deletePromotion: (id: string) => Promise<boolean>;
  createMedia: (name: string, url: string) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;
  updateSettings: (data: Partial<StoreSettings>) => Promise<boolean>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Routing View
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'product-details' | 'outfit-builder' | 'ai-stylist' | 'admin' | 'checkout' | 'success'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState<string | null>(null);

  // Cart & Wishlist local state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Aesthetic theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // AI recommendations
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Reviews map by product_id
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});

  // Checkout and Success results
  const [checkoutDetails, setCheckoutDetails] = useState<any>(null);

  // Admin section
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<DashboardStats | null>(null);

  // Extra luxury states for comprehensive Admin management
  const [posts, setPosts] = useState<Post[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  // 1. Initial Load of API store components
  const loadStoreData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat, resCol, resBanners, resPosts, resSettings, resPromotions] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/collections"),
        fetch("/api/banners"),
        fetch("/api/posts"),
        fetch("/api/settings"),
        fetch("/api/promotions")
      ]);

      if (resProd.ok && resCat.ok && resCol.ok && resBanners.ok) {
        const prod = await resProd.json();
        const cat = await resCat.json();
        const col = await resCol.json();
        const ban = await resBanners.json();
        const postData = resPosts.ok ? await resPosts.json() : [];
        const settData = resSettings.ok ? await resSettings.json() : null;
        const promoData = resPromotions.ok ? await resPromotions.json() : [];

        setProducts(prod);
        setCategories(cat);
        setCollections(col);
        setBanners(ban);
        setPosts(postData);
        setSettings(settData);
        setPromotions(promoData);
        setError(null);
      } else {
        throw new Error("Failed to load official Debbie Fashion backend systems");
      }
    } catch (err: any) {
      console.error(err);
      setError("Atelier connections interrupted, operating on dynamic seed frameworks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();

    // Check Local Storage for cart
    const cachedCart = localStorage.getItem("debbie_cart");
    if (cachedCart) {
      try {
        setCart(JSON.parse(cachedCart));
      } catch (e) {
        setCart([]);
      }
    }

    // Check Wishlist cache
    const cachedWish = localStorage.getItem("debbie_wishlist");
    if (cachedWish) {
      try {
        setWishlist(JSON.parse(cachedWish));
      } catch (e) {
        setWishlist([]);
      }
    }

    // Check Admin session cache
    const cachedAdmin = sessionStorage.getItem("debbie_admin_session");
    if (cachedAdmin) {
      const data = JSON.parse(cachedAdmin);
      setIsAdminLoggedIn(true);
      setAdminUser(data);
    }

    // Default theme check
    const currentTheme = localStorage.getItem("debbie_theme") as 'light' | 'dark' | null;
    if (currentTheme) {
      setTheme(currentTheme);
      if (currentTheme === 'dark') document.documentElement.classList.add('dark');
    }
  }, []);

  // Sync Cart local state
  useEffect(() => {
    localStorage.setItem("debbie_cart", JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist local state
  useEffect(() => {
    localStorage.setItem("debbie_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 2. Shopping Cart Methods
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
      }
    });
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    setCart(prev => {
      const updated = [...prev];
      if (quantity <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = quantity;
      }
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // 3. Wishlist Methods
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.id === productId);

  // 4. Dark Theme Switcher
  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem("debbie_theme", nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return nextTheme;
    });
  };

  // 5. Review Load & Submit
  const loadReviews = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(prev => ({ ...prev, [productId]: data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (productId: string, name: string, rating: number, comment: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_name: name, rating, comment })
      });
      if (response.ok) {
        await loadReviews(productId);
        // Refresh products to fetch adjusted aggregate scores
        await loadStoreData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Checkout Order Submission
  const placeOrder = async (formData: { customer_name: string; customer_phone: string; customer_email: string; delivery_location: string; notes?: string }) => {
    try {
      const orderItemsPayload = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: orderItemsPayload
        })
      });

      if (res.ok) {
        const orderRes = await res.json();
        setCheckoutDetails(orderRes);
        clearCart();
        setCurrentView('success');
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // 7. AI Styling Recommendation
  const getAIRecommendation = async (gender: string, colors: string[], preferred_style: string, budget: number, occasion: string) => {
    try {
      setAiLoading(true);
      setAiResult(null);
      const res = await fetch("/api/ai-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, favorite_colors: colors, preferred_style, budget, occasion })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      } else {
        setAiResult({
          stylist_verdict: "Atelier connectivity timed out. Our master stylist recommends matching simple tailored dark trousers with the silk draped slip dress for contrast.",
          styling_tips: ["Keep accessories minimal.", "Comfortable heels will frame the drape silhouette perfectly."],
          matching_product_ids: ["prod-7", "prod-5"]
        });
      }
    } catch (err) {
      console.error(err);
      setAiResult({
        stylist_verdict: "Our styling algorithms are fine-tuning. We recommend pairing relaxed knits with our organic linen elements for effortless elegance.",
        styling_tips: ["Drape accessories over high shoulders.", "Linen slides complete this resort look beautifully."],
        matching_product_ids: ["prod-9", "prod-10"]
      });
    } finally {
      setAiLoading(false);
    }
  };

  const clearAIRecommendation = () => {
    setAiResult(null);
  };

  // 8. Admin Controls
  const loginAdmin = async (password: string, username = "debbie_admin") => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setIsAdminLoggedIn(true);
        setAdminUser(data);
        sessionStorage.setItem("debbie_admin_session", JSON.stringify(data));
        // Fetch fresh stats immediately
        await loadAdminStatsAndOrders();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    sessionStorage.removeItem("debbie_admin_session");
  };

  const loadAdminStatsAndOrders = async () => {
    try {
      const [resOrders, resStats, resMedia, resSubscribers] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/admin/dashboard-stats"),
        fetch("/api/media"),
        fetch("/api/subscribers")
      ]);
      if (resOrders.ok && resStats.ok) {
        const ords = await resOrders.json();
        const stats = await resStats.json();
        const med = resMedia.ok ? await resMedia.json() : [];
        const subs = resSubscribers.ok ? await resSubscribers.json() : [];
        setAdminOrders(ords);
        setAdminStats(stats);
        setMedia(med);
        setSubscribers(subs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // LOOKBOOK AND MEDIA SYSTEMS MUTATIONS
  const createPost = async (data: Partial<Post>) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updatePost = async (id: string, data: Partial<Post>) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const createPromotion = async (data: Partial<Promotion>) => {
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updatePromotion = async (id: string, data: Partial<Promotion>) => {
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deletePromotion = async (id: string) => {
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const createMedia = async (name: string, url: string) => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url })
      });
      if (res.ok) {
        await loadAdminStatsAndOrders();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await loadAdminStatsAndOrders();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateSettings = async (data: Partial<StoreSettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const createProduct = async (pData: Partial<Product>) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pData)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateProduct = async (id: string, pData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pData)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadAdminStatsAndOrders();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Category collection controls
  const createCategory = async (cData: Partial<Category>) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cData)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const createCollection = async (coData: Partial<Collection>) => {
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coData)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const createBanner = async (bData: Partial<Banner>) => {
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bData)
      });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteBanner = async (id: string) => {
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Newsletter Subscriber
  const subscribeNewsletter = async (email: string) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      return res.ok;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <MarketplaceContext.Provider value={{
      products,
      categories,
      collections,
      banners,
      loading,
      error,
      currentView,
      setCurrentView,
      selectedProductId,
      setSelectedProductId,
      selectedCollectionSlug,
      setSelectedCollectionSlug,
      
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotal,

      wishlist,
      toggleWishlist,
      isInWishlist,

      aiResult,
      aiLoading,
      getAIRecommendation,
      clearAIRecommendation,

      theme,
      toggleTheme,

      checkoutDetails,
      placeOrder,

      reviews,
      loadReviews,
      submitReview,

      isAdminLoggedIn,
      adminUser,
      loginAdmin,
      logoutAdmin,
      adminOrders,
      adminStats,
      loadAdminStatsAndOrders,

      createProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      createCategory,
      deleteCategory,
      createCollection,
      deleteCollection,
      createBanner,
      deleteBanner,
      subscribeNewsletter,
      posts,
      promotions,
      media,
      settings,
      subscribers,
      createPost,
      updatePost,
      deletePost,
      createPromotion,
      updatePromotion,
      deletePromotion,
      createMedia,
      deleteMedia,
      updateSettings
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
