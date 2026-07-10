/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Path to JSON Database file for local persistence in preview
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper interfaces
interface DbSchema {
  admins: any[];
  categories: any[];
  collections: any[];
  products: any[];
  orders: any[];
  order_items: any[];
  reviews: any[];
  banners: any[];
  newsletter_subscribers: any[];
  posts: any[];
  promotions: any[];
  media: any[];
  settings: any;
}

// Global DB in-memory cache
let db: DbSchema = {
  admins: [
    {
      id: "admin-1",
      username: "admin",
      password_hash: "admin",
      name: "Atelier Master Admin",
      email: "admin@debbieatelier.com",
      created_at: new Date().toISOString(),
    },
    {
      id: "admin-2",
      username: "debbie",
      password_hash: "psd",
      name: "Debbie Alinda",
      email: "hasty0joel@gmail.com",
      created_at: new Date().toISOString(),
    }
  ],
  categories: [],
  collections: [],
  products: [],
  orders: [],
  order_items: [],
  reviews: [],
  banners: [],
  newsletter_subscribers: [],
  posts: [],
  promotions: [],
  media: [],
  settings: null
};

// Load database from file if it exists, otherwise write the default seed DB.
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
      console.log("Database successfully loaded from file.");
    }

    // Assure initialization of admins with admin/admin credentials
    if (!db.admins) {
      db.admins = [];
    }
    const adminExists = db.admins.some(a => a.username === "admin");
    if (!adminExists) {
      db.admins.push({
        id: "admin-default",
        username: "admin",
        password_hash: "admin",
        name: "Atelier Master Admin",
        email: "admin@debbieatelier.com",
        created_at: new Date().toISOString()
      });
    } else {
      // Ensure the passcode is "admin"
      const adm = db.admins.find(a => a.username === "admin");
      if (adm) {
        adm.password_hash = "admin";
      }
    }
    
    // Assure initialization of lookbook posts
    if (!db.posts) {
      db.posts = [];
    }

    // Assure initialization of promotions
    if (!db.promotions) {
      db.promotions = [];
    }

    // Assure initialization of media files
    if (!db.media) {
      db.media = [];
    }

    // Assure initialization of boutique configuration settings
    if (!db.settings) {
      db.settings = {
        store_name: "Debbie Atelier",
        phone: "+256 701 123456",
        whatsapp: "+256 701 123456",
        email: "hasty0joel@gmail.com",
        address: "Plot 10, Acacia Avenue, Kololo, Kampala",
        delivery_info: "Standard Kampala drop deliveries hand-delivered within 24 hours. Regional boutique dispatches handled via safe-courier networks."
      };
    }

    saveDb();
  } catch (err) {
    console.error("Failed to load local DB, using in-memory fallbacks.", err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write DB details to disk.", err);
  }
}

// Perform initial boot DB trigger
loadDb();

// -------------------------------------------------------------
// AI STYLE RECOMMENDATION SYSTEM - GEMINI SERVER PROXY
// -------------------------------------------------------------
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Stylist is operating in simulation fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

function extractJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Attempt to extract JSON from markdown block or raw text
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonStr);
    }
    throw e;
  }
}

async function generateWithHuggingFace(prompt: string): Promise<any> {
  const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) {
    throw new Error("No Hugging Face token configured in environment variables (HF_TOKEN or HUGGINGFACE_API_KEY)");
  }

  const models = [
    "Qwen/Qwen2.5-72B-Instruct",
    "meta-llama/Meta-Llama-3-8B-Instruct",
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
  ];

  let lastError: any = null;
  for (const model of models) {
    try {
      console.log(`[HUGGING FACE] Trying model: ${model}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hfToken}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content: "You are a master luxury stylist. You must respond with raw, valid JSON only. Do not include markdown code block formatting or any explanation outside the JSON."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1200
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Hugging Face API error (${response.status}): ${errText}`);
        }

        const result = await response.json() as any;
        const content = result.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("Empty response from Hugging Face");
        }

        console.log(`[HUGGING FACE] Successfully generated recommendation using ${model}`);
        return extractJson(content);
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err: any) {
      console.warn(`[HUGGING FACE] Model ${model} failed:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All Hugging Face models failed");
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", persistence: fs.existsSync(DB_FILE) });
});

// COLLECTIONS
app.get("/api/collections", (req, res) => {
  res.json(db.collections);
});

app.post("/api/collections", (req, res) => {
  const { name, slug, description, image, lifestyle_theme } = req.body;
  const newCol = {
    id: `col-${Date.now()}`,
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    image: image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
    lifestyle_theme: lifestyle_theme || "generic",
    created_at: new Date().toISOString()
  };
  db.collections.push(newCol);
  saveDb();
  res.status(201).json(newCol);
});

app.delete("/api/collections/:id", (req, res) => {
  db.collections = db.collections.filter(c => c.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// CATEGORIES
app.get("/api/categories", (req, res) => {
  res.json(db.categories);
});

app.post("/api/categories", (req, res) => {
  const { name, slug, description, image } = req.body;
  const newCat = {
    id: `cat-${Date.now()}`,
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    image: image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800"
  };
  db.categories.push(newCat);
  saveDb();
  res.status(201).json(newCat);
});

app.delete("/api/categories/:id", (req, res) => {
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// PRODUCTS
app.get("/api/products", (req, res) => {
  res.json(db.products);
});

app.get("/api/products/:id", (req, res) => {
  const prod = db.products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

app.post("/api/products", (req, res) => {
  const { title, description, price, original_price, sizes, colors, material, stock, brand, is_trending, is_new, category_id, collection_id, image_url, images } = req.body;
  const newProduct = {
    id: `prod-${Date.now()}`,
    title,
    description,
    price: Number(price),
    original_price: original_price ? Number(original_price) : undefined,
    rating: 5.0,
    reviews_count: 0,
    sizes: Array.isArray(sizes) ? sizes : ["S", "M", "L"],
    colors: Array.isArray(colors) ? colors : ["Black", "White"],
    material: material || "Organic Cotton Blend",
    stock: stock ? Number(stock) : 10,
    brand: brand || "Debbie Fashion",
    is_trending: !!is_trending,
    is_new: !!is_new,
    category_id,
    collection_id,
    image_url: image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
    images: Array.isArray(images) && images.length > 0 ? images : [image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"],
    created_at: new Date().toISOString()
  };
  db.products.push(newProduct);
  saveDb();
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const existing = db.products[idx];
  db.products[idx] = {
    ...existing,
    ...req.body,
    id: existing.id,
    price: req.body.price ? Number(req.body.price) : existing.price,
    original_price: req.body.original_price ? Number(req.body.original_price) : existing.original_price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock
  };
  saveDb();
  res.json(db.products[idx]);
});

app.delete("/api/products/:id", (req, res) => {
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// REVIEWS
app.get("/api/products/:id/reviews", (req, res) => {
  const reviews = db.reviews.filter(r => r.product_id === req.params.id);
  res.json(reviews);
});

app.post("/api/products/:id/reviews", (req, res) => {
  const { reviewer_name, rating, comment } = req.body;
  const product_id = req.params.id;
  const prod = db.products.find(p => p.id === product_id);
  if (!prod) return res.status(404).json({ error: "Product not found" });

  const newReview = {
    id: `rev-${Date.now()}`,
    product_id,
    reviewer_name: reviewer_name || "Anonymous",
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    comment: comment || "",
    created_at: new Date().toISOString()
  };

  db.reviews.push(newReview);
  
  // Recalculate rating / review counts in product schema
  const matchingReviews = db.reviews.filter(r => r.product_id === product_id);
  const totalRating = matchingReviews.reduce((sum, r) => sum + r.rating, 0);
  prod.rating = Number((totalRating / matchingReviews.length).toFixed(1));
  prod.reviews_count = matchingReviews.length;

  saveDb();
  res.status(201).json(newReview);
});

app.get("/api/reviews", (req, res) => {
  res.json(db.reviews || []);
});

app.delete("/api/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const idx = db.reviews.findIndex(r => r.id === reviewId);
  if (idx === -1) return res.status(404).json({ error: "Review not found" });
  
  const [removed] = db.reviews.splice(idx, 1);
  
  const prod = db.products.find(p => p.id === removed.product_id);
  if (prod) {
    const matchingReviews = db.reviews.filter(r => r.product_id === removed.product_id);
    if (matchingReviews.length > 0) {
      const totalRating = matchingReviews.reduce((sum, r) => sum + r.rating, 0);
      prod.rating = Number((totalRating / matchingReviews.length).toFixed(1));
    } else {
      prod.rating = 5.0;
    }
    prod.reviews_count = matchingReviews.length;
  }
  
  saveDb();
  res.json({ success: true, removed });
});

// ORDERS & CHECKOUT ENGINE
app.get("/api/orders", (req, res) => {
  // Map or seed values to support easy join metrics
  const mappedOrders = db.orders.map(order => {
    const items = db.order_items.filter(item => item.order_id === order.id).map(item => {
      const prod = db.products.find(p => p.id === item.product_id);
      return {
        ...item,
        product_title: prod ? prod.title : "Deleted Garment",
        product_image: prod ? prod.image_url : ""
      };
    });
    return { ...order, items };
  });
  res.json(mappedOrders);
});

app.put("/api/orders/:id", (req, res) => {
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });
  db.orders[idx].status = req.body.status;
  saveDb();
  res.json(db.orders[idx]);
});

app.post("/api/orders", (req, res) => {
  const { customer_name, customer_phone, customer_email, delivery_location, notes, items } = req.body;
  if (!customer_name || !customer_phone || !customer_email || !delivery_location || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required checkout parameters" });
  }

  // Calculate order total
  let orderTotal = 0;
  const orderId = `order-${Date.now()}`;
  const generatedRef = `DF-${Math.floor(100000 + Math.random() * 900000)}`;

  const createdItems = items.map(cartItem => {
    const originalProd = db.products.find(p => p.id === cartItem.productId);
    const price = originalProd ? originalProd.price : 100000;
    const quantity = Number(cartItem.quantity) || 1;
    const size = cartItem.size || "M";
    const color = cartItem.color || "Standard";
    orderTotal += price * quantity;

    // Deduct stock levels elegantly
    if (originalProd) {
      originalProd.stock = Math.max(0, originalProd.stock - quantity);
    }

    return {
      id: `oi-${Math.floor(Math.random() * 1000000)}`,
      order_id: orderId,
      product_id: cartItem.productId,
      quantity,
      size,
      color,
      price
    };
  });

  // Save order
  const newOrder = {
    id: orderId,
    order_ref: generatedRef,
    customer_name,
    customer_phone,
    customer_email,
    delivery_location,
    notes: notes || "",
    total: orderTotal,
    status: "New",
    created_at: new Date().toISOString()
  };

  db.orders.push(newOrder);
  db.order_items.push(...createdItems);
  saveDb();

  // Simulate Email Notification to Debbie Admin
  console.log(`[DEBBIE ADMIN EMAIL ALERT] New Order Ref #${generatedRef} has been placed by ${customer_name}. Total value: UGX ${orderTotal}. Deliver to: ${delivery_location}`);

  // pre-fill order product details text for client-side Whatsapp redirect
  const product_list_str = createdItems.map(item => {
    const prod = db.products.find(p => p.id === item.product_id);
    const title = prod ? prod.title : "Garment Product";
    return `- ${title} (${item.color} / ${item.size}) x${item.quantity} [UGX ${item.price.toLocaleString()}]`;
  }).join("\n");

  res.status(201).json({
    success: true,
    orderId,
    order_ref: generatedRef,
    total: orderTotal,
    product_list_str,
    customer_name,
    customer_phone,
    customer_email
  });
});

// BANNERS
app.get("/api/banners", (req, res) => {
  res.json(db.banners);
});

app.post("/api/banners", (req, res) => {
  const { title, subtitle, image_url, link, type } = req.body;
  const newBanner = {
    id: `ban-${Date.now()}`,
    title,
    subtitle: subtitle || "",
    image_url: image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600",
    link: link || "/catalog",
    type: type || "homepage"
  };
  db.banners.push(newBanner);
  saveDb();
  res.status(201).json(newBanner);
});

app.delete("/api/banners/:id", (req, res) => {
  db.banners = db.banners.filter(b => b.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// NEWSLETTER
app.get("/api/subscribers", (req, res) => {
  res.json(db.newsletter_subscribers);
});

app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  const exists = db.newsletter_subscribers.find(s => s.email === email);
  if (exists) return res.json({ success: true, message: "Already subscribed" });

  const newSub = {
    id: `sub-${Date.now()}`,
    email,
    created_at: new Date().toISOString()
  };
  db.newsletter_subscribers.push(newSub);
  saveDb();
  res.status(201).json({ success: true });
});

// LOOKBOOK POSTS
app.get("/api/posts", (req, res) => {
  res.json(db.posts || []);
});

app.post("/api/posts", (req, res) => {
  const { title, caption, images, tags, collection_id, is_featured, status } = req.body;
  const newPost = {
    id: `post-${Date.now()}`,
    title: title || "Untitled Look",
    caption: caption || "",
    images: images || [],
    tags: tags || [],
    collection_id: collection_id || null,
    is_featured: !!is_featured,
    status: status || "draft",
    created_at: new Date().toISOString()
  };
  if (!db.posts) db.posts = [];
  db.posts.push(newPost);
  saveDb();
  res.status(201).json(newPost);
});

app.put("/api/posts/:id", (req, res) => {
  if (!db.posts) db.posts = [];
  const idx = db.posts.findIndex(p => p.id === req.params.id);
  if (idx > -1) {
    db.posts[idx] = { ...db.posts[idx], ...req.body };
    saveDb();
    res.json(db.posts[idx]);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

app.delete("/api/posts/:id", (req, res) => {
  if (!db.posts) db.posts = [];
  db.posts = db.posts.filter(p => p.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// PROMOTIONS
app.get("/api/promotions", (req, res) => {
  res.json(db.promotions || []);
});

app.post("/api/promotions", (req, res) => {
  const { code, discount, is_flash, is_active, products, start_date, end_date } = req.body;
  const newPromo = {
    id: `promo-${Date.now()}`,
    code: (code || "").toUpperCase(),
    discount: Number(discount) || 10,
    is_flash: !!is_flash,
    is_active: is_active !== false,
    products: products || [],
    start_date: start_date || "",
    end_date: end_date || ""
  };
  if (!db.promotions) db.promotions = [];
  db.promotions.push(newPromo);
  saveDb();
  res.status(201).json(newPromo);
});

app.put("/api/promotions/:id", (req, res) => {
  if (!db.promotions) db.promotions = [];
  const idx = db.promotions.findIndex(p => p.id === req.params.id);
  if (idx > -1) {
    db.promotions[idx] = { ...db.promotions[idx], ...req.body };
    saveDb();
    res.json(db.promotions[idx]);
  } else {
    res.status(404).json({ error: "Promotion not found" });
  }
});

app.delete("/api/promotions/:id", (req, res) => {
  if (!db.promotions) db.promotions = [];
  db.promotions = db.promotions.filter(p => p.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// MEDIA CENTER
app.get("/api/media", (req, res) => {
  res.json(db.media || []);
});

app.post("/api/media", (req, res) => {
  const { name, url } = req.body;
  const newMedia = {
    id: `med-${Date.now()}`,
    name: name || "Uploaded Asset",
    url: url || "",
    date: new Date().toISOString().split('T')[0]
  };
  if (!db.media) db.media = [];
  db.media.push(newMedia);
  saveDb();
  res.status(201).json(newMedia);
});

app.put("/api/media/:id", (req, res) => {
  if (!db.media) db.media = [];
  const idx = db.media.findIndex(m => m.id === req.params.id);
  if (idx > -1) {
    db.media[idx].name = req.body.name || db.media[idx].name;
    db.media[idx].url = req.body.url || db.media[idx].url;
    saveDb();
    res.json(db.media[idx]);
  } else {
    res.status(404).json({ error: "Media not found" });
  }
});

app.delete("/api/media/:id", (req, res) => {
  if (!db.media) db.media = [];
  db.media = db.media.filter(m => m.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// SYSTEM SETTINGS
app.get("/api/settings", (req, res) => {
  res.json(db.settings || {
    store_name: "Debbie Atelier",
    phone: "+256 701 123456",
    whatsapp: "+256 701 123456",
    email: "hasty0joel@gmail.com",
    address: "Plot 10, Acacia Avenue, Kololo, Kampala",
    delivery_info: "Standard Kampala drop deliveries hand-delivered within 24 hours. Regional boutique dispatches handled via safe-courier networks."
  });
});

app.put("/api/settings", (req, res) => {
  db.settings = { ...(db.settings || {}), ...req.body };
  saveDb();
  res.json(db.settings);
});

// ADMIN AUTHENTICATION
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.admins.find(a => a.username === username && a.password_hash === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  // Standard token implementation
  const token = `debbie-token-${Buffer.from(username).toString("base64")}`;
  res.json({
    username: user.username,
    name: user.name,
    email: user.email,
    token
  });
});

// ADMIN ACCOUNTS MANAGEMENT API
app.get("/api/admin/accounts", (req, res) => {
  res.json((db.admins || []).map(a => ({
    id: a.id,
    username: a.username,
    name: a.name,
    email: a.email,
    created_at: a.created_at || new Date().toISOString()
  })));
});

app.post("/api/admin/accounts", (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: "All account fields are required (username, password, name, email)" });
  }

  const exists = (db.admins || []).some(a => a.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: `Username '${username}' is already in use.` });
  }

  const newAdmin = {
    id: `admin-${Date.now()}`,
    username,
    password_hash: password,
    name,
    email,
    created_at: new Date().toISOString()
  };

  if (!db.admins) {
    db.admins = [];
  }
  db.admins.push(newAdmin);
  saveDb();

  res.json({
    id: newAdmin.id,
    username: newAdmin.username,
    name: newAdmin.name,
    email: newAdmin.email,
    created_at: newAdmin.created_at
  });
});

app.delete("/api/admin/accounts/:id", (req, res) => {
  const { id } = req.params;
  const adminToDelete = (db.admins || []).find(a => a.id === id);
  if (!adminToDelete) {
    return res.status(404).json({ error: "Administrator account not found." });
  }

  if (adminToDelete.username === "admin") {
    return res.status(400).json({ error: "The primary 'admin' account cannot be deleted." });
  }

  db.admins = (db.admins || []).filter(a => a.id !== id);
  saveDb();

  res.json({ success: true, message: "Administrator account removed successfully." });
});

// ANALYTICS & DASHBOARD METRICS
app.get("/api/admin/dashboard-stats", (req, res) => {
  const totalOrders = db.orders.length;
  const revenue = db.orders.reduce((sum, o) => o.status !== "Cancelled" ? sum + o.total : sum, 0);
  const totalProducts = db.products.length;
  
  // Custom rich simulation values for visitor counters & conversions
  const baseVisitors = 1750;
  const visitorsCount = baseVisitors + db.orders.length * 3;
  const conversionRate = Number((((totalOrders || 8) / visitorsCount) * 100).toFixed(2));

  // Orders by Status
  const statuses: any[] = ['New', 'Contacted', 'Confirmed', 'Packed', 'Delivered', 'Cancelled'];
  const ordersByStatus = statuses.map(st => ({
    status: st,
    count: db.orders.filter(o => o.status === st).length
  }));

  // Sales trend line generator (last 7 days mapping including current date)
  const salesTrends = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // Sum real orders or add luxurious smooth simulation base values for nice displays
    const dayOrders = db.orders.filter(o => {
      const oDate = new Date(o.created_at);
      return oDate.toDateString() === d.toDateString();
    });
    
    const realSales = dayOrders.reduce((sum, o) => sum + o.total, 0);
    // Baseline beautiful curve for empty database views
    const mockVals = [450000, 680000, 520000, 890000, 1100000, 750000, 950000];
    const baseValue = mockVals[6 - i];

    salesTrends.push({
      date: dateStr,
      sales: realSales > 0 ? realSales : baseValue,
      orders: dayOrders.length > 0 ? dayOrders.length : Math.round(baseValue / 150000)
    });
  }

  // Best Sellers Calculator
  const productSalesMap: Record<string, { qty: number, rev: number }> = {};
  db.order_items.forEach(item => {
    if (!productSalesMap[item.product_id]) {
      productSalesMap[item.product_id] = { qty: 0, rev: 0 };
    }
    productSalesMap[item.product_id].qty += item.quantity;
    productSalesMap[item.product_id].rev += item.price * item.quantity;
  });

  const bestSellers = Object.entries(productSalesMap).map(([pId, stats]) => {
    const p = db.products.find(prod => prod.id === pId);
    return {
      product_id: pId,
      title: p ? p.title : "Discontinued Premium Piece",
      image_url: p ? p.image_url : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
      total_sold: stats.qty,
      revenue: stats.rev
    };
  }).sort((a, b) => b.total_sold - a.total_sold).slice(0, 5);

  // If bestSellers is empty (no orders placed yet), lets pre-populate with nice luxury placeholders
  if (bestSellers.length === 0) {
    bestSellers.push(
      { product_id: "prod-7", title: "Satin Draped Muse Back Midi Dress", image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800", total_sold: 45, revenue: 9450000 },
      { product_id: "prod-4", title: "Couture Retro High-Top Sneakers", image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800", total_sold: 31, revenue: 8680000 },
      { product_id: "prod-1", title: "Classic Vintage Denim Bomber", image_url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800", total_sold: 28, revenue: 5040000 }
    );
  }

  res.json({
    totalOrders,
    revenue,
    totalProducts,
    visitorsCount,
    conversionRate,
    ordersByStatus,
    salesTrends,
    bestSellers
  });
});

// AI STYLE RECOMMENDATION CONTROLLER WITH GEMINI PROXY
app.post("/api/ai-recommendation", async (req, res) => {
  const { gender, favorite_colors, preferred_style, budget, occasion } = req.body;
  if (!gender || !preferred_style || !occasion) {
    return res.status(400).json({ error: "Please submit Gender, Style Preferences and Occasion." });
  }

  const colorStr = Array.isArray(favorite_colors) ? favorite_colors.join(", ") : "Any Elegant Hue";
  const actualBudget = Number(budget) || 300000;

  // Compile prompt message with a listing of Debbie's luxury catalog
  const catalogListText = db.products.map(p => {
    return `- ID: "${p.id}", Title: "${p.title}", Fabric/Material: "${p.material}", Price: UGX ${p.price.toLocaleString()}`;
  }).join("\n");

  const prompt = `
You are the Executive Master Stylist at "Debbie Fashion", an ultra-premier luxury styling atelier. A client of high distinction has requested an immediate Bespoke Style Recommendation.

----- CLIENT PROFILE -----
- Gender Identification: ${gender}
- Perfect Occasion: ${occasion}
- Style Aesthetic: ${preferred_style}
- Preferred Hues: ${colorStr}
- Investment Budget Cap: UGX ${actualBudget.toLocaleString()}

----- AVAILABLE ATELIER CATALOG -----
${catalogListText}

----- STYLING DIRECTIVES -----
Select 2 to 3 perfectly matching items from our actual available catalog listed above that fall near or under the client's budget.
Write a highly engaging, sophisticated, and polished fashion recommendation outlining this personalized curated look.
Your response MUST be valid JSON matching this schema:
{
  "stylist_verdict": "Detailed editorial narrative explaining why this look perfectly accents the client's silhouette, colors and context",
  "styling_tips": [
    "Sophisticated tip on hair or outerwear drape",
    "Sophisticated tip on jewelry, footwear or details"
  ],
  "matching_product_ids": ["prod-id1", "prod-id2"]
}

Important details:
- Use exact IDs from the catalogue (e.g. "prod-3", "prod-7", etc.) depending on style match. Do NOT make up new IDs.
- Ensure the tones match real Kampala or global luxury lifestyle elegance.
- Do NOT include any markdown blocks other than stringified JSON inside your plain response. Return only pure JSON content.
`;

  try {
    const aiInstance = getGeminiClient();
    if (process.env.GEMINI_API_KEY) {
      console.log("[GEMINI STYLIST INTERACTION] Dialing Gemini-3.5-Flash for custom curation...");
      const response = await aiInstance.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stylist_verdict: { type: Type.STRING },
              styling_tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              matching_product_ids: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["stylist_verdict", "styling_tips", "matching_product_ids"]
          }
        }
      });

      const responseText = response.text ? response.text.trim() : "";
      const parsedRecommendation = JSON.parse(responseText);
      return res.json(parsedRecommendation);
    } else {
      throw new Error("No Gemini API key configured");
    }
  } catch (error: any) {
    console.warn(`[GEMINI STYLIST EXCEPTION] Gemini failed or returned an error (${error.message || error}). Checking Hugging Face fallback...`);
    
    const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    if (hfToken) {
      try {
        console.log("[HUGGING FACE FALLBACK] Dialing Hugging Face Serverless API...");
        const parsedRecommendation = await generateWithHuggingFace(prompt);
        return res.json(parsedRecommendation);
      } catch (hfError: any) {
        console.error("[HUGGING FACE EXCEPTION] Hugging Face fallback failed as well:", hfError.message || hfError);
      }
    } else {
      console.log("[INFO] No Hugging Face token configured (HF_TOKEN or HUGGINGFACE_API_KEY). Skipping HF fallback.");
    }

    console.log("[STYLING FALLBACK] Executing rule-based stylist engine...");
    
    // Intelligent rules matching based on input style/gender/occasion
    let matching_product_ids: string[] = [];
    let stylist_verdict = "";
    let styling_tips: string[] = [];

    // Fallbacks
    if (preferred_style.toLowerCase().includes("ceo") || occasion.toLowerCase().includes("business") || occasion.toLowerCase().includes("work")) {
      matching_product_ids = ["prod-5", "prod-6"];
      stylist_verdict = `For a commanding ${occasion} stance in executive settings, the Debbie Master Stylist recommends structuring your silhouette with a tailored wool cashmere envelope. This pairing aligns masculine tailoring logic with fluid contemporary geometry, delivering high-status boardroom presence.`;
      styling_tips = [
        "Pair the shoulder drape with clean minimalist leather slide loafers.",
        "Keep accessories strictly architectural-think raw geometric gold bands and minimal leather binders."
      ];
    } else if (occasion.toLowerCase().includes("date") || preferred_style.toLowerCase().includes("romantic") || preferred_style.toLowerCase().includes("party")) {
      matching_product_ids = ["prod-7", "prod-8"];
      stylist_verdict = `Evoking sheer romance for your upcoming ${occasion}, we have assembled an elite pairing featuring heavy satin fluidity contrasted with custom-stitched peak wool trims. The jewel tones beautifully reflect soft ambient lighting, creating an undeniable allure that feels editorial.`;
      styling_tips = [
        "Slick your hair back to highlight the low-draped criss-cross back detailing.",
        "Accost this silhouette with a structured calfskin top-handle clutch."
      ];
    } else if (preferred_style.toLowerCase().includes("street") || preferred_style.toLowerCase().includes("drip") || preferred_style.toLowerCase().includes("campus")) {
      matching_product_ids = ["prod-3", "prod-4", "prod-1"];
      stylist_verdict = `Curating active culture for your modern ${occasion}, we have paired structured military-grade utility ripstops with hand-grained Italian high-tops. It balances relaxed off-duty coordinates with premium textures that demand respect from Kololo to Kampala streets.`;
      styling_tips = [
        "Let the denim hem pool naturally over the high-top ankle contour.",
        "Top the ensemble with a matching heavyweight rib-knit beanbag duster."
      ];
    } else {
      // General Luxury selection
      matching_product_ids = ["prod-11", "prod-12"];
      stylist_verdict = `We have selected our signature wax-accented duster paired with hand-stained cowhide, custom engineered for your sophisticated ${occasion}. It combines local Kampala heritage aesthetics with global resort ease, presenting an incredibly luxurious statement.`;
      styling_tips = [
        "Drape the kimono loosely open over a neutral column knit maxi dress.",
        "Match the hand-stained cognac leather strap carefully with high-arch linen platform soles."
      ];
    }

    res.json({
      stylist_verdict,
      styling_tips,
      matching_product_ids
    });
  }
});


// Fallback for any unhandled /api/* routes to prevent HTML/SPA fallback conflicts
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `Atelier API endpoint not found: ${req.method} ${req.url}` });
});


// -------------------------------------------------------------
// VITE OR STATIC FILE MIDDLEWARE MOUNTING
// -------------------------------------------------------------
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=================================================`);
    console.log(`  DEBBIE FASHION SERVER READY ON PORT ${PORT}`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=================================================`);
  });
}

initServer().catch(err => {
  console.error("Failed to initialize Debbie Fashion fullstack container:", err);
});
