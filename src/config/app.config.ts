export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true', // 개발 환경에서는 true, production 환경에서는 false
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true', // TypeORM 이 엔티티들을 자동으로 로드하도록 설정한다.
  },
});
