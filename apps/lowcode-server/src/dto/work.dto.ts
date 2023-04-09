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
  content: any;
}

export class FindWorksDto {
  title?: string;

  status?: string;

  isTemplate?: string;

  pageIndex?: string;

  pageSize?: string;

  id?: string;

  uuid?: string;
}

export class PublishWorkDto {
  @IsBoolean()
  @IsOptional()
  isTemplate: boolean;
}
