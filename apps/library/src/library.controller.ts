import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { from, map, scan, lastValueFrom } from 'rxjs';

import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { RpcBusinessException } from '@lib/common/exceptions/business.exception';

import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Library } from './entities/library.entity';

@Controller()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @GrpcMethod('LibraryService', 'FindLibraries')
  async findLibraries({ author }: { author?: string }) {
    try {
      const list = await this.libraryService.find(author);
      const data = await lastValueFrom(
        from(list).pipe(
          map(async (item) => {
            let config;
            if (item.author !== author) {
              config = await this.libraryService.findConfig({
                library: item.name,
                author,
              });
            }
            const { currentVersion, title } = config || item;
            const { id, version, url, scope, remoteEntry } = currentVersion;
            const { components } = await this.libraryService.libVersionDetail(
              id,
            );
            return {
              ...item,
              currentVersion: { id, version },
              components,
              title,
              url,
              scope,
              remoteEntry,
            };
          }),
          scan(async (acc, crt) => [...(await acc), await crt], []),
        ),
      );
      return data;
    } catch (error) {
      throw new RpcBusinessException(
        ERRNO_ENUM.LIB_FIND_FAILED,
        '列表获取失败',
      );
    }
  }

  @GrpcMethod('LibraryService', 'CreateLibrary')
  async createLibrary(dto: CreateLibraryDto) {
    try {
      const { name, author, version, components, url, scope, remoteEntry } =
        dto;
      const currentVersion = {
        library: name,
        version,
        components,
        url,
        scope,
        remoteEntry,
      };
      const lib = await this.libraryService.findOne({ name });
      if (!lib) {
        await this.libraryService.createLibrary({
          name,
          author,
          currentVersion,
        });
        return true;
      } else if (lib.author !== author) {
        throw new RpcBusinessException(ERRNO_ENUM.LIB_EXISTED, '组件库已存在');
      }
      const versions = await this.libraryService.getVersions({
        library: name,
        version,
      });
      if (versions.length) {
        throw new RpcBusinessException(
          ERRNO_ENUM.LIB_VERSION_EXISTED,
          '当前版本已存在',
        );
      }
      await this.libraryService.createLibrary({
        id: lib.id,
        currentVersion,
      });
      return true;
    } catch (error) {
      throw new RpcBusinessException(
        ERRNO_ENUM.LIB_CREATE_FAILED,
        '组件库创建失败',
      );
    }
  }

  @GrpcMethod('LibraryService', 'FindLibVersions')
  async findLibVersions({ id }: { id: number }) {
    try {
      const lib = await this.libraryService.findOne({ id });
      if (!lib) {
        throw new RpcBusinessException(
          ERRNO_ENUM.LIB_FIND_FAILED,
          '组件库不存在',
        );
      }
      const { name } = lib;
      return await this.libraryService.getVersions({ library: name });
    } catch (error) {
      throw new RpcBusinessException(
        ERRNO_ENUM.LIB_VERSIONS_FIND_FAILED,
        '版本获取失败',
      );
    }
  }

  @GrpcMethod('LibraryService', 'UpdateLibrary')
  async UpdateLibrary(dto: UpdateLibraryDto) {
    try {
      const { id, author, title, currentVersion } = dto;
      const lib = await this.libraryService.findOne({ id });
      if (!lib || (lib.author !== author && !lib.isPublic)) {
        throw new RpcBusinessException(
          ERRNO_ENUM.LIB_FIND_FAILED,
          '组件库不存在',
        );
      }
      const payload: Partial<Library> = { id, title };
      if (currentVersion) {
        const [version] = await this.libraryService.getVersions({
          id: currentVersion,
        });
        if (version) {
          payload.currentVersion = version;
        }
      }
      if (lib.author === author) {
        await this.libraryService.updateLibrary(payload);
      } else {
        const config = await this.libraryService.findConfig({
          library: lib.name,
          author,
        });
        await this.libraryService.updateConfig({
          id: config?.id,
          library: lib.name,
          author,
          title,
          currentVersion: payload.currentVersion,
        });
      }
      return true;
    } catch (error) {
      throw new RpcBusinessException(ERRNO_ENUM.LIB_UPDATE_FAILED, '更新失败');
    }
  }
}

export type ILibraryMicroService = MicroServiceType<typeof LibraryController>;
