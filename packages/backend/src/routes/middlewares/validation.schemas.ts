import Joi from 'joi';

export const regValidationBodySchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(4).max(20).required(),
  password: Joi.string().min(4).max(20).required()
});

export const loginValidationBodySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required()
});

export const postCreateValidationSchema = Joi.object({
  text: Joi.string().required()
});
