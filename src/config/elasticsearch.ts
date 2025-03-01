import { Client } from '@elastic/elasticsearch';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

// Create and configure the Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_HOST,
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Ignoring SSL certificate issues as mentioned in the requirements
  }
});

// Test the connection
async function checkConnection(): Promise<boolean> {
  try {
    const info = await client.info();
    logger.info(`Elasticsearch connected to ${info.name} cluster`);
    return true;
  } catch (error) {
    logger.error('Elasticsearch connection error:', error);
    return false;
  }
}

// Initialize connection when the app starts
checkConnection();

const index = process.env.ELASTICSEARCH_INDEX;

export {
  client,
  checkConnection,
  index
};
