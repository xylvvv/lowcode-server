import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import DatabaseConfig from './config/database.config';
import { User } from './user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true, // 声明为全局模块
      // envFilePath: 'apps/user/.env',
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        username: config.get('DATABASE_USER') as string,
        password: config.get('DATABASE_PASSWORD') as string,
        ...config.get('database'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
