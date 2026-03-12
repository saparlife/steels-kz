-- Seed static pages for home and catalog
INSERT INTO pages (slug, title_ru, title_kz, sort_order, is_active)
VALUES
  ('home', 'Главная', 'Басты бет', 0, true),
  ('katalog', 'Каталог продукции', 'Өнім каталогы', 1, true)
ON CONFLICT (slug) DO NOTHING;
