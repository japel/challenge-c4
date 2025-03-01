import express, { Request, Response } from 'express';
import * as analyticsService from '../services/analyticsService';

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Get analytics data
 * @access  Public
 */
router.get('/', (req: Request, res: Response): void => {
  const searchCount = analyticsService.getSearchCount();
  const cacheCount = analyticsService.getCacheCount();
  const averageResponseTime = analyticsService.getAverageResponseTime();
  const averageResponseTimeCached = analyticsService.getAverageResponseTimeCached();
  const topKeywords = analyticsService.getTopKeywords();
  
  res.json({
    success: true,
    data: {
      searchCount,
      cacheCount,
      averageResponseTime,
      averageResponseTimeCached,
      topKeywords
    }
  });
});

// Route to record analytics data
router.post('/', (req: Request, res: Response): void => {
  const { query, responseTime, cached } = req.body;
  analyticsService.recordSearch(query, responseTime, cached);
  res.json({ success: true });
});

export default router;
