# Парсер продуктов steels.kz

## Расположение

- **Локально**: `/Users/sapar/Documents/work/pet/steel/scripts/parse-products.ts`
- **На сервере**: `/data/docker/steel-parser/`
- **Сервер**: `65.21.195.154` (SSH ключ настроен)

## Быстрые команды

### Проверить статус парсера
```bash
ssh root@65.21.195.154 "docker logs steel-parser --tail 30"
```

### Проверить количество товаров в БД
```bash
ssh root@65.21.195.154 "docker logs steel-parser 2>&1 | grep -E 'Total in DB|inserted|Categories:'"
```

### Количество завершённых категорий
```bash
ssh root@65.21.195.154 "docker logs steel-parser 2>&1 | grep -c '✓'"
```

### Остановить парсер
```bash
ssh root@65.21.195.154 "docker stop steel-parser"
```

### Перезапустить парсер
```bash
ssh root@65.21.195.154 "cd /data/docker/steel-parser && docker compose up -d"
```

## Обновление парсера

1. Отредактировать локально: `scripts/parse-products.ts`
2. Скопировать на сервер:
```bash
scp /Users/sapar/Documents/work/pet/steel/scripts/parse-products.ts root@65.21.195.154:/data/docker/steel-parser/
```
3. Пересобрать и запустить:
```bash
ssh root@65.21.195.154 "cd /data/docker/steel-parser && docker compose build --no-cache && docker compose up -d"
```

## Сброс парсинга (начать заново)

Создать на сервере файл `reset.ts`:
```typescript
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

async function main() {
  const { data, error } = await supabase
    .from("parse_progress")
    .update({
      products_parsed: false,
      last_page: 0,
      products_count: 0,
      error_message: null
    })
    .neq("category_id", "00000000-0000-0000-0000-000000000000")
    .select("category_id")

  console.log("Reset", data?.length || 0, "categories")
}

main()
```

Запустить:
```bash
ssh root@65.21.195.154 "cd /data/docker/steel-parser && docker run --rm --env-file .env -v \$(pwd):/app -w /app node:20-alpine sh -c 'npx tsx reset.ts'"
```

## Структура Docker

```
/data/docker/steel-parser/
├── docker-compose.yml
├── Dockerfile
├── .env                    # Supabase credentials
├── package.json
└── parse-products.ts       # Основной скрипт
```

### .env файл
```
NEXT_PUBLIC_SUPABASE_URL=https://nlatynxsoxzbmbfvctum.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Как работает парсер

1. Читает категории из `parse_progress` где `products_parsed = false`
2. Для каждой категории:
   - Определяет количество страниц (3 метода):
     - `.catalog-header` с текстом "Найдено: X товаров"
     - Последняя ссылка в `.pagination a`
     - Количество элементов `.pagination li`
   - Парсит каждую страницу (24 товара на страницу)
   - Сохраняет прогресс в `parse_progress.last_page`
3. Пропускает товары с существующим slug (без дубликатов)

## Настройки скорости

В `parse-products.ts`:
```typescript
const DELAY_MS = 30           // Задержка между запросами (мс)
const CONCURRENT_REQUESTS = 30 // Параллельных запросов
```

## База данных

- **products**: Товары
- **product_attributes**: Атрибуты товаров
- **product_images**: Изображения
- **attribute_definitions**: Определения атрибутов
- **parse_progress**: Прогресс парсинга по категориям

## Ожидаемые результаты

- ~648 категорий
- ~177,000 товаров
- ~130+ атрибутов
- Время: несколько часов
