import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'apps/user-server/src/user/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsBoolean()
  @IsOptional()
  isFrozen?: boolean;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @ArrayUnique()
  roles?: number[];
}
