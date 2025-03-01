import React, { useState, useCallback } from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import { SearchParams, SearchResults as SearchResultsType } from '../types';
import { useSearch } from '../hooks/useSearch';

const SearchPage: React.FC = () => {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>({
    q: '',
    page: 1,
    limit: 12,
    sortBy: 'datum',
    sortOrder: 'desc',
  });

  // Use the search hook with React Query for caching
  const { data, isLoading, isError } = useSearch(searchParams);

  // Handle search submit
  const handleSearch = useCallback((params: SearchParams) => {
    // Reset to page 1 when search criteria changes
    setSearchParams({ ...params, page: 1 });
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>IMAGO Media Search</Title>
          <Text c="dimmed">Search through IMAGO's extensive media library</Text>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        <SearchResults
          results={data as SearchResultsType | undefined}
          isLoading={isLoading}
          isError={isError}
          onPageChange={handlePageChange}
          searchParams={searchParams}
        />
      </Stack>
    </Container>
  );
};

export default SearchPage;
