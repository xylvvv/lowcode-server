import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Library } from './entities/library.entity';
import { LibraryVersion } from './entities/library-version.entity';
import { LibraryConfig } from './entities/library-config.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,

    @InjectRepository(LibraryVersion)
    private versionRepository: Repository<LibraryVersion>,

    @InjectRepository(LibraryConfig)
    private configRepository: Repository<LibraryConfig>,
  ) {}

  find(author?: string) {
    return this.libraryRepository.find({
      where: [{ author }, { isPublic: true }],
      relations: {
        currentVersion: true,
      },
    });
  }

  libVersionDetail(id: number) {
    return this.versionRepository.findOne({
      where: { id },
      relations: {
        components: true,
      },
    });
  }

  createLibrary(library: any) {
    return this.libraryRepository.save(library);
  }

  findOne({ name, id }: Partial<Library>) {
    return this.libraryRepository.findOneBy({
      name,
      id,
    });
  }

  getVersions(where: { library?: string; version?: string; id?: number }) {
    return this.versionRepository.find({
      where,
      order: { id: 'DESC' },
    });
  }

  updateLibrary({ id, ...lib }: Partial<Library>) {
    return this.libraryRepository.update(id, lib);
  }

  findConfig(where: Partial<LibraryConfig>) {
    return this.configRepository.findOne({
      where,
      relations: {
        currentVersion: true,
      },
    });
  }

  updateConfig(config: Partial<LibraryConfig>) {
    return this.configRepository.save(config);
  }
}
