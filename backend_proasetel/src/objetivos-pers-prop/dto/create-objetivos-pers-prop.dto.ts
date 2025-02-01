import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateObjetivosPersPropDto {

   @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsString()
    objtivoEmpDep: string;

    @IsBoolean()
    @IsOptional()
    estado: boolean;

    @IsBoolean()
    @IsOptional()
    aceptacion: boolean;
}
