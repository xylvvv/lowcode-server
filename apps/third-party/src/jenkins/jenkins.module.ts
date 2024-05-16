import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Jenkins from 'jenkins';

import { JenkinsController } from './jenkins.controller';

@Module({
  imports: [ConfigModule],
  controllers: [JenkinsController],
  providers: [
    {
      provide: 'JENKINS_CLIENT',
      useFactory: (config: ConfigService) => {
        return new Jenkins({
          baseUrl: config.get('JENKINS_SERVER'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class JenkinsModule {}
