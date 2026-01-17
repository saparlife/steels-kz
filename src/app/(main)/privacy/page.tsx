import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности - Сталь Сервис Казахстан',
  description: 'Политика конфиденциальности и обработки персональных данных компании Сталь Сервис Казахстан.',
}

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Политика <span className="text-orange-500">конфиденциальности</span>
            </h1>
            <p className="text-gray-400">Последнее обновление: 1 января 2026 года</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Общие положения</h2>
              <p className="text-gray-600 mb-6">
                Настоящая политика конфиденциальности персональных данных (далее — Политика) действует
                в отношении всей информации, которую ТОО «Сталь Сервис Казахстан» (далее — Компания)
                может получить о Пользователе во время использования сайта steels.kz.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Определения</h2>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li><strong>Персональные данные</strong> — любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу.</li>
                <li><strong>Обработка персональных данных</strong> — любое действие с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу, удаление.</li>
                <li><strong>Пользователь</strong> — любой посетитель веб-сайта steels.kz.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Какие данные мы собираем</h2>
              <p className="text-gray-600 mb-4">Мы можем собирать следующую информацию:</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Имя и фамилия</li>
                <li>Контактная информация (телефон, email)</li>
                <li>Название компании</li>
                <li>Данные о заказах и запросах</li>
                <li>Техническая информация о посещении сайта (IP-адрес, тип браузера, время посещения)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Цели обработки данных</h2>
              <p className="text-gray-600 mb-4">Мы используем собранную информацию для:</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Обработки заказов и запросов</li>
                <li>Связи с клиентами по вопросам заказов</li>
                <li>Улучшения качества обслуживания</li>
                <li>Отправки информации об акциях и новостях (при согласии пользователя)</li>
                <li>Выполнения требований законодательства</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Защита данных</h2>
              <p className="text-gray-600 mb-6">
                Мы принимаем необходимые организационные и технические меры для защиты персональных данных
                от неправомерного доступа, уничтожения, изменения, блокирования, копирования, распространения,
                а также от иных неправомерных действий третьих лиц.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Передача данных третьим лицам</h2>
              <p className="text-gray-600 mb-6">
                Мы не передаем персональные данные третьим лицам, за исключением случаев:
              </p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Получения явного согласия пользователя</li>
                <li>Передачи данных партнерам для выполнения заказа (доставка)</li>
                <li>Требований законодательства Республики Казахстан</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Файлы cookie</h2>
              <p className="text-gray-600 mb-6">
                Сайт использует файлы cookie для улучшения пользовательского опыта. Cookie — это небольшие
                текстовые файлы, которые сохраняются на вашем устройстве. Вы можете отключить использование
                cookie в настройках браузера.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Права пользователя</h2>
              <p className="text-gray-600 mb-4">Вы имеете право:</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Получить информацию о хранимых персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления персональных данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Контактная информация</h2>
              <p className="text-gray-600 mb-6">
                По вопросам, связанным с обработкой персональных данных, вы можете обратиться:
              </p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Email: <a href="mailto:privacy@steels.kz" className="text-orange-500 hover:underline">privacy@steels.kz</a></li>
                <li>Телефон: <a href="tel:+77273123291" className="text-orange-500 hover:underline">+7 (7273) 123-291</a></li>
                <li>Адрес: г. Алматы, ул. Примерная, 1</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Изменения в политике</h2>
              <p className="text-gray-600">
                Компания оставляет за собой право вносить изменения в настоящую Политику. Новая редакция
                Политики вступает в силу с момента ее размещения на сайте. Продолжение использования сайта
                после внесения изменений означает ваше согласие с новой редакцией Политики.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
