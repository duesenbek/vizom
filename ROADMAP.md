# Vizom — ROADMAP

Обновлено: 2025-11-10

## 0. Кратко — что уже сделано

- Настроили окружение и переменные:
  - Обновлён `.env.example` (полный список переменных, безопасные значения по умолчанию).
  - Добавлен валидатор окружения `src/config/env-fixed.js` (проверка типов, required, маскирование секретов).
- Оптимизация сборки (Vite):
  - Создан конфиг `vite.config.prod-fixed.js` с минификацией (terser), hidden source maps, code-splitting, gzip и brotli.
  - Включены плагины: `vite-plugin-compression`, `rollup-plugin-visualizer`, PWA (`vite-plugin-pwa`).
- Скрипты прод-оптимизации:
  - `scripts/optimize-build.js` — пост-оптимизация HTML (минимизация), мета-CSP заголовки, генерация `sw.js`, build-статистика.
  - `package.prod.json` — команды сборки, деплоя и аудитов (Lighthouse, imagemin).
- Трекинг ошибок:
  - `src/tracking/error-tracking.js` — интеграция Sentry (BrowserTracing, breadcrumbs, ErrorBoundary, PerformanceMonitor).
- Улучшение первого впечатления (лендинг — React-вариант):
  - Компоненты: `Hero`, `LiveDemo`, `Features`, `Gallery`, `QuickStart`, `TrustSignals`.
  - Компоновка: `src/react/App.tsx`, вход: `src/react/main.tsx`, отдельный входной HTML: `index-react.html`.
- DeepSeek клиент и интеграции:
  - `src/core/deepseek-complete.ts` — цельный клиент с кэшом, парсингом ответов, фоллбэками.

Примечание: React-часть добавлена отдельно и не меняет текущие HTML-страницы. Для её запуска нужны зависимости и `tsconfig` (см. ниже).

---

## 1. Окружение и конфигурация

Файлы:
- `.env.example` — полный список переменных. Скопируйте в `.env` и заполните.
- `src/config/env-fixed.js` — читает и валидирует `process.env`, даёт клиентскую и серверную проекции.

Ключевые переменные (неполный список):
- DeepSeek: `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL`, `DEEPSEEK_TIMEOUT`.
- Трекинг: `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `ENABLE_ERROR_TRACKING`.
- Аналитика: `PLAUSIBLE_DOMAIN`, `UMAMI_WEBSITE_ID`, `GA_TRACKING_ID`.
- Безопасность: `CORS_ORIGIN`, `JWT_SECRET`, `RATE_LIMIT_*`.

Использование в коде:
- `import { getEnv, getClientEnv, getServerEnv } from 'src/config/env-fixed.js'`

---

## 2. Сборка и производительность

Файлы:
- `vite.config.prod-fixed.js` — сборка production:
  - Минификация через `terser` (удаление console/debugger), splitChunks, таргеты браузеров.
  - Source maps: `hidden` для прод.
  - Плагины: gzip и brotli, visualizer (отчет `dist/stats.html`), PWA/Workbox.
- `scripts/optimize-build.js` — postbuild:
  - Минимизирует HTML, добавляет мета-CSP, генерирует `sw.js`, пишет `build-stats.md`.

Команды (в `package.prod.json`):
- `build` — сборка с `vite.config.prod-fixed.js`.
- `build:analyze` — сборка + отчет бандла.
- `optimize-images` — оптимизация изображений (imagemin).
- `performance-audit` — Lighthouse отчет (указать прод-URL).

---

## 3. Трекинг ошибок

Файл: `src/tracking/error-tracking.js`
- Инициализация Sentry (dsn/env/release из `.env`).
- ErrorBoundary: глобальные `error` / `unhandledrejection`.
- PerformanceMonitor: Web Vitals (LCP, FID, CLS), перехват `fetch` для метрик API.
- Хелперы `ErrorTracker.trackError/trackAPIError/trackFeatureUsage`.

Включение:
- Установите `SENTRY_DSN`, `ENABLE_ERROR_TRACKING=true`.
- Импортируйте `initializeErrorTracking()` в точке входа фронтенда.

---

## 4. Аналитика

Готовность:
- Переменные в `.env.example` для Plausible/Umami/GA.
- Инжект скриптов можно добавить в HTML (или как модуль) по выбранной платформе.

План:
- Добавить модуль `src/tracking/analytics.js` c переключателем провайдеров по env.

---

## 5. SEO и Open Graph

Сделано:
- В postbuild скрипте — мета-оптимизация в HTML (частично). 

План:
- `public/robots.txt`, `public/sitemap.xml` (скрипт генерации `scripts/generate-sitemap.js` упомянут в `package.prod.json`).
- OG-теги в шаблонах HTML, микроразметка.

---

## 6. Безопасность

Сделано:
- Базовый CSP через мета-тег в `optimize-build.js` (для статического хостинга; для Netlify/Vercel лучше через заголовки).
- Переменные для CORS/Rate limiting.

План:
- Вынести CSP в заголовки платформы (например, Netlify `_headers`).
- Санитайз ввода на серверных функциях (Stripe webhook и др.).
- Включить HTTPS (платформа деплоя).

---

## 7. Улучшение первого впечатления (лендинг, демо)

Сделано:
- React-компоненты: `Hero`, `LiveDemo`, `Features`, `Gallery`, `QuickStart`, `TrustSignals`.
- Компоновка: `src/react/App.tsx`, `src/react/main.tsx`, `index-react.html`.

Требуется для запуска:
- Установить зависимости: `react`, `react-dom`, `typescript`, `@types/react`, `@types/react-dom`.
- Добавить `tsconfig.json` с `"jsx": "react-jsx"`.
- Запустить через Vite (`index-react.html`).

---

## 8. API/DeepSeek

Сделано:
- `src/core/deepseek-complete.ts` — единый клиент: валидация ответов, кэш (`SimpleCache`), парсинг (`SimpleResponseParsing`), UI-фидбек (встроенный).

План:
- Включить реальный вызов в генераторе `generator.html` вместо моков.
- Центральная обработка ошибок через `ErrorTracker`.

---

## 9. Тестирование и регрессии

Чек-листы:
- Рендер графиков: пустые/большие/невалидные данные, разные браузеры.
- Экспорт: PNG (Chart.js), SVG/PDF (D3/jsPDF — по плану).
- API ошибки: невалидные запросы, сетевые фейлы, rate limit.
- Утечки памяти: цикл создания/удаления, очистка слушателей, профайлинг Performance.
- Мобайл: жесты, адаптив, реальные девайсы.
- Совместимость: Chrome/Firefox/Safari + мобильные.

---

## 10. Деплой

Netlify (пример):
- `deploy:staging:netlify` / `deploy:production:netlify` в `package.prod.json` (указать ID сайтов).
- Статические заголовки (CSP) и кэш — через `_headers` (план).

---

## 11. Ближайшие шаги (Backlog)

- [ ] Добавить `tsconfig.json` и установить React-зависимости, чтобы убрать JSX-линты.
- [ ] Интегрировать аналитику (Plausible/Umami) модульно.
- [ ] Сформировать `robots.txt` и `sitemap.xml` (и скрипт авто-генерации).
- [ ] Включить строгие заголовки CSP на уровне платформы деплоя.
- [ ] Покрыть критические пути E2E-тестами (генерация → превью → экспорт).
