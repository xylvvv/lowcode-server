import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OssModule } from './oss/oss.module';
import { JenkinsModule } from './jenkins/jenkins.module';

@Module({
  imports: [ConfigModule.forRoot(), OssModule, JenkinsModule],
  controllers: [],
  providers: [],
})
export class ThirdPartyModule {}
