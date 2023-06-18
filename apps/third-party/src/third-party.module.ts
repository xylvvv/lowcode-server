import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OssModule } from './oss/oss.module';

@Module({
  imports: [OssModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class ThirdPartyModule {}
