import { IsBoolean, IsString } from "class-validator";

export class CreateObjetivosDepDto {

    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsString()
    objtivoEmpDep: string;

    @IsBoolean()
    estado: boolean;

}
