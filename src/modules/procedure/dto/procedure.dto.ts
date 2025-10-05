import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ProcedureDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MinLength(6)
  name: string;
}
