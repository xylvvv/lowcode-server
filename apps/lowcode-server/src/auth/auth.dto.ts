import { Length, IsEmail, IsString, IsEnum } from 'class-validator';

export class LoginReqDto {
  @IsEmail()
  username: string;

  // @IsMobilePhone('zh-CN')
  // phone: string;

  @Length(6, 15)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  username: string;

  @IsString()
  captcha: string;

  @Length(6, 15)
  password: string;
}

export class CaptchaDto {
  @IsEmail()
  username: string;
}

enum OAuthType {
  GITHUB = 'github',
}

export class OAuthConfigDto {
  @IsEnum(OAuthType)
  type: OAuthType;
}

export class OAuthDto {
  @IsEnum(OAuthType)
  type: OAuthType;

  @IsString()
  code: string;
}
