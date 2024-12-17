import { IsString } from "class-validator";

export class CreateObjetivosPerDto {

    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsString()
    objetivoDep: string;

}
