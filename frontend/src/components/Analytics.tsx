import React from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Title,
  Grid,
  Divider,
  RingProgress,
  Center,
  Alert,
  Skeleton,
  Box,
} from '@mantine/core';
import { useAnalytics } from '../hooks/useSearch';

const Analytics: React.FC = () => {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height={200} mb="md" radius="md" />
        <Skeleton height={200} mb="md" radius="md" />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert color="red" title="Error loading analytics" variant="filled">
        Something went wrong while loading the analytics data. Please try again later.
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert color="blue" title="No data available" variant="light">
        No analytics data is currently available.
      </Alert>
    );
  }

  const { searchCount, cacheCount, averageResponseTime, averageResponseTimeCached, topKeywords } =
    data.data;

  return (
    <Stack gap="xl">
      <Title order={2} mb="md">
        Search Analytics
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" p="lg" radius="md" h="100%">
            <Stack gap="md">
              <Title order={3}>Performance Metrics</Title>
              <Divider />

              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="lg" fw={500}>
                    Total Searches
                  </Text>
                  <Text c="dimmed">Number of searches performed</Text>
                </Stack>
                <Text size="xl" fw={700} c="blue">
                  {searchCount}
                </Text>
              </Group>

              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="lg" fw={500}>
                    Total Cache hits
                  </Text>
                  <Text c="dimmed">Number of cache hits</Text>
                </Stack>
                <Text size="xl" fw={700} c="blue">
                  {cacheCount}
                </Text>
              </Group>

              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="lg" fw={500}>
                    Average Response Time (no cache)
                  </Text>
                  <Text c="dimmed">Time to process search requests</Text>
                </Stack>
                <Text size="xl" fw={700} c="blue">
                  {averageResponseTime.toFixed(2)}ms
                </Text>
              </Group>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="lg" fw={500}>
                    Average Response Time (with cache)
                  </Text>
                  <Text c="dimmed">Including cached responses</Text>
                </Stack>
                <Text size="xl" fw={700} c="blue">
                  {averageResponseTimeCached.toFixed(2)}ms
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" p="lg" radius="md" h="100%">
            <Stack gap="md">
              <Title order={3}>Top Search Keywords</Title>
              <Divider />

              {topKeywords.length === 0 ? (
                <Text c="dimmed">No keywords data available yet</Text>
              ) : (
                <Stack gap="xs">
                  {topKeywords.slice(0, 5).map((item, index) => {
                    // Calculate percentage for visualization
                    const totalCount = topKeywords.reduce((sum, k) => sum + k.count, 0);
                    const percentage = Math.round((item.count / totalCount) * 100);

                    return (
                      <Group key={item.keyword} justify="space-between" wrap="nowrap">
                        <Box style={{ width: '70%' }}>
                          <Group justify="space-between" wrap="nowrap">
                            <Text fw={500}>
                              {index + 1}. {item.keyword}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {item.count} searches
                            </Text>
                          </Group>
                          <div
                            style={{
                              height: '8px',
                              backgroundColor: '#E9ECEF',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              marginTop: '4px',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: '#228BE6',
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                        </Box>
                        <RingProgress
                          size={60}
                          thickness={4}
                          roundCaps
                          sections={[{ value: percentage, color: 'blue' }]}
                          label={
                            <Center>
                              <Text size="xs" fw={700}>
                                {percentage}%
                              </Text>
                            </Center>
                          }
                        />
                      </Group>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Analytics;
