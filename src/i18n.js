'use strict';

(function () {
  const DEFAULT_LANG = 'en';
  const FLAG_MAP = {
    en: '🇺🇸',
    kk: '🇰🇿',
    ru: '🇷🇺',
    es: '🇪🇸',
    pt: '🇵🇹',
    tr: '🇹🇷',
    de: '🇩🇪'
  };

  // Minimal translations object; others fall back to EN
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.generator': 'Generator',
      'nav.templates': 'Templates',
      'nav.docs': 'Docs',
      'nav.startShort': 'Start',
      'hero.title': 'Build beautiful charts, tables, and dashboards in seconds',
      'hero.subtitle': 'VIZOM turns your ideas into production-ready visuals instantly. Describe what you want and get pixel-perfect results.',
      'hero.primaryButton': 'Start Building Free',
      'hero.secondaryButton': 'Explore Features',
      'hero.tiles.responsive': 'Responsive charts',
      'hero.tiles.tables': 'Tables and CSV export',
      'hero.tiles.dashboards': 'Dashboards in minutes',
      'quickStart.placeholder': 'For example: Create a monthly sales bar chart...',
      'quickStart.button': 'Create',
      'quickStart.hint': 'Supports text, CSV, and lists. We automatically detect the data type.',
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
      'templates.cards.details': 'Details'
    },

    // Russian
    ru: {
      'nav.home': 'Главная',
      'nav.generator': 'Генератор',
      'nav.templates': 'Шаблоны',
      'nav.docs': 'Документация',
      'nav.startShort': 'Старт',
      'hero.title': 'Создавайте красивые графики, таблицы и дашборды за секунды',
      'hero.subtitle': 'VIZOM мгновенно превращает ваши идеи в готовые визуализации. Опишите, что вам нужно, и получите точный результат.',
      'hero.primaryButton': 'Начать бесплатно',
      'hero.secondaryButton': 'Изучить возможности',
      'hero.tiles.responsive': 'Адаптивные графики',
      'hero.tiles.tables': 'Таблицы и экспорт CSV',
      'hero.tiles.dashboards': 'Дашборды за минуты',
      'quickStart.placeholder': 'Например: Построй столбчатую диаграмму месячных продаж...',
      'quickStart.button': 'Создать',
      'quickStart.hint': 'Поддерживаются текст, CSV и списки. Тип данных определяется автоматически.',
      'how.title': 'Как это работает',
      'how.subtitle': '4 простых шага к вашей визуализации',
      'how.step1.title': 'Опишите данные',
      'how.step1.desc': 'Вставьте текст, CSV или краткое описание.',
      'how.step2.title': 'Умный парсинг',
      'how.step2.desc': 'Мы автоматически структурируем данные.',
      'how.step3.title': 'Генерация визуала',
      'how.step3.desc': 'ИИ строит график, таблицу или дашборд.',
      'how.step4.title': 'Экспорт и общий доступ',
      'how.step4.desc': 'Скачайте PNG/PDF или вставьте на сайт.',
      'generator.preview.title': 'Предпросмотр',
      'generator.preview.status': 'В сети',
      'generator.preview.generate': 'Сгенерировать',
      'generator.preview.download': 'Скачать',
      'generator.preview.loading': 'Создаем визуал…',
      'generator.preview.emptyTitle': 'Здесь появится визуализация',
      'generator.preview.emptySubtitle': 'Выберите тип графика и введите данные',
      'generator.smartParse': 'Умный парсинг',
      'generator.export.title': 'Формат экспорта',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Настройки',
      'generator.settings.theme.label': 'Тема',
      'generator.settings.animation.label': 'Анимация',
      'generator.chartSection.title': 'Выберите тип графика',
      'generator.chartTypes.custom': 'Произвольный',
      'generator.chartTypes.bar': 'Столбчатая',
      'generator.chartDescriptions.bar': 'Сравнить значения',
      'generator.chartTypes.line': 'Линейная',
      'generator.chartDescriptions.line': 'Показать тренды',
      'generator.chartTypes.pie': 'Круговая',
      'generator.chartDescriptions.pie': 'Показать доли',
      'generator.chartTypes.table': 'Таблица',
      'generator.chartDescriptions.table': 'Структурированные данные',
      'generator.chartTypes.dashboard': 'Дашборд',
      'generator.chartDescriptions.dashboard': 'Несколько видов',
      'templates.header.title': 'Галерея шаблонов',
      'templates.header.subtitle': 'Начните с профессионального шаблона и настройте под себя',
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
      'templates.cards.details': 'Детали'
    },

    // Kazakh
    kk: {
      'nav.home': 'Басты бет',
      'nav.generator': 'Генератор',
      'nav.templates': 'Үлгілер',
      'nav.docs': 'Құжаттама',
      'nav.startShort': 'Бастау',
      'hero.title': 'Көркем диаграммалар, кестелер және дэшбордтарды секундтарда жасаңыз',
      'hero.subtitle': 'VIZOM идеяңызды дайын визуализацияға тез айналдырады. Не керегін сипаттаңыз – нәтижені бірден алыңыз.',
      'hero.primaryButton': 'Тегін бастау',
      'hero.secondaryButton': 'Мүмкіндіктер',
      'hero.tiles.responsive': 'Бейімделгіш диаграммалар',
      'hero.tiles.tables': 'Кестелер және CSV экспорт',
      'hero.tiles.dashboards': 'Дэшбордтар минуттарда',
      'quickStart.placeholder': 'Мысалы: Айлық сатылымдарға бағанды диаграмма құр...',
      'quickStart.button': 'Жасау',
      'quickStart.hint': 'Мәтін, CSV және тізімдер қолдау табады. Дерек түрі автоматты анықталады.',
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

    // German
    de: {
      'nav.home': 'Start',
      'nav.generator': 'Generator',
      'nav.templates': 'Vorlagen',
      'nav.docs': 'Doku',
      'nav.startShort': 'Start',
      'hero.title': 'Erstelle Diagramme, Tabellen und Dashboards in Sekunden',
      'hero.subtitle': 'VIZOM macht aus Ideen sofort produktionsreife Visuals.',
      'hero.primaryButton': 'Kostenlos starten',
      'hero.secondaryButton': 'Funktionen ansehen',
      'hero.tiles.responsive': 'Responsiv Diagramme',
      'hero.tiles.tables': 'Tabellen und CSV-Export',
      'hero.tiles.dashboards': 'Dashboards in Minuten',
      'quickStart.placeholder': 'Z. B.: Erstelle ein Monats-Balkendiagramm…',
      'quickStart.button': 'Erstellen',
      'quickStart.hint': 'Unterstützt Text, CSV und Listen. Automatische Erkennung.',
      'how.title': 'So funktioniert es',
      'how.subtitle': '4 einfache Schritte',
      'how.step1.title': 'Beschreibe deine Daten',
      'how.step1.desc': 'Füge Text, CSV oder eine Kurzbeschreibung ein.',
      'how.step2.title': 'Intelligentes Parsing',
      'how.step2.desc': 'Wir strukturieren die Daten automatisch.',
      'how.step3.title': 'Visualisierung',
      'how.step3.desc': 'KI erstellt Diagramm, Tabelle oder Dashboard.',
      'how.step4.title': 'Export & Teilen',
      'how.step4.desc': 'PNG/PDF herunterladen oder einbetten.',
      'generator.preview.title': 'Vorschau',
      'generator.preview.status': 'Live',
      'generator.preview.generate': 'Generieren',
      'generator.preview.download': 'Download',
      'generator.preview.loading': 'Wird erzeugt…',
      'generator.preview.emptyTitle': 'Dein Visual erscheint hier',
      'generator.preview.emptySubtitle': 'Diagrammtyp wählen und Daten eingeben',
      'generator.smartParse': 'Smart Parse',
      'generator.export.title': 'Exportformat',
      'generator.export.png': 'PNG',
      'generator.export.pdf': 'PDF',
      'generator.export.csv': 'CSV',
      'generator.export.svg': 'SVG',
      'generator.settings.title': 'Einstellungen',
      'generator.settings.theme.label': 'Thema',
      'generator.settings.animation.label': 'Animation',
      'generator.chartSection.title': 'Diagrammtyp wählen',
      'generator.chartTypes.custom': 'Benutzerdefiniert',
      'generator.chartTypes.bar': 'Balken',
      'generator.chartDescriptions.bar': 'Werte vergleichen',
      'generator.chartTypes.line': 'Linie',
      'generator.chartDescriptions.line': 'Trends zeigen',
      'generator.chartTypes.pie': 'Kreis',
      'generator.chartDescriptions.pie': 'Anteile',
      'generator.chartTypes.table': 'Tabelle',
      'generator.chartDescriptions.table': 'Strukturierte Daten',
      'generator.chartTypes.dashboard': 'Dashboard',
      'generator.chartDescriptions.dashboard': 'Mehrere Ansichten',
      'templates.header.title': 'Vorlagen-Galerie',
      'templates.header.subtitle': 'Starte mit einer Profi-Vorlage und passe sie an',
      'templates.favorites.title': 'Favoriten',
      'templates.favorites.manage': 'Verwalten',
      'templates.sidebar.view': 'Ansicht',
      'templates.sidebar.categories': 'Kategorien',
      'templates.sidebar.all': 'Alle Vorlagen',
      'templates.sidebar.business': 'Business',
      'templates.sidebar.academic': 'Akademisch',
      'templates.sidebar.marketing': 'Marketing',
      'templates.sidebar.sort': 'Sortieren',
      'templates.cards.use': 'Verwenden',
      'templates.cards.preview': 'Vorschau',
      'templates.cards.details': 'Details'
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
    if (el) el.textContent = FLAG_MAP[lang] || FLAG_MAP[DEFAULT_LANG];
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
      if (node.childElementCount === 0) {
        node.textContent = val;
      } else {
        const textTarget = node.querySelector('[data-i18n-text]');
        if (textTarget) {
          textTarget.textContent = val;
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
  }

  function initLanguageMenu() {
    const toggle = document.getElementById('language-toggle');
    const menu = document.getElementById('language-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    document.querySelectorAll('.language-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        // Allow choosing any, but fallback will show EN content
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
