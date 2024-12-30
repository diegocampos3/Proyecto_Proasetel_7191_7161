import { IsUUID, IsBoolean, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class CreateEvaluacionPerDto {
  @IsUUID()
  @IsNotEmpty()
  idFormulario: string;

  @IsUUID()
  @IsNotEmpty()
  idPeriodoEva: string;

  @IsBoolean()
  @IsNotEmpty()
  estado: boolean;

}
