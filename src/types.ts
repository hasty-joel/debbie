/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Admin {
  id: string;
  username: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  lifestyle_theme: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count: number;
  sizes: string[]; // e.g. ["S", "M", "L", "XL"]
  colors: string[]; // e.g. ["Black", "White", "Beige"]
  material: string;
  stock: number;
  brand: string;
  is_trending: boolean;
  is_new: boolean;
  category_id: string;
  collection_id: string;
  image_url: string; // primary image thumbnail
  images: string[];  // full gallery array
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
}

export type OrderStatus = 'New' | 'Contacted' | 'Confirmed' | 'Packed' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_location: string;
  notes?: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title?: string;
  product_image?: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link: string;
  type: 'homepage' | 'promotional' | 'collection';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  caption: string;
  images: string[];
  tags: string[];
  collection_id?: string;
  is_featured: boolean;
  status: 'draft' | 'published';
  created_at: string;
}

export interface Promotion {
  id: string;
  code: string;
  discount: number;
  is_flash: boolean;
  is_active: boolean;
  products: string[];
  start_date: string;
  end_date: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  date: string;
}

export interface StoreSettings {
  store_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  delivery_info: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface AIStyleRecommendation {
  gender: string;
  favorite_colors: string[];
  preferred_style: string;
  budget: number;
  occasion: string;
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  totalProducts: number;
  visitorsCount: number;
  conversionRate: number;
  ordersByStatus: { status: OrderStatus; count: number }[];
  salesTrends: { date: string; sales: number; orders: number }[];
  bestSellers: { product_id: string; title: string; image_url: string; total_sold: number; revenue: number }[];
}
