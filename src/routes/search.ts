import express, { Request, Response, NextFunction } from 'express';
import * as searchService from '../services/searchService';
import * as analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

const router = express.Router();

/**
 * @route   GET /api/search
 * @desc    Search media items
 * @access  Public
 */
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const {
      q,
      photographer,
      dateFrom,
      dateTo,
      restrictions,
      sortBy,
      sortOrder,
      page,
      limit
    } = req.query;
    
    // Convert pagination parameters to numbers
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    
    // Perform the search
    const results = await searchService.search({
      q: q as string,
      photographer: photographer as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      restrictions: restrictions as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string,
      page: pageNum,
      limit: limitNum
    });
    
    // Record analytics
    const responseTime = Date.now() - startTime;
    analyticsService.recordSearch(req.query, responseTime);
    
    // Log the search
    logger.info('Search performed', { 
      query: req.query, 
      hits: results.totalHits,
      responseTime 
    });
    
    // Return results
    res.json({
      success: true,
      responseTime,
      ...results
    });
  } catch (error) {
    next(error);
  }
});

export default router;