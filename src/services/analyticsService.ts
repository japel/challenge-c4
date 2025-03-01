import logger from '../utils/logger';
import { AnalyticsData } from '../types/interfaces';

// In-memory storage for basic analytics
// In a production environment, this would be a database
const analytics: AnalyticsData = {
  searchCount: 0,
  cacheCount: 0,
  responseTimeLog: [],
  queryKeywords: {}
};

interface KeywordCount {
  keyword: string;
  count: number;
}

const recordSearch = (query: Record<string, any>, responseTime: number, cached: boolean = false): void => {
  try {
    // Increment search count
    if (!cached) {
        analytics.searchCount += 1;
    } else {
        analytics.cacheCount += 1;
    }
    
    // Log response time
    analytics.responseTimeLog.push({
      timestamp: new Date(),
      responseTime,
      cached
    });
    
    // Track search keywords
    if (query.q) {
      const keywords = (query.q as string).toLowerCase().split(' ');
      keywords.forEach((keyword: string) => {
        if (keyword.length > 2) { // Ignore very short words
          analytics.queryKeywords[keyword] = (analytics.queryKeywords[keyword] || 0) + 1;
        }
      });
    }
    
    // Trim response time log if it gets too large
    if (analytics.responseTimeLog.length > 1000) {
      analytics.responseTimeLog = analytics.responseTimeLog.slice(-1000);
    }
  } catch (error) {
    logger.error('Error recording analytics:', error);
  }
};

const getSearchCount = (): number => {
    return analytics.searchCount;
};

const getCacheCount = (): number => {
    return analytics.cacheCount;
};

const getAverageResponseTime = (): number => {
    // Filter logs where cached is false
    const filteredLogs = analytics.responseTimeLog.filter(log => !log.cached);
  
    if (filteredLogs.length === 0) return 0;  // If no logs with cached false, return 0
    
    const sum = filteredLogs.reduce((acc, log) => acc + log.responseTime, 0);
    return sum / filteredLogs.length;  // Return the average of responseTime for cached false logs
  };
  
  const getAverageResponseTimeCached = (): number => {
    if (analytics.responseTimeLog.length === 0) return 0;  // If there are no logs, return 0
    
    const sum = analytics.responseTimeLog.reduce((acc, log) => acc + log.responseTime, 0);
    return sum / analytics.responseTimeLog.length;  // Return the average of responseTime for all logs
  };

const getTopKeywords = (limit = 10): KeywordCount[] => {
  return Object.entries(analytics.queryKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
};

export {
  recordSearch,
  getSearchCount,
  getCacheCount,
  getAverageResponseTime,
  getAverageResponseTimeCached,
  getTopKeywords
};
