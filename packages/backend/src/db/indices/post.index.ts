import { INDEXES } from '../../constants';

export const postIndex = {
  indexName: INDEXES.POST,
  mapping: {
    userEmail: { type: 'keyword' },
    userName: { type: 'keyword' },
    text: { type: 'text' },
    homePageUrl: { type: 'text', index: false },
    file: { type: 'text', index: false },
    createdAt: { type: 'date' },
    parent: { type: 'keyword' }
  }
};
