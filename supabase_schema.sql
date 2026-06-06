-- ==========================================
-- DEBBIE FASHION - SUPABASE DATABASE SCHEMA
-- ==========================================

-- Enable UI-supportedUUID generators
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: Admin details can only be read/written by authenticated administrators.
CREATE POLICY "Admin access only" ON public.admins
    FOR ALL
    USING (auth.role() = 'authenticated');


-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view categories
CREATE POLICY "Allow public read categories" ON public.categories
    FOR SELECT USING (true);

-- Policy: Only admins can manage categories
CREATE POLICY "Admin write categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');


-- 3. COLLECTIONS (LIFESTYLE THEME) TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    lifestyle_theme VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view collections
CREATE POLICY "Allow public read collections" ON public.collections
    FOR SELECT USING (true);

-- Policy: Only admins can manage collections
CREATE POLICY "Admin write collections" ON public.collections
    FOR ALL USING (auth.role() = 'authenticated');


-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXTNot null,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    rating DECIMAL(3,2) DEFAULT 5.00 NOT NULL,
    reviews_count INT DEFAULT 0 NOT NULL,
    sizes VARCHAR(20)[] DEFAULT ARRAY['S', 'M', 'L']::VARCHAR(20)[] NOT NULL,
    colors VARCHAR(50)[] DEFAULT ARRAY['Black', 'White']::VARCHAR(50)[] NOT NULL,
    material VARCHAR(255),
    stock INT DEFAULT 10 NOT NULL,
    brand VARCHAR(100) DEFAULT 'Debbie' NOT NULL,
    is_trending BOOLEAN DEFAULT false NOT NULL,
    is_new BOOLEAN DEFAULT true NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view products
CREATE POLICY "Allow public read products" ON public.products
    FOR SELECT USING (true);

-- Policy: Only admins can manage products
CREATE POLICY "Admin write products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');


-- 5. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Product Images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read product images
CREATE POLICY "Allow public read product images" ON public.product_images
    FOR SELECT USING (true);

-- Policy: Only admins can manage product images
CREATE POLICY "Admin write product images" ON public.product_images
    FOR ALL USING (auth.role() = 'authenticated');


-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_ref VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    delivery_location VARCHAR(255) NOT NULL,
    notes TEXT,
    total DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'New' NOT NULL, -- New, Contacted, Confirmed, Packed, Delivered, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow clients to insert orders (place order without logging in)
CREATE POLICY "Allow public insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can read/write orders
CREATE POLICY "Admin read and write orders" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated');


-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow clients to submit order items publicly
CREATE POLICY "Allow public insert order_items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can read/write order items
CREATE POLICY "Admin read and write order_items" ON public.order_items
    FOR ALL USING (auth.role() = 'authenticated');


-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews
CREATE POLICY "Allow public read reviews" ON public.reviews
    FOR SELECT USING (true);

-- Policy: Anyone can submit a review
CREATE POLICY "Allow public submit reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can delete/edit reviews
CREATE POLICY "Admin manage reviews" ON public.reviews
    FOR ALL USING (auth.role() = 'authenticated');


-- 9. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link VARCHAR(255),
    type VARCHAR(50) DEFAULT 'homepage' NOT NULL, -- homepage, promotional, collection
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Policy: Public read
CREATE POLICY "Allow public read banners" ON public.banners
    FOR SELECT USING (true);

-- Policy: Admin write
CREATE POLICY "Admin write banners" ON public.banners
    FOR ALL USING (auth.role() = 'authenticated');


-- 10. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to subscribe
CREATE POLICY "Allow public insert subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can read list
CREATE POLICY "Admin read subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');


-- ==========================================
-- STORAGE BUCKETS SETUP
-- ==========================================
-- Run this in your Supabase Dashboard under Storage -> New Bucket
-- 1. Create a bucket named "products" with public access enabled.
-- 2. Create a bucket named "banners" with public access enabled.
