import {
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLibraryDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @Matches(/^\d+\.\d+\.\d+$/)
  @MaxLength(10)
  version: string;

  @IsString()
  url: string;

  @IsString()
  remoteEntry: string;

  @IsString()
  scope: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  components: ComponentDto[];
}

class ComponentDto {
  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsString()
  settingPath: string;

  @IsString()
  detailPath: string;
}

export class UpdateLibraryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  currentVersion?: number;
}
