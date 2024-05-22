import { IsString, MaxLength, Length, IsMobilePhone } from 'class-validator';

export class LoginReqDto {
  @IsString()
  @MaxLength(10)
  username: string;

  // @IsMobilePhone('zh-CN')
  // phone: string;

  @Length(6, 15)
  password: string;
}
