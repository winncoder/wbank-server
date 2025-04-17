import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.signIn(loginRequestDto);
  }

  @Post('register')
  signUp(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authService.signUp(registerRequestDto);
  }
}
