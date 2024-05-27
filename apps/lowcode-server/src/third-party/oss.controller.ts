import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('oss')
@UseGuards(JwtAuthGuard)
export class OssController {
  constructor(private ossService: OssService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.ossService.upload(file.buffer);
  }
}
