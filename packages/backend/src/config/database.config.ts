/* eslint-disable no-console */

import { Client } from '@elastic/elasticsearch';

const db = new Client({
  node: process.env.ELASTIC_ENDPOINT, // Elasticsearch endpoint
  auth: {
    apiKey: {
      // API key ID and secret
      id: process.env.ELASTIC_API_KEY_ID,
      api_key: process.env.ELASTIC_API_KEY
    }
  }
});

export default db;
