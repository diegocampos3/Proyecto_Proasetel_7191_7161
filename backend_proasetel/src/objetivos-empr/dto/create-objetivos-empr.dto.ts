import { IsString } from "class-validator";

export class CreateObjetivosEmprDto {

    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;
}
