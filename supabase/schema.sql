-- =============================================
-- STEELS.KZ Clone - Database Schema
-- =============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================
-- CATEGORIES (с поддержкой неограниченной вложенности)
-- =============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL,
    name_ru VARCHAR(500) NOT NULL,
    name_kz VARCHAR(500),
    description_ru TEXT,
    description_kz TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    image_url TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    products_count INTEGER DEFAULT 0,
    -- Для быстрого поиска пути категории
    path TEXT[], -- массив id родительских категорий
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для категорий
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_level ON categories(level);
CREATE INDEX idx_categories_path ON categories USING GIN(path);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE UNIQUE INDEX idx_categories_unique_slug_parent ON categories(slug, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- =============================================
-- ATTRIBUTE DEFINITIONS (определения атрибутов для фильтров)
-- =============================================
CREATE TABLE attribute_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_ru VARCHAR(255) NOT NULL,
    name_kz VARCHAR(255),
    type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, number, select, multiselect, boolean
    unit VARCHAR(50), -- мм, кг, м и т.д.
    unit_kz VARCHAR(50),
    is_filterable BOOLEAN DEFAULT true,
    is_searchable BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attribute_definitions_slug ON attribute_definitions(slug);
CREATE INDEX idx_attribute_definitions_filterable ON attribute_definitions(is_filterable);

-- =============================================
-- CATEGORY ATTRIBUTES (какие атрибуты доступны для категории)
-- =============================================
CREATE TABLE category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_definitions(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    UNIQUE(category_id, attribute_id)
);

CREATE INDEX idx_category_attributes_category ON category_attributes(category_id);

-- =============================================
-- PRODUCTS (товары)
-- =============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    sku VARCHAR(100),
    slug VARCHAR(500) NOT NULL,
    name_ru VARCHAR(1000) NOT NULL,
    name_kz VARCHAR(1000),
    short_description_ru TEXT,
    short_description_kz TEXT,
    description_ru TEXT,
    description_kz TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    price DECIMAL(15, 2),
    old_price DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'KZT',
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    -- Для быстрого поиска по категориям
    category_path UUID[], -- массив id всех родительских категорий
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для товаров
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_category_path ON products USING GIN(category_path);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_name_ru_trgm ON products USING GIN(name_ru gin_trgm_ops);

-- =============================================
-- PRODUCT ATTRIBUTES (значения атрибутов товаров)
-- =============================================
CREATE TABLE product_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_definitions(id) ON DELETE CASCADE,
    value_text VARCHAR(1000),
    value_number DECIMAL(15, 4),
    value_boolean BOOLEAN,
    UNIQUE(product_id, attribute_id)
);

CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX idx_product_attributes_attribute ON product_attributes(attribute_id);
CREATE INDEX idx_product_attributes_value_text ON product_attributes(value_text);
CREATE INDEX idx_product_attributes_value_number ON product_attributes(value_number);

-- =============================================
-- PRODUCT IMAGES
-- =============================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_ru VARCHAR(500),
    alt_kz VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =============================================
-- PAGES (статические страницы)
-- =============================================
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
    content_ru TEXT,
    content_kz TEXT,
    meta_title_ru VARCHAR(500),
    meta_title_kz VARCHAR(500),
    meta_description_ru TEXT,
    meta_description_kz TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);

-- =============================================
-- NEWS (новости)
-- =============================================
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title_ru VARCHAR(500) NOT NULL,
    title_kz VARCHAR(500),
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
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published_at ON news(published_at DESC);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value_ru TEXT,
    value_kz TEXT,
    type VARCHAR(50) DEFAULT 'text', -- text, json, html, image
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTACTS / CITIES
-- =============================================
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name_ru VARCHAR(255) NOT NULL,
    name_kz VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address_ru TEXT,
    address_kz TEXT,
    working_hours_ru TEXT,
    working_hours_kz TEXT,
    coordinates_lat DECIMAL(10, 8),
    coordinates_lng DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- REVIEWS / TESTIMONIALS
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    content_ru TEXT NOT NULL,
    content_kz TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FAQ
-- =============================================
CREATE TABLE faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_ru TEXT NOT NULL,
    question_kz TEXT,
    answer_ru TEXT NOT NULL,
    answer_kz TEXT,
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SPECIAL OFFERS / BANNERS
-- =============================================
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ru VARCHAR(500),
    title_kz VARCHAR(500),
    subtitle_ru VARCHAR(500),
    subtitle_kz VARCHAR(500),
    image_url TEXT NOT NULL,
    link_url TEXT,
    position VARCHAR(50) DEFAULT 'home', -- home, catalog, sidebar
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMIN USERS
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- super_admin, admin, editor
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция для обновления path и level категории
CREATE OR REPLACE FUNCTION update_category_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path TEXT[];
    parent_level INTEGER;
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path := ARRAY[]::TEXT[];
        NEW.level := 0;
    ELSE
        SELECT path, level INTO parent_path, parent_level
        FROM categories WHERE id = NEW.parent_id;

        NEW.path := parent_path || NEW.parent_id::TEXT;
        NEW.level := parent_level + 1;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_category_path_trigger
BEFORE INSERT OR UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_category_path();

-- Функция для обновления category_path продукта
CREATE OR REPLACE FUNCTION update_product_category_path()
RETURNS TRIGGER AS $$
DECLARE
    cat_path TEXT[];
BEGIN
    SELECT path INTO cat_path FROM categories WHERE id = NEW.category_id;
    NEW.category_path := (cat_path || NEW.category_id::TEXT)::UUID[];
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_category_path_trigger
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_category_path();

-- Функция для обновления products_count в категории
CREATE OR REPLACE FUNCTION update_category_products_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET products_count = products_count + 1 WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET products_count = products_count - 1 WHERE id = OLD.category_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
        UPDATE categories SET products_count = products_count - 1 WHERE id = OLD.category_id;
        UPDATE categories SET products_count = products_count + 1 WHERE id = NEW.category_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_category_products_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION update_category_products_count();

-- =============================================
-- ROW LEVEL SECURITY (для безопасности)
-- =============================================

-- Включаем RLS для публичных таблиц
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения активного контента
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active pages" ON pages FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active news" ON news FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active reviews" ON reviews FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active faq" ON faq FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active cities" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- =============================================
-- INITIAL DATA
-- =============================================

-- Настройки сайта по умолчанию
INSERT INTO site_settings (key, value_ru, value_kz, type) VALUES
('site_name', 'Сталь Сервис Казахстан', 'Сталь Сервис Қазақстан', 'text'),
('site_description', 'Крупнейший поставщик металлопроката в Казахстане', 'Қазақстандағы ең ірі металл прокат жеткізушісі', 'text'),
('phone', '+7 (7273) 123-291', '+7 (7273) 123-291', 'text'),
('email', 'info@steels.kz', 'info@steels.kz', 'text'),
('address', 'г. Алматы, ул. Примерная, 1', 'Алматы қ., Үлгілі к-сі, 1', 'text'),
('working_hours', 'Пн-Пт: 9:00 - 18:00', 'Дс-Жм: 9:00 - 18:00', 'text'),
('whatsapp', '+77771234567', '+77771234567', 'text');

-- Город по умолчанию
INSERT INTO cities (slug, name_ru, name_kz, phone, email, address_ru, address_kz, working_hours_ru, working_hours_kz, is_default) VALUES
('almaty', 'Алматы', 'Алматы', '+7 (7273) 123-291', 'almaty@steels.kz', 'г. Алматы, ул. Примерная, 1', 'Алматы қ., Үлгілі к-сі, 1', 'Пн-Пт: 9:00 - 18:00', 'Дс-Жм: 9:00 - 18:00', true);

-- Базовые атрибуты для фильтров
INSERT INTO attribute_definitions (slug, name_ru, name_kz, type, unit, unit_kz, is_filterable, sort_order) VALUES
('diameter', 'Диаметр', 'Диаметрі', 'number', 'мм', 'мм', true, 1),
('thickness', 'Толщина', 'Қалыңдығы', 'number', 'мм', 'мм', true, 2),
('length', 'Длина', 'Ұзындығы', 'number', 'м', 'м', true, 3),
('width', 'Ширина', 'Ені', 'number', 'мм', 'мм', true, 4),
('weight', 'Вес', 'Салмағы', 'number', 'кг', 'кг', true, 5),
('steel_grade', 'Марка стали', 'Болат маркасы', 'select', null, null, true, 6),
('gost', 'ГОСТ/ТУ', 'ГОСТ/ТУ', 'select', null, null, true, 7),
('coating', 'Покрытие', 'Жабын', 'select', null, null, true, 8),
('color', 'Цвет', 'Түсі', 'select', null, null, true, 9);

