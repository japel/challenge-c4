import { client, index } from '../config/elasticsearch';
import logger from '../utils/logger';
import { MediaItem, SearchParams, SearchResults } from '../types/interfaces';

/**
 * Convert a date from DD.MM.YYYY format to ISO format (YYYY-MM-DD)
 * @param dateString - Date in DD.MM.YYYY format
 * @returns ISO formatted date string or original string if not valid
 */
const formatDateForElasticsearch = (dateString: string): string => {
  if (!dateString) return dateString;
  
  // Check if the date is in DD.MM.YYYY format
  const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = dateString.match(dateRegex);
  
  if (match) {
    const [_, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  
  // Return original string if it doesn't match the pattern
  return dateString;
};

/**
 * Performs a search using Elasticsearch
 * @param params - Search parameters
 * @returns Promise with search results
 */
const search = async (params: SearchParams): Promise<SearchResults> => {
  // Extract parameters and handle type conversion
  let {
    q = '',
    photographer = '',
    dateFrom = '',
    dateTo = '',
    restrictions = '',
    sortBy = '',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = params;
  
  // Ensure page and limit are numbers
  page = typeof page === 'string' ? parseInt(page) : page;
  limit = typeof limit === 'string' ? parseInt(limit) : limit;

  // Calculate offset
  const from = (page - 1) * limit;
  
  // Build the base query
  const query = {
    bool: {
      must: [] as any[],
      filter: [] as any[]
    }
  };
  
  // Add keyword search if provided
  if (q) {
    // Split the query into terms for better multi-term handling
    const terms = q.trim().split(/\s+/);
    const isMultiTerm = terms.length > 1;
    
    // Create different query structures based on single vs multi-term queries
    if (isMultiTerm) {
      // For multi-term queries like "Michael Jackson", use a more granular approach
      // Create a boolean query where we focus strongly on exact phrase matches
      const multiTermQuery = {
        bool: {
          should: [
            // Exact phrase match with very high boost - this should put exact matches at the top
            { 
              match_phrase: { 
                suchtext: { 
                  query: q,
                  boost: 50  // Much higher boost to ensure exact matches come first
                } 
              } 
            },
            // Match on all terms individually, but with a lower boost
            ...terms.map(term => ({ 
              match: { 
                suchtext: {
                  query: term,
                  boost: 2
                } 
              } 
            }))
          ],
          minimum_should_match: 1
        }
      };
      
      // Add the multi-term query to the main query
      query.bool.must.push(multiTermQuery);
    } else {
      // For single-term queries (e.g., just "Michael")
      const singleTerm = q.trim();
      const isNumeric = !isNaN(parseInt(singleTerm));
      
      const keywordQuery: any = {
        bool: {
          should: [
            // Exact term match with highest boost
            { term: { suchtext: { value: singleTerm, boost: 5 } } },
            // Partial match using standard analyzer
            { match: { suchtext: { query: singleTerm, boost: 3 } } }
          ],
          minimum_should_match: 1
        }
      };
      
      // Add numeric search for bildnummer if it's a number
      if (isNumeric) {
        keywordQuery.bool.should.push({ 
          term: { bildnummer: singleTerm }
        });
      }
      
      query.bool.must.push(keywordQuery);
    }
  }
  
  // Add photographer filter if provided
  if (photographer && photographer.trim() !== '') {
    query.bool.filter.push({
      match: {
        fotografen: photographer
      }
    });
  }
  
  // Add date range filter if provided
  if ((dateFrom && dateFrom.trim() !== '') || (dateTo && dateTo.trim() !== '')) {
    const rangeFilter = {
      range: {
        datum: {
          ...(dateFrom && dateFrom.trim() !== '' && { gte: formatDateForElasticsearch(dateFrom) }),
          ...(dateTo && dateTo.trim() !== '' && { lte: formatDateForElasticsearch(dateTo) })
        }
      }
    };
    
    query.bool.filter.push(rangeFilter);
  }
  
  // Add restrictions filter if provided
  if (restrictions && restrictions.trim() !== '') {
    query.bool.filter.push({
      match_phrase: {
        suchtext: restrictions
      }
    });
  }
  
  // If no query or filter is provided, match all documents
  if (query.bool.must.length === 0 && query.bool.filter.length === 0) {
    query.bool.must.push({
      match_all: {}
    });
  }
  
  // Build sort options - respect user's sort choice
  let sortOption: any[];
  
  if (sortBy && sortBy !== '_score') {
    // If user explicitly chose a sort field (like datum), use that as primary sort
    sortOption = [
      { [sortBy]: { order: sortOrder } },  // Primary sort by requested field
      { _score: 'desc' }  // Secondary sort by score
    ];
  } else {
    // Default to sorting by score
    sortOption = [{ _score: 'desc' }];
  }
  
  try {
    // Start measuring response time
    const startTime = Date.now();
    
    const result = await client.search({
      index,
      body: {
        query,
        sort: sortOption,
        from,
        size: limit,
        _source: [
          'suchtext',
          'bildnummer',
          'fotografen',
          'datum',
          'hoehe',
          'breite'
        ],
        highlight: {
          fields: {
            suchtext: {}
          }
        }
      }
    });
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Extract and format results
    const hits: MediaItem[] = result.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
      highlights: hit.highlight ? hit.highlight.suchtext : []
    }));
    
    // Handle total hits (could be number or object with value property)
    const totalHits = typeof result.hits.total === 'number' 
      ? result.hits.total 
      : (result.hits.total?.value || 0);
    
    // Log the search query for analytics purposes
    logger.info(`Search performed`, {
      query: params,
      hits: totalHits,
      responseTime,
      timestamp: new Date().toISOString()
    });
    
    return {
      totalHits,
      page,
      limit,
      totalPages: Math.ceil(totalHits / limit),
      hits,
      responseTime
    };
  } catch (error) {
    logger.error('Elasticsearch query error:', error);
    throw new Error('Error executing search query');
  }
};

export {
  search
};
