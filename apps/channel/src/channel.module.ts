import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import DatabaseConfig from './config/database.config';
import { Channel } from './channel.entity';

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
    TypeOrmModule.forFeature([Channel]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
