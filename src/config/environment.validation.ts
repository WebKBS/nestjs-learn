import * as Joi from 'joi';

// Joi 를 사용해서 환경 변수의 유효성을 검사.
export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),

  // JWT 설정
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),

  // AWS 설정
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_CLOUDFRONT_URL: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),

  // 메일 설정
  MAIL_HOST: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
});
