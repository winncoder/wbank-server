//auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { User } from 'src/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(loginRequestDto: LoginRequestDto): Promise<any> {
    const user = await this.userService.findOneByUsername(loginRequestDto.username);
    if (user?.password !== loginRequestDto.password) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(registerRequestDto: any): Promise<any> {
    const user = await this.userService.create(registerRequestDto);
    return user;
  }

  async validateUserFromToken(token: string): Promise<any> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw err;
    }

    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}