import { SetMetadata } from '@nestjs/common';
import { CHECK_ABILITY_KEY } from '../auth.const';
import {
  PermissionAction,
  PermissionSubject,
} from '@lib/common/enums/permission.enum';

export interface RequiredRule {
  subject: PermissionSubject;
  action: PermissionAction;
}

export const CheckAbility = (...rules: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, rules);
