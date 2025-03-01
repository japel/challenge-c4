import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell, Box, Text } from '@mantine/core';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App: React.FC = () => {
  return (
    <AppShell
      header={{ height: 70 }}
      footer={{ height: 60 }}
      padding="md"
      styles={{
        main: {
          background: '#f9fafb'
        }
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </AppShell.Main>
      
      <AppShell.Footer p="md">
        <Box ta="center">
          <Text size="sm" c="dimmed">
            IMAGO Media Search © {new Date().getFullYear()} - Built with React, TypeScript, and Mantine UI
          </Text>
        </Box>
      </AppShell.Footer>
    </AppShell>
  );
};

export default App;