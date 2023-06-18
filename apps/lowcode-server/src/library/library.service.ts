import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ILibraryMicroService } from 'apps/library/src/library.controller';

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

  findAll(author?: string) {
    return this.libraryService.findLibraries({ author });
  }

  create(library: any) {
    return this.libraryService.createLibrary(library);
  }
}
