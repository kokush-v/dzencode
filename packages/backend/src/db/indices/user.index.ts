import { INDEXES } from '../../constants';

export const userIndex = {
  indexName: INDEXES.USER,
  mapping: {
    email: { type: 'keyword' },
    name: { type: 'text' },
    password: { type: 'keyword' }
  }
};
