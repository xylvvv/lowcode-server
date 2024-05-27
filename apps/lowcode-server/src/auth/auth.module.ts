import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { createClient } from 'redis';

import { JWT_SECRET } from './auth.const';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: 'MAILER_TRANSPORTER',
      useFactory: (config: ConfigService) => {
        return createTransport({
          host: 'smtp.163.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get('MAILER_USER'),
            pass: config.get('MAILER_SECRET'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
