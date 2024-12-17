import { IsString } from "class-validator";

export class CreateObjetivosDepDto {

    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsString()
    departamento: string;

    @IsString()
    objetivoEmpr: string;

}
