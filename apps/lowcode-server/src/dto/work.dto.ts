import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsObject()
  @IsOptional()
  content: any;
}

export class FindWorksDto {
  @IsOptional()
  title: string;

  @IsOptional()
  status: string;

  @IsOptional()
  @Transform(({ obj }) => ['1', 'true'].includes(obj.isTemplate))
  isTemplate: boolean;

  @IsInt()
  pageIndex: number = 1;

  @IsInt()
  pageSize: number = 10;

  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  uuid: string;
}

export class PublishWorkDto {
  @IsBoolean()
  @IsOptional()
  isTemplate: boolean;
}
