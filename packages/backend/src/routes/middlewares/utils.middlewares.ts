import Joi from 'joi';

import { Request, Response, NextFunction } from 'express';
import UserService from '../../services/user.service';
import { GetExistRequest } from '../../types/requests.types';
import { ERRORS } from '../../constants';
import PostService from '../../services/post.service';

type FindServices = UserService | PostService;

export const validateRequestBody =
  (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.validate(req.body);

    const file = req.file;

    if (file && file?.size > 100 && file?.mimetype.split('/')[0] === 'plain') {
      return res.status(400).json({ error: 'File max size 100 kb' });
    }
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details.map((d) => d.message).join(', ') });
    }

    next();
  };

export const isExist =
  <T extends FindServices>(EntityClass: new () => T) =>
  async (req: GetExistRequest, res: Response, next: NextFunction) => {
    try {
      const entity = new EntityClass();

      if (entity instanceof UserService) {
        const { email } = req.body;

        try {
          await entity.findOne(email);
          if (req.route.path !== '/register') {
            return next();
          }
        } catch (error) {
          if (req.route.path === '/register') {
            return next();
          }
          throw new Error(ERRORS.USER.NOT_EXIST);
        }

        throw new Error(ERRORS.USER.EXIST);
      }

      if (entity instanceof PostService) {
        try {
          const { postId } = req.params;
          await entity.findOne(postId);
        } catch (error) {
          throw new Error(ERRORS.NOT_FOUND);
        }
      }

      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          error: error.message
        });
      }
    }
  };

export const tryCatch =
  (
    handler: (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<void>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) res.status(400).json({ error: error.message });
    }
  };
