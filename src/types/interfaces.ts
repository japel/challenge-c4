// Media item interface
export interface MediaItem {
  id?: string;
  suchtext: string;
  bildnummer: string;
  fotografen: string;
  datum: string;
  hoehe: string;
  breite: string;
  score?: number;
  highlights?: string[];
}

// Search parameters interface
export interface SearchParams {
  q?: string;
  photographer?: string;
  dateFrom?: string;
  dateTo?: string;
  restrictions?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

// Search results interface
export interface SearchResults {
  totalHits: number;
  page: number;
  limit: number;
  totalPages: number;
  hits: MediaItem[];
  responseTime?: number;
}

// Response time log entry
export interface ResponseTimeLog {
  timestamp: Date;
  responseTime: number;
  cached?: boolean;
}

// Analytics data interface
export interface AnalyticsData {
  searchCount: number;
  cacheCount: number;
  responseTimeLog: ResponseTimeLog[];
  queryKeywords: Record<string, number>;
}

// Analytics results interface
export interface AnalyticsResults {
  searchCount: number;
  cacheCount: number;
  averageResponseTime: number;
  averageResponseTimeCached: number;
  topKeywords: Array<{keyword: string; count: number}>;
}

// Error interface
export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}
