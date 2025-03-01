import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, createTheme } from '@mantine/core';
import { postAnalytics } from './services/api';
import '@mantine/core/styles.css';
import App from './App';
import './styles.css';

export const createQueryClient = (cacheEnabled: boolean) => {
    return new QueryClient({
      defaultOptions: {
        queries: cacheEnabled
          ? {
              staleTime: 1000 * 60 * 5, // 5 minutes
              gcTime: 1000 * 60 * 30, // 30 minutes
              refetchOnWindowFocus: false,
              refetchOnReconnect: false,
            }
          : {
              staleTime: 0, // Always stale (forces re-fetch)
              gcTime: 0, // Garbage collect immediately (disable caching)
              refetchOnWindowFocus: false,
              refetchOnReconnect: false,
            },
      },
    });
  };

const queryClient = createQueryClient(false);

queryClient.getQueryCache().subscribe((queryc) => {
    // hacky way to detect cache hits
    console.log(queryc);
    if(queryc.query.queryKey[0] === 'search' && queryc.type === 'observerOptionsUpdated') {
        postAnalytics({
          query: 'search',
          responseTime: 0,
          cached: true})
    }
  });

// Create a Mantine theme
const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'blue',
  colors: {
    brand: [
      '#E7F5FF',
      '#D0EBFF',
      '#A5D8FF',
      '#74C0FC',
      '#4DABF7',
      '#339AF0',
      '#228BE6',
      '#1C7ED6',
      '#1971C2',
      '#1864AB',
    ],
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
