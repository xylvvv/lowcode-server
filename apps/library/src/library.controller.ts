import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { from, map, scan, lastValueFrom } from 'rxjs';

import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';

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
            const {
              currentVersion: { version, id },
              title,
            } = config || item;
            const { components, url, scope, remoteEntry } =
              await this.libraryService.libVersionDetail(id);
            return {
              ...item,
              currentVersion: version,
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
      return new SuccessRes(data);
    } catch (error) {
      console.log(error);
      return new ErrorRes({
        errno: ERRNO_ENUM.LIB_FIND_FAILED,
        message: '列表获取失败',
      });
    }
  }

  @GrpcMethod('LibraryService', 'CreateLibrary')
  async createLibrary(dto: CreateLibraryDto) {
    try {
      const {
        name,
        author,
        version,
        components,
        url,
        scope,
        remoteEntry,
        ...rest
      } = dto;
      const lib = await this.libraryService.findOne({ name });
      if (!lib) {
        await this.libraryService.createLibrary({
          ...rest,
          name,
          author,
          currentVersion: {
            library: name,
            version,
            components,
            url,
            scope,
            remoteEntry,
          },
        });
        return new SuccessRes(true);
      } else if (lib.author !== author) {
        return new ErrorRes({
          errno: ERRNO_ENUM.LIB_EXISTED,
          message: '组件库已存在',
        });
      }
      const versions = await this.libraryService.getVersions({
        library: name,
        version,
      });
      if (versions.length) {
        return new ErrorRes({
          errno: ERRNO_ENUM.LIB_VERSION_EXISTED,
          message: '当前版本已存在',
        });
      }
      await this.libraryService.createLibrary({
        ...rest,
        id: lib.id,
        currentVersion: {
          library: name,
          version,
          components,
        },
      });
      return new SuccessRes(true);
    } catch (error) {
      return new ErrorRes({
        errno: ERRNO_ENUM.LIB_CREATE_FAILED,
        message: '组件库创建失败',
      });
    }
  }

  @GrpcMethod('LibraryService', 'FindLibVersions')
  async findLibVersions({ id }: { id: number }) {
    try {
      const lib = await this.libraryService.findOne({ id });
      if (!lib) {
        return new ErrorRes({
          errno: ERRNO_ENUM.LIB_FIND_FAILED,
          message: '组件库不存在',
        });
      }
      const { name } = lib;
      const versions = await this.libraryService.getVersions({ library: name });
      return new SuccessRes(versions);
    } catch (error) {
      return new ErrorRes({
        errno: ERRNO_ENUM.LIB_VERSIONS_FIND_FAILED,
        message: '版本获取失败',
      });
    }
  }

  @GrpcMethod('LibraryService', 'UpdateLibrary')
  async UpdateLibrary(dto: UpdateLibraryDto) {
    try {
      const { id, author, title, currentVersion } = dto;
      const lib = await this.libraryService.findOne({ id });
      if (!lib || (lib.author !== author && !lib.isPublic)) {
        return new ErrorRes({
          errno: ERRNO_ENUM.LIB_FIND_FAILED,
          message: '组件库不存在',
        });
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
      return new SuccessRes(true);
    } catch (error) {
      return new ErrorRes({
        errno: ERRNO_ENUM.LIB_UPDATE_FAILED,
        message: '更新失败',
      });
    }
  }
}

export type ILibraryMicroService = MicroServiceType<typeof LibraryController>;
