import { NextFunction, Request, Response } from 'express';
import { IPostCreateSchemaToken } from '../../schemas/post.schema';
import axios from 'axios';

export const captchaValidation = async (
  req: Request<any, any, IPostCreateSchemaToken, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reCaptcha } = req.body;

    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SITE_SECRET}&response=${reCaptcha}`
    );

    if (data.success) {
      next();
    } else {
      res.status(400).json({
        error: data['error-codes'][0]
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
};
