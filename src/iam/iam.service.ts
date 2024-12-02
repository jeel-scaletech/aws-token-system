import { Inject, Injectable } from '@nestjs/common';
import {
  CreateLoginProfileCommand,
  CreateUserCommand,
  DeleteLoginProfileCommand,
  DeleteUserCommand,
  DeleteUserPolicyCommand,
  IAMClient,
  ListUserPoliciesCommand,
  PutUserPolicyCommand,
  SimulatePrincipalPolicyCommand,
} from '@aws-sdk/client-iam';
import { ServiceException } from '@smithy/smithy-client';
import { Database, DRIZZLE_DATABASE } from 'src/database/database.module';
import { iamUsersTable } from 'src/database/schema';
import { ValidUser } from 'src/auth/types/valid-user.type';
import { ServiceError } from 'src/utils/core.exception';
import { oneLine } from 'common-tags';
import { IAMPolicyDocument } from './dto/policy.types';
import { eq } from 'drizzle-orm';

@Injectable()
export class IamService {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: Database,

    private readonly iamClient: IAMClient,
  ) {}

  private generatePolicyName(username: string) {
    return `inline-policy-${username}`;
  }

  async createIamUser(
    owner: ValidUser,
    username: string,
    password: string,
    policyDocument: IAMPolicyDocument,
  ) {
    // check if all the policies are available to the logged in user.
    const sentRequests = policyDocument.Statement.map(
      (x) =>
        new SimulatePrincipalPolicyCommand({
          ActionNames: x.Action,
          PolicySourceArn: owner.userArn,
          ResourceArns: x.Resource,
        }),
    ).map((x) => this.iamClient.send(x));

    const failedPolicies = (await Promise.all(sentRequests))
      .flatMap((x) => x.EvaluationResults)
      .filter((x) => x.EvalDecision != 'allowed');

    // if any policy is disallowed, throw error
    if (failedPolicies.length != 0) {
      throw new ServiceError(
        400,
        oneLine`
        You don't have the following permissions and hence your temp user shall not as well.
        Failed Policies are: ${failedPolicies.map((x) => x.EvalActionName).join(',')}
        `,
      );
    }

    const iamUsername = `${owner.email}-${username}`;
    // create the user
    const createCommand = new CreateUserCommand({
      UserName: iamUsername,
    });

    // give aws console access by creating a login profile with given password
    const enableConsoleLogin = new CreateLoginProfileCommand({
      UserName: iamUsername,
      Password: password,
      PasswordResetRequired: false,
    });

    return await this.db.transaction(async (tx) => {
      // insert in transaction, hence if creating iam fails, the db entry is also reverted
      await tx.insert(iamUsersTable).values({
        owner: owner.email,
        username: iamUsername,
      });

      const awsUser = await this.iamClient
        .send(createCommand)
        .then((x) => x.User);

      // add all policies to the newly created user.
      await this.iamClient.send(
        new PutUserPolicyCommand({
          PolicyDocument: JSON.stringify(policyDocument),
          PolicyName: this.generatePolicyName(username),
          UserName: awsUser.UserName,
        }),
      );

      const loginProfile = await this.iamClient
        .send(enableConsoleLogin)
        .then((x) => x.LoginProfile);

      // return the new user login profile
      return {
        iamUsername,
        password,
        createdDate: loginProfile.CreateDate,
      };
    });
  }

  private async deletePolices(username: string) {
    const policies = await this.iamClient
      .send(
        new ListUserPoliciesCommand({
          UserName: username,
        }),
      )
      .then((x) => x.PolicyNames);

    const deleteRequests = policies
      .map(
        (policyName) =>
          new DeleteUserPolicyCommand({
            UserName: username,
            PolicyName: policyName,
          }),
      )
      .map((x) => this.iamClient.send(x));

    await Promise.all(deleteRequests);
  }

  private async deleteLoginProfile(username: string) {
    const deleteProfile = new DeleteLoginProfileCommand({
      UserName: username,
    });

    return await this.iamClient.send(deleteProfile);
  }

  private async deleteAccount(username: string) {
    const deleteCommand = new DeleteUserCommand({
      UserName: username,
    });

    return await this.iamClient.send(deleteCommand);
  }

  async deleteIamAccount(username: string) {
    // helper inline function to ignore 404 errors as db and aws may be out of sync
    const ignore404 = (e: unknown) => {
      if (e instanceof ServiceException && e.$response.statusCode == 404) {
        //ignore and log the error TODO:
      } else {
        throw e;
      }
    };

    return await this.db.transaction(async (tx) => {
      // delete policies, login profile and user account in order
      // and ignore silently if anything does not exist
      await this.deletePolices(username).catch(ignore404);

      // why ignore 404? if policies are already deleted, then it will throw error.
      // and even if everything else is in place, it wont execute due to thrown exception
      await this.deleteLoginProfile(username).catch(ignore404);
      await this.deleteAccount(username).catch(ignore404);

      await tx
        .delete(iamUsersTable)
        .where(eq(iamUsersTable.username, username));
    });
  }
}
