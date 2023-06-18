import { Controller } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';

@Controller()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @GrpcMethod('LibraryService', 'FindLibraries')
  async findLibraries({ author }: { author?: string }) {
    try {
      const list = await this.libraryService.find(author);
      return new SuccessRes(
        list.map((item) => {
          const {
            currentVersion: { version, components },
            ...rest
          } = item;
          return {
            ...rest,
            currentVersion: version,
            components,
          };
        }),
      );
    } catch (error) {
      return new ErrorRes({
        errno: ERRNO_ENUM.LIB_FIND_FAILED,
        message: '列表获取失败',
      });
    }
  }

  @GrpcMethod('LibraryService', 'CreateLibrary')
  async createLibrary(dto: CreateLibraryDto) {
    try {
      const { name, author, version, components, ...rest } = dto;
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
          },
        });
        return new SuccessRes(true);
      } else if (lib.author !== author) {
        return new ErrorRes({
          errno: ERRNO_ENUM.LIB_EXISTED,
          message: '组件库已存在',
        });
      }
      const libVersion = await this.libraryService.getVersion({
        name,
        version,
      });
      if (libVersion) {
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
}

export type ILibraryMicroService = MicroServiceType<typeof LibraryController>;
