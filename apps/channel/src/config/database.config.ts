import { registerAs } from '@nestjs/config';

const devConfig = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'lowcode_cms',
  entityPrefix: 'cms_',
  synchronize: true, // 是否自动创建表结构（生产环境慎用，可能会丢失数据）
  // 引入实体的四种方式：
  // entities: ['dist/**/*.entity{.ts,.js}'], // 1. 静态全局路径，但是webpack热更新不支持
  // entities: [Category, Product], // 2. 破坏了应用的域边界
  autoLoadEntities: true, // 3. 自动载入实体（4. 还可以通过ormconfig.json文件的方式）
  logging: ['query'],
};

const prodConfig = {
  ...devConfig,
  host: 'localhost',
  synchronize: false,
};

export default registerAs('database', () =>
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig,
);
