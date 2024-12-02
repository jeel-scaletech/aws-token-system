import {
  CreateAccessKeyCommand,
  DeleteAccessKeyCommand,
  IAMClient,
  ListAccessKeysCommand,
  UpdateAccessKeyCommand,
} from '@aws-sdk/client-iam';
import { Injectable } from '@nestjs/common';
import { UpdateTokenDetails } from './dto/update-token.req.dto';

@Injectable()
export class TokenService {
  constructor(private readonly iamClient: IAMClient) {}

  async getTokens(username: string) {
    return await this.iamClient
      .send(
        new ListAccessKeysCommand({
          UserName: username,
        }),
      )
      .then((x) => x.AccessKeyMetadata);
  }

  async createToken(username: string) {
    return await this.iamClient
      .send(
        new CreateAccessKeyCommand({
          UserName: username,
        }),
      )
      .then((x) => x.AccessKey);
  }

  async updateToken(
    username: string,
    tokenId: string,
    details: UpdateTokenDetails,
  ) {
    await this.iamClient.send(
      new UpdateAccessKeyCommand({
        AccessKeyId: tokenId,
        UserName: username,
        Status: details.tokenState,
      }),
    );
  }

  async deleteToken(username: string, tokenId: string) {
    await this.iamClient.send(
      new DeleteAccessKeyCommand({
        AccessKeyId: tokenId,
        UserName: username,
      }),
    );
  }
}
