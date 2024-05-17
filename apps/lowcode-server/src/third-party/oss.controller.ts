import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';

@Controller('oss')
@UseGuards(AuthGuard('jwt'))
export class OssController {
  constructor(private ossService: OssService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.ossService.upload(file.buffer);
  }
}
