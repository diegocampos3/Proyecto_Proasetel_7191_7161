
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRespuestasPreguntaDto {
    @IsString()
    @IsNotEmpty()
    clave: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    valor: number;
}