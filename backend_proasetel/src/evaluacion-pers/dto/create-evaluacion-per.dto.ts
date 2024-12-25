import { IsUUID, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEvaluacionPerDto {
  @IsUUID()
  @IsNotEmpty()
  idFormulario: string;

  @IsUUID()
  @IsNotEmpty()
  idPeriodoEva: string;

  @IsUUID()
  @IsNotEmpty()
  idUserEvaluado: string;

  @IsUUID()
  @IsNotEmpty()
  idObjPer: string;

  @IsBoolean()
  @IsNotEmpty()
  estado: boolean;

  @IsOptional()
  nivelLogro?: number;
}
