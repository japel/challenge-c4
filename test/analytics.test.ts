import request from 'supertest';
import * as analyticsService from '../src/services/analyticsService';

// Mock the elasticsearch config
jest.mock('../src/config/elasticsearch', () => {
  return {
    client: {
      search: jest.fn(),
      info: jest.fn()
    },
    index: 'imago'
  };
});

// Mock the analytics service
jest.mock('../src/services/analyticsService');

// After mocking, we can require the app
import app from '../src/server';

describe('Analytics API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/analytics', () => {
    it('should return analytics data', async () => {
      // Mock the analytics service functions
      (analyticsService.getSearchCount as jest.Mock).mockReturnValue(10);
      (analyticsService.getCacheCount as jest.Mock).mockReturnValue(40);
      (analyticsService.getAverageResponseTime as jest.Mock).mockReturnValue(150);
      (analyticsService.getAverageResponseTimeCached as jest.Mock).mockReturnValue(250);
      (analyticsService.getTopKeywords as jest.Mock).mockReturnValue([
        { keyword: 'test', count: 5 },
        { keyword: 'image', count: 3 }
      ]);

      const response = await request(app).get('/api/analytics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.searchCount).toBe(10);
      expect(response.body.data.cacheCount).toBe(40);
      expect(response.body.data.averageResponseTime).toBe(150);
      expect(response.body.data.averageResponseTimeCached).toBe(250);
      expect(response.body.data.topKeywords).toHaveLength(2);
      expect(analyticsService.getSearchCount).toHaveBeenCalledTimes(1);
      expect(analyticsService.getAverageResponseTime).toHaveBeenCalledTimes(1);
      expect(analyticsService.getTopKeywords).toHaveBeenCalledTimes(1);
    });
  });
});
