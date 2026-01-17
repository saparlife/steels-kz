# Парсинг данных с steels.kz

## Подготовка базы данных

Перед запуском парсеров выполни SQL в Supabase Dashboard → SQL Editor:

```sql
-- Таблица прогресса парсинга
CREATE TABLE IF NOT EXISTS parse_progress (
  category_id UUID PRIMARY KEY REFERENCES categories(id) ON DELETE CASCADE,
  source_url TEXT,
  attributes_parsed BOOLEAN DEFAULT FALSE,
  products_parsed BOOLEAN DEFAULT FALSE,
  products_count INTEGER DEFAULT 0,
  last_page INTEGER DEFAULT 0,
  error_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Маппинг картинок для дедупликации
CREATE TABLE IF NOT EXISTS image_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT UNIQUE NOT NULL,
  storage_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавить source_url в product_images
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Уникальный индекс на slug товара
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_unique') THEN
    ALTER TABLE products ADD CONSTRAINT products_slug_unique UNIQUE (slug);
  END IF;
END $$;
```

## Порядок запуска

```bash
# 1. Подготовка (найдёт листовые категории, инициализирует прогресс)
npm run parse:prepare

# 2. Парсинг атрибутов (~700 категорий, ~5-10 мин)
npm run parse:attributes

# 3. Парсинг товаров (~170k товаров, ~2-4 часа)
npm run parse:products

# 4. Загрузка картинок товаров (отдельно, ~1-2 часа)
npm run download:product-images
```

## Описание скриптов

| Скрипт | Функция |
|--------|---------|
| `parse:prepare` | Находит ~700 листовых категорий, создаёт записи в `parse_progress` |
| `parse:attributes` | Парсит фильтры с steels.kz, создаёт `attribute_definitions`, связывает с категориями |
| `parse:products` | Парсит товары постранично, сохраняет в БД с автогенерацией SEO, может продолжить с места остановки |
| `download:product-images` | Качает уникальные картинки в Supabase Storage, дедуплицирует |

## Возобновление после сбоя

Все скрипты можно прервать (Ctrl+C) и перезапустить — они продолжат с места остановки благодаря таблице `parse_progress`.

## Мониторинг прогресса

```sql
-- Статус парсинга атрибутов
SELECT
  COUNT(*) FILTER (WHERE attributes_parsed) as done,
  COUNT(*) FILTER (WHERE NOT attributes_parsed) as pending
FROM parse_progress;

-- Статус парсинга товаров
SELECT
  COUNT(*) FILTER (WHERE products_parsed) as done,
  COUNT(*) FILTER (WHERE NOT products_parsed) as pending,
  SUM(products_count) as total_products
FROM parse_progress;

-- Общее количество товаров в БД
SELECT COUNT(*) FROM products;
```
