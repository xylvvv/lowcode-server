import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';

import { OssController } from './oss.controller';

@Module({
  imports: [ConfigModule],
  controllers: [OssController],
  providers: [
    {
      provide: 'OSS_CLIENT',
      useFactory: (config: ConfigService) => {
        return new OSS({
          bucket: config.get('OSS_BUCKET'),
          endpoint: config.get('OSS_ENDPOINT'),
          accessKeyId: config.get('OSS_ACCESS_KEY'),
          accessKeySecret: config.get('OSS_SECRET_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class OssModule {}
