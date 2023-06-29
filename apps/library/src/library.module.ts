import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Library } from './entities/library.entity';
import { LibraryVersion } from './entities/library-version.entity';
import { Component } from './entities/component.entity';
import { LibraryConfig } from './entities/library-config.entity';
import DatabaseConfig from './config/database.config';

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
    TypeOrmModule.forFeature([
      Library,
      LibraryVersion,
      Component,
      LibraryConfig,
    ]),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
