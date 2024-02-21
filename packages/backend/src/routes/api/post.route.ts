import passport from 'passport';
import { Router } from 'express';
import multer from 'multer';

import { isExist, tryCatch, validateRequestBody } from '../middlewares/utils.middlewares';
import postController from '../../controllers/post.controller';
import PostService from '../../services/post.service';
import { postCreateValidationSchema } from '../middlewares/validation.schemas';

const postRouter: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

postRouter.get('/get', isExist(PostService), tryCatch(postController.getPost.bind(postController)));

postRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  validateRequestBody(postCreateValidationSchema),
  tryCatch(postController.createPost.bind(postController))
);

export default postRouter;
