import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThirdPartyService } from './third-party.service';

@Controller('third-party')
export class ThirdPartyController {
  constructor(private thirdPartyService: ThirdPartyService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.thirdPartyService.upload(file.buffer);
  }
}
