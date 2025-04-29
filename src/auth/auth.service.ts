/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Imports the JwtService, which is used to handle JSON Web Tokens (JWT).
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/entities/user.model';
import * as bcrypt from 'bcrypt'; //library used to hash and compared password
import { SignupDto } from './dto/signup.dto';//Data Transfer Objects (DTOs) used to define the structure of the data expected during user signup and login.
import { LoginDto } from './dto/login.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private redisService:RedisService,
  ) {}

  async login(loginDto:LoginDto) :Promise<{access_token:string}>{
    console.log(loginDto.email, loginDto.password)
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = { sub: user.id, role: user.role,email:user.email };
    console.log(payload)
    // return   this.jwtService.sign(payload);
    
    const token = this.jwtService.sign(payload);

    const redisKey=`tokens:${user.id}`

    const client=this.redisService.getClient();

    // Check the number of tokens already stored
  const tokenCount = await client.scard(redisKey); // SCARD command to get set count

  // If there are already 5 tokens, don't store the new one
  if (tokenCount >= 5) {
    console.log("Token limit reached. Not storing the new token.");
    return {
      access_token: token, // You can return the token to the client but don't store it in Redis
    };
  }

    await client.sadd(redisKey,token)

    // Set expiry for the *set* only if it doesn't exist already
  const ttl = await client.ttl(redisKey);
  if (ttl === -1) {
    await client.expire(redisKey, 86400); // 1 day
  }
    return {
      access_token: token,
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userModel.findOne({ where: { email },raw:true });
    
    
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    if (!user.password) {
      throw new UnauthorizedException('Password missing');
    }
    
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
  
  

 

  async signup(signupDto: SignupDto) {
    const { name, address, email, password ,role} = signupDto;
    const existing = await this.userModel.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      address,
      email,
      password: hashedPassword,
      role:role
    });
  
    // const payload = { sub: user.id, role: user.role };
  
    return {
      message: 'Signup successful',
      
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }
  

}
