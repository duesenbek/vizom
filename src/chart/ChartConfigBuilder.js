/**
 * Chart Configuration Builder
 * Builds chart configurations with themes, animations, and options
 */

import { 
  ChartConfig, 
  ChartRenderOptions, 
  ChartType, 
  ChartTheme, 
  ChartAnimation,
  CHART_TYPES,
  CHART_THEMES,
  DEFAULT_ANIMATION
} from './types.js';

export class ChartConfigBuilder {
  private config: Partial<ChartConfig> = {};
  private theme: ChartTheme = CHART_THEMES.default;
  private animation: ChartAnimation = { ...DEFAULT_ANIMATION };

  /**
   * Set chart type
   */
  setType(type: string): ChartConfigBuilder {
    const chartType = CHART_TYPES[type];
    if (!chartType) {
      throw new Error(`Chart type "${type}" not supported`);
    }

    this.config.type = type;
    this.config.options = { ...chartType.defaultOptions };
    return this;
  }

  /**
   * Set chart data
   */
  setData(data: any): ChartConfigBuilder {
    this.config.data = data;
    return this;
  }

  /**
   * Set chart theme
   */
  setTheme(themeName: string): ChartConfigBuilder {
    const theme = CHART_THEMES[themeName];
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`);
    }

    this.theme = theme;
    return this;
  }

  /**
   * Set custom theme
   */
  setCustomTheme(theme: ChartTheme): ChartConfigBuilder {
    this.theme = theme;
    return this;
  }

  /**
   * Set animation settings
   */
  setAnimation(animation: Partial<ChartAnimation>): ChartConfigBuilder {
    this.animation = { ...this.animation, ...animation };
    return this;
  }

  /**
   * Enable/disable animations
   */
  setAnimationEnabled(enabled: boolean): ChartConfigBuilder {
    this.animation.enabled = enabled;
    return this;
  }

  /**
   * Set animation duration
   */
  setAnimationDuration(duration: number): ChartConfigBuilder {
    this.animation.duration = duration;
    return this;
  }

  /**
   * Set chart title
   */
  setTitle(title: string): ChartConfigBuilder {
    if (!this.config.options) {
      this.config.options = {};
    }
    
    this.config.options.plugins = {
      ...this.config.options.plugins,
      title: {
        ...this.config.options.plugins?.title,
        display: true,
        text: title
      }
    };
    
    return this;
  }

  /**
   * Set legend position
   */
  setLegendPosition(position: 'top' | 'bottom' | 'left' | 'right' | false): ChartConfigBuilder {
    if (!this.config.options) {
      this.config.options = {};
    }
    
    this.config.options.plugins = {
      ...this.config.options.plugins,
      legend: {
        ...this.config.options.plugins?.legend,
        display: position !== false,
        position: position || 'top'
      }
    };
    
    return this;
  }

  /**
   * Set responsive options
   */
  setResponsive(responsive: boolean = true, maintainAspectRatio: boolean = false): ChartConfigBuilder {
    this.config.responsive = responsive;
    
    if (!this.config.options) {
      this.config.options = {};
    }
    
    this.config.options.responsive = responsive;
    this.config.options.maintainAspectRatio = maintainAspectRatio;
    
    return this;
  }

  /**
   * Set chart dimensions
   */
  setDimensions(width?: number, height?: number, aspectRatio?: number): ChartConfigBuilder {
    if (!this.config.options) {
      this.config.options = {};
    }
    
    if (width !== undefined) {
      this.config.options.width = width;
    }
    
    if (height !== undefined) {
      this.config.options.height = height;
    }
    
    if (aspectRatio !== undefined) {
      this.config.options.aspectRatio = aspectRatio;
    }
    
    return this;
  }

  /**
   * Add or update scales
   */
  setScales(scales: any): ChartConfigBuilder {
    if (!this.config.options) {
      this.config.options = {};
    }
    
    this.config.options.scales = {
      ...this.config.options.scales,
      ...scales
    };
    
    return this;
  }

  /**
   * Set X axis configuration
   */
  setXAxis(config: any): ChartConfigBuilder {
    return this.setScales({ x: config });
  }

  /**
   * Set Y axis configuration
   */
  setYAxis(config: any): ChartConfigBuilder {
    return this.setScales({ y: config });
  }

  /**
   * Add plugins
   */
  setPlugins(plugins: any): ChartConfigBuilder {
    if (!this.config.options) {
      this.config.options = {};
    }
    
    this.config.options.plugins = {
      ...this.config.options.plugins,
      ...plugins
    };
    
    return this;
  }

  /**
   * Set custom options
   */
  setOptions(options: any): ChartConfigBuilder {
    this.config.options = {
      ...this.config.options,
      ...options
    };
    
    return this;
  }

  /**
   * Apply theme colors to data
   */
  private applyThemeColors(): void {
    if (!this.config.data || !this.config.data.datasets) {
      return;
    }

    const datasets = this.config.data.datasets;
    const colors = this.theme.colors;

    datasets.forEach((dataset: any, index: number) => {
      const colorIndex = index % colors.length;
      const color = colors[colorIndex];

      // Apply colors based on chart type
      if (this.config.type === 'line' || this.config.type === 'area') {
        dataset.borderColor = color;
        dataset.backgroundColor = color + '33'; // Add transparency
      } else if (this.config.type === 'pie' || this.config.type === 'doughnut') {
        if (!dataset.backgroundColor) {
          dataset.backgroundColor = colors;
        }
      } else {
        dataset.backgroundColor = color;
        dataset.borderColor = color;
      }
    });
  }

  /**
   * Apply theme to options
   */
  private applyThemeToOptions(): void {
    if (!this.config.options) {
      this.config.options = {};
    }

    // Apply theme colors to grid
    if (this.config.options.scales) {
      Object.values(this.config.options.scales).forEach((scale: any) => {
        if (scale.grid) {
          scale.grid.color = this.theme.grid;
        }
        if (scale.ticks) {
          scale.ticks.color = this.theme.text;
        }
      });
    }

    // Apply theme to legend
    if (this.config.options.plugins?.legend) {
      this.config.options.plugins.legend.labels = {
        ...this.config.options.plugins.legend.labels,
        color: this.theme.text
      };
    }

    // Apply theme to title
    if (this.config.options.plugins?.title) {
      this.config.options.plugins.title.color = this.theme.text;
    }
  }

  /**
   * Apply animation settings
   */
  private applyAnimation(): void {
    if (!this.config.options) {
      this.config.options = {};
    }

    this.config.options.animation = this.animation.enabled ? {
      duration: this.animation.duration,
      easing: this.animation.easing,
      delay: this.animation.delay
    } : false;
  }

  /**
   * Build final configuration
   */
  build(): ChartConfig {
    // Validate required fields
    if (!this.config.type) {
      throw new Error('Chart type is required');
    }

    if (!this.config.data) {
      throw new Error('Chart data is required');
    }

    // Apply theme and animations
    this.applyThemeColors();
    this.applyThemeToOptions();
    this.applyAnimation();

    // Set defaults
    const finalConfig: ChartConfig = {
      type: this.config.type,
      data: this.config.data,
      options: this.config.options || {},
      theme: this.theme,
      animation: this.animation,
      responsive: this.config.responsive !== false,
      interactive: this.config.interactive !== false
    };

    return finalConfig;
  }

  /**
   * Reset builder
   */
  reset(): ChartConfigBuilder {
    this.config = {};
    this.theme = CHART_THEMES.default;
    this.animation = { ...DEFAULT_ANIMATION };
    return this;
  }

  /**
   * Create builder from existing config
   */
  static fromConfig(config: ChartConfig): ChartConfigBuilder {
    const builder = new ChartConfigBuilder();
    
    builder.config = { ...config };
    
    if (config.theme) {
      builder.theme = config.theme;
    }
    
    if (config.animation) {
      builder.animation = { ...config.animation };
    }
    
    return builder;
  }

  /**
   * Get chart type information
   */
  static getChartTypeInfo(type: string): ChartType | undefined {
    return CHART_TYPES[type];
  }

  /**
   * Get all chart types
   */
  static getAllChartTypes(): Record<string, ChartType> {
    return { ...CHART_TYPES };
  }

  /**
   * Get chart types by category
   */
  static getChartTypesByCategory(category: string): ChartType[] {
    return Object.values(CHART_TYPES).filter(type => type.category === category);
  }

  /**
   * Get theme information
   */
  static getThemeInfo(themeName: string): ChartTheme | undefined {
    return CHART_THEMES[themeName];
  }

  /**
   * Get all themes
   */
  static getAllThemes(): Record<string, ChartTheme> {
    return { ...CHART_THEMES };
  }
}
