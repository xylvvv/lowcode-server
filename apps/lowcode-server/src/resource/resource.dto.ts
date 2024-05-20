import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MaxLength(20)
  @Matches(/^([A-Z][a-z]+)+$/)
  subject: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @Matches(/^([A-Z][a-z]+,)*[A-Z][a-z]+$/, { each: true })
  actions: string[];

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}

export class UpdateResourceDto {
  @IsString()
  @MaxLength(20)
  @Matches(/^([A-Z][a-z]+)+$/)
  @IsOptional()
  subject: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @Matches(/^([A-Z][a-z]+,)*[A-Z][a-z]+$/, { each: true })
  actions: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}
