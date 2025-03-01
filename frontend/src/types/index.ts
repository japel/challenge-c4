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
  success: boolean;
  responseTime: number;
  totalHits: number;
  page: number;
  limit: number;
  totalPages: number;
  hits: MediaItem[];
}

// Analytics results interface
export interface AnalyticsResults {
  success: boolean;
  data: {
    searchCount: number;
    cacheCount: number;
    averageResponseTime: number;
    averageResponseTimeCached: number;
    topKeywords: Array<{keyword: string; count: number}>;
  };
}
