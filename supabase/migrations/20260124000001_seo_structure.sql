-- SEO Structure Migration
-- Adds new tables for brands, manufacturers, offers, documents, guides, glossary, cases, etc.

-- Бренды
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_ru VARCHAR(500) NOT NULL,
    name_kz VARCHAR(500),
    description_ru TEXT,
    description_kz TEXT,
    logo_url TEXT,
    website_url TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    products_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Производители
CREATE TABLE IF NOT EXISTS manufacturers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_ru VARCHAR(500) NOT NULL,
    name_kz VARCHAR(500),
    description_ru TEXT,
    description_kz TEXT,
    country VARCHAR(100),
    logo_url TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    products_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Спецпредложения
CREATE TABLE IF NOT EXISTS special_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
    description_ru TEXT,
    description_kz TEXT,
    image_url TEXT,
    discount_percent INTEGER,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offer_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES special_offers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    special_price DECIMAL(15,2),
    UNIQUE(offer_id, product_id)
);

-- Документы/Сертификаты
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- certificate, gost, license, quality
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
    description_ru TEXT,
    description_kz TEXT,
    file_url TEXT,
    issuer VARCHAR(255),
    issue_date DATE,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Справочники ГОСТ
CREATE TABLE IF NOT EXISTS gost_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    number VARCHAR(100) NOT NULL,
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
    description_ru TEXT,
    description_kz TEXT,
    content_ru TEXT,
    content_kz TEXT,
    document_url TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Марки стали
CREATE TABLE IF NOT EXISTS steel_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description_ru TEXT,
    description_kz TEXT,
    chemical_composition JSONB,
    mechanical_properties JSONB,
    applications_ru TEXT,
    applications_kz TEXT,
    gost_id UUID REFERENCES gost_standards(id),
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Глоссарий
CREATE TABLE IF NOT EXISTS glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    term_ru VARCHAR(255) NOT NULL,
    term_kz VARCHAR(255),
    definition_ru TEXT NOT NULL,
    definition_kz TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Гайды
CREATE TABLE IF NOT EXISTS guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
    excerpt_ru TEXT,
    excerpt_kz TEXT,
    content_ru TEXT,
    content_kz TEXT,
    image_url TEXT,
    category VARCHAR(100),
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Категории FAQ (нормализация)
CREATE TABLE IF NOT EXISTS faq_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_ru VARCHAR(255) NOT NULL,
    name_kz VARCHAR(255),
    description_ru TEXT,
    description_kz TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Кейсы
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
    client_name VARCHAR(255),
    industry VARCHAR(100),
    excerpt_ru TEXT,
    excerpt_kz TEXT,
    content_ru TEXT,
    content_kz TEXT,
    image_url TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Лиды (заявки)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- price_request, order, wholesale, business, partner
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    city VARCHAR(100),
    message TEXT,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    source_page VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, completed, cancelled
    manager_notes TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Связи продуктов с брендами и производителями
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE SET NULL;

-- Связь FAQ с категориями
ALTER TABLE faq ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL;
ALTER TABLE faq ADD COLUMN IF NOT EXISTS page_slug VARCHAR(255);

-- Расширение таблицы cities для складов и гео-страниц
ALTER TABLE cities ADD COLUMN IF NOT EXISTS has_warehouse BOOLEAN DEFAULT false;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS warehouse_address_ru TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS warehouse_address_kz TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS meta_title_ru VARCHAR(500);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS meta_title_kz VARCHAR(500);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS meta_description_ru TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS meta_description_kz TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS description_ru TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS description_kz TEXT;

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);
CREATE INDEX IF NOT EXISTS idx_manufacturers_slug ON manufacturers(slug);
CREATE INDEX IF NOT EXISTS idx_manufacturers_active ON manufacturers(is_active);
CREATE INDEX IF NOT EXISTS idx_special_offers_slug ON special_offers(slug);
CREATE INDEX IF NOT EXISTS idx_special_offers_active_dates ON special_offers(is_active, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_gost_standards_slug ON gost_standards(slug);
CREATE INDEX IF NOT EXISTS idx_steel_grades_slug ON steel_grades(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_faq_categories_slug ON faq_categories(slug);
CREATE INDEX IF NOT EXISTS idx_cases_slug ON cases(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category_id);
CREATE INDEX IF NOT EXISTS idx_cities_warehouse ON cities(has_warehouse);

-- RLS Policies для публичного доступа (чтение)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gost_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE steel_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_products ENABLE ROW LEVEL SECURITY;

-- Политики для чтения активных записей
DROP POLICY IF EXISTS "Allow public read on active brands" ON brands;
CREATE POLICY "Allow public read on active brands" ON brands FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active manufacturers" ON manufacturers;
CREATE POLICY "Allow public read on active manufacturers" ON manufacturers FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active special_offers" ON special_offers;
CREATE POLICY "Allow public read on active special_offers" ON special_offers FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active documents" ON documents;
CREATE POLICY "Allow public read on active documents" ON documents FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active gost_standards" ON gost_standards;
CREATE POLICY "Allow public read on active gost_standards" ON gost_standards FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active steel_grades" ON steel_grades;
CREATE POLICY "Allow public read on active steel_grades" ON steel_grades FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active glossary_terms" ON glossary_terms;
CREATE POLICY "Allow public read on active glossary_terms" ON glossary_terms FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active guides" ON guides;
CREATE POLICY "Allow public read on active guides" ON guides FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active faq_categories" ON faq_categories;
CREATE POLICY "Allow public read on active faq_categories" ON faq_categories FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on active cases" ON cases;
CREATE POLICY "Allow public read on active cases" ON cases FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow public read on offer_products" ON offer_products;
CREATE POLICY "Allow public read on offer_products" ON offer_products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on leads" ON leads;
CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT WITH CHECK (true);
