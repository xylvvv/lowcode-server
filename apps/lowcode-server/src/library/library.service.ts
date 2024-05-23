import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { ILibraryMicroService } from 'apps/library/src/library.controller';
import { BusinessException } from '@lib/common/exceptions/business.exception';

@Injectable()
export class LibraryService implements OnModuleInit {
  private libraryService: ILibraryMicroService;

  constructor(
    @Inject('LIBRARY_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.libraryService =
      this.client.getService<ILibraryMicroService>('LibraryService');
  }

  async findAll(author?: string) {
    const res = await lastValueFrom(
      this.libraryService.findLibraries({ author }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async create(library: any) {
    const res = await lastValueFrom(
      this.libraryService.createLibrary(library),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async findLibVersions(id: number) {
    const res = await lastValueFrom(
      this.libraryService.findLibVersions({ id }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }

  async update(library: any) {
    const res = await lastValueFrom(
      this.libraryService.UpdateLibrary(library),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data;
  }
}
