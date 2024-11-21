import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/user.repository';
import { ValidUser } from './types/valid-user.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    return await this.userRepo.findUserWithPassword(email, pass);
  }

  async generateToken(user: ValidUser): Promise<string> {
    return await this.jwtService.signAsync(user);
  }
}
