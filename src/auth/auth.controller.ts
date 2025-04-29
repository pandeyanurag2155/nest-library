/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log(process.env.JWT_SECRET);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    try {
        
        return this.authService.login(loginDto);
    } catch (error) {
        console.error("dfgdfsfdsgdfg", error);
        
    }
  }


  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    try {
        
        return this.authService.signup(signupDto);
    } catch (error) {
        console.error("gsdfgdsfdfs", error);
        
    }
  }
}
