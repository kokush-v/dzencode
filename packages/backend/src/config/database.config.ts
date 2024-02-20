/* eslint-disable no-console */

import { Client } from '@elastic/elasticsearch';

const db = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID
  },
  auth: {
    apiKey: {
      id: process.env.ELASTIC_API_KEY_ID,
      api_key: process.env.ELASTIC_API_KEY
    }
  }
});

export default db;
