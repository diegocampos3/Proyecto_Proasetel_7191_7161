import { IsUUID, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateResultadoEvaluacionDto {
  @IsUUID()
  @IsOptional()
  idObjPer: string;

  @IsUUID()
  @IsOptional()
  idObjPersProp: string;

  @IsUUID()
  @IsNotEmpty()
  idPregunta: string;

  @IsInt()
  @IsOptional()
  puntaje_evaluado: number;

  @IsInt()
  @IsOptional()
  puntaje_supervisor: number;
}