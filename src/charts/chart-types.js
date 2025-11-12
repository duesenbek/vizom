/**
 * @fileoverview Chart Types Registry - Production optimized chart type definitions
 * @version 2.0.0
 * @lastUpdated 2025-11-11
 */

/**
 * @typedef {Object} ChartType
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {string} icon Emoji icon used in UI
 * @property {string} category Category (basic, advanced, etc.)
 * @property {string} library Recommended library (chartjs, echarts, apexcharts, plotly, auto)
 * @property {string} description Short explanation of what the chart communicates
 * @property {string} useCase Guidance on when to choose the chart
 * @property {string[]} examples Real-world examples of datasets that fit the chart
 * @property {string[]} tags Search tags (e.g. popular, time-series)
 * @property {{minPoints: number, xAxis: string, yAxis: string}} dataRequirements Basic data requirements
 * @property {"beginner"|"intermediate"|"advanced"} difficulty Suggested skill level
 * @property {boolean} interactive Whether the chart supports advanced interactions
 * @property {string[]} exportFormats Supported export formats
 */

/**
 * @typedef {Object} ChartCategory
 * @property {string} id Category identifier
 * @property {string} label Human-readable category label
 * @property {ChartType[]} items Chart types in this category
 */

/**
 * @typedef {Object} ChartMetadata
 * @property {number} totalTypes Total number of chart types
 * @property {number} categories Number of categories
 * @property {string[]} libraries Supported libraries
 * @property {string} version Registry version
 * @property {string} lastUpdated Last update timestamp
 */

const CATEGORY_LABELS = {
  basic: 'Basic Charts',
  composition: 'Composition',
  comparison: 'Comparisons',
  distribution: 'Distributions',
  advanced: 'Advanced Analytics',
  financial: 'Financial',
  spatial: 'Spatial & Networks',
  temporal: 'Temporal',
  specialised: 'Specialised'
};

const DEFAULT_EXPORTS = {
  chartjs: ['png', 'jpg', 'webp', 'svg'],
  echarts: ['png', 'svg', 'webp'],
  apexcharts: ['png', 'svg', 'csv'],
  plotly: ['png', 'svg', 'pdf', 'json'],
  auto: ['png', 'svg']
};

const createType = (category, cfg) => {
  const library = cfg.library ?? 'auto';
  return {
    category,
    name: cfg.name,
    id: cfg.id,
    icon: cfg.icon,
    library,
    description: cfg.description,
    useCase: cfg.useCase,
    examples: cfg.examples,
    tags: cfg.tags ?? [],
    dataRequirements: cfg.dataRequirements,
    difficulty: cfg.difficulty,
    interactive: cfg.interactive ?? true,
    exportFormats: cfg.exportFormats ?? DEFAULT_EXPORTS[library] ?? DEFAULT_EXPORTS.auto
  };
};

/** @type {Record<string, ChartType[]>} */
export const CHART_TYPES = {
  basic: [
    createType('basic', {
      id: 'line',
      name: 'Line Chart',
      icon: '📈',
      description: 'Shows how a numeric value changes over a continuous range or time.',
      useCase: 'Choose when you want to emphasise a trend or progression over time.',
      examples: ['Monthly revenue', 'Website traffic', 'Daily active users'],
      dataRequirements: { minPoints: 2, xAxis: 'temporal or sequential', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['popular', 'trend', 'time-series']
    }),
    createType('basic', {
      id: 'spline',
      name: 'Smooth Line',
      icon: '〰️',
      library: 'apexcharts',
      description: 'Highlights gradual trends with a smooth curve between data points.',
      useCase: 'Use when you want a polished trend line without sharp corners.',
      examples: ['Temperature averages', 'Moving averages', 'Customer satisfaction index'],
      dataRequirements: { minPoints: 4, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['smooth', 'trend', 'presentation']
    }),
    createType('basic', {
      id: 'bar',
      name: 'Bar Chart',
      icon: '📊',
      description: 'Compares discrete categories with rectangular bars.',
      useCase: 'Use when comparing values between categories or segments.',
      examples: ['Revenue by product line', 'Leads by region', 'Survey responses'],
      dataRequirements: { minPoints: 2, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['popular', 'comparison', 'categorical']
    }),
    createType('basic', {
      id: 'column',
      name: 'Column Chart',
      icon: '🏛️',
      library: 'apexcharts',
      description: 'Vertical bars that emphasise comparisons across categories.',
      useCase: 'Ideal when category labels are short and you want to highlight growth.',
      examples: ['Monthly new users', 'Quarterly bookings', 'Store performance'],
      dataRequirements: { minPoints: 2, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['popular', 'comparison', 'baseline']
    }),
    createType('basic', {
      id: 'grouped-bar',
      name: 'Grouped Bar',
      icon: '🪟',
      library: 'echarts',
      description: 'Displays multiple series of bars side by side for each category.',
      useCase: 'Perfect for comparing sub-categories within a main group.',
      examples: ['Plan vs. actual revenue', 'Region performance by quarter', 'Channel mix year over year'],
      dataRequirements: { minPoints: 2, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['comparison', 'multi-series', 'categorical']
    }),
    createType('basic', {
      id: 'stacked-bar',
      name: 'Stacked Bar',
      icon: '🧱',
      library: 'echarts',
      description: 'Stacks series within a single bar to show contribution to the total.',
      useCase: 'Use when highlighting how segments contribute to a whole over categories.',
      examples: ['Revenue breakdown by product and region', 'Expense categories by quarter', 'Marketing spend by channel'],
      dataRequirements: { minPoints: 2, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['composition', 'comparison', 'multi-series']
    }),
    createType('basic', {
      id: 'scatter',
      name: 'Scatter Plot',
      icon: '⚫',
      description: 'Shows relationships between two numerical variables.',
      useCase: 'Great for spotting correlations or clusters between metrics.',
      examples: ['Ad spend vs. revenue', 'Customer age vs. lifetime value', 'Speed vs. efficiency'],
      dataRequirements: { minPoints: 10, xAxis: 'numeric', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['relationship', 'analytics', 'popular']
    }),
    createType('basic', {
      id: 'bubble',
      name: 'Bubble Chart',
      icon: '🫧',
      library: 'chartjs',
      description: 'Extends scatter plots with bubble size to encode a third variable.',
      useCase: 'Use when comparing three related metrics simultaneously.',
      examples: ['Revenue vs. profit with bubble sized by margin', 'Population vs. GDP sized by growth', 'Pipeline value vs. win rate vs. deal size'],
      dataRequirements: { minPoints: 10, xAxis: 'numeric', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['relationship', 'multi-metric', 'interactive']
    }),
    createType('basic', {
      id: 'area',
      name: 'Area Chart',
      icon: '📉',
      description: 'Fills the space under a line to emphasise volume over time.',
      useCase: 'Choose when you want to highlight cumulative impact or magnitude.',
      examples: ['Cumulative revenue', 'Active subscriptions', 'Daily sign-ups'],
      dataRequirements: { minPoints: 3, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['trend', 'magnitude', 'time-series']
    }),
    createType('basic', {
      id: 'stepped-area',
      name: 'Stepped Area',
      icon: '🪜',
      library: 'apexcharts',
      description: 'Represents changes that happen at distinct intervals, forming steps.',
      useCase: 'Great for subscription counts or inventory levels that change in jumps.',
      examples: ['Active licences by month', 'Inventory levels', 'Project milestones reached'],
      dataRequirements: { minPoints: 3, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['step', 'time-series', 'operations']
    }),
    createType('basic', {
      id: 'pie',
      name: 'Pie Chart',
      icon: '🥧',
      description: 'Displays proportional contribution to a whole with slices.',
      useCase: 'Use rarely and only when comparing few segments that sum to 100%.',
      examples: ['Market share', 'Budget allocation', 'Customer segments'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric (percentage)' },
      difficulty: 'beginner',
      tags: ['composition', 'part-to-whole']
    }),
    createType('basic', {
      id: 'doughnut',
      name: 'Doughnut Chart',
      icon: '🍩',
      description: 'Pie chart variant with a centre hole for labels or totals.',
      useCase: 'Great for showing parts of a whole while highlighting a central KPI.',
      examples: ['Segment contribution with annual total', 'Support tickets by type', 'Expense breakdown'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric (percentage)' },
      difficulty: 'beginner',
      tags: ['composition', 'dashboard']
    }),
    createType('basic', {
      id: 'polar-area',
      name: 'Polar Area',
      icon: '🧭',
      library: 'chartjs',
      description: 'Displays categories as equal-angle segments with varying radius.',
      useCase: 'Use when comparing a handful of categories with cyclical meaning.',
      examples: ['Sales by day of week', 'Channel share by quarter', 'Feature usage distribution'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['cyclical', 'comparison']
    })
  ],
  composition: [
    createType('composition', {
      id: 'stacked-area',
      name: 'Stacked Area',
      icon: '🪄',
      library: 'apexcharts',
      description: 'Fills multiple area series stacked to show cumulative totals.',
      useCase: 'Perfect for showing how segments build towards an overall trend.',
      examples: ['Revenue by product line over time', 'Energy mix by source', 'Support tickets by severity'],
      dataRequirements: { minPoints: 3, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['composition', 'time-series', 'multi-series']
    }),
    createType('composition', {
      id: 'radar',
      name: 'Radar',
      icon: '🕸️',
      library: 'echarts',
      description: 'Plots values across multiple dimensions on a radial grid.',
      useCase: 'Helpful for comparing profiles or capability scores across categories.',
      examples: ['Team skill matrix', 'Product feature comparison', 'Performance KPIs'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric (scaled)' },
      difficulty: 'intermediate',
      tags: ['profile', 'comparison', 'circular']
    }),
    createType('composition', {
      id: 'sunburst',
      name: 'Sunburst',
      icon: '☀️',
      library: 'echarts',
      description: 'Visualises hierarchical data with concentric rings.',
      useCase: 'Use when you want to explain drill-down structure and contribution.',
      examples: ['Company org chart', 'Product categories', 'Customer segmentation tiers'],
      dataRequirements: { minPoints: 5, xAxis: 'hierarchical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['hierarchy', 'composition', 'drill-down']
    }),
    createType('composition', {
      id: 'treemap',
      name: 'Treemap',
      icon: '🗂️',
      library: 'echarts',
      description: 'Represents hierarchical data as nested rectangles sized by value.',
      useCase: 'Great for showing proportional contribution across nested categories.',
      examples: ['Portfolio allocation', 'File storage usage', 'Customer segments'],
      dataRequirements: { minPoints: 5, xAxis: 'hierarchical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['composition', 'hierarchy', 'drill-down']
    }),
    createType('composition', {
      id: 'funnel',
      name: 'Funnel',
      icon: '🔻',
      library: 'echarts',
      description: 'Shows how values decrease across sequential stages.',
      useCase: 'Choose for pipeline analytics like marketing, sales, or onboarding.',
      examples: ['Sales funnel', 'User onboarding steps', 'Conversion stages'],
      dataRequirements: { minPoints: 3, xAxis: 'sequential stages', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['conversion', 'pipeline', 'sequential']
    }),
    createType('composition', {
      id: 'waterfall',
      name: 'Waterfall',
      icon: '💧',
      library: 'echarts',
      description: 'Highlights incremental increases and decreases leading to a total.',
      useCase: 'Ideal for explaining how different factors contribute to net change.',
      examples: ['Revenue bridge analysis', 'Budget variance breakdown', 'P&L breakdown'],
      dataRequirements: { minPoints: 4, xAxis: 'sequential', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['finance', 'variance', 'composition']
    }),
    createType('composition', {
      id: 'icicle',
      name: 'Icicle Chart',
      icon: '🧊',
      library: 'echarts',
      description: 'Displays hierarchical data in cascading bars from top to bottom.',
      useCase: 'Use when illustrating hierarchical breakdowns with clear sections.',
      examples: ['Cost breakdown by department', 'Website navigation depth', 'Organisational structure'],
      dataRequirements: { minPoints: 5, xAxis: 'hierarchical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['hierarchy', 'drill-down']
    }),
    createType('composition', {
      id: 'marimekko',
      name: 'Marimekko',
      icon: '🧱',
      library: 'echarts',
      description: 'Combines stacked bars with varying widths to show share within share.',
      useCase: 'Best for comparing market segments across categories simultaneously.',
      examples: ['Market share by region and product', 'Channel contribution by quarter', 'Audience segmentation'],
      dataRequirements: { minPoints: 6, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['composition', 'comparison', 'market']
    })
  ],
  comparison: [
    createType('comparison', {
      id: 'bullet',
      name: 'Bullet Chart',
      icon: '🎯',
      library: 'apexcharts',
      description: 'Combines bar, target marker, and qualitative ranges in one compact view.',
      useCase: 'Perfect for comparing actual performance against targets.',
      examples: ['Sales vs. quota', 'SLA response time goal', 'Budget vs. spend'],
      dataRequirements: { minPoints: 1, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['targets', 'kpi', 'dashboard']
    }),
    createType('comparison', {
      id: 'gauge',
      name: 'Gauge',
      icon: '⏱️',
      library: 'echarts',
      description: 'Displays a single KPI against a maximum value on a dial.',
      useCase: 'Use when highlighting status of a key metric like utilisation or score.',
      examples: ['NPS score', 'System uptime', 'Server utilisation'],
      dataRequirements: { minPoints: 1, xAxis: 'single value', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['kpi', 'status', 'presentation']
    }),
    createType('comparison', {
      id: 'progress',
      name: 'Progress Ring',
      icon: '⭕',
      library: 'apexcharts',
      description: 'Circular progress indicator for one or more metrics.',
      useCase: 'Ideal for showing completion percentage in dashboards.',
      examples: ['Project completion', 'Campaign progress', 'Feature rollout'],
      dataRequirements: { minPoints: 1, xAxis: 'single value', yAxis: 'percentage' },
      difficulty: 'beginner',
      tags: ['kpi', 'progress', 'dashboard']
    }),
    createType('comparison', {
      id: 'pareto',
      name: 'Pareto Chart',
      icon: '📐',
      library: 'echarts',
      description: 'Combines descending bars with a cumulative percentage line.',
      useCase: 'Use when applying the 80/20 rule to prioritise impactful factors.',
      examples: ['Defect causes', 'Customer complaints by type', 'Revenue sources'],
      dataRequirements: { minPoints: 4, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['analysis', 'priority', 'quality']
    }),
    createType('comparison', {
      id: 'lollipop',
      name: 'Lollipop Chart',
      icon: '🍭',
      library: 'echarts',
      description: 'Minimal alternative to bar charts using stems and circles.',
      useCase: 'Great for highlighting ranking differences with less ink.',
      examples: ['Employee satisfaction by team', 'City population ranking', 'Feature adoption score'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'beginner',
      tags: ['comparison', 'ranking', 'minimal']
    })
  ],
  distribution: [
    createType('distribution', {
      id: 'histogram',
      name: 'Histogram',
      icon: '🏗️',
      library: 'plotly',
      description: 'Groups continuous data into bins to show frequency distribution.',
      useCase: 'Ideal for understanding spread and skewness of large datasets.',
      examples: ['Age distribution', 'Session duration', 'Order values'],
      dataRequirements: { minPoints: 20, xAxis: 'numeric', yAxis: 'frequency' },
      difficulty: 'intermediate',
      tags: ['distribution', 'analytics']
    }),
    createType('distribution', {
      id: 'boxplot',
      name: 'Box Plot',
      icon: '🧊',
      library: 'plotly',
      description: 'Summarises distribution using quartiles and outliers.',
      useCase: 'Use when comparing variability across categories.',
      examples: ['Delivery time by carrier', 'Response time by team', 'Salary ranges'],
      dataRequirements: { minPoints: 5, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['distribution', 'statistics']
    }),
    createType('distribution', {
      id: 'violin',
      name: 'Violin Plot',
      icon: '🎻',
      library: 'plotly',
      description: 'Combines box plot with kernel density to show distribution shape.',
      useCase: 'Great for comparing distributions with multiple peaks.',
      examples: ['Customer spend by segment', 'Device usage times', 'Service response times'],
      dataRequirements: { minPoints: 10, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['distribution', 'density', 'analytics']
    }),
    createType('distribution', {
      id: 'density',
      name: 'Density Plot',
      icon: '🌊',
      library: 'plotly',
      description: 'Smooth curve representing the probability density of data.',
      useCase: 'Choose when you want a softer alternative to histograms.',
      examples: ['Website visit duration', 'Sensor readings', 'Financial returns'],
      dataRequirements: { minPoints: 20, xAxis: 'numeric', yAxis: 'density' },
      difficulty: 'advanced',
      tags: ['distribution', 'probability']
    }),
    createType('distribution', {
      id: 'hexbin',
      name: 'Hexbin Plot',
      icon: '⬡',
      library: 'echarts',
      description: 'Aggregates dense scatter data into hexagonal bins.',
      useCase: 'Great for large datasets where scatter plots overplot.',
      examples: ['Location density', 'Sales vs. margin for thousands of points', 'Sensor data clouds'],
      dataRequirements: { minPoints: 200, xAxis: 'numeric', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['density', 'big-data']
    }),
    createType('distribution', {
      id: 'contour',
      name: 'Contour Plot',
      icon: '🗺️',
      library: 'plotly',
      description: 'Shows density or value gradients using contour lines.',
      useCase: 'Use for visualising gradients, heat maps, or topographical data.',
      examples: ['Customer concentration', 'Heat distribution', 'Risk surfaces'],
      dataRequirements: { minPoints: 200, xAxis: 'numeric', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['density', 'gradient', 'analytics']
    })
  ],
  
  advanced: [
    createType('advanced', {
      id: 'heatmap',
      name: 'Heatmap',
      icon: '🔥',
      library: 'echarts',
      description: 'Uses colour intensity to show magnitude across two dimensions.',
      useCase: 'Ideal for spotting hotspots, anomalies, or clustered activity.',
      examples: ['Engagement by hour and day', 'Support volume heatmap', 'Sales by region and month'],
      dataRequirements: { minPoints: 25, xAxis: 'categorical', yAxis: 'categorical' },
      difficulty: 'advanced',
      tags: ['pattern', 'matrix']
    }),
    createType('advanced', {
      id: 'calendar',
      name: 'Calendar Heatmap',
      icon: '📅',
      library: 'echarts',
      description: 'Maps data values onto calendar days to reveal daily patterns.',
      useCase: 'Great for daily metrics such as commits, workouts, or support tickets.',
      examples: ['Product usage by day', 'Bug reports per day', 'Content publishing schedule'],
      dataRequirements: { minPoints: 30, xAxis: 'date', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['calendar', 'temporal']
    }),
    createType('advanced', {
      id: 'sankey',
      name: 'Sankey Flow',
      icon: '🌊',
      library: 'echarts',
      description: 'Shows flows between stages with link thickness proportional to volume.',
      useCase: 'Best for explaining how quantities move through pathways or processes.',
      examples: ['Customer journey flow', 'Energy distribution', 'Budget allocations'],
      dataRequirements: { minPoints: 6, xAxis: 'nodes & links', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['flow', 'process', 'drill-down']
    }),
    createType('advanced', {
      id: 'parallel',
      name: 'Parallel Coordinates',
      icon: '∥',
      library: 'echarts',
      description: 'Plots multivariate data across parallel axes to reveal relationships.',
      useCase: 'Ideal for exploring patterns across multiple metrics per record.',
      examples: ['Customer attribute comparison', 'Fleet performance metrics', 'Data science feature analysis'],
      dataRequirements: { minPoints: 20, xAxis: 'multiple numeric dimensions', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['multivariate', 'analytics']
    }),
    createType('advanced', {
      id: 'network',
      name: 'Network Graph',
      icon: '🕸️',
      library: 'echarts',
      description: 'Represents connections between entities as nodes and links.',
      useCase: 'Use for visualising relationships like organisational charts or dependencies.',
      examples: ['Collaboration network', 'API dependency map', 'Fraud detection graph'],
      dataRequirements: { minPoints: 10, xAxis: 'nodes & links', yAxis: 'numeric weights' },
      difficulty: 'advanced',
      tags: ['network', 'relationships']
    }),
    createType('advanced', {
      id: 'wordcloud',
      name: 'Word Cloud',
      icon: '☁️',
      library: 'echarts',
      description: 'Sizes words based on frequency to highlight recurring themes.',
      useCase: 'Great for summarising qualitative data such as feedback or reviews.',
      examples: ['Customer feedback themes', 'Survey keywords', 'Support ticket topics'],
      dataRequirements: { minPoints: 20, xAxis: 'text', yAxis: 'frequency' },
      difficulty: 'beginner',
      tags: ['text', 'frequency']
    }),
    createType('advanced', {
      id: 'radial-bar',
      name: 'Radial Bar',
      icon: '🎛️',
      library: 'apexcharts',
      description: 'Wraps bar values around a circle for compact KPI comparisons.',
      useCase: 'Perfect for dashboards highlighting a few KPIs with radial layout.',
      examples: ['Goal completion by team', 'Feature adoption', 'Performance scores'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['kpi', 'dashboard', 'circular']
    }),
    createType('advanced', {
      id: 'choropleth',
      name: 'Choropleth Map',
      icon: '🗺️',
      library: 'echarts',
      description: 'Fills geographic regions with colour intensity based on values.',
      useCase: 'Use for representing regional metrics like sales or population density.',
      examples: ['Sales by state', 'Covid cases by region', 'Market penetration map'],
      dataRequirements: { minPoints: 5, xAxis: 'geo', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['map', 'geo', 'spatial']
    })
  ],
  financial: [
    createType('financial', {
      id: 'candlestick',
      name: 'Candlestick',
      icon: '💹',
      library: 'apexcharts',
      description: 'Shows open, high, low, and close values for trading periods.',
      useCase: 'Best for financial market data where volatility matters.',
      examples: ['Stock price movements', 'Crypto trading sessions', 'Commodity prices'],
      dataRequirements: { minPoints: 10, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['finance', 'trading', 'volatility']
    }),
    createType('financial', {
      id: 'ohlc',
      name: 'OHLC Chart',
      icon: '📈',
      library: 'plotly',
      description: 'Simplified candlestick representing open-high-low-close bars.',
      useCase: 'Use when you want financial detail with reduced visual complexity.',
      examples: ['Daily stock movement', 'Forex pairs', 'Commodity tracking'],
      dataRequirements: { minPoints: 10, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['finance', 'trading']
    }),
    createType('financial', {
      id: 'range-area',
      name: 'Range Area',
      icon: '📏',
      library: 'apexcharts',
      description: 'Displays the upper and lower bounds of values over time.',
      useCase: 'Great for showing variability such as min/max or forecast intervals.',
      examples: ['Temperature highs and lows', 'Forecast confidence bands', 'Project estimates'],
      dataRequirements: { minPoints: 6, xAxis: 'temporal', yAxis: 'numeric range' },
      difficulty: 'intermediate',
      tags: ['range', 'forecast', 'band']
    }),
    createType('financial', {
      id: 'renko',
      name: 'Renko Chart',
      icon: '🧱',
      library: 'apexcharts',
      description: 'Filters out small price movements to highlight trends.',
      useCase: 'Useful for traders focusing on momentum over noise.',
      examples: ['Stock trend detection', 'Crypto trend analysis', 'Commodity momentum'],
      dataRequirements: { minPoints: 20, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['finance', 'momentum']
    })
  ],
  spatial: [
    createType('spatial', {
      id: 'geo-scatter',
      name: 'Geo Scatter',
      icon: '🛰️',
      library: 'echarts',
      description: 'Plots points on a map to show geographic distribution.',
      useCase: 'Use for visualising location-based metrics and event hotspots.',
      examples: ['Store locations', 'Delivery incidents', 'User check-ins'],
      dataRequirements: { minPoints: 5, xAxis: 'geo', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['map', 'locations']
    }),
    createType('spatial', {
      id: 'geo-heatmap',
      name: 'Geo Heatmap',
      icon: '🔥',
      library: 'echarts',
      description: 'Aggregates spatial points into heat zones on a map.',
      useCase: 'Great for density analysis like demand hotspots or risk areas.',
      examples: ['Ride-hailing demand', 'Delivery heat zones', 'Crime statistics'],
      dataRequirements: { minPoints: 50, xAxis: 'geo', yAxis: 'density' },
      difficulty: 'advanced',
      tags: ['map', 'density']
    }),
    createType('spatial', {
      id: 'arc-map',
      name: 'Arc Map',
      icon: '🌀',
      library: 'echarts',
      description: 'Connects origin-destination pairs with arcs across a map.',
      useCase: 'Perfect for demonstrating flows between locations.',
      examples: ['Logistics routes', 'Flight paths', 'Data centre traffic'],
      dataRequirements: { minPoints: 10, xAxis: 'geo', yAxis: 'numeric weight' },
      difficulty: 'advanced',
      tags: ['map', 'flow', 'connections']
    }),
    createType('spatial', {
      id: 'territory',
      name: 'Territory Map',
      icon: '🗺️',
      library: 'echarts',
      description: 'Divides regions into territories with distinct boundaries.',
      useCase: 'Useful for sales territories, support regions, or political maps.',
      examples: ['Sales territory ownership', 'Support coverage map', 'Election regions'],
      dataRequirements: { minPoints: 5, xAxis: 'geo', yAxis: 'categories' },
      difficulty: 'intermediate',
      tags: ['map', 'territory', 'categorical']
    })
  ],
  temporal: [
    createType('temporal', {
      id: 'timeline',
      name: 'Timeline',
      icon: '🕒',
      library: 'echarts',
      description: 'Displays events along a timeline with optional details.',
      useCase: 'Great for product launches, project milestones, or historical events.',
      examples: ['Project roadmap', 'Release schedule', 'Company history'],
      dataRequirements: { minPoints: 3, xAxis: 'temporal', yAxis: 'events' },
      difficulty: 'beginner',
      tags: ['events', 'storytelling']
    }),
    createType('temporal', {
      id: 'stream',
      name: 'Streamgraph',
      icon: '🌊',
      library: 'echarts',
      description: 'Flows stacked area series around a central axis for organic look.',
      useCase: 'Ideal for showing how topics or categories evolve over time.',
      examples: ['Content category trends', 'Music genre popularity', 'Support topics over time'],
      dataRequirements: { minPoints: 6, xAxis: 'temporal', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['time-series', 'composition']
    }),
    createType('temporal', {
      id: 'range-bar',
      name: 'Range Bar',
      icon: '🪄',
      library: 'apexcharts',
      description: 'Shows start and end values for time-bound tasks or durations.',
      useCase: 'Great for comparing durations or scheduling overlaps.',
      examples: ['Manufacturing cycle times', 'Event durations', 'Shift coverage'],
      dataRequirements: { minPoints: 3, xAxis: 'temporal range', yAxis: 'categorical' },
      difficulty: 'intermediate',
      tags: ['duration', 'comparison']
    }),
    createType('temporal', {
      id: 'gantt',
      name: 'Gantt Chart',
      icon: '📅',
      library: 'apexcharts',
      description: 'Classic project management chart for task timelines and dependencies.',
      useCase: 'Perfect for planning projects, sprints, or resource allocation.',
      examples: ['Project plan', 'Sprint roadmap', 'Construction schedule'],
      dataRequirements: { minPoints: 5, xAxis: 'temporal range', yAxis: 'categorical' },
      difficulty: 'advanced',
      tags: ['project', 'planning', 'schedule']
    })
  ],
  specialised: [
    createType('specialised', {
      id: '3d-surface',
      name: '3D Surface',
      icon: '🏔️',
      library: 'plotly',
      description: 'Shows three-dimensional surfaces with height, depth, and colour.',
      useCase: 'Use for mathematical surfaces or two independent variables.',
      examples: ['Topography', 'Risk scoring', 'Response surfaces'],
      dataRequirements: { minPoints: 100, xAxis: 'numeric grid', yAxis: 'numeric grid' },
      difficulty: 'advanced',
      tags: ['3d', 'analytics']
    }),
    createType('specialised', {
      id: '3d-scatter',
      name: '3D Scatter',
      icon: '⚪',
      library: 'plotly',
      description: 'Plots individual points in three-dimensional space.',
      useCase: 'Great for exploring clusters or patterns in three metrics.',
      examples: ['Manufacturing tolerances', 'Geospatial clusters', 'Scientific experiments'],
      dataRequirements: { minPoints: 30, xAxis: 'numeric', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['3d', 'clusters']
    }),
    createType('specialised', {
      id: 'isoline',
      name: 'Isoline Chart',
      icon: '〽️',
      library: 'plotly',
      description: 'Uses contour lines on a 2D plane to represent equal values.',
      useCase: 'Ideal for weather maps, elevation, or gradient analysis.',
      examples: ['Temperature gradients', 'Pressure maps', 'Performance thresholds'],
      dataRequirements: { minPoints: 100, xAxis: 'numeric grid', yAxis: 'numeric grid' },
      difficulty: 'advanced',
      tags: ['contour', 'gradient']
    }),
    createType('specialised', {
      id: 'flow-map',
      name: 'Flow Map',
      icon: '🛫',
      library: 'echarts',
      description: 'Combines mapping with directional arrows to show movement.',
      useCase: 'Perfect for migration, shipping routes, or data transfers.',
      examples: ['Logistics routes', 'Commuter patterns', 'Network traffic flows'],
      dataRequirements: { minPoints: 10, xAxis: 'geo pairs', yAxis: 'numeric weight' },
      difficulty: 'advanced',
      tags: ['map', 'flow']
    }),
    createType('specialised', {
      id: 'correlation-matrix',
      name: 'Correlation Matrix',
      icon: '🧬',
      library: 'echarts',
      description: 'Visualises correlations between variables in a grid heatmap.',
      useCase: 'Great for exploring relationships in analytics and data science.',
      examples: ['Feature correlation matrix', 'Risk factor analysis', 'KPI relationships'],
      dataRequirements: { minPoints: 16, xAxis: 'categorical', yAxis: 'categorical' },
      difficulty: 'advanced',
      tags: ['analytics', 'relationship', 'matrix']
    }),
    createType('specialised', {
      id: 'funnel-waterfall',
      name: 'Funnel Waterfall',
      icon: '🕳️',
      library: 'echarts',
      description: 'Blends funnel shape with waterfall steps to show drop-off detail.',
      useCase: 'Use when you need both stage conversion and variance explanation.',
      examples: ['Signup funnel with losses', 'Manufacturing yield loss', 'Operational efficiency waterfall'],
      dataRequirements: { minPoints: 4, xAxis: 'sequential', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['conversion', 'variance', 'hybrid']
    }),
    
    // Additional chart types for performance testing
    createType('specialised', {
      id: 'radial-bar',
      name: 'Radial Bar Chart',
      icon: '🎯',
      library: 'echarts',
      description: 'Circular bar chart showing progress or comparison around a center point.',
      useCase: 'Use for circular progress indicators or comparing categories radially.',
      examples: ['Skill assessment', 'Performance metrics', 'Progress tracking'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['circular', 'progress', 'comparison']
    }),
    
    createType('specialised', {
      id: 'sunburst',
      name: 'Sunburst Chart',
      icon: '☀️',
      library: 'echarts',
      description: 'Hierarchical visualization showing proportions across multiple levels.',
      useCase: 'Use for multi-level hierarchical data with proportional relationships.',
      examples: ['File system usage', 'Budget breakdown', 'Organizational structure'],
      dataRequirements: { minPoints: 5, xAxis: 'hierarchical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['hierarchical', 'proportional', 'multi-level']
    }),
    
    createType('specialised', {
      id: 'treemap-3d',
      name: '3D Treemap',
      icon: '📦',
      library: 'plotly',
      description: 'Three-dimensional treemap with depth for hierarchical data visualization.',
      useCase: 'Use when you need to show hierarchical proportions with visual depth.',
      examples: ['Portfolio allocation', 'Resource distribution', 'Market share'],
      dataRequirements: { minPoints: 4, xAxis: 'hierarchical', yAxis: 'numeric' },
      difficulty: 'advanced',
      tags: ['3d', 'hierarchical', 'proportional']
    }),
    
    createType('specialised', {
      id: 'polar-heatmap',
      name: 'Polar Heatmap',
      icon: '🌡️',
      library: 'plotly',
      description: 'Circular heatmap showing intensity patterns across angular and radial dimensions.',
      useCase: 'Use for cyclical data with intensity variations across angles and radius.',
      examples: ['Wind rose diagrams', 'Circular time patterns', 'Directional intensity'],
      dataRequirements: { minPoints: 8, xAxis: 'angular', yAxis: 'radial intensity' },
      difficulty: 'advanced',
      tags: ['polar', 'heatmap', 'cyclical']
    }),
    
    createType('specialised', {
      id: 'sankey-flow',
      name: 'Sankey Flow Diagram',
      icon: '🌊',
      library: 'echarts',
      description: 'Enhanced Sankey diagram with animated flow visualization.',
      useCase: 'Use for showing flow quantities with animated transitions between nodes.',
      examples: ['Energy flow', 'Migration patterns', 'Budget allocation'],
      dataRequirements: { minPoints: 3, xAxis: 'source-target', yAxis: 'flow volume' },
      difficulty: 'advanced',
      tags: ['flow', 'animated', 'network']
    }),
    
    createType('specialised', {
      id: 'circular-packing',
      name: 'Circular Packing',
      icon: '⭕',
      library: 'echarts',
      description: 'Hierarchical bubble chart with circles packed within larger circles.',
      useCase: 'Use for hierarchical data where size represents importance or quantity.',
      examples: ['Product categories', 'File sizes', 'Population distribution'],
      dataRequirements: { minPoints: 4, xAxis: 'hierarchical', yAxis: 'size' },
      difficulty: 'intermediate',
      tags: ['hierarchical', 'bubble', 'packing']
    }),
    
    createType('specialised', {
      id: 'parallel-coordinates',
      name: 'Parallel Coordinates',
      icon: '📊',
      library: 'plotly',
      description: 'Multi-dimensional visualization using parallel axes for dimensional analysis.',
      useCase: 'Use for exploring relationships across multiple dimensions simultaneously.',
      examples: ['Customer segmentation', 'Performance analysis', 'Multi-criteria decision'],
      dataRequirements: { minPoints: 10, xAxis: 'multiple dimensions', yAxis: 'normalized values' },
      difficulty: 'advanced',
      tags: ['multi-dimensional', 'parallel', 'analysis']
    }),
    
    createType('specialised', {
      id: 'chord-diagram',
      name: 'Chord Diagram',
      icon: '🎵',
      library: 'echarts',
      description: 'Circular visualization showing relationships and flows between entities.',
      useCase: 'Use for showing symmetric relationships or flows between categories.',
      examples: ['Trade flows', 'Music genre relationships', 'Social connections'],
      dataRequirements: { minPoints: 3, xAxis: 'entities', yAxis: 'relationship strength' },
      difficulty: 'advanced',
      tags: ['relationships', 'circular', 'flows']
    }),
    
    createType('specialised', {
      id: 'streamgraph',
      name: 'Streamgraph',
      icon: '🌊',
      library: 'echarts',
      description: 'Stacked area chart with smooth, organic flows showing composition over time.',
      useCase: 'Use for time-series composition data with smooth visual transitions.',
      examples: ['Music listening trends', 'Market share evolution', 'Budget allocation over time'],
      dataRequirements: { minPoints: 5, xAxis: 'temporal', yAxis: 'composition' },
      difficulty: 'intermediate',
      tags: ['time-series', 'composition', 'smooth']
    }),
    
    createType('specialised', {
      id: 'timeline-gantt',
      name: 'Timeline Gantt',
      icon: '📅',
      library: 'echarts',
      description: 'Project timeline with dependencies and resource allocation visualization.',
      useCase: 'Use for project management, scheduling, and dependency tracking.',
      examples: ['Project schedules', 'Event planning', 'Resource allocation'],
      dataRequirements: { minPoints: 3, xAxis: 'time', yAxis: 'tasks/resources' },
      difficulty: 'intermediate',
      tags: ['timeline', 'project', 'dependencies']
    }),
    
    createType('specialised', {
      id: 'venn-diagram',
      name: 'Venn Diagram',
      icon: '🔗',
      library: 'plotly',
      description: 'Set visualization showing intersections and relationships between datasets.',
      useCase: 'Use for showing commonalities and differences between data groups.',
      examples: ['Customer segments', 'Feature overlap', 'Survey responses'],
      dataRequirements: { minPoints: 2, xAxis: 'sets', yAxis: 'intersections' },
      difficulty: 'intermediate',
      tags: ['sets', 'intersections', 'relationships']
    }),
    
    createType('specialised', {
      id: 'word-cloud',
      name: 'Word Cloud',
      icon: '☁️',
      library: 'echarts',
      description: 'Text visualization where word size represents frequency or importance.',
      useCase: 'Use for text analysis, keyword extraction, and frequency visualization.',
      examples: ['Customer feedback', 'Document keywords', 'Social media tags'],
      dataRequirements: { minPoints: 5, xAxis: 'words', yAxis: 'frequency/importance' },
      difficulty: 'beginner',
      tags: ['text', 'frequency', 'visualization']
    }),
    
    createType('specialised', {
      id: 'bullet-chart',
      name: 'Bullet Chart',
      icon: '🎯',
      library: 'echarts',
      description: 'Performance metric chart showing target, actual, and comparative ranges.',
      useCase: 'Use for KPI tracking, performance measurement, and goal attainment.',
      examples: ['Sales targets', 'Performance metrics', 'Quality indicators'],
      dataRequirements: { minPoints: 1, xAxis: 'metrics', yAxis: 'performance' },
      difficulty: 'intermediate',
      tags: ['kpi', 'performance', 'target']
    }),
    
    createType('specialised', {
      id: 'pictorial-bar',
      name: 'Pictorial Bar Chart',
      icon: '🖼️',
      library: 'echarts',
      description: 'Bar chart using custom images or icons instead of rectangular bars.',
      useCase: 'Use for creative data visualization with thematic visual elements.',
      examples: ['Product sales', 'Brand comparisons', 'Thematic metrics'],
      dataRequirements: { minPoints: 2, xAxis: 'categorical', yAxis: 'numeric' },
      difficulty: 'intermediate',
      tags: ['pictorial', 'creative', 'thematic']
    }),
    
    createType('specialised', {
      id: 'liquid-fill',
      name: 'Liquid Fill Chart',
      icon: '💧',
      library: 'echarts',
      description: 'Animated liquid fill gauge showing progress or percentage completion.',
      useCase: 'Use for progress indicators, completion rates, and capacity visualization.',
      examples: ['Storage usage', 'Project completion', 'Goal progress'],
      dataRequirements: { minPoints: 1, xAxis: 'single metric', yAxis: 'percentage' },
      difficulty: 'intermediate',
      tags: ['animated', 'gauge', 'progress']
    }),
    
    createType('specialised', {
      id: 'theme-river',
      name: 'Theme River',
      icon: '🏞️',
      library: 'echarts',
      description: 'Flowing visualization showing changes in composition over time like a river.',
      useCase: 'Use for time-series data with evolving composition and smooth flows.',
      examples: ['Genre popularity trends', 'Political sentiment over time', 'Market evolution'],
      dataRequirements: { minPoints: 6, xAxis: 'temporal', yAxis: 'composition flow' },
      difficulty: 'advanced',
      tags: ['time-series', 'flow', 'composition']
    }),
    
    createType('specialised', {
      id: 'custom-svg',
      name: 'Custom SVG Chart',
      icon: '🎨',
      library: 'auto',
      description: 'Fully customizable chart using custom SVG elements and animations.',
      useCase: 'Use for unique visualizations that don\'t fit standard chart types.',
      examples: ['Infographic elements', 'Custom dashboards', 'Branded visualizations'],
      dataRequirements: { minPoints: 1, xAxis: 'custom', yAxis: 'custom' },
      difficulty: 'advanced',
      tags: ['custom', 'svg', 'infographic']
    }),
    
    createType('specialised', {
      id: 'matrix-heatmap',
      name: 'Matrix Heatmap',
      icon: '🔲',
      library: 'echarts',
      description: 'Grid-based heatmap showing correlations or intensities between two categorical variables.',
      useCase: 'Use for correlation analysis, confusion matrices, and intensity grids.',
      examples: ['Correlation matrices', 'Confusion matrices', 'Activity patterns'],
      dataRequirements: { minPoints: 4, xAxis: 'categorical', yAxis: 'categorical' },
      difficulty: 'intermediate',
      tags: ['correlation', 'matrix', 'heatmap']
    }),
    
    createType('specialised', {
      id: 'gauge-meters',
      name: 'Gauge Meters',
      icon: '⚡',
      library: 'echarts',
      description: 'Multiple gauge meters for dashboard-style metric visualization.',
      useCase: 'Use for real-time dashboards with multiple KPIs and performance metrics.',
      examples: ['System monitoring', 'Business dashboards', 'Performance metrics'],
      dataRequirements: { minPoints: 1, xAxis: 'metrics', yAxis: 'gauge values' },
      difficulty: 'intermediate',
      tags: ['dashboard', 'gauge', 'real-time']
    }),
    
    createType('specialised', {
      id: 'hierarchical-tree',
      name: 'Hierarchical Tree',
      icon: '🌳',
      library: 'echarts',
      description: 'Interactive tree visualization with expandable/collapsible nodes.',
      useCase: 'Use for organizational structures, file systems, and decision trees.',
      examples: ['Company hierarchy', 'File systems', 'Decision trees'],
      dataRequirements: { minPoints: 3, xAxis: 'hierarchical', yAxis: 'tree structure' },
      difficulty: 'intermediate',
      tags: ['hierarchical', 'tree', 'interactive']
    }),
    
    createType('specialised', {
      id: 'candlestick-chart',
      name: 'Candlestick Chart',
      icon: '📈',
      library: 'echarts',
      description: 'Financial chart showing open, high, low, and close values for time periods.',
      useCase: 'Use for financial data analysis, stock prices, and market trends.',
      examples: ['Stock prices', 'Currency exchange', 'Commodity prices'],
      dataRequirements: { minPoints: 4, xAxis: 'temporal', yAxis: 'OHLC values' },
      difficulty: 'advanced',
      tags: ['financial', 'OHLC', 'trading']
    }),
    
    createType('specialised', {
      id: 'box-whisker',
      name: 'Box and Whisker Plot',
      icon: '📊',
      library: 'plotly',
      description: 'Statistical visualization showing quartiles, median, and outliers in data distribution.',
      useCase: 'Use for statistical analysis, data distribution, and outlier detection.',
      examples: ['Test scores', 'Measurement data', 'Survey responses'],
      dataRequirements: { minPoints: 5, xAxis: 'categorical', yAxis: 'statistical distribution' },
      difficulty: 'intermediate',
      tags: ['statistical', 'distribution', 'outliers']
    }),
    
    createType('specialised', {
      id: 'violin-plot',
      name: 'Violin Plot',
      icon: '🎻',
      library: 'plotly',
      description: 'Combination of box plot and kernel density plot showing distribution shape.',
      useCase: 'Use for detailed distribution analysis with probability density visualization.',
      examples: ['Population distribution', 'Response time analysis', 'Performance metrics'],
      dataRequirements: { minPoints: 5, xAxis: 'categorical', yAxis: 'distribution density' },
      difficulty: 'advanced',
      tags: ['statistical', 'distribution', 'density']
    }),
    
    createType('specialised', {
      id: 'error-bars',
      name: 'Error Bars Chart',
      icon: '📏',
      library: 'plotly',
      description: 'Chart with error bars showing uncertainty or confidence intervals.',
      useCase: 'Use for scientific data, experimental results, and statistical confidence.',
      examples: ['Experimental results', 'Survey margins', 'Scientific measurements'],
      dataRequirements: { minPoints: 3, xAxis: 'categorical', yAxis: 'values with error' },
      difficulty: 'intermediate',
      tags: ['statistical', 'uncertainty', 'confidence']
    }),
    
    createType('specialised', {
      id: 'waterfall-progression',
      name: 'Waterfall Progression',
      icon: '💹',
      library: 'echarts',
      description: 'Enhanced waterfall chart with intermediate calculations and subtotals.',
      useCase: 'Use for financial statements, profit analysis, and cumulative changes.',
      examples: ['P&L statements', 'Budget variance', 'Cumulative growth'],
      dataRequirements: { minPoints: 4, xAxis: 'sequential', yAxis: 'cumulative values' },
      difficulty: 'intermediate',
      tags: ['financial', 'cumulative', 'progression']
    }),
    
    createType('specialised', {
      id: 'radar-comparison',
      name: 'Multi-Radar Comparison',
      icon: '🎯',
      library: 'echarts',
      description: 'Multiple radar charts overlaid for comparing multi-dimensional datasets.',
      useCase: 'Use for comparing performance across multiple dimensions or categories.',
      examples: ['Product comparison', 'Team performance', 'Competitor analysis'],
      dataRequirements: { minPoints: 5, xAxis: 'dimensions', yAxis: 'multiple datasets' },
      difficulty: 'advanced',
      tags: ['comparison', 'multi-dimensional', 'radar']
    }),
    
    createType('specialised', {
      id: 'scatter-3d',
      name: '3D Scatter Plot',
      icon: '🔮',
      library: 'plotly',
      description: 'Three-dimensional scatter plot for exploring relationships across three variables.',
      useCase: 'Use for multi-variable analysis and 3D data exploration.',
      examples: ['Scientific data', 'Market analysis', 'Research data'],
      dataRequirements: { minPoints: 10, xAxis: 'variable 1', yAxis: 'variables 2 & 3' },
      difficulty: 'advanced',
      tags: ['3d', 'scatter', 'multi-variable']
    }),
    
    createType('specialised', {
      id: 'surface-3d',
      name: '3D Surface Plot',
      icon: '🏔️',
      library: 'plotly',
      description: 'Three-dimensional surface plot showing continuous data across two variables.',
      useCase: 'Use for continuous function visualization and surface analysis.',
      examples: ['Temperature distribution', 'Elevation maps', 'Mathematical functions'],
      dataRequirements: { minPoints: 20, xAxis: 'variable 1', yAxis: 'surface values' },
      difficulty: 'advanced',
      tags: ['3d', 'surface', 'continuous']
    }),
    
    createType('specialised', {
      id: 'mesh-plot',
      name: '3D Mesh Plot',
      icon: '🕸️',
      library: 'plotly',
      description: 'Three-dimensional wireframe mesh for structural and mathematical visualization.',
      useCase: 'Use for structural analysis, mathematical surfaces, and wireframe models.',
      examples: ['Structural analysis', 'Mathematical models', 'Engineering data'],
      dataRequirements: { minPoints: 15, xAxis: 'coordinates', yAxis: 'mesh connections' },
      difficulty: 'advanced',
      tags: ['3d', 'mesh', 'structural']
    }),
    
    createType('specialised', {
      id: 'isoclines-map',
      name: 'Isoclines Map',
      icon: '🗺️',
      library: 'plotly',
      description: 'Contour map showing lines of equal values across geographic or spatial data.',
      useCase: 'Use for geographic data, elevation maps, and spatial distributions.',
      examples: ['Elevation maps', 'Weather data', 'Geographic distributions'],
      dataRequirements: { minPoints: 10, xAxis: 'coordinates', yAxis: 'contour values' },
      difficulty: 'advanced',
      tags: ['geographic', 'contour', 'spatial']
    }),
    
    createType('specialised', {
      id: 'geo-scatter',
      name: 'Geographic Scatter',
      icon: '🌍',
      library: 'plotly',
      description: 'Scatter plot overlaid on geographic maps for spatial data visualization.',
      useCase: 'Use for location-based data and geographic distribution analysis.',
      examples: ['Store locations', 'Customer distribution', 'Geographic data'],
      dataRequirements: { minPoints: 5, xAxis: 'latitude/longitude', yAxis: 'data values' },
      difficulty: 'intermediate',
      tags: ['geographic', 'scatter', 'location']
    }),
    
    createType('specialised', {
      id: 'choropleth-enhanced',
      name: 'Enhanced Choropleth',
      icon: '🗺️',
      library: 'plotly',
      description: 'Advanced choropleth map with multiple layers and interactive features.',
      useCase: 'Use for complex geographic data with multiple data layers.',
      examples: ['Demographic data', 'Economic indicators', 'Regional statistics'],
      dataRequirements: { minPoints: 3, xAxis: 'regions', yAxis: 'statistical values' },
      difficulty: 'advanced',
      tags: ['geographic', 'statistical', 'multi-layer']
    }),
    
    createType('specialised', {
      id: 'connection-map',
      name: 'Connection Map',
      icon: '🔗',
      library: 'plotly',
      description: 'Geographic map showing connections and flows between locations.',
      useCase: 'Use for migration patterns, trade routes, and network connections.',
      examples: ['Migration flows', 'Trade routes', 'Network connections'],
      dataRequirements: { minPoints: 3, xAxis: 'locations', yAxis: 'connection strength' },
      difficulty: 'advanced',
      tags: ['geographic', 'network', 'flows']
    }),
    
    createType('specialised', {
      id: 'hexagon-binning',
      name: 'Hexagon Binning',
      icon: '⬡',
      library: 'plotly',
      description: '2D density visualization using hexagonal bins for large datasets.',
      useCase: 'Use for density analysis of large 2D datasets with smooth visualization.',
      examples: ['Population density', 'Data clustering', 'Distribution analysis'],
      dataRequirements: { minPoints: 50, xAxis: 'coordinate 1', yAxis: 'coordinate 2' },
      difficulty: 'intermediate',
      tags: ['density', 'binning', 'large-data']
    }),
    
    createType('specialised', {
      id: 'density-heatmap',
      name: 'Density Heatmap',
      icon: '🌡️',
      library: 'plotly',
      description: 'Continuous density heatmap showing data concentration patterns.',
      useCase: 'Use for visualizing data density and concentration patterns.',
      examples: ['Activity hotspots', 'Usage patterns', 'Data clustering'],
      dataRequirements: { minPoints: 20, xAxis: 'coordinate 1', yAxis: 'coordinate 2' },
      difficulty: 'intermediate',
      tags: ['density', 'heatmap', 'concentration']
    }),
    
    createType('specialised', {
      id: 'spatial-network',
      name: 'Spatial Network Graph',
      icon: '🕸️',
      library: 'plotly',
      description: 'Network graph with geographic positioning for spatial relationship analysis.',
      useCase: 'Use for geographic networks and spatial relationship visualization.',
      examples: ['Transport networks', 'Social networks', 'Infrastructure'],
      dataRequirements: { minPoints: 4, xAxis: 'coordinates', yAxis: 'network connections' },
      difficulty: 'advanced',
      tags: ['network', 'geographic', 'spatial']
    })
  ]
};

// Performance optimizations: Pre-computed indexes and caches
/** @type {ChartType[]} */
const FLAT_TYPES = Object.values(CHART_TYPES).flat();

/** @type {Map<string, ChartType>} - O(1) lookup by chart type ID */
const CHART_TYPE_INDEX = new Map();
FLAT_TYPES.forEach((type) => {
  CHART_TYPE_INDEX.set(type.id, type);
});

/** @type {Map<string, ChartType[]>} - Library-based index */
const LIBRARY_INDEX = new Map();
['chartjs', 'echarts', 'apexcharts', 'plotly', 'auto'].forEach(lib => {
  LIBRARY_INDEX.set(lib, FLAT_TYPES.filter(type => type.library === lib || type.library === 'auto'));
});

/** @type {Map<string, ChartType[]>} - Category-based index */
const CATEGORY_INDEX = new Map();
Object.keys(CHART_TYPES).forEach(cat => {
  CATEGORY_INDEX.set(cat, CHART_TYPES[cat]);
});

/** @type {ChartType[]} - Popular charts cache */
const POPULAR_CHARTS = FLAT_TYPES.filter((type) => type.tags?.includes('popular')).slice(0, 6);

/**
 * Registry metadata for version tracking and statistics
 * @type {ChartMetadata}
 */
export const CHART_METADATA = {
  totalTypes: FLAT_TYPES.length,
  categories: Object.keys(CHART_TYPES).length,
  libraries: ['chartjs', 'echarts', 'apexcharts', 'plotly', 'auto'],
  version: '2.0.0',
  lastUpdated: '2025-11-11'
};

/**
 * Get all available chart types
 * @returns {ChartType[]} Array of all chart type objects
 */
export function getAllChartTypes() {
  return FLAT_TYPES;
}

/**
 * Get a specific chart type by its ID
 * @param {string} id - The chart type identifier
 * @returns {ChartType|null} Chart type object or null if not found
 * @performance O(1) lookup using Map index
 */
export function getChartTypeById(id) {
  return CHART_TYPE_INDEX.get(id) || null;
}

/**
 * Get all chart categories with their chart types
 * @returns {ChartCategory[]} Array of category objects with chart types
 */
export function getCategories() {
  return Object.keys(CHART_TYPES).map((key) => ({
    id: key,
    label: CATEGORY_LABELS[key] || key,
    items: CHART_TYPES[key]
  }));
}

/**
 * Get popular chart types (tagged as 'popular')
 * @returns {ChartType[]} Array of popular chart types (max 6)
 */
export function getPopularChartTypes() {
  return POPULAR_CHARTS;
}

/**
 * Get chart types filtered by library
 * @param {string} library - Library name ('chartjs', 'echarts', 'apexcharts', 'plotly', 'auto')
 * @returns {ChartType[]} Array of chart types compatible with specified library
 * @performance O(1) lookup using pre-computed index
 */
export function getChartTypesByLibrary(library) {
  return LIBRARY_INDEX.get(library) || [];
}

/**
 * Get chart types filtered by difficulty level
 * @param {"beginner"|"intermediate"|"advanced"} difficulty - Difficulty level
 * @returns {ChartType[]} Array of chart types with specified difficulty
 */
export function getChartTypesByDifficulty(difficulty) {
  return FLAT_TYPES.filter((type) => type.difficulty === difficulty);
}

/**
 * Search chart types by query string
 * @param {string} query - Search query to match against name, description, use case, and tags
 * @returns {ChartType[]} Array of chart types matching the search query
 */
export function searchChartTypes(query) {
  const lower = query.toLowerCase();
  return FLAT_TYPES.filter((type) =>
    type.name.toLowerCase().includes(lower) ||
    type.description?.toLowerCase().includes(lower) ||
    type.useCase?.toLowerCase().includes(lower) ||
    type.tags?.some((tag) => tag.includes(lower))
  );
}

/**
 * Get recommended library for a chart type based on data size
 * @param {string} chartTypeId - Chart type identifier
 * @param {number} [dataSize=0] - Size of dataset (number of data points)
 * @returns {string} Recommended library name
 */
export function getRecommendedLibrary(chartTypeId, dataSize = 0) {
  const type = getChartTypeById(chartTypeId);
  if (!type) return 'chartjs';
  if (type.library !== 'auto') return type.library;
  if (dataSize > 10000) return 'echarts';
  if (dataSize > 1000) return 'apexcharts';
  return 'chartjs';
}

/**
 * Validate data compatibility with a specific chart type
 * @param {Array|Object} data - Data to validate
 * @param {string} chartTypeId - Chart type identifier
 * @returns {{valid: boolean, errors: string[]}} Validation result with any errors
 */
export function validateDataForChartType(data, chartTypeId) {
  const type = getChartTypeById(chartTypeId);
  if (!type?.dataRequirements) {
    return { valid: true, errors: [] };
  }

  const errors = [];
  const dataLength = Array.isArray(data) ? data.length : 0;

  if (dataLength < type.dataRequirements.minPoints) {
    errors.push(`Need at least ${type.dataRequirements.minPoints} data points`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get chart types by category
 * @param {string} categoryId - Category identifier
 * @returns {ChartType[]} Array of chart types in the specified category
 * @performance O(1) lookup using pre-computed index
 */
export function getChartTypesByCategory(categoryId) {
  return CATEGORY_INDEX.get(categoryId) || [];
}

/**
 * Check if a chart type exists
 * @param {string} id - Chart type identifier
 * @returns {boolean} True if chart type exists
 * @performance O(1) lookup
 */
export function chartTypeExists(id) {
  return CHART_TYPE_INDEX.has(id);
}

/**
 * Get all available library names
 * @returns {string[]} Array of supported library names
 */
export function getSupportedLibraries() {
  return CHART_METADATA.libraries;
}

/**
 * Get all difficulty levels
 * @returns {Array<"beginner"|"intermediate"|"advanced">} Array of difficulty levels
 */
export function getDifficultyLevels() {
  return ['beginner', 'intermediate', 'advanced'];
}

// Export raw data structures for advanced usage
export { CATEGORY_LABELS };
