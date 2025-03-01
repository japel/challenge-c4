import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Group, Title, Text, Box } from '@mantine/core';

const Header: React.FC = () => {
  return (
    <Box bg="dark" c="white" h="100%">
      <Container size="lg" h="100%">
        <Group justify="space-between" h="100%">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <Group gap="xs">
              <Box
                w={32}
                h={32}
                bg="blue"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                }}
              >
                <Text fw={700} size="lg" c="white">
                  I
                </Text>
              </Box>
              <div>
                <Title order={3}>IMAGO</Title>
                <Text size="xs" c="gray.4">
                  Media Search
                </Text>
              </div>
            </Group>
          </Link>

          <Group gap="md">
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <Text>Search</Text>
            </Link>
            <Link to="/analytics" style={{ textDecoration: 'none', color: 'white' }}>
              <Text>Analytics</Text>
            </Link>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
