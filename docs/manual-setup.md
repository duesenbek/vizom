# Manual Setup Checklist

Some parts of the monetization/auth flow require manual configuration outside the repo. Use this list to finish deployment.

## 1. Supabase Auth UI
- Ensure every page that needs authentication includes the auth modal markup. Copy the `#auth-modal` block from `templates.html`.
- Verify buttons referenced in `src/supabase-auth.js` exist:
  - `#google-signin`
  - `#close-auth-modal`
  - `#sign-in-btn`, `#get-started-btn`, `#sign-out-btn`
  - `#mobile-sign-in-btn`, `#mobile-get-started-btn`

## 2. Stripe Frontend Client (`src/payments/stripe-client.js`)
- Инициализирует Stripe.js (динамическая загрузка `<script src="https://js.stripe.com/v3">`).
- Берёт publishable key из `window.__VIZOM_ENV__.STRIPE_PUBLISHABLE_KEY` → env → дефолтного `pk_test_...`.
- Методы:
  - `startCheckout(plan)` → POST `/.netlify/functions/create-checkout-session`, пробрасывает Supabase JWT в `Authorization: Bearer`, перенаправляет на `payload.url`.
  - `notifyAdWatched()` → POST `/.netlify/functions/watch-ad` для бонуса после рекламы.
  - Автобиндинг `[data-action="upgrade-pro"]`, подписка на события `billing:upgrade` / `billing:watchAd`.
- При появлении новых кнопок с `data-action="upgrade-pro"` они будут автоматически привязаны (наблюдатель MutationObserver).

## 3. Netlify Functions (`netlify/functions/*`)
Сделаны заглушки серверных функций. Перед деплоем нужно:

1. `create-checkout-session.js`
   - Требует env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `SUPABASE_SERVICE_KEY`, `SUPABASE_URL`, опц. `SUCCESS_URL`, `CANCEL_URL`.
   - Читает Supabase JWT из `Authorization`, сохраняет `userId` в `metadata`, создаёт Stripe Checkout Session и возвращает `{ url }`.

2. `check-quota.js`
   - Env: `SUPABASE_SERVICE_KEY`, `SUPABASE_URL`, опц. `DAILY_FREE_LIMIT` (по умолчанию 5).
   - Проверяет/создаёт запись в `profiles`, сбрасывает счётчик при смене даты, возвращает JSON `{ allowed, remaining, showBanner, shouldShowAd, bannerText, canWatchAd }`.

3. `watch-ad.js`
   - Env: `SUPABASE_SERVICE_KEY`, `SUPABASE_URL`, опц. `AD_BONUS_GENERATIONS` (по умолчанию 1).
   - После просмотра рекламы уменьшает `daily_generations` на бонус (не ниже 0), тем самым открывая дополнительную генерацию.

Добавить `netlify.toml` или UI-конфиг, чтобы проксировать `/.netlify/functions/*`. Все функции поддерживают `OPTIONS` для CORS.

4. (Пока не реализован) `stripe-webhook.js`
   - Необходимо добавить самостоятельно. Задача: принимать вебхук, валидировать `stripe-signature`, по событию `checkout.session.completed` расставлять `subscription_plan='pro'`, `ads_enabled=false`, сохранять `stripe_customer_id/stripe_subscription_id` в `profiles`.

### Переменные окружения (Netlify → Site settings → Environment)

| Название | Обязателен | Описание |
|----------|------------|----------|
| `SUPABASE_URL` | ✅ | `https://poptvesywntelmtbrige.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Публичный ключ из Supabase (для фронтенда) |
| `SUPABASE_SERVICE_KEY` | ✅ | Ключ сервиса (не путать с ANON), хранится только на сервере (функции) |
| `STRIPE_SECRET_KEY` | ✅ | Секретный ключ учётки (test/prod) |
| `STRIPE_PRICE_ID` | ✅ | ID продукта/price для подписки $2.99 |
| `STRIPE_PUBLISHABLE_KEY` | ⭘ | Публичный ключ, если хотите переопределить дефолт |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Секрет вебхука (после создания endpoint) |
| `SUCCESS_URL` / `CANCEL_URL` | ⭘ | Кастомные редиректы после оплаты |
| `DAILY_FREE_LIMIT` | ⭘ | Кол-во бесплатных генераций (по умолчанию 5) |
| `AD_BONUS_GENERATIONS` | ⭘ | Сколько генераций возвращает просмотр рекламы (1) |

## 4. Supabase Database
Execute in Supabase SQL editor:
```sql
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  subscription_plan text default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  daily_generations integer default 0,
  last_generation_date date,
  ads_enabled boolean default true,
  created_at timestamptz default now()
);
```

Optional: add RPC or edge function to increment `daily_generations`.

### Webhook настройка
- В Stripe Dashboard → Developers → Webhooks → добавить endpoint (например, `https://vizom.netlify.app/.netlify/functions/stripe-webhook`).
- Подписать события: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
- Записать `Signing secret` в `STRIPE_WEBHOOK_SECRET`.

### Проверка локально
- Для локального теста Netlify Functions используйте `npx netlify dev` или `netlify dev --targetPort 5173`, убедившись, что env переменные доступны (можно создать `netlify.toml` и `.env` в каталоге).
- Квота/реклама: фронт вызывает `/.netlify/functions/check-quota` и `/.netlify/functions/watch-ad`. Если функции не задеплоены, фронт выдаст fallback (нет лимитов).

## 5. Generation Limits & Ads
- After checkout webhook updates the profile, ensure frontend fetches latest profile (e.g., call `/rest/v1/profiles?id=eq.<userId>`).
- In `scripts/pages/generator.js`, wire the quota check to call a backend endpoint that reads/increments `daily_generations`.
- Display ad banners only when `ads_enabled = true`. Example containers already exist; replace placeholders with real ad code.

Keep this document updated as new manual steps appear.
