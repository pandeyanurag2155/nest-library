/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtRedisAuthGuard } from '../common/guards/jwt-redis-auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtRedisAuthGuard)
  @Get()
  getProtected(@Req() req) {
    return {
      message: 'Access granted ',
      user: req.user,
    };
  }
}
