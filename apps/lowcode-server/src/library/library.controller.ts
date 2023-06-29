import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LibraryService } from './library.service';
import { CreateLibraryDto, UpdateLibraryDto } from '../dto/library.dto';

@Controller('library')
@UseGuards(AuthGuard('jwt'))
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get()
  find(@Request() req) {
    const { username } = req.user;
    return this.libraryService.findAll(username);
  }

  @Post()
  create(@Body() dto: CreateLibraryDto, @Request() req) {
    const { username } = req.user;
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
    @Request() req,
    @Body() dto: UpdateLibraryDto,
  ) {
    const { username: author } = req.user;
    return this.libraryService.update({
      id,
      author,
      ...dto,
    });
  }
}
