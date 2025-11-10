---
trigger: manual
---

# 💻 VIZOM — THE AI VISUAL ENGINE

## 🎯 Goal
VIZOM is a minimalistic AI web platform for generating beautiful **data visuals**, **tables**, and **dashboards** instantly.

Our brand keyword: `Clean. Fast. Visual.`

## 🎨 Design Guidelines
- White minimalist UI.
- TailwindCSS via CDN.
- Use **San Francisco / Inter** fonts.
- Keep all buttons and inputs clean, rounded, and with subtle shadows.
- Do not overload with gradients or animations.

## 🧱 Tech Stack
- HTML + TailwindCSS + Vanilla JS
- Supabase (Auth + Database)
- Optional: API integration with DeepSeek / OpenAI for generation logic

## ⚙️ Functional Rules
1. Each new feature must integrate cleanly into the homepage or `/tools` subpage.
2. Add clear CTA buttons (Generate, Download, Save).
3. Keep responses instant; use lightweight JS.
4. Backend calls must go through Supabase edge functions (secure endpoints).
5. Cache previous results (localStorage).

## 🔒 Auth Rules
- Simple **Google Sign-In** via Supabase.
- If user not logged in, allow preview only (3 free generations).
- Store user projects under `profiles/{user_id}/tables`.

## 🌍 Localization
Support EN, RU, KZ, TR, PT, DE.
Use i18n JSON files for translations.

## 📈 Monetization
- Basic free plan (limited requests/day)
- Paid plan (subscription 2.99$) via Stripe 

## ✅ UX Rules
- Always show a progress state (“Generating…”)
- Allow easy copy/download in JPG, PNG, CSV,pdf.
- Show watermark “VIZOM.AI” on free-tier images.

## 📁 Folder Structure
/public
/src
/assets
/scripts
/styles
/components
/docs

## 🚀 Deployment
- Hosted on **Netrflify**
- Connected to **Supabase project**
- SEO optimized for “AI table generator”, “AI chart maker”



