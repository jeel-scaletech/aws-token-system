import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsernameOwnerGuard } from 'src/guards/user-owner.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { TokenService } from './token.service';
import { UpdateTokenReqDto } from './dto/update-token.req.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, UsernameOwnerGuard)
@Controller('/iam/:username/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  async getTokens(@Param('username') username: string) {
    return await this.tokenService.getTokens(username);
  }

  @Post()
  async createToken(@Param('username') username: string) {
    return await this.tokenService.createToken(username);
  }

  @Patch(':token_id')
  async updateToken(
    @Param('username') username: string,
    @Param('token_id') tokenId: string,
    @Body() updateTokenDetails: UpdateTokenReqDto,
  ) {
    await this.tokenService.updateToken(username, tokenId, updateTokenDetails);
  }

  @Delete(':token_id')
  async deleteToken(
    @Param('username') username: string,
    @Param('token_id') tokenId: string,
  ) {
    await this.tokenService.deleteToken(username, tokenId);
  }
}
