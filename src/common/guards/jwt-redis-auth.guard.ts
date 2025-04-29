/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { RedisService } from 'src/redis/redis.service';
  
  @Injectable()
  export class JwtRedisAuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private redisService: RedisService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid Authorization header');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        // 1. Verify JWT
        const payload = this.jwtService.verify(token); // Throws if invalid/expired
  
        // 2. Check if token is in Redis
        const redisKey = `tokens:${payload.sub}`;
        const redisClient = this.redisService.getClient();
        const exists = await redisClient.sismember(redisKey, token);
  
        if (!exists) {
          throw new UnauthorizedException('Token is revoked or not recognized');
        }
  
        // Attach payload to request
        request.user = payload;
  
        console.log('Token verified successfully');
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  