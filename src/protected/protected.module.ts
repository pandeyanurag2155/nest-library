/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
// src/protected/protected.module.ts
import { Module } from '@nestjs/common';
import { ProtectedController } from './protected.controller';
import { JwtRedisAuthGuard } from '../common/guards/jwt-redis-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
          }),
          inject: [ConfigService],
        }),
      ],
  controllers: [ProtectedController],
  providers: [JwtRedisAuthGuard, RedisService],
})
export class ProtectedModule {}
