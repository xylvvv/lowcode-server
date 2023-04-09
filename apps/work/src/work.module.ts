import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import DatabaseConfig from './config/database.config';
import { Work } from './work.entity';
import { WorkContentSchema } from './work-content.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
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
    TypeOrmModule.forFeature([Work]),
    MongooseModule.forRoot('mongodb://localhost/lowcode'),
    MongooseModule.forFeature([
      { name: 'WorkContent', schema: WorkContentSchema },
      { name: 'WorkPublishContent', schema: WorkContentSchema },
    ]),
  ],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}
