import { IsBoolean, IsString } from "class-validator";

export class CreateObjetivosEmprDto {
    
    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsBoolean()
    estado: boolean;
}
