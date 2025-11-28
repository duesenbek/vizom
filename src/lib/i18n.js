'use strict';

(function () {
  const DEFAULT_LANG = 'en';
  // Map app languages to ISO 3166-1 alpha-2 country codes for flag-icons
  const FLAG_CODE = {
    en: 'us',
    kk: 'kz',
    ru: 'ru',
    es: 'es',
    pt: 'br',
    tr: 'tr',
    fr: 'fr',
    pl: 'pl'
  };

  // Language names for display
  const LANGUAGE_NAMES = {
    en: 'English',
    ru: 'Русский',
    kk: 'Қазақша',
    tr: 'Türkçe',
    pt: 'Português',
    es: 'Español',
    fr: 'Français',
    pl: 'Polski'
  };

  // Minimal translations object; others fall back to EN
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.generator': 'Generator',
      'nav.templates': 'Templates',
      'nav.docs': 'Docs',
      'nav.pricing': 'Pricing',
      'nav.startShort': 'Start',
      'hero.title': 'Design premium dashboards with natural language',
      'hero.subtitle': 'Describe your data vision and Vizom crafts a production-ready visualization with advanced layouts, premium styling, and export-ready assets in seconds.',
      'hero.primaryButton': 'Start Building Free',
      'hero.secondaryButton': 'Explore Features',
      'hero.tiles.responsive': 'Responsive charts',
      'hero.tiles.tables': 'Tables and CSV export',
      'hero.tiles.dashboards': 'Dashboards in minutes',
      'quickStart.placeholder': 'Try: Compare 2023 vs 2024 revenue with growth delta and trendline',
      'quickStart.button': 'Create',
      'quickStart.hint': 'Instant AI charts. No onboarding, no credit card.',
      'how.title': 'How it works',
      'how.subtitle': '4 simple steps to your finished visualization',
      'how.step1.title': 'Describe your data',
      'how.step1.desc': 'Paste text, CSV, or a short description.',
      'how.step2.title': 'Smart parsing',
      'how.step2.desc': 'We automatically structure messy data.',
      'how.step3.title': 'Visual generation',
      'how.step3.desc': 'AI builds your chart, table, or dashboard.',
      'how.step4.title': 'Export & share',
      'how.step4.desc': 'Download PNG/PDF or embed it in your site.',
      'generator.preview.title': 'Preview',
      'generator.preview.status': 'Live',
      'generator.preview.generate': 'Generate',
      'generator.preview.download': 'Download',
      'generator.preview.loading': 'Generating your visual…',
      'generator.preview.emptyTitle': 'Your visual will appear here',
      'generator.preview.emptySubtitle': 'Select a chart type and enter your data to get started',
      'generator.smartParse': 'Smart Parse',
      'generator.export.title': 'Export Format',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Settings',
      'generator.settings.theme.label': 'Theme',
      'generator.settings.animation.label': 'Animation',
      'generator.chartSection.title': 'Select Chart Type',
      'generator.chartTypes.custom': 'Custom',
      'generator.chartTypes.bar': 'Bar Chart',
      'generator.chartDescriptions.bar': 'Compare values',
      'generator.chartTypes.line': 'Line Chart',
      'generator.chartDescriptions.line': 'Show trends',
      'generator.chartTypes.pie': 'Pie Chart',
      'generator.chartDescriptions.pie': 'Show parts',
      'generator.chartTypes.table': 'Table',
      'generator.chartDescriptions.table': 'Structured data',
      'generator.chartTypes.dashboard': 'Dashboard',
      'generator.chartDescriptions.dashboard': 'Multiple views',

      // Templates page
      'templates.header.title': 'Template Gallery',
      'templates.header.subtitle': 'Start with a professional template and customize it to your needs',
      'templates.favorites.title': 'Favorite Templates',
      'templates.favorites.manage': 'Manage',
      'templates.sidebar.view': 'View',
      'templates.sidebar.categories': 'Categories',
      'templates.sidebar.all': 'All templates',
      'templates.sidebar.business': 'Business',
      'templates.sidebar.academic': 'Academic',
      'templates.sidebar.marketing': 'Marketing',
      'templates.sidebar.sort': 'Sort',
      'templates.cards.use': 'Use',
      'templates.cards.preview': 'Preview',
      'templates.cards.details': 'Details',

      // Auth
      'auth.signIn': 'Sign In',
      'auth.signOut': 'Sign Out',
      'auth.getStarted': 'Get Started',
      'auth.title': 'Sign In to VIZOM',
      'auth.description': 'Sign in with Google to access the visualization generator.',
      'auth.continueWithGoogle': 'Continue with Google',

      // Hero section (index page)
      'hero.generateChart': 'Generate Chart',
      'hero.security': 'Enterprise-grade security',
      'hero.speed': '10× faster than manual design',

      // Features section
      'features.title': 'Powerful automation for modern teams',
      'features.subtitle': 'Vizom blends AI-driven insights with a premium Chart.js engine, so your dashboards feel bespoke—not boilerplate.',
      'features.card1.title': 'Context-aware charting',
      'features.card1.desc': 'Natural language prompts become polished Chart.js configs with smart annotations, legends, and responsive layouts.',
      'features.card2.title': 'Design-grade themes',
      'features.card2.desc': 'Premium palettes, cohesive typography, and glassmorphism surfaces designed to impress stakeholders and leadership.',
      'features.card3.title': 'Enterprise delivery',
      'features.card3.desc': 'Export high-resolution assets, embed responsive code snippets, and sync analytics events with one click.',
      'features.exploreThemes': 'Explore themes',
      'features.startExporting': 'Start exporting',

      // Examples section
      'examples.title': 'See what you can create',
      'examples.subtitle': 'Click any example to instantly generate it in the editor',

      // Common
      'common.learnMore': 'Learn more',
      'common.close': 'Close',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.loading': 'Loading...'
    },

    // Russian
    ru: {
      'nav.home': 'Главная',
      'nav.generator': 'Генератор',
      'nav.templates': 'Шаблоны',
      'nav.docs': 'Документация',
      'nav.pricing': 'Цены',
      'nav.startShort': 'Старт',
      'hero.title': 'Создавайте премиум-дашборды на естественном языке',
      'hero.subtitle': 'Опишите свою идею — Vizom создаст готовую визуализацию с продвинутыми макетами, премиальным стилем и экспортом за секунды.',
      'hero.primaryButton': 'Начать бесплатно',
      'hero.secondaryButton': 'Возможности',
      'hero.tiles.responsive': 'Адаптивные диаграммы',
      'hero.tiles.tables': 'Таблицы и CSV экспорт',
      'hero.tiles.dashboards': 'Дашборды за минуты',
      'quickStart.placeholder': 'Попробуйте: Сравни выручку 2023 и 2024 с дельтой роста и трендом',
      'quickStart.button': 'Создать',
      'quickStart.hint': 'Мгновенные AI-графики. Без регистрации, без карты.',
      'how.title': 'Как это работает',
      'how.subtitle': '4 простых шага к вашей визуализации',
      'how.step1.title': 'Опишите данные',
      'how.step1.desc': 'Вставьте текст, CSV или краткое описание.',
      'how.step2.title': 'Умный парсинг',
      'how.step2.desc': 'Мы автоматически структурируем данные.',
      'how.step3.title': 'Генерация визуала',
      'how.step3.desc': 'ИИ создаёт диаграмму, таблицу или дашборд.',
      'how.step4.title': 'Экспорт и публикация',
      'how.step4.desc': 'Скачайте PNG/PDF или встройте на сайт.',
      'generator.preview.title': 'Предпросмотр',
      'generator.preview.status': 'Онлайн',
      'generator.preview.generate': 'Создать',
      'generator.preview.download': 'Скачать',
      'generator.preview.loading': 'Создаём визуализацию…',
      'generator.preview.emptyTitle': 'Здесь появится ваша визуализация',
      'generator.preview.emptySubtitle': 'Выберите тип диаграммы и введите данные',
      'generator.smartParse': 'Умный парсинг',
      'generator.export.title': 'Формат экспорта',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Настройки',
      'generator.settings.theme.label': 'Тема',
      'generator.settings.animation.label': 'Анимация',
      'generator.chartSection.title': 'Выберите тип диаграммы',
      'generator.chartTypes.custom': 'Свой',
      'generator.chartTypes.bar': 'Столбчатая',
      'generator.chartDescriptions.bar': 'Сравнение значений',
      'generator.chartTypes.line': 'Линейная',
      'generator.chartDescriptions.line': 'Показать тренды',
      'generator.chartTypes.pie': 'Круговая',
      'generator.chartDescriptions.pie': 'Показать доли',
      'generator.chartTypes.table': 'Таблица',
      'generator.chartDescriptions.table': 'Структурированные данные',
      'generator.chartTypes.dashboard': 'Дашборд',
      'generator.chartDescriptions.dashboard': 'Несколько видов',
      'templates.header.title': 'Галерея шаблонов',
      'templates.header.subtitle': 'Начните с профессионального шаблона и настройте его',
      'templates.favorites.title': 'Избранные шаблоны',
      'templates.favorites.manage': 'Управление',
      'templates.sidebar.view': 'Вид',
      'templates.sidebar.categories': 'Категории',
      'templates.sidebar.all': 'Все шаблоны',
      'templates.sidebar.business': 'Бизнес',
      'templates.sidebar.academic': 'Академические',
      'templates.sidebar.marketing': 'Маркетинг',
      'templates.sidebar.sort': 'Сортировка',
      'templates.cards.use': 'Использовать',
      'templates.cards.preview': 'Предпросмотр',
      'templates.cards.details': 'Подробнее',

      // Auth
      'auth.signIn': 'Войти',
      'auth.signOut': 'Выйти',
      'auth.getStarted': 'Начать',
      'auth.title': 'Вход в VIZOM',
      'auth.description': 'Войдите через Google для доступа к генератору визуализаций.',
      'auth.continueWithGoogle': 'Продолжить с Google',

      // Hero section
      'hero.generateChart': 'Создать диаграмму',
      'hero.security': 'Корпоративная безопасность',
      'hero.speed': 'В 10 раз быстрее ручного дизайна',

      // Features section
      'features.title': 'Мощная автоматизация для современных команд',
      'features.subtitle': 'Vizom сочетает ИИ-аналитику с премиальным движком Chart.js, чтобы ваши дашборды выглядели уникально.',
      'features.card1.title': 'Контекстные диаграммы',
      'features.card1.desc': 'Запросы на естественном языке превращаются в готовые конфигурации Chart.js с аннотациями и адаптивной версткой.',
      'features.card2.title': 'Дизайнерские темы',
      'features.card2.desc': 'Премиальные палитры, единая типографика и стеклянные поверхности для впечатляющих презентаций.',
      'features.card3.title': 'Корпоративная доставка',
      'features.card3.desc': 'Экспорт в высоком разрешении, встраиваемые сниппеты и синхронизация аналитики в один клик.',
      'features.exploreThemes': 'Смотреть темы',
      'features.startExporting': 'Начать экспорт',

      // Examples section
      'examples.title': 'Посмотрите, что можно создать',
      'examples.subtitle': 'Нажмите на пример, чтобы сразу сгенерировать его в редакторе',

      // Common
      'common.learnMore': 'Подробнее',
      'common.close': 'Закрыть',
      'common.save': 'Сохранить',
      'common.cancel': 'Отмена',
      'common.delete': 'Удалить',
      'common.edit': 'Редактировать',
      'common.loading': 'Загрузка...'
    },

    // Kazakh
    kk: {
      'nav.home': 'Басты бет',
      'nav.generator': 'Генератор',
      'nav.templates': 'Үлгілер',
      'nav.docs': 'Құжаттама',
      'nav.pricing': 'Бағалар',
      'nav.startShort': 'Бастау',
      'hero.title': 'Табиғи тілде премиум дэшбордтар жасаңыз',
      'hero.subtitle': 'Идеяңызды сипаттаңыз — Vizom дайын визуализацияны жетілдірілген макеттермен, премиум стильмен және экспортпен секундтарда жасайды.',
      'hero.primaryButton': 'Тегін бастау',
      'hero.secondaryButton': 'Мүмкіндіктер',
      'hero.tiles.responsive': 'Бейімделгіш диаграммалар',
      'hero.tiles.tables': 'Кестелер және CSV экспорт',
      'hero.tiles.dashboards': 'Дэшбордтар минуттарда',
      'quickStart.placeholder': 'Көріңіз: 2023 пен 2024 табысын өсу дельтасы мен трендпен салыстыр',
      'quickStart.button': 'Жасау',
      'quickStart.hint': 'Лезде AI-графиктер. Тіркелусіз, картасыз.',
      'how.title': 'Қалай жұмыс істейді',
      'how.subtitle': '4 қарапайым қадам',
      'how.step1.title': 'Деректерді сипаттаңыз',
      'how.step1.desc': 'Мәтін, CSV не қысқа сипаттама.',
      'how.step2.title': 'Ақылды талдау',
      'how.step2.desc': 'Деректерді өзіміз құрылымдаймыз.',
      'how.step3.title': 'Визуал жасау',
      'how.step3.desc': 'ИИ график, кесте не дэшборд құрады.',
      'how.step4.title': 'Экспорт және бөлісу',
      'how.step4.desc': 'PNG/PDF жүктеп алыңыз немесе ендіріңіз.',
      'generator.preview.title': 'Алдын ала қарау',
      'generator.preview.status': 'Онлайн',
      'generator.preview.generate': 'Генерациялау',
      'generator.preview.download': 'Жүктеу',
      'generator.preview.loading': 'Визуал жасалуда…',
      'generator.preview.emptyTitle': 'Визуал осында пайда болады',
      'generator.preview.emptySubtitle': 'График түрін таңдап, дерек енгізіңіз',
      'generator.smartParse': 'Ақылды талдау',
      'generator.export.title': 'Экспорт пішімі',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Баптаулар',
      'generator.settings.theme.label': 'Тема',
      'generator.settings.animation.label': 'Анимация',
      'generator.chartSection.title': 'График түрін таңдаңыз',
      'generator.chartTypes.custom': 'Еркін',
      'generator.chartTypes.bar': 'Бағанды',
      'generator.chartDescriptions.bar': 'Мәндерді салыстыру',
      'generator.chartTypes.line': 'Сызықтық',
      'generator.chartDescriptions.line': 'Трендтер',
      'generator.chartTypes.pie': 'Дөңгелек',
      'generator.chartDescriptions.pie': 'Үлестер',
      'generator.chartTypes.table': 'Кесте',
      'generator.chartDescriptions.table': 'Құрылымды дерек',
      'generator.chartTypes.dashboard': 'Дэшборд',
      'generator.chartDescriptions.dashboard': 'Көп көрініс',
      'templates.header.title': 'Үлгілер галереясы',
      'templates.header.subtitle': 'Кәсіби үлгіден бастап, өзіңізге сай реттеңіз',
      'templates.favorites.title': 'Таңдаулы үлгілер',
      'templates.favorites.manage': 'Басқару',
      'templates.sidebar.view': 'Көрініс',
      'templates.sidebar.categories': 'Санаттар',
      'templates.sidebar.all': 'Барлық үлгілер',
      'templates.sidebar.business': 'Бизнес',
      'templates.sidebar.academic': 'Академиялық',
      'templates.sidebar.marketing': 'Маркетинг',
      'templates.sidebar.sort': 'Сұрыптау',
      'templates.cards.use': 'Қолдану',
      'templates.cards.preview': 'Алдын қарау',
      'templates.cards.details': 'Егжей-тегжей'
    },

    // Spanish
    es: {
      'nav.home': 'Inicio',
      'nav.generator': 'Generador',
      'nav.templates': 'Plantillas',
      'nav.docs': 'Docs',
      'nav.startShort': 'Empezar',
      'hero.title': 'Crea gráficos, tablas y paneles en segundos',
      'hero.subtitle': 'VIZOM convierte tus ideas en visuales listos para producción al instante.',
      'hero.primaryButton': 'Comenzar gratis',
      'hero.secondaryButton': 'Explorar funciones',
      'hero.tiles.responsive': 'Gráficos responsivos',
      'hero.tiles.tables': 'Tablas y exportación CSV',
      'hero.tiles.dashboards': 'Paneles en minutos',
      'quickStart.placeholder': 'Por ejemplo: Crea un gráfico de barras mensual...',
      'quickStart.button': 'Crear',
      'quickStart.hint': 'Admite texto, CSV y listas. Detectamos el tipo de datos automáticamente.',
      'how.title': 'Cómo funciona',
      'how.subtitle': '4 pasos simples',
      'how.step1.title': 'Describe tus datos',
      'how.step1.desc': 'Pega texto, CSV o una breve descripción.',
      'how.step2.title': 'Análisis inteligente',
      'how.step2.desc': 'Estructuramos los datos automáticamente.',
      'how.step3.title': 'Generación visual',
      'how.step3.desc': 'La IA construye tu gráfico, tabla o panel.',
      'how.step4.title': 'Exportar y compartir',
      'how.step4.desc': 'Descarga PNG/PDF o incrústalo.',
      'generator.preview.title': 'Vista previa',
      'generator.preview.status': 'En vivo',
      'generator.preview.generate': 'Generar',
      'generator.preview.download': 'Descargar',
      'generator.preview.loading': 'Generando…',
      'generator.preview.emptyTitle': 'Tu visual aparecerá aquí',
      'generator.preview.emptySubtitle': 'Selecciona un tipo de gráfico e ingresa tus datos',
      'generator.smartParse': 'Análisis inteligente',
      'generator.export.title': 'Formato de exportación',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Ajustes',
      'generator.settings.theme.label': 'Tema',
      'generator.settings.animation.label': 'Animación',
      'generator.chartSection.title': 'Selecciona tipo de gráfico',
      'generator.chartTypes.custom': 'Personalizado',
      'generator.chartTypes.bar': 'Barras',
      'generator.chartDescriptions.bar': 'Comparar valores',
      'generator.chartTypes.line': 'Líneas',
      'generator.chartDescriptions.line': 'Mostrar tendencias',
      'generator.chartTypes.pie': 'Circular',
      'generator.chartDescriptions.pie': 'Partes',
      'generator.chartTypes.table': 'Tabla',
      'generator.chartDescriptions.table': 'Datos estructurados',
      'generator.chartTypes.dashboard': 'Panel',
      'generator.chartDescriptions.dashboard': 'Múltiples vistas',
      'templates.header.title': 'Galería de plantillas',
      'templates.header.subtitle': 'Empieza con una plantilla profesional y personalízala',
      'templates.favorites.title': 'Plantillas favoritas',
      'templates.favorites.manage': 'Gestionar',
      'templates.sidebar.view': 'Vista',
      'templates.sidebar.categories': 'Categorías',
      'templates.sidebar.all': 'Todas las plantillas',
      'templates.sidebar.business': 'Negocios',
      'templates.sidebar.academic': 'Académico',
      'templates.sidebar.marketing': 'Marketing',
      'templates.sidebar.sort': 'Ordenar',
      'templates.cards.use': 'Usar',
      'templates.cards.preview': 'Vista previa',
      'templates.cards.details': 'Detalles'
    },

    // Portuguese
    pt: {
      'nav.home': 'Início',
      'nav.generator': 'Gerador',
      'nav.templates': 'Modelos',
      'nav.docs': 'Docs',
      'nav.startShort': 'Começar',
      'hero.title': 'Crie gráficos, tabelas e dashboards em segundos',
      'hero.subtitle': 'VIZOM transforma ideias em visuais prontos instantaneamente.',
      'hero.primaryButton': 'Começar grátis',
      'hero.secondaryButton': 'Explorar recursos',
      'hero.tiles.responsive': 'Gráficos responsivos',
      'hero.tiles.tables': 'Tabelas e exportação CSV',
      'hero.tiles.dashboards': 'Dashboards em minutos',
      'quickStart.placeholder': 'Ex.: Crie um gráfico de barras mensal...',
      'quickStart.button': 'Criar',
      'quickStart.hint': 'Suporta texto, CSV e listas. Detectamos automaticamente.',
      'how.title': 'Como funciona',
      'how.subtitle': '4 passos simples',
      'how.step1.title': 'Descreva seus dados',
      'how.step1.desc': 'Cole texto, CSV ou uma breve descrição.',
      'how.step2.title': 'Análise inteligente',
      'how.step2.desc': 'Estruturamos os dados automaticamente.',
      'how.step3.title': 'Geração visual',
      'how.step3.desc': 'A IA cria seu gráfico, tabela ou dashboard.',
      'how.step4.title': 'Exportar e compartilhar',
      'how.step4.desc': 'Baixe PNG/PDF ou incorpore.',
      'generator.preview.title': 'Pré-visualização',
      'generator.preview.status': 'Ao vivo',
      'generator.preview.generate': 'Gerar',
      'generator.preview.download': 'Baixar',
      'generator.preview.loading': 'Gerando…',
      'generator.preview.emptyTitle': 'Seu visual aparecerá aqui',
      'generator.preview.emptySubtitle': 'Selecione um tipo e insira seus dados',
      'generator.smartParse': 'Análise inteligente',
      'generator.export.title': 'Formato de exportação',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Configurações',
      'generator.settings.theme.label': 'Tema',
      'generator.settings.animation.label': 'Animação',
      'generator.chartSection.title': 'Selecione o tipo de gráfico',
      'generator.chartTypes.custom': 'Personalizado',
      'generator.chartTypes.bar': 'Barras',
      'generator.chartDescriptions.bar': 'Comparar valores',
      'generator.chartTypes.line': 'Linhas',
      'generator.chartDescriptions.line': 'Tendências',
      'generator.chartTypes.pie': 'Pizza',
      'generator.chartDescriptions.pie': 'Partes',
      'generator.chartTypes.table': 'Tabela',
      'generator.chartDescriptions.table': 'Dados estruturados',
      'generator.chartTypes.dashboard': 'Dashboard',
      'generator.chartDescriptions.dashboard': 'Múltiplas vistas',
      'templates.header.title': 'Galeria de modelos',
      'templates.header.subtitle': 'Comece com um modelo profissional e personalize',
      'templates.favorites.title': 'Modelos favoritos',
      'templates.favorites.manage': 'Gerenciar',
      'templates.sidebar.view': 'Visualização',
      'templates.sidebar.categories': 'Categorias',
      'templates.sidebar.all': 'Todos os modelos',
      'templates.sidebar.business': 'Negócios',
      'templates.sidebar.academic': 'Acadêmico',
      'templates.sidebar.marketing': 'Marketing',
      'templates.sidebar.sort': 'Ordenar',
      'templates.cards.use': 'Usar',
      'templates.cards.preview': 'Pré-visualizar',
      'templates.cards.details': 'Detalhes'
    },

    // Turkish
    tr: {
      'nav.home': 'Ana sayfa',
      'nav.generator': 'Oluşturucu',
      'nav.templates': 'Şablonlar',
      'nav.docs': 'Dokümanlar',
      'nav.startShort': 'Başlat',
      'hero.title': 'Saniyeler içinde grafikler, tablolar ve panolar oluşturun',
      'hero.subtitle': 'VIZOM fikirlerinizi anında üretim hazır görsellere dönüştürür.',
      'hero.primaryButton': 'Ücretsiz başla',
      'hero.secondaryButton': 'Özellikleri keşfet',
      'hero.tiles.responsive': 'Duyarlı grafikler',
      'hero.tiles.tables': 'Tablolar ve CSV dışa aktarma',
      'hero.tiles.dashboards': 'Dakikalar içinde panolar',
      'quickStart.placeholder': 'Örn: Aylık satış çubuk grafiği oluştur…',
      'quickStart.button': 'Oluştur',
      'quickStart.hint': 'Metin, CSV ve listeler desteklenir. Veri türünü otomatik algılarız.',
      'how.title': 'Nasıl çalışır',
      'how.subtitle': '4 basit adım',
      'how.step1.title': 'Verini açıkla',
      'how.step1.desc': 'Metin, CSV veya kısa açıklama.',
      'how.step2.title': 'Akıllı ayrıştırma',
      'how.step2.desc': 'Veriyi otomatik yapılandırırız.',
      'how.step3.title': 'Görsel üretimi',
      'how.step3.desc': 'YZ grafik, tablo veya pano oluşturur.',
      'how.step4.title': 'Dışa aktar ve paylaş',
      'how.step4.desc': 'PNG/PDF indir veya yerleştir.',
      'generator.preview.title': 'Önizleme',
      'generator.preview.status': 'Canlı',
      'generator.preview.generate': 'Oluştur',
      'generator.preview.download': 'İndir',
      'generator.preview.loading': 'Oluşturuluyor…',
      'generator.preview.emptyTitle': 'Görsel burada görünecek',
      'generator.preview.emptySubtitle': 'Grafik türünü seç ve verini gir',
      'generator.smartParse': 'Akıllı ayrıştırma',
      'generator.export.title': 'Dışa aktarma biçimi',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Ayarlar',
      'generator.settings.theme.label': 'Tema',
      'generator.settings.animation.label': 'Animasyon',
      'generator.chartSection.title': 'Grafik türünü seç',
      'generator.chartTypes.custom': 'Özel',
      'generator.chartTypes.bar': 'Çubuk',
      'generator.chartDescriptions.bar': 'Değerleri karşılaştır',
      'generator.chartTypes.line': 'Çizgi',
      'generator.chartDescriptions.line': 'Eğilimleri göster',
      'generator.chartTypes.pie': 'Pasta',
      'generator.chartDescriptions.pie': 'Parçalar',
      'generator.chartTypes.table': 'Tablo',
      'generator.chartDescriptions.table': 'Yapılandırılmış veri',
      'generator.chartTypes.dashboard': 'Pano',
      'generator.chartDescriptions.dashboard': 'Birden çok görünüm',
      'templates.header.title': 'Şablon Galerisi',
      'templates.header.subtitle': 'Profesyonel bir şablonla başlayın ve özelleştirin',
      'templates.favorites.title': 'Favori şablonlar',
      'templates.favorites.manage': 'Yönet',
      'templates.sidebar.view': 'Görünüm',
      'templates.sidebar.categories': 'Kategoriler',
      'templates.sidebar.all': 'Tüm şablonlar',
      'templates.sidebar.business': 'İş',
      'templates.sidebar.academic': 'Akademik',
      'templates.sidebar.marketing': 'Pazarlama',
      'templates.sidebar.sort': 'Sırala',
      'templates.cards.use': 'Kullan',
      'templates.cards.preview': 'Önizleme',
      'templates.cards.details': 'Detaylar'
    },

    // French
    fr: {
      'nav.home': 'Accueil',
      'nav.generator': 'Générateur',
      'nav.templates': 'Modèles',
      'nav.docs': 'Docs',
      'nav.startShort': 'Démarrer',
      'nav.pricing': 'Tarifs',
      'hero.title': 'Créez des graphiques, tableaux et tableaux de bord en quelques secondes',
      'hero.subtitle': 'VIZOM transforme vos idées en visuels prêts à l\'emploi instantanément.',
      'hero.primaryButton': 'Commencer gratuitement',
      'hero.secondaryButton': 'Explorer les fonctionnalités',
      'hero.tiles.responsive': 'Graphiques adaptatifs',
      'hero.tiles.tables': 'Tableaux et export CSV',
      'hero.tiles.dashboards': 'Tableaux de bord en minutes',
      'quickStart.placeholder': 'Ex: Créez un graphique à barres mensuel...',
      'quickStart.button': 'Créer',
      'quickStart.hint': 'Prend en charge le texte, CSV et les listes. Détection automatique.',
      'how.title': 'Comment ça marche',
      'how.subtitle': '4 étapes simples',
      'how.step1.title': 'Décrivez vos données',
      'how.step1.desc': 'Collez du texte, CSV ou une brève description.',
      'how.step2.title': 'Analyse intelligente',
      'how.step2.desc': 'Nous structurons les données automatiquement.',
      'how.step3.title': 'Génération visuelle',
      'how.step3.desc': 'L\'IA crée votre graphique, tableau ou dashboard.',
      'how.step4.title': 'Exporter et partager',
      'how.step4.desc': 'Téléchargez PNG/PDF ou intégrez.',
      'generator.preview.title': 'Aperçu',
      'generator.preview.status': 'En direct',
      'generator.preview.generate': 'Générer',
      'generator.preview.download': 'Télécharger',
      'generator.preview.loading': 'Génération en cours…',
      'generator.preview.emptyTitle': 'Votre visuel apparaîtra ici',
      'generator.preview.emptySubtitle': 'Sélectionnez un type et entrez vos données',
      'generator.smartParse': 'Analyse intelligente',
      'generator.export.title': 'Format d\'export',
      'generator.chartSection.title': 'Sélectionnez le type de graphique',
      'generator.chartTypes.bar': 'Barres',
      'generator.chartTypes.line': 'Lignes',
      'generator.chartTypes.pie': 'Camembert',
      'generator.chartTypes.table': 'Tableau',
      'generator.chartTypes.dashboard': 'Dashboard',
      'templates.header.title': 'Galerie de modèles',
      'templates.header.subtitle': 'Commencez avec un modèle professionnel',
      'auth.signIn': 'Connexion',
      'auth.signOut': 'Déconnexion',
      'auth.getStarted': 'Commencer',
      'pricing.title': 'Choisissez votre plan',
      'pricing.free': 'Gratuit',
      'pricing.pro': 'Pro',
      'pricing.allChartTypes': 'Tous les types de graphiques',
      'pricing.templates': 'modèles',
      'pricing.aiGenerations': 'Générations IA',
      'pricing.perDay': '/jour',
      'pricing.unlimited': 'Illimité',
      'pricing.export': 'Export',
      'pricing.withWatermark': 'avec filigrane',
      'pricing.noWatermark': 'sans filigrane',
      'pricing.cloudStorage': 'Stockage cloud',
      'pricing.prioritySupport': 'Support prioritaire',
      'common.learnMore': 'En savoir plus',
      'common.close': 'Fermer',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler'
    },

    // Polish
    pl: {
      'nav.home': 'Strona główna',
      'nav.generator': 'Generator',
      'nav.templates': 'Szablony',
      'nav.docs': 'Dokumentacja',
      'nav.startShort': 'Start',
      'nav.pricing': 'Cennik',
      'hero.title': 'Twórz wykresy, tabele i dashboardy w kilka sekund',
      'hero.subtitle': 'VIZOM zamienia Twoje pomysły w gotowe wizualizacje natychmiast.',
      'hero.primaryButton': 'Zacznij za darmo',
      'hero.secondaryButton': 'Poznaj funkcje',
      'hero.tiles.responsive': 'Responsywne wykresy',
      'hero.tiles.tables': 'Tabele i eksport CSV',
      'hero.tiles.dashboards': 'Dashboardy w minuty',
      'quickStart.placeholder': 'Np.: Stwórz wykres słupkowy sprzedaży miesięcznej...',
      'quickStart.button': 'Utwórz',
      'quickStart.hint': 'Obsługuje tekst, CSV i listy. Automatyczne wykrywanie.',
      'how.title': 'Jak to działa',
      'how.subtitle': '4 proste kroki',
      'how.step1.title': 'Opisz swoje dane',
      'how.step1.desc': 'Wklej tekst, CSV lub krótki opis.',
      'how.step2.title': 'Inteligentna analiza',
      'how.step2.desc': 'Automatycznie strukturyzujemy dane.',
      'how.step3.title': 'Generowanie wizualne',
      'how.step3.desc': 'AI tworzy wykres, tabelę lub dashboard.',
      'how.step4.title': 'Eksportuj i udostępnij',
      'how.step4.desc': 'Pobierz PNG/PDF lub osadź.',
      'generator.preview.title': 'Podgląd',
      'generator.preview.status': 'Na żywo',
      'generator.preview.generate': 'Generuj',
      'generator.preview.download': 'Pobierz',
      'generator.preview.loading': 'Generowanie…',
      'generator.preview.emptyTitle': 'Twoja wizualizacja pojawi się tutaj',
      'generator.preview.emptySubtitle': 'Wybierz typ i wprowadź dane',
      'generator.smartParse': 'Inteligentna analiza',
      'generator.export.title': 'Format eksportu',
      'generator.chartSection.title': 'Wybierz typ wykresu',
      'generator.chartTypes.bar': 'Słupkowy',
      'generator.chartTypes.line': 'Liniowy',
      'generator.chartTypes.pie': 'Kołowy',
      'generator.chartTypes.table': 'Tabela',
      'generator.chartTypes.dashboard': 'Dashboard',
      'templates.header.title': 'Galeria szablonów',
      'templates.header.subtitle': 'Zacznij od profesjonalnego szablonu',
      'auth.signIn': 'Zaloguj się',
      'auth.signOut': 'Wyloguj się',
      'auth.getStarted': 'Rozpocznij',
      'pricing.title': 'Wybierz plan',
      'pricing.free': 'Darmowy',
      'pricing.pro': 'Pro',
      'pricing.allChartTypes': 'Wszystkie typy wykresów',
      'pricing.templates': 'szablonów',
      'pricing.aiGenerations': 'Generacje AI',
      'pricing.perDay': '/dzień',
      'pricing.unlimited': 'Bez limitu',
      'pricing.export': 'Eksport',
      'pricing.withWatermark': 'ze znakiem wodnym',
      'pricing.noWatermark': 'bez znaku wodnego',
      'pricing.cloudStorage': 'Chmura',
      'pricing.prioritySupport': 'Priorytetowe wsparcie',
      'common.learnMore': 'Dowiedz się więcej',
      'common.close': 'Zamknij',
      'common.save': 'Zapisz',
      'common.cancel': 'Anuluj'
    }
  };

  function getLang() {
    // Force English by default; use saved lang if present
    const saved = localStorage.getItem('vizom_lang');
    return saved || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem('vizom_lang', lang);
    applyTranslations(lang);
    updateFlag(lang);
    // Set document language
    try { document.documentElement.setAttribute('lang', lang); } catch (e) {}
    // Mark selected flag
    document.querySelectorAll('.language-option').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  function updateFlag(lang) {
    const el = document.getElementById('language-flag');
    const FLAG_EMOJI = {
      en: '🇺🇸',
      ru: '🇷🇺',
      kk: '🇰🇿',
      tr: '🇹🇷',
      pt: '🇧🇷',
      es: '🇪🇸',
      fr: '🇫🇷',
      pl: '🇵🇱'
    };
    if (el) el.textContent = FLAG_EMOJI[lang] || FLAG_EMOJI[DEFAULT_LANG];
  }

  function t(key, lang) {
    const l = lang || getLang();
    const en = translations.en || {};
    const dict = (translations[l] || {});
    return (key in dict) ? dict[key] : (en[key] || '');
  }

  function applyTranslations(lang) {
    const current = lang || getLang();
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      const val = t(key, current);
      if (!val) return;
      
      // If no child elements, just set text
      if (node.childElementCount === 0) {
        node.textContent = val;
      } else {
        // Look for explicit text target first
        const textTarget = node.querySelector('[data-i18n-text]');
        if (textTarget) {
          textTarget.textContent = val;
        } else {
          // Find first text node and update it, preserving child elements
          const childNodes = Array.from(node.childNodes);
          let textNodeFound = false;
          for (const child of childNodes) {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
              child.textContent = val;
              textNodeFound = true;
              break;
            }
          }
          // If no text node found, look for span without data-i18n
          if (!textNodeFound) {
            const span = node.querySelector('span:not([data-i18n])');
            if (span && span.childElementCount === 0) {
              span.textContent = val;
            }
          }
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      const val = t(key, current);
      if (val) node.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-i18n-option]').forEach((node) => {
      const key = node.getAttribute('data-i18n-option');
      const val = t(key, current);
      if (val) node.textContent = val;
    });

    // Handle title/tooltip translations
    document.querySelectorAll('[data-i18n-title]').forEach((node) => {
      const key = node.getAttribute('data-i18n-title');
      const val = t(key, current);
      if (val) node.setAttribute('title', val);
    });

    // Handle aria-label translations
    document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
      const key = node.getAttribute('data-i18n-aria');
      const val = t(key, current);
      if (val) node.setAttribute('aria-label', val);
    });

    console.log('[i18n] Applied translations for:', current);
  }

  function initLanguageMenu() {
    const toggle = document.getElementById('language-toggle');
    const menu = document.getElementById('language-menu');
    if (!toggle || !menu) return;

    // Mark current language as active
    const currentLang = getLang();
    document.querySelectorAll('.language-option').forEach((btn) => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) {
        btn.classList.add('is-active', 'bg-blue-50');
      } else {
        btn.classList.remove('is-active', 'bg-blue-50');
      }
    });

    toggle.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    document.querySelectorAll('.language-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLang(lang);
        menu.classList.add('hidden');
      });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lang = getLang();
    applyTranslations(lang);
    updateFlag(lang);
    try { document.documentElement.setAttribute('lang', lang); } catch (e) {}
    initLanguageMenu();
  });

  // Expose minimal API for dynamic re-apply
  window.VIZOM_I18N = {
    apply: () => applyTranslations(getLang()),
    set: (l) => setLang(l),
    setLanguage: (l) => setLang(l), // Alias for compatibility
    get: () => getLang(),
    t: (key) => t(key, getLang())
  };
})();
