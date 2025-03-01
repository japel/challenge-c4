import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Group,
  Card,
  Select,
  Grid,
  Box,
  Collapse,
  Tooltip,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SearchParams } from '../types';

// Define initial search params
const initialSearchParams: SearchParams = {
  q: '',
  photographer: '',
  dateFrom: '',
  dateTo: '',
  restrictions: '',
  // Leave sort fields empty for backend defaults
  sortBy: '',
  sortOrder: '',
  page: 1,
  limit: 12,
};

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams);
  const [opened, { toggle }] = useDisclosure(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  // Handle input changes
  const handleChange = (name: keyof SearchParams, value: string | number | boolean) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  // Handle reset
  const handleReset = () => {
    setSearchParams(initialSearchParams);
    onSearch(initialSearchParams);
  };

  return (
    <Card withBorder shadow="sm" radius="md" p="md" mb="xl">
      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Search Keywords"
              placeholder="Search across title and caption fields (e.g. Manchester, Jackson...)"
              size="md"
              value={searchParams.q || ''}
              onChange={e => handleChange('q', e.target.value)}
              styles={{
                input: {
                  '&:focus': {
                    borderColor: '#228BE6',
                  },
                },
              }}
            />
          </Grid.Col>
        </Grid>

        <Collapse in={opened}>
          <Box mt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Photographer"
                  placeholder="Filter by photographer"
                  value={searchParams.photographer || ''}
                  onChange={e => handleChange('photographer', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Restrictions"
                  placeholder="Filter by restrictions"
                  value={searchParams.restrictions || ''}
                  onChange={e => handleChange('restrictions', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Date From"
                  placeholder="DD.MM.YYYY"
                  value={searchParams.dateFrom || ''}
                  onChange={e => handleChange('dateFrom', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Date To"
                  placeholder="DD.MM.YYYY"
                  value={searchParams.dateTo || ''}
                  onChange={e => handleChange('dateTo', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Sort By"
                  placeholder="Select a field to sort by (default: relevance)"
                  value={searchParams.sortBy || ''}
                  onChange={value => handleChange('sortBy', value || '')}
                  data={[
                    { value: '', label: 'Relevance' },
                    { value: 'datum', label: 'Date' },
                    { value: 'bildnummer', label: 'Image Number' },
                    { value: 'fotografen', label: 'Photographer' },
                  ]}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Sort Order"
                  placeholder="Select a sort order (default: descending)"
                  value={searchParams.sortOrder || ''}
                  onChange={value => handleChange('sortOrder', value || '')}
                  data={[
                    { value: 'desc', label: 'Descending' },
                    { value: 'asc', label: 'Ascending' },
                  ]}
                  clearable
                  disabled={!searchParams.sortBy} // Only enable if sortBy is selected
                />
              </Grid.Col>
            </Grid>
          </Box>
        </Collapse>

        <Group justify="space-between" mt="lg">
          <Tooltip label={opened ? 'Hide advanced filters' : 'Show advanced filters'}>
            <Button
              variant="subtle"
              color="gray"
              onClick={toggle}
              leftSection={<Text size="xl">{opened ? '−' : '+'}</Text>}
            >
              {opened ? 'Less filters' : 'More filters'}
            </Button>
          </Tooltip>

          <Group>
            <Button variant="outline" color="gray" onClick={handleReset} disabled={isLoading}>
              Reset
            </Button>
            <Button type="submit" loading={isLoading}>
              Search
            </Button>
          </Group>
        </Group>
      </form>
    </Card>
  );
};

export default SearchForm;
