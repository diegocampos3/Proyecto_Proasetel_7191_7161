import { IsString, Max } from "class-validator";

export class CreateDepartamentoDto {

    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;
}