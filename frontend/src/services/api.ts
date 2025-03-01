import axios from 'axios';
import { SearchParams, SearchResults, AnalyticsResults } from '../types';

// Create an axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to search media items
export const searchMedia = async (params: SearchParams): Promise<SearchResults> => {
  // Set default limit to 12 if not specified and remove empty parameters
  const cleanParams: Record<string, any> = {};

  // Only include non-empty parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value;
    }
  });

  // Ensure limit is set
  if (!cleanParams.limit) cleanParams.limit = 12;

  // Remove sortBy=datum if it exists (let the backend use the default sort by score)
  if (cleanParams.sortBy === 'datum' && !params.sortBy) {
    delete cleanParams.sortBy;
  }

  const response = await api.get<SearchResults>('/search', { params: cleanParams });
  return response.data;
};

// Function to get analytics data
export const getAnalytics = async (): Promise<AnalyticsResults> => {
  const response = await api.get<AnalyticsResults>('/analytics');
  return response.data;
};

// Function to post analytics data
export const postAnalytics = async (data: any): Promise<void> => {
  await api.post('/analytics', data);
};

export default api;
