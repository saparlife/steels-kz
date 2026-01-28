import { createClient } from '@supabase/supabase-js'
import * as crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BATCH_SIZE = 500
const CONCURRENCY = 10
const DRY_RUN = process.argv.includes('--dry-run')

// ─── Hash helper ───────────────────────────────────────────────────────────────

function hashVariant(id: string, variants: number): number {
  const hash = crypto.createHash('md5').update(id).digest()
  return hash.readUInt32BE(0) % variants
}

// ─── Name cleanup ──────────────────────────────────────────────────────────────

function cleanName(name: string): string {
  return name
    .replace(/\s+в\s+(г\.?\s*)?Алматы\s*$/i, '')
    .trim()
}

// ─── Attribute helpers ─────────────────────────────────────────────────────────

interface AttrRow {
  value_text: string | null
  value_number: number | null
  attribute_definitions: {
    name_ru: string
    unit: string | null
  }
}

function formatAttrs(attrs: AttrRow[]): string {
  return attrs
    .map(a => {
      const name = a.attribute_definitions.name_ru
      const val = a.value_text ?? a.value_number?.toString() ?? ''
      const unit = a.attribute_definitions.unit
      if (!val) return ''
      return unit ? `${name}: ${val} ${unit}` : `${name}: ${val}`
    })
    .filter(Boolean)
    .join(', ')
}

function buildAttrsTable(attrs: AttrRow[]): string {
  if (attrs.length === 0) return ''
  const rows = attrs
    .map(a => {
      const name = a.attribute_definitions.name_ru
      const val = a.value_text ?? a.value_number?.toString() ?? ''
      const unit = a.attribute_definitions.unit
      const display = unit && a.value_number !== null ? `${val} ${unit}` : val
      if (!display) return ''
      return `  <tr><td>${escapeHtml(name)}</td><td>${escapeHtml(display)}</td></tr>`
    })
    .filter(Boolean)
    .join('\n')

  if (!rows) return ''
  return `<h3>Характеристики</h3>\n<table>\n${rows}\n</table>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Meta title templates (8 variants) ─────────────────────────────────────────

function generateMetaTitle(name: string, category: string, id: string): string {
  const v = hashVariant(id + '_mt', 8)
  const templates = [
    `${name} — купить в Казахстане`,
    `${name} | Цена и наличие`,
    `Купить ${name} в Алматы`,
    `${name} — ${category} с доставкой`,
    `${name} — каталог, цены`,
    `${category}: ${name}`,
    `${name} — оптом и в розницу`,
    `${name} | Склад Алматы`,
  ]
  const result = templates[v]
  if (result.length > 60) {
    return name.length > 60 ? name.substring(0, 57) + '...' : name
  }
  return result
}

// ─── Meta description templates (8 variants, up to 160 chars) ──────────────────

function generateMetaDescription(name: string, attrs: AttrRow[], id: string): string {
  const v = hashVariant(id + '_md', 8)
  const attrStr = formatAttrs(attrs)

  const templates = [
    `${name} с доставкой по Казахстану. ${attrStr}. Каталог, цены, наличие на складе.`,
    `Купить ${name} в Алматы. ${attrStr}. Оптовые и розничные поставки.`,
    `${name} по выгодной цене. ${attrStr}. Доставка по всему Казахстану.`,
    `${name} — наличие на складе в Алматы. ${attrStr}. Звоните!`,
    `Заказать ${name}. ${attrStr}. Быстрая доставка по Казахстану.`,
    `${name} от компании Темир Сервис. ${attrStr}. Опт и розница.`,
    `${name} — цена, характеристики. ${attrStr}. Доставка, самовывоз.`,
    `Продажа: ${name}. ${attrStr}. Гарантия качества, доставка по РК.`,
  ]

  let result = templates[v]
  // If too long, try without attrs
  if (result.length > 160) {
    const templatesNoAttr = [
      `${name} с доставкой по Казахстану. Каталог, цены, наличие на складе.`,
      `Купить ${name} в Алматы. Оптовые и розничные поставки.`,
      `${name} по выгодной цене. Доставка по всему Казахстану.`,
      `${name} — наличие на складе в Алматы. Звоните!`,
      `Заказать ${name}. Быстрая доставка по Казахстану.`,
      `${name} от компании Темир Сервис. Опт и розница.`,
      `${name} — цена, характеристики. Доставка, самовывоз.`,
      `Продажа: ${name}. Гарантия качества, доставка по РК.`,
    ]
    result = templatesNoAttr[v]
  }

  if (result.length > 160) {
    return result.substring(0, 157) + '...'
  }
  return result
}

// ─── Short description ─────────────────────────────────────────────────────────

function generateShortDescription(attrs: AttrRow[]): string {
  const attrStr = formatAttrs(attrs)
  if (!attrStr) return 'Доставка по Казахстану.'
  return `${attrStr}. Доставка по Казахстану.`
}

// ─── Description (HTML) ────────────────────────────────────────────────────────

// Introduction templates per top-level category slug (3 variants each)
const INTRO_TEMPLATES: Record<string, string[]> = {
  // Fallback for unknown categories
  _default: [
    'Предлагаем вашему вниманию {name} от компании «Темир Сервис». Продукция соответствует стандартам качества и доступна со склада в Алматы.',
    '{name} — качественная продукция для строительных и промышленных нужд. Компания «Темир Сервис» осуществляет поставки по всему Казахстану.',
    'Компания «Темир Сервис» предлагает {name} по выгодным ценам. Вся продукция сертифицирована и проходит контроль качества.',
  ],
  // Чёрный металлопрокат
  'chernyj-metalloprokat': [
    '{name} — высококачественный чёрный металлопрокат от проверенных производителей. Компания «Темир Сервис» гарантирует соответствие продукции стандартам ГОСТ.',
    'Предлагаем {name} из чёрного металлопроката. Продукция широко применяется в строительстве, машиностроении и промышленности.',
    '{name} в наличии на складе в Алматы. Чёрный металлопрокат от «Темир Сервис» — надёжный выбор для ваших проектов.',
  ],
  // Нержавеющая сталь
  'nerzhaveyushchaya-stal': [
    '{name} из нержавеющей стали — устойчивость к коррозии и долговечность. «Темир Сервис» предлагает широкий ассортимент нержавеющего проката.',
    'Нержавеющая продукция: {name}. Идеально подходит для пищевой, химической промышленности и строительства.',
    '{name} от «Темир Сервис». Нержавеющая сталь высокого качества с гарантией соответствия ГОСТ.',
  ],
  // Трубный прокат
  'trubnyj-prokat': [
    '{name} — качественный трубный прокат для различных областей применения. Наличие на складе, быстрая доставка по Казахстану.',
    'Трубная продукция: {name}. «Темир Сервис» предлагает трубы различных диаметров и марок стали.',
    '{name} в ассортименте от «Темир Сервис». Трубный прокат для строительства, нефтегазовой отрасли и ЖКХ.',
  ],
  // Сортовой прокат
  'sortovoj-prokat': [
    '{name} — сортовой прокат от проверенных заводов-производителей. «Темир Сервис» обеспечивает стабильные поставки.',
    'Сортовой прокат: {name}. Продукция используется в строительстве, производстве металлоконструкций и машиностроении.',
    '{name} от «Темир Сервис» — надёжный сортовой прокат для промышленных и строительных задач.',
  ],
  // Листовой прокат
  'listovoj-prokat': [
    '{name} — листовой прокат различных толщин и марок стали. Наличие на складе в Алматы.',
    'Листовая сталь: {name}. «Темир Сервис» предлагает листовой прокат горячекатаный и холоднокатаный.',
    '{name} от «Темир Сервис». Листовой прокат для строительства, производства и обшивки.',
  ],
  // Метизы и крепёж
  'metizy-i-krepezh': [
    '{name} — метизная продукция высокого качества. «Темир Сервис» предлагает широкий выбор крепёжных изделий.',
    'Метизы и крепёж: {name}. Болты, гайки, шайбы, саморезы и другие крепёжные элементы в наличии.',
    '{name} от «Темир Сервис». Надёжный крепёж для строительных и промышленных работ.',
  ],
  // Арматура
  'armatura': [
    '{name} — строительная арматура для армирования бетонных конструкций. Соответствие ГОСТ, наличие на складе.',
    'Арматура: {name}. «Темир Сервис» поставляет арматурную сталь различных диаметров и классов.',
    '{name} от «Темир Сервис» — арматурный прокат для монолитного строительства и фундаментов.',
  ],
  // Балка
  'balka': [
    '{name} — стальные балки для строительства зданий и сооружений. Соответствие ГОСТ, доставка по РК.',
    'Стальная балка: {name}. Применяется в каркасном строительстве, мостостроении и промышленности.',
    '{name} от «Темир Сервис». Двутавровые и другие балки в широком ассортименте.',
  ],
  // Швеллер
  'shveller': [
    '{name} — стальной швеллер для строительных и промышленных конструкций. Склад в Алматы.',
    'Швеллер: {name}. «Темир Сервис» предлагает горячекатаный и гнутый швеллер различных размеров.',
    '{name} от «Темир Сервис» — швеллер для несущих конструкций и каркасов зданий.',
  ],
  // Уголок
  'ugolok': [
    '{name} — стальной уголок равнополочный и неравнополочный. Наличие, доставка по Казахстану.',
    'Металлический уголок: {name}. Широко применяется в строительстве и производстве металлоконструкций.',
    '{name} от «Темир Сервис». Стальной уголок для каркасов, ограждений и конструкций.',
  ],
  // Профнастил
  'profnastil': [
    '{name} — профнастил для кровли, стен и ограждений. Качественное цинковое и полимерное покрытие.',
    'Профнастил: {name}. «Темир Сервис» предлагает профилированный лист различных марок и расцветок.',
    '{name} от «Темир Сервис» — профнастил для крыши, забора и фасада.',
  ],
  // Профильная труба
  'profilnaya-truba': [
    '{name} — профильные трубы квадратного и прямоугольного сечения. Наличие на складе в Алматы.',
    'Профильная труба: {name}. Применяется для каркасных конструкций, ворот и ограждений.',
    '{name} от «Темир Сервис». Профильный трубный прокат для строительства и производства.',
  ],
  // Сетка
  'setka': [
    '{name} — металлическая сетка для строительства, армирования и ограждений. Наличие на складе.',
    'Сетка: {name}. «Темир Сервис» предлагает сварную, тканую, рабицу и кладочную сетку.',
    '{name} от «Темир Сервис» — металлическая сетка для различных задач строительства.',
  ],
  // Проволока
  'provoloka': [
    '{name} — проволока стальная для вязки, армирования и технических нужд. Наличие на складе.',
    'Проволока: {name}. «Темир Сервис» предлагает вязальную, сварочную и общего назначения проволоку.',
    '{name} от «Темир Сервис». Стальная проволока различных диаметров и назначений.',
  ],
  // Электроды
  'elektrody': [
    '{name} — сварочные электроды для ручной дуговой сварки. Широкий выбор марок и диаметров.',
    'Электроды: {name}. «Темир Сервис» поставляет электроды для сварки углеродистых и легированных сталей.',
    '{name} от «Темир Сервис» — электроды для качественной и надёжной сварки.',
  ],
  // Цветной металлопрокат
  'tsvetnoj-metalloprokat': [
    '{name} — цветной металлопрокат: алюминий, медь, латунь. Наличие на складе в Алматы.',
    'Цветные металлы: {name}. «Темир Сервис» предлагает широкий ассортимент цветного проката.',
    '{name} от «Темир Сервис». Цветной металлопрокат для промышленности и строительства.',
  ],
  // Кровельные материалы
  'krovelnye-materialy': [
    '{name} — кровельные материалы для надёжной крыши. Качественное покрытие, доставка по РК.',
    'Кровля: {name}. «Темир Сервис» предлагает металлочерепицу, профнастил и комплектующие.',
    '{name} от «Темир Сервис» — кровельные материалы с гарантией качества.',
  ],
  // Водоснабжение и отопление
  'vodosnabzhenie-i-otoplenie': [
    '{name} — продукция для систем водоснабжения и отопления. Наличие на складе, быстрая доставка.',
    'Водоснабжение и отопление: {name}. «Темир Сервис» предлагает трубы, фитинги и арматуру.',
    '{name} от «Темир Сервис» — материалы для инженерных систем зданий.',
  ],
  // Запорная арматура
  'zapornaya-armatura': [
    '{name} — запорная арматура для трубопроводов. Краны, задвижки, вентили в наличии.',
    'Запорная арматура: {name}. «Темир Сервис» предлагает продукцию для систем ВК и отопления.',
    '{name} от «Темир Сервис» — запорная и регулирующая арматура для инженерных сетей.',
  ],
  // Оцинкованная сталь
  'otsinkovannaya-stal': [
    '{name} — оцинкованная сталь с антикоррозийным покрытием. Наличие на складе в Алматы.',
    'Оцинковка: {name}. «Темир Сервис» предлагает оцинкованный прокат для кровли и строительства.',
    '{name} от «Темир Сервис». Оцинкованная сталь — долговечная защита от коррозии.',
  ],
  // Металлоконструкции
  'metallokonstruktsii': [
    '{name} — металлоконструкции для строительства и промышленности. Изготовление и поставка.',
    'Металлоконструкции: {name}. «Темир Сервис» предлагает готовые и заказные металлоконструкции.',
    '{name} от «Темир Сервис» — металлоконструкции для промышленных и гражданских объектов.',
  ],
}

// Application area templates per top-level category slug (3 variants each)
const APPLICATION_TEMPLATES: Record<string, string[]> = {
  _default: [
    'Продукция применяется в строительстве, промышленности и производстве. Подходит для различных конструктивных и технических решений.',
    'Используется в гражданском и промышленном строительстве, при монтаже инженерных систем и производстве металлоконструкций.',
    'Область применения включает строительство зданий, промышленных объектов, производство конструкций и инженерных коммуникаций.',
  ],
  'chernyj-metalloprokat': [
    'Чёрный металлопрокат применяется в строительстве, машиностроении, нефтегазовой отрасли и производстве металлоконструкций.',
    'Используется для возведения зданий, мостов, опор, каркасных конструкций и в общепромышленных целях.',
    'Область применения: строительство жилых и промышленных объектов, производство оборудования, трубопроводных систем.',
  ],
  'nerzhaveyushchaya-stal': [
    'Нержавеющая сталь применяется в пищевой промышленности, химических производствах, медицине и строительстве.',
    'Используется в условиях повышенной влажности, агрессивных сред, а также в декоративных целях.',
    'Область применения: пищевое оборудование, ёмкости, трубопроводы, фасады, перила и ограждения.',
  ],
  'trubnyj-prokat': [
    'Трубы применяются для водо- и газоснабжения, отопления, канализации, а также для конструктивных целей.',
    'Используются в нефтегазовой отрасли, ЖКХ, строительстве и при прокладке инженерных коммуникаций.',
    'Область применения: трубопроводные системы, тепловые сети, обсадные колонны, конструкции.',
  ],
  'sortovoj-prokat': [
    'Сортовой прокат применяется при изготовлении металлоконструкций, машин, механизмов и в строительстве.',
    'Используется для армирования, создания каркасов, опор и других несущих элементов конструкций.',
    'Область применения: строительство, мостостроение, производство техники и промышленного оборудования.',
  ],
  'listovoj-prokat': [
    'Листовой прокат применяется для обшивки, настила, изготовления ёмкостей, корпусов и деталей конструкций.',
    'Используется в судостроении, машиностроении, строительстве и при изготовлении металлоизделий.',
    'Область применения: строительные конструкции, автомобилестроение, производство контейнеров и резервуаров.',
  ],
  'metizy-i-krepezh': [
    'Метизы применяются для соединения строительных и промышленных конструкций, монтажа оборудования.',
    'Используются в строительстве, машиностроении, при монтаже трубопроводов и металлоконструкций.',
    'Область применения: крепление конструкций, сборка оборудования, строительный и бытовой монтаж.',
  ],
  'armatura': [
    'Арматура применяется для армирования железобетонных конструкций: фундаментов, перекрытий, колонн и стен.',
    'Используется в монолитном строительстве, при возведении жилых, промышленных и инфраструктурных объектов.',
    'Область применения: фундаменты, каркасы зданий, мосты, дорожное строительство, сваи.',
  ],
  'balka': [
    'Балки применяются в качестве несущих элементов зданий, мостов, эстакад и промышленных сооружений.',
    'Используются в каркасном строительстве, при устройстве перекрытий и в мостостроении.',
    'Область применения: каркасы зданий, колонны, перекрытия, подкрановые балки, мостовые конструкции.',
  ],
  'shveller': [
    'Швеллер применяется для изготовления каркасов, рам, перемычек и других несущих элементов.',
    'Используется в строительстве, машиностроении и при производстве металлоконструкций.',
    'Область применения: каркасные конструкции, вагоностроение, станины оборудования, опоры.',
  ],
  'ugolok': [
    'Уголок применяется для изготовления рам, каркасов, ограждений и усиления конструкций.',
    'Используется в строительстве, при монтаже металлоконструкций, изготовлении мебели и стеллажей.',
    'Область применения: каркасы, фермы, связи, ограждения, элементы крепления.',
  ],
  'profnastil': [
    'Профнастил применяется для устройства кровли, облицовки стен, возведения заборов и ограждений.',
    'Используется в строительстве жилых, коммерческих и промышленных объектов.',
    'Область применения: кровля, фасады, ограждения, перегородки, несъёмная опалубка.',
  ],
  'profilnaya-truba': [
    'Профильная труба применяется для изготовления каркасов, ворот, заборов и металлоконструкций.',
    'Используется в строительстве теплиц, навесов, беседок и промышленных сооружений.',
    'Область применения: каркасные конструкции, мебель, рекламные конструкции, ограждения.',
  ],
  'setka': [
    'Металлическая сетка применяется для армирования, ограждения, фильтрации и отделочных работ.',
    'Используется в строительстве, сельском хозяйстве, промышленности и благоустройстве территорий.',
    'Область применения: кладочные работы, штукатурка, ограждения, фильтры, клетки.',
  ],
  'provoloka': [
    'Проволока применяется для вязки арматуры, изготовления сетки, пружин и в сварочных работах.',
    'Используется в строительстве, промышленности, сельском хозяйстве и при производстве метизов.',
    'Область применения: вязка арматуры, изготовление крепежа, сварка, плетение сетки.',
  ],
  'elektrody': [
    'Электроды применяются для ручной дуговой сварки углеродистых, низколегированных и нержавеющих сталей.',
    'Используются при монтаже металлоконструкций, трубопроводов, ремонте оборудования.',
    'Область применения: строительная и промышленная сварка, наплавка, ремонт металлоизделий.',
  ],
  'tsvetnoj-metalloprokat': [
    'Цветной металлопрокат применяется в электротехнике, авиастроении, химической промышленности и строительстве.',
    'Используется для изготовления токоведущих шин, теплообменников, декоративных элементов.',
    'Область применения: электротехника, машиностроение, приборостроение, строительство.',
  ],
  'krovelnye-materialy': [
    'Кровельные материалы применяются для устройства скатных и плоских крыш жилых и коммерческих зданий.',
    'Используются при строительстве, реконструкции и ремонте кровель различной сложности.',
    'Область применения: кровля жилых домов, коммерческих зданий, промышленных объектов.',
  ],
  'vodosnabzhenie-i-otoplenie': [
    'Продукция применяется при монтаже систем водоснабжения, отопления и канализации.',
    'Используется в жилом, коммерческом и промышленном строительстве для инженерных сетей.',
    'Область применения: водопровод, отопление, тёплый пол, канализация, дренаж.',
  ],
  'zapornaya-armatura': [
    'Запорная арматура применяется для управления потоком в трубопроводных системах водо-, газо- и теплоснабжения.',
    'Используется в ЖКХ, промышленных объектах и инженерных сетях зданий.',
    'Область применения: водопроводные и тепловые сети, газопроводы, технологические трубопроводы.',
  ],
  'otsinkovannaya-stal': [
    'Оцинкованная сталь применяется для кровли, водостоков, вентиляции и изготовления профилей.',
    'Используется в строительстве, производстве бытовой техники и автомобилестроении.',
    'Область применения: кровля, фасады, воздуховоды, профили, ограждения.',
  ],
  'metallokonstruktsii': [
    'Металлоконструкции применяются для возведения каркасов зданий, ангаров, навесов и промышленных объектов.',
    'Используются в промышленном и гражданском строительстве, при возведении быстровозводимых зданий.',
    'Область применения: каркасы зданий, ангары, склады, торговые павильоны, навесы.',
  ],
}

const DELIVERY_TEXT = 'Компания «Темир Сервис» осуществляет доставку металлопродукции по Алматы и всему Казахстану. Для заказа и уточнения наличия свяжитесь с нами: +7 (700) 161-87-67, sale@temir-service.kz. Возможен самовывоз со склада.'

function generateDescription(
  name: string,
  attrs: AttrRow[],
  topCategorySlug: string,
  id: string
): string {
  const introVariants = INTRO_TEMPLATES[topCategorySlug] || INTRO_TEMPLATES._default
  const appVariants = APPLICATION_TEMPLATES[topCategorySlug] || APPLICATION_TEMPLATES._default

  const introIdx = hashVariant(id + '_intro', introVariants.length)
  const appIdx = hashVariant(id + '_app', appVariants.length)

  const intro = introVariants[introIdx].replace('{name}', escapeHtml(name))
  const application = appVariants[appIdx]
  const attrsTable = buildAttrsTable(attrs)

  const parts = [`<p>${intro}</p>`]

  if (attrsTable) {
    parts.push(attrsTable)
  }

  parts.push(`<h3>Область применения</h3>\n<p>${application}</p>`)
  parts.push(`<h3>Доставка и оплата</h3>\n<p>${DELIVERY_TEXT}</p>`)

  return parts.join('\n\n')
}

// ─── Batch processing ──────────────────────────────────────────────────────────

interface ProductRow {
  id: string
  name_ru: string
  category_id: string
}

interface CategoryRow {
  id: string
  slug: string
  name_ru: string
  parent_id: string | null
  level: number
  path: string[] | null
}

async function loadCategories(): Promise<Map<string, CategoryRow>> {
  const map = new Map<string, CategoryRow>()
  let offset = 0
  const limit = 1000

  while (true) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, name_ru, parent_id, level, path')
      .range(offset, offset + limit - 1)

    if (error) throw new Error(`Failed to load categories: ${error.message}`)
    if (!data || data.length === 0) break

    for (const cat of data) {
      map.set(cat.id, cat as CategoryRow)
    }

    if (data.length < limit) break
    offset += limit
  }

  return map
}

function getTopCategorySlug(categoryId: string, categoriesMap: Map<string, CategoryRow>): string {
  const cat = categoriesMap.get(categoryId)
  if (!cat) return '_default'

  // If this category has a path, use the first element (root category)
  if (cat.path && cat.path.length > 0) {
    const rootCat = categoriesMap.get(cat.path[0])
    if (rootCat) return rootCat.slug
  }

  // If level 0, it's already top-level
  if (cat.level === 0) return cat.slug

  // Walk up the tree
  let current: CategoryRow | undefined = cat
  while (current && current.parent_id) {
    current = categoriesMap.get(current.parent_id)
  }

  return current?.slug ?? '_default'
}

function getCategoryName(categoryId: string, categoriesMap: Map<string, CategoryRow>): string {
  const cat = categoriesMap.get(categoryId)
  return cat?.name_ru ?? ''
}

async function fetchAttrsChunked(productIds: string[]): Promise<AttrRow[]> {
  const CHUNK = 50
  const all: AttrRow[] = []
  for (let i = 0; i < productIds.length; i += CHUNK) {
    const chunk = productIds.slice(i, i + CHUNK)
    const { data, error } = await supabase
      .from('product_attributes')
      .select('product_id, value_text, value_number, attribute_definitions(name_ru, unit)')
      .in('product_id', chunk)
    if (error) {
      console.error(`    Attrs chunk error: ${error.message}`)
      continue
    }
    if (data) {
      for (const attr of data) {
        if (attr.attribute_definitions) {
          all.push(attr as unknown as AttrRow & { product_id: string })
        }
      }
    }
  }
  return all
}

async function processBatch(
  products: ProductRow[],
  categoriesMap: Map<string, CategoryRow>,
  batchNum: number
): Promise<number> {
  const productIds = products.map(p => p.id)

  const allAttrs = await fetchAttrsChunked(productIds)

  // Group attrs by product
  const attrsByProduct = new Map<string, AttrRow[]>()
  for (const attr of allAttrs) {
    const pid = (attr as unknown as { product_id: string }).product_id
    if (!attrsByProduct.has(pid)) attrsByProduct.set(pid, [])
    attrsByProduct.get(pid)!.push(attr)
  }

  // Build updates
  const updates: Array<{
    id: string
    name_ru: string
    meta_title_ru: string
    meta_description_ru: string
    short_description_ru: string
    description_ru: string
  }> = []

  for (const product of products) {
    const name = cleanName(product.name_ru)
    const attrs = attrsByProduct.get(product.id) || []
    const topSlug = getTopCategorySlug(product.category_id, categoriesMap)
    const categoryName = getCategoryName(product.category_id, categoriesMap)

    updates.push({
      id: product.id,
      name_ru: name,
      meta_title_ru: generateMetaTitle(name, categoryName, product.id),
      meta_description_ru: generateMetaDescription(name, attrs, product.id),
      short_description_ru: generateShortDescription(attrs),
      description_ru: generateDescription(name, attrs, topSlug, product.id),
    })
  }

  if (DRY_RUN) {
    for (const u of updates.slice(0, 3)) {
      console.log('\n─── Product:', u.name_ru, '───')
      console.log('meta_title:', u.meta_title_ru)
      console.log('meta_desc:', u.meta_description_ru)
      console.log('short_desc:', u.short_description_ru)
      console.log('description:', u.description_ru.substring(0, 300) + '...')
    }
    return updates.length
  }

  // Execute updates with concurrency
  let completed = 0
  let idx = 0

  async function worker() {
    while (idx < updates.length) {
      const i = idx++
      const u = updates[i]
      const { error } = await supabase
        .from('products')
        .update({
          name_ru: u.name_ru,
          meta_title_ru: u.meta_title_ru,
          meta_description_ru: u.meta_description_ru,
          short_description_ru: u.short_description_ru,
          description_ru: u.description_ru,
        })
        .eq('id', u.id)

      if (error) {
        console.error(`  Error updating ${u.id}: ${error.message}`)
      } else {
        completed++
      }
    }
  }

  const workers = Array(Math.min(CONCURRENCY, updates.length))
    .fill(null)
    .map(() => worker())
  await Promise.all(workers)

  return completed
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Content Uniquifier')
  console.log('═══════════════════════════════════════════════════')
  if (DRY_RUN) {
    console.log('  MODE: DRY RUN (first 10 products, no DB writes)')
  }
  console.log()

  // Load all categories
  console.log('Loading categories...')
  const categoriesMap = await loadCategories()
  console.log(`  ${categoriesMap.size} categories loaded`)

  // Count total products
  const { count: totalCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  console.log(`  ${totalCount} total products\n`)

  const startTime = Date.now()
  let processed = 0
  let lastId = ''
  let batchNum = 0
  const limit = DRY_RUN ? 10 : BATCH_SIZE

  while (true) {
    let query = supabase
      .from('products')
      .select('id, name_ru, category_id')
      .order('id')
      .limit(limit)

    if (lastId) {
      query = query.gt('id', lastId)
    }

    const { data: products, error } = await query

    if (error) {
      console.error(`Error fetching products after ${lastId}: ${error.message}`)
      break
    }

    if (!products || products.length === 0) break

    batchNum++
    const batchProcessed = await processBatch(
      products as ProductRow[],
      categoriesMap,
      batchNum
    )
    processed += batchProcessed

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    const pct = totalCount ? ((processed / totalCount) * 100).toFixed(1) : '?'
    console.log(`  Batch ${batchNum}: ${processed}/${totalCount} (${pct}%) — ${elapsed}s`)

    if (DRY_RUN) break

    lastId = products[products.length - 1].id
    if (products.length < limit) break
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log(`  Processed: ${processed} products`)
  console.log(`  Time: ${elapsed}s`)
  console.log('═══════════════════════════════════════════════════')
}

main().catch(console.error)
