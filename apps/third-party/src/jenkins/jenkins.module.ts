import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JenkinsController } from './jenkins.controller';
import { JenkinsService } from './jenkins.service';

@Module({
  imports: [ConfigModule],
  controllers: [JenkinsController],
  providers: [JenkinsService],
})
export class JenkinsModule {}
