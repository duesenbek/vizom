export declare function initializeErrorTracking(): void;
export declare class ErrorTracker {
  static trackError(error: any, context?: Record<string, any>): void;
  static trackUserAction(action: string, properties?: Record<string, any>): void;
  static trackAPIError(error: any, endpoint: string, method: string, requestData?: Record<string, any>): void;
  static trackPerformance(metricName: string, value: number, unit?: string): void;
  static setUser(user: { id?: string; email?: string; username?: string }): void;
  static clearUser(): void;
  static trackFeatureUsage(featureName: string, properties?: Record<string, any>): void;
  static trackChartError(error: any, chartType: string, prompt?: string, responseTime?: number): void;
}
