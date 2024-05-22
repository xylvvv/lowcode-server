import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Gender } from 'apps/user-server/src/user/user.entity';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @Length(3, 10)
  nickname?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  picture?: string;
}

export class NewPasswordDto {
  @Length(6, 15)
  password: string;

  @Length(6, 15)
  newPassword: string;

  @IsString()
  verify: string;
}
