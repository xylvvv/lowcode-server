import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(20)
  @Matches(/^([A-Z][a-z]+)+$/)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}

export class UpdateRoleDto {
  @IsString()
  @MaxLength(20)
  @Matches(/^([A-Z][a-z]+)+$/)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}

export class AssignPermissionsDto {
  @IsArray()
  @IsOptional()
  @Type(() => Permission)
  @ValidateNested({ each: true })
  permissions?: Permission[];
}

class Permission {
  @IsInt()
  resourceId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Matches(/^([A-Z][a-z]+,)*[A-Z][a-z]+$/, { each: true })
  actions: string[];
}
