import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ProcedureDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MinLength(6)
  name: string;

  @MaxLength(500)
  description: string;

  type: string;

  group: string;
}
