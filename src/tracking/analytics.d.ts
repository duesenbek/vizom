export declare function initializeAnalytics(preferred?: Array<'plausible'|'umami'|'ga'>): Promise<'plausible'|'umami'|'ga'|null>;
export declare function trackPageview(url?: string, title?: string): boolean;
export declare function trackEvent(name: string, params?: Record<string, any>): boolean;
export declare function setUser(userId: string): boolean;
