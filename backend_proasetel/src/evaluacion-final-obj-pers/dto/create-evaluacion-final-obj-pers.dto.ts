import { IsUUID, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEvaluacionFinalObjPersDto {
  @IsUUID()
  idObjPer: string;

  @IsUUID()
  idObjPersProp: string;

  @IsNumber()
  @IsNotEmpty()
  nivelLogro: number;
}