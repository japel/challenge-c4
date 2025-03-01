import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { searchMedia } from '../services/api';
import { SearchParams, SearchResults } from '../types';

export const useSearch = (params: SearchParams, cacheEnabled: boolean = false) => {
    const queryOptions: UseQueryOptions<SearchResults, Error, SearchResults, [string, SearchParams]> = {
      queryKey: ['search', params],
      queryFn: () => searchMedia(params),
      enabled: !!params.q || !!params.photographer || !!params.dateFrom || !!params.dateTo || !!params.restrictions,
      placeholderData: (previousData: SearchResults | undefined) => previousData,
      gcTime: cacheEnabled ? 1000 * 60 * 5 : 0,
      staleTime: cacheEnabled ? 1000 * 60 * 1 : 0,
    };
  
    return useQuery(queryOptions);
  };

export const useAnalytics = (cacheEnabled: boolean = false) => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => import('../services/api').then(mod => mod.getAnalytics()),
    gcTime: cacheEnabled ? 1000 * 60 * 5 : 0,
    staleTime: cacheEnabled ? 1000 * 60 * 1 : 0,
  });
};
