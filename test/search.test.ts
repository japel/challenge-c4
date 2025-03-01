import request from 'supertest';
import app from '../src/server';
import { client } from '../src/config/elasticsearch';

// Mock the elasticsearch client
jest.mock('../src/config/elasticsearch', () => {
  return {
    client: {
      search: jest.fn(),
      info: jest.fn(),
    },
    index: 'imago',
  };
});

describe('Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/search', () => {
    it('should return search results', async () => {
      // Mock the Elasticsearch response
      (client.search as jest.Mock).mockResolvedValueOnce({
        hits: {
          total: { value: 1 },
          hits: [
            {
              _id: '1',
              _score: 1.0,
              _source: {
                suchtext: 'Test Image',
                bildnummer: '1234567890',
                fotografen: 'Test Photographer',
                datum: '01.01.2023',
                hoehe: '1000',
                breite: '1000',
              },
            },
          ],
        },
      });

      const response = await request(app).get('/api/search').query({ q: 'test' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.hits).toHaveLength(1);
      expect(client.search).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      // Mock an Elasticsearch error
      (client.search as jest.Mock).mockRejectedValueOnce(new Error('Elasticsearch error'));

      const response = await request(app).get('/api/search').query({ q: 'test' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
