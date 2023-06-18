import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryVersion } from './entities/library-version.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,

    @InjectRepository(LibraryVersion)
    private versionRepository: Repository<LibraryVersion>,
  ) {}

  find(author?: string) {
    return this.libraryRepository.find({
      where: [{ author }, { isPublic: true }],
      relations: {
        currentVersion: {
          components: true,
        },
      },
    });
  }

  createLibrary(library: any) {
    return this.libraryRepository.save(library);
  }

  findOne({ name }: Partial<Library>) {
    return this.libraryRepository.findOneBy({
      name,
    });
  }

  getVersion({ name, version }: { name: string; version: string }) {
    return this.versionRepository.findOneBy({
      library: name,
      version,
    });
  }
}
