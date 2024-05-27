import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { LibraryService } from './library.service';
import { CreateLibraryDto, UpdateLibraryDto } from './library.dto';
import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get()
  find(@User('username') username: string) {
    return this.libraryService.findAll(username);
  }

  @Post()
  create(@Body() dto: CreateLibraryDto, @User('username') username: string) {
    return this.libraryService.create({
      ...dto,
      author: username,
    });
  }

  @Get('versions/:id')
  findLibVersions(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.findLibVersions(id);
  }

  @Patch(':id')
  updateLibrary(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibraryDto,
    @User('username') author: string,
  ) {
    return this.libraryService.update({
      id,
      author,
      ...dto,
    });
  }
}
