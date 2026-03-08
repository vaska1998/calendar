import Joi from 'joi';

const API_DEFAULT_PORT = 3000;

export const configValidationSchema = Joi.object({
  SERVICE_PORT: Joi.number().default(API_DEFAULT_PORT),
  MONGODB_URI: Joi.string().required(),
  FRONTEND_URL: Joi.string().default('http://localhost:5173'),
});
