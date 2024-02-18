import passport from 'passport';
import { Router } from 'express';

import { isExist, tryCatch } from '../middlewares/utils.middlewares';
import postController from '../../controllers/post.controller';
import PostService from '../../services/post.service';

const postRouter: Router = Router();

postRouter.get(
  '/get',
  passport.authenticate('jwt', { session: false }),
  tryCatch(postController.getPost.bind(postController))
);

postRouter.post(
  '/create',
  isExist(PostService),
  tryCatch(postController.createPost.bind(postController))
);

export default postRouter;
