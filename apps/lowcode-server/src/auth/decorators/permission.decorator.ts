import { UseGuards, applyDecorators } from '@nestjs/common';
import { CheckAbility, type RequiredRule } from './check-ability.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import {
  PermissionAction,
  PermissionSubject,
} from '@lib/common/enums/permission.enum';

export function Permission(
  subject: PermissionSubject,
  action: PermissionAction,
);
export function Permission(rules: RequiredRule[]);

export function Permission(
  rule: PermissionSubject | RequiredRule[],
  action?: PermissionAction,
) {
  const rules = Array.isArray(rule) ? rule : [{ subject: rule, action }];
  return applyDecorators(
    CheckAbility(...rules),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
}
