// VisualizationRegistry - unified orchestration for visualization libraries
// Allows Vizom to register, lazy-load, and interact with multiple charting stacks

const registry = new Map();

function ensureScriptLoaded(src, globalCheck) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Script loading is only supported in the browser'));
  }

  if (typeof globalCheck === 'function') {
    const existing = globalCheck();
    if (existing) {
      return Promise.resolve(existing);
    }
  }

  return new Promise((resolve, reject) => {
    const isAlreadyEnqueued = document.querySelector(`script[data-vizom-src="${src}"]`);
    if (isAlreadyEnqueued) {
      isAlreadyEnqueued.addEventListener('load', () => resolve(globalCheck?.()));
      isAlreadyEnqueued.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset.vizomSrc = src;

    script.onload = () => {
      try {
        resolve(globalCheck?.());
      } catch (error) {
        reject(error);
      }
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });
}

export class VisualizationRegistry {
  static registerLibrary(config) {
    const {
      id,
      name,
      loader,
      adapters = {},
      docs = '',
      tags = [],
      featureHighlights = [],
      recommendedUseCases = [],
    } = config;

    if (!id || !name) {
      throw new Error('Visualization library registration requires an id and name');
    }

    registry.set(id, {
      id,
      name,
      loader,
      adapters,
      docs,
      tags,
      featureHighlights,
      recommendedUseCases,
      status: 'registered',
      api: null,
    });
  }

  static isRegistered(id) {
    return registry.has(id);
  }

  static listLibraries() {
    return Array.from(registry.values()).map(({ api, loader, ...meta }) => meta);
  }

  static getLibrary(id) {
    return registry.get(id) || null;
  }

  static async loadLibrary(id) {
    const entry = registry.get(id);
    if (!entry) {
      throw new Error(`Visualization library '${id}' is not registered`);
    }

    if (entry.status === 'ready' && entry.api) {
      return entry.api;
    }

    if (typeof entry.loader !== 'function') {
      throw new Error(`Visualization library '${id}' does not provide a loader`);
    }

    entry.status = 'loading';
    try {
      const api = await entry.loader();
      entry.api = api;
      entry.status = 'ready';
      return api;
    } catch (error) {
      entry.status = 'error';
      throw error;
    }
  }
}

// Default registrations -----------------------------------------------------

VisualizationRegistry.registerLibrary({
  id: 'chartjs',
  name: 'Chart.js',
  tags: ['canvas', '2d', 'lightweight', 'interactive'],
  docs: 'https://www.chartjs.org/docs/latest/',
  featureHighlights: [
    'Declarative configuration-driven charts',
    'Rich plugin ecosystem and extensibility hooks',
    'Great default animations and tooltips',
  ],
  recommendedUseCases: [
    'Marketing dashboards',
    'Financial trend analysis',
    'Embedded analytics for SaaS products',
  ],
  loader: () => ensureScriptLoaded(
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
    () => window.Chart,
  ),
  adapters: {
    createChart: (ctx, config) => new window.Chart(ctx, config),
    destroy: (chartInstance) => chartInstance?.destroy?.(),
  },
});

VisualizationRegistry.registerLibrary({
  id: 'd3',
  name: 'D3.js',
  tags: ['svg', 'canvas', 'data-driven', 'low-level'],
  docs: 'https://github.com/d3/d3/blob/main/API.md',
  featureHighlights: [
    'Fine-grained control over SVG, Canvas, and WebGL rendering',
    'Massive ecosystem of layouts, utilities, and behaviors',
    'Composable functional utilities for data transformation',
  ],
  recommendedUseCases: [
    'Custom storytelling visualizations',
    'Interactive network graphs and maps',
    'Advanced data exploration tooling',
  ],
  loader: async () => {
    if (window.d3) {
      return window.d3;
    }

    // Dynamic import fallback (ES module)
    const module = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm');
    // Expose to global namespace for compatibility with existing modules
    if (!window.d3) {
      window.d3 = module;
    }
    return module;
  },
  adapters: {
    select: (...args) => window.d3?.select?.(...args),
    createForceSimulation: (nodes, links, config = {}) => {
      const d3 = window.d3;
      if (!d3) return null;

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d) => d.id).distance(config.distance || 50))
        .force('charge', d3.forceManyBody().strength(config.strength || -300))
        .force('center', d3.forceCenter(config.width / 2, config.height / 2));

      if (config.collisionRadius) {
        simulation.force('collision', d3.forceCollide().radius(config.collisionRadius));
      }

      return simulation;
    },
  },
});

// Suggested placeholders for additional libraries --------------------------

VisualizationRegistry.registerLibrary({
  id: 'echarts',
  name: 'Apache ECharts',
  tags: ['canvas', 'rich-media', 'themes'],
  docs: 'https://echarts.apache.org/en/api.html',
  featureHighlights: [
    ' 3D charts, geographic maps, and complex interactions',
    ' Built-in theming engine and responsive layouts',
    ' Dataset transforms for quick data shaping',
  ],
  recommendedUseCases: [
    'Global operations dashboards',
    'Enterprise BI replacements',
    'Interactive marketing experiences',
  ],
  loader: () => ensureScriptLoaded(
    'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js',
    () => window.echarts,
  ),
  adapters: {
    createChart: (domElement, config) => window.echarts?.init?.(domElement, config.theme || null),
  },
});

VisualizationRegistry.registerLibrary({
  id: 'plotly',
  name: 'Plotly.js',
  tags: ['webgl', 'statistics', 'scientific'],
  docs: 'https://plotly.com/javascript/',
  featureHighlights: [
    'Scientific chart gallery with deep configuration',
    'Heatmaps, contour plots, 3D surfaces, and volume rendering',
    'Export-ready vector graphics and image outputs',
  ],
  recommendedUseCases: [
    'Data science notebooks and model explainability',
    'Geospatial analytics',
    'Executive briefings with export to PowerPoint/PDF',
  ],
  loader: () => ensureScriptLoaded(
    'https://cdn.plot.ly/plotly-2.27.0.min.js',
    () => window.Plotly,
  ),
  adapters: {
    newPlot: (domNode, data, layout, config) => window.Plotly?.newPlot?.(domNode, data, layout, config),
    react: (domNode, data, layout, config) => window.Plotly?.react?.(domNode, data, layout, config),
  },
});

export default VisualizationRegistry;
