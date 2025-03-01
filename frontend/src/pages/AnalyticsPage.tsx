import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import Analytics from '../components/Analytics';

const AnalyticsPage: React.FC = () => {
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>IMAGO Search Analytics</Title>
          <Text c="dimmed">View usage statistics and performance metrics</Text>
        </div>

        <Analytics />
      </Stack>
    </Container>
  );
};

export default AnalyticsPage;
