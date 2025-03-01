import React from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Badge, 
  Grid, 
  Pagination, 
  Skeleton,
  Alert,
  Stack,
  Box,
  Divider,
  AspectRatio
} from '@mantine/core';
import { MediaItem, SearchResults as SearchResultsType, SearchParams } from '../types';

interface SearchResultsProps {
  results: SearchResultsType | undefined;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (page: number) => void;
  searchParams: SearchParams;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  isError, 
  onPageChange, 
  searchParams 
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Stack>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} height={200} mb="md" radius="md" />
        ))}
      </Stack>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <Alert color="red" title="Error loading results" variant="filled">
        Something went wrong while loading the search results. Please try again later.
      </Alert>
    );
  }
  
  // No results state
  if (results && results.totalHits === 0) {
    return (
      <Alert color="blue" title="No results found" variant="light">
        No media items match your search criteria. Try adjusting your search parameters.
      </Alert>
    );
  }
  
  // Empty state (no search performed yet)
  if (!results) {
    return (
      <Alert color="blue" title="Search for media" variant="light">
        Use the search form above to find media items in the IMAGO library.
      </Alert>
    );
  }
  
  // Highlight matches in text with proper em tag handling
  const highlightMatches = (text: string, highlights?: string[]) => {
    if (!highlights || highlights.length === 0 || !searchParams.q) {
      return <Text lineClamp={3}>{text}</Text>;
    }
    
    // Use the first highlight
    let highlightText = highlights[0];
    const maxLength = 200;
    
    // Replace <em> tags with bold styling
    // First, create a document fragment to safely parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${highlightText}</div>`, 'text/html');
    const frag = doc.querySelector('div');
    
    // Get the cleaned text for length check
    const cleanText = frag?.textContent || highlightText;
    
    // Trim highlight if too long
    if (cleanText.length > maxLength) {
      // We'll need to truncate, but this is complex with HTML
      // For simplicity, we'll just use the truncated plain text
      highlightText = cleanText.substring(0, maxLength) + '...';
      
      // And then manually rebuild with em tags
      if (searchParams.q) {
        const regex = new RegExp(`(${searchParams.q})`, 'gi');
        highlightText = highlightText.replace(regex, '<em>$1</em>');
      }
    }
    
    // Create elements from the highlighted HTML
    return (
      <Text 
        dangerouslySetInnerHTML={{ 
          __html: highlightText.replace(/<em>/g, '<strong>').replace(/<\/em>/g, '</strong>') 
        }} 
      />
    );
  };
  
  // Use placeholder image with bildnummer overlay
  const getImage = (item: MediaItem) => {
    return (
      <Box 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative'
        }}
      >
        <img 
          src="/placeholder-image.svg"
          alt={item.suchtext}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '5px 10px',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Text fw={500} size="sm">
            {item.bildnummer}
          </Text>
        </Box>
      </Box>
    );
  };
  
  // Format date to locale string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Text fw={500}>
          Found {results.totalHits} result{results.totalHits !== 1 ? 's' : ''} in {results.responseTime}ms
        </Text>
        
        {results.totalPages > 1 && (
          <Pagination
            total={results.totalPages}
            value={results.page}
            onChange={onPageChange}
            withEdges
          />
        )}
      </Group>
      
      <Grid>
        {results.hits.map((item) => (
          <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" p="lg" radius="md">
              <Card.Section>
                <AspectRatio ratio={3/2}>
                  {getImage(item)}
                </AspectRatio>
              </Card.Section>
              
              <Stack gap="xs" mt="md" mb="xs">
                <Group justify="space-between">
                  <Badge color="blue">{item.bildnummer}</Badge>
                  <Text size="sm" c="dimmed">{formatDate(item.datum)}</Text>
                </Group>
                
                <Text fw={500} size="lg" lineClamp={1}>
                  {item.suchtext.substring(0, 50)}
                  {item.suchtext.length > 50 && '...'}
                </Text>
                
                <Divider my="xs" />
                
                {highlightMatches(item.suchtext, item.highlights)}
                
                <Group justify="space-between" mt="md">
                  <Text size="sm" c="dimmed">
                    {item.fotografen}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {item.breite}×{item.hoehe}
                  </Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      
      {results.totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            total={results.totalPages}
            value={results.page}
            onChange={onPageChange}
            withEdges
            size="lg"
          />
        </Group>
      )}
    </Stack>
  );
};

export default SearchResults;