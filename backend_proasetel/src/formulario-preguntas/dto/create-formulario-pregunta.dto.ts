import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateFormularioPreguntaDto {
  @IsUUID()
  @IsNotEmpty()
  idFormulario: string;

  @IsString()
  @IsNotEmpty()
  pregunta: string;
}

