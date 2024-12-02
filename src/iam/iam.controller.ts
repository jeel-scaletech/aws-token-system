import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { IamService } from './iam.service';
import { CreateIamUserDto } from './dto/create-iam.req.dto';
import { ValidUser } from 'src/auth/types/valid-user.type';
import { User } from 'src/lib/decorators/user.decorator';
import {
  generateRandomHexString,
  generateSecurePassword,
} from 'src/utils/random-hex';

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  // - POST /iam
  @Post()
  @UseGuards(JwtAuthGuard)
  async createIamUser(@User() user: ValidUser, @Body() body: CreateIamUserDto) {
    const username = body.username ?? generateRandomHexString(16);
    const password = body.password ?? generateSecurePassword(16);

    return await this.iamService.createIamUser(
      user,
      username,
      password,
      body.policyDocument,
    );
  }

  // - DELETE /iam/{id}
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteIamAccount(@Param('id') username: string) {
    return await this.iamService.deleteIamAccount(username);
  }
}
