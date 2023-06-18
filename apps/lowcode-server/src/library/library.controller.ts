import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from '../dto/library.dto';

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
}
