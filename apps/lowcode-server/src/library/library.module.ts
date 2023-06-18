import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LIBRARY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'library',
          protoPath: 'apps/library/src/proto/library.proto',
          url: 'localhost:5004',
        },
      },
    ]),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
