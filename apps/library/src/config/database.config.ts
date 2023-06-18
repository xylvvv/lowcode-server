import { registerAs } from '@nestjs/config';

const devConfig = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'lowcode_lms',
  entityPrefix: 'lms_',
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
};

const prodConfig = {
  ...devConfig,
  host: 'localhost',
  synchronize: false,
};

export default registerAs('database', () =>
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig,
);
