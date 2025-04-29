/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { JwtRedisAuthGuard } from 'src/common/guards/jwt-redis-auth.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        console.log('JwtModule registering with secret:', secret);
        return {
          secret: secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,RedisService,JwtRedisAuthGuard],
  exports: [JwtStrategy]
})
export class AuthModule {}
