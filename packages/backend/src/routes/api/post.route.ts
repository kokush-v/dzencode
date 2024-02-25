import passport from 'passport';
import { Router } from 'express';
import multer from 'multer';

import { isExist, tryCatch, validateRequestBody } from '../middlewares/utils.middlewares';
import postController from '../../controllers/post.controller';
import PostService from '../../services/post.service';
import { postCreateValidationSchema } from '../middlewares/validation.schemas';
import { captchaValidation } from '../middlewares/captcha.middlewares';

const postRouter: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

postRouter.get('/', tryCatch(postController.getMany.bind(postController)));
postRouter.get('/get', isExist(PostService), tryCatch(postController.getOne.bind(postController)));
postRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  validateRequestBody(postCreateValidationSchema),
  captchaValidation,
  tryCatch(postController.create.bind(postController))
);

postRouter.post(
  '/reply/:postId',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  validateRequestBody(postCreateValidationSchema),
  tryCatch(postController.reply.bind(postController))
);

export default postRouter;
