import QUEUES from '../queue/list';
import { queueService } from '../queue/bull';
import { userIndex } from './indices/user.index';
import { postIndex } from './indices/post.index';

export const initIndices = async () => {
  const indices = [userIndex, postIndex];

  indices.map((data) => {
    queueService.addJob(QUEUES.CREATE_INDEX, data);
  });

  console.log(`Indices initialized ${indices.map((i) => i.indexName)}`);
};
