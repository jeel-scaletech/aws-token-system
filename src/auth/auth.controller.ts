import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidUser } from './types/valid-user.type';
import { LocalAuthGuard } from './local/local.guard';
import { User } from 'src/lib/decorators/user.decorator';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@User() user: ValidUser) {
    const token = await this.authService.generateToken(user);

    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  async profile(@User() user: ValidUser) {
    return user;
  }
}
