/**
 * Global TypeScript Definitions for Vizom
 * Provides type safety across the application
 */

// Global window extensions
declare global {
  interface Window {
    // Chart system
    chartEngine: import('./chart-engine-refactored').ChartEngine;
    
    // Modal system
    ModalSystem: import('./components/ModalSystemRefactored').ModalSystem;
    modalSystem: import('./components/ModalSystemRefactored').ModalSystem;
    
    // Workflow system
    workflowOptimizer: import('./components/workflow/WorkflowOptimizer').WorkflowOptimizer;
    
    // Application
    vizomApp: import('./app-refactored-new').VizomApp;
    
    // Legacy compatibility
    Chart: any;
    Chartjs: any;
  }
}

// Chart.js type extensions
declare module 'chart.js' {
  interface ChartConfiguration {
    type: string;
    data: ChartData;
    options?: ChartOptions;
  }
  
  interface ChartData {
    labels?: string[];
    datasets: ChartDataset[];
  }
  
  interface ChartDataset {
    label?: string;
    data: number[] | any[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
  }
  
  interface ChartOptions {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
      legend?: {
        display?: boolean;
        position?: 'top' | 'bottom' | 'left' | 'right';
      };
      title?: {
        display?: boolean;
        text?: string;
        font?: {
          size?: number;
          weight?: string;
        };
        color?: string;
      };
      tooltip?: {
        backgroundColor?: string;
        enabled?: boolean;
      };
    };
    scales?: {
      [key: string]: {
        beginAtZero?: boolean;
        grid?: {
          color?: string;
          display?: boolean;
        };
        title?: {
          display?: boolean;
          text?: string;
        };
        ticks?: {
          color?: string;
        };
      };
    };
    animation?: {
      duration?: number;
      easing?: string;
    };
  }
}

// API response types
export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface ChartGenerationResponse {
  config: any;
  type: string;
  metadata?: {
    processingTime: number;
    chartType: string;
    dataPoints: number;
  };
}

export interface DataParsingResponse {
  data: any;
  format: string;
  columns: string[];
  rows: any[];
  metadata?: {
    originalFormat: string;
    detectedFormat: string;
    confidence: number;
  };
}

// Event types
export interface VizomEvent {
  type: string;
  data?: any;
  timestamp: Date;
}

export interface ChartEvent extends VizomEvent {
  type: 'chart:generated' | 'chart:generation-error' | 'chart:render' | 'chart:export';
  chartType?: string;
  config?: any;
}

export interface DataEvent extends VizomEvent {
  type: 'data:parsed' | 'data:parsing-error' | 'data:validated';
  format?: string;
  data?: any;
}

export interface ModalEvent extends VizomEvent {
  type: 'modal:open' | 'modal:close' | 'modal:before-close';
  modalId: string;
}

export interface WorkflowEvent extends VizomEvent {
  type: 'workflow:start' | 'workflow:complete' | 'step:start' | 'step:complete';
  workflowId: string;
  stepId?: string;
}

// Configuration types
export interface VizomConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  charts: {
    defaultTheme: string;
    animations: boolean;
    responsive: boolean;
  };
  ui: {
    theme: string;
    language: string;
  };
  features: {
    export: boolean;
    templates: boolean;
    customization: boolean;
  };
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface DataValidationResult extends ValidationResult {
  dataQuality: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
}

// Export types
export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'jpg' | 'csv' | 'json';
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  width?: number;
  height?: number;
  backgroundColor?: string;
  includeLegend?: boolean;
  includeTitle?: boolean;
}

export interface ExportResult {
  success: boolean;
  url?: string;
  blob?: Blob;
  filename?: string;
  size?: number;
  error?: string;
}

// Template types
export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  chartType: string;
  preview: string;
  config: any;
  requirements: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// User types
export interface UserPreferences {
  theme: string;
  language: string;
  defaultChartType: string;
  animations: boolean;
  autoSave: boolean;
  exportFormat: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  subscription: {
    plan: string;
    expiresAt: Date;
    features: string[];
  };
}

// Error types
export class VizomError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: any
  ) {
    super(message);
    this.name = 'VizomError';
  }
}

export class ChartError extends VizomError {
  constructor(message: string, chartType?: string, context?: any) {
    super(message, 'CHART_ERROR', { chartType, ...context });
    this.name = 'ChartError';
  }
}

export class DataError extends VizomError {
  constructor(message: string, dataType?: string, context?: any) {
    super(message, 'DATA_ERROR', { dataType, ...context });
    this.name = 'DataError';
  }
}

export class APIError extends VizomError {
  constructor(message: string, statusCode?: number, context?: any) {
    super(message, 'API_ERROR', { statusCode, ...context });
    this.name = 'APIError';
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EventHandler<T = any> = (event: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// Performance monitoring types
export interface PerformanceMetrics {
  renderTime: number;
  dataSize: number;
  chartType: string;
  timestamp: Date;
  memoryUsage?: number;
}

export interface PerformanceReport {
  totalCharts: number;
  averageRenderTime: number;
  slowestChart: {
    type: string;
    renderTime: number;
  };
  memoryUsage: number;
  recommendations: string[];
}

// Plugin types
export interface VizomPlugin {
  name: string;
  version: string;
  init: () => void;
  destroy?: () => void;
  config?: any;
}

export interface PluginRegistry {
  register: (plugin: VizomPlugin) => void;
  unregister: (name: string) => void;
  get: (name: string) => VizomPlugin | undefined;
  getAll: () => VizomPlugin[];
}

export {};
