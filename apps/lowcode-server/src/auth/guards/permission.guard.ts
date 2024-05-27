import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { uniqWith } from 'lodash';
import { createMongoAbility } from '@casl/ability';

import { CHECK_ABILITY_KEY } from '../auth.const';
import { UserService } from '../../user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly refletor: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.refletor.getAllAndMerge(CHECK_ABILITY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const { roles = [] } = await this.userService.findOne(user.username);
    const permissions = uniqWith(
      roles.reduce((acc, crt) => {
        return acc.concat(
          crt.permissions?.map((p) => ({
            subject: p.resource.subject,
            action: p.action,
          })),
        );
      }, []),
      (p1, p2) => p1.subject === p2.subject && p1.action === p2.action,
    );
    const ability = createMongoAbility(permissions);
    return rules.every((rule) => ability.can(rule.action, rule.subject));
  }
}
