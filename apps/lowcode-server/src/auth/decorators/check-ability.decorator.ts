import { SetMetadata } from '@nestjs/common';
import { CHECK_ABILITY_KEY } from '../auth.const';

export const CheckAbility = (subject: string, action: string) =>
  SetMetadata(CHECK_ABILITY_KEY, { subject, action });
