import { WORK_STATUS_ENUM } from '@lib/common/enums/work-status.enum';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
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
  isTemplate: string;

  @IsOptional()
  pageIndex: string;

  @IsOptional()
  pageSize: string;

  @IsOptional()
  id: string;

  @IsOptional()
  uuid: string;
}

export class PublishWorkDto {
  @IsBoolean()
  @IsOptional()
  isTemplate: boolean;
}
