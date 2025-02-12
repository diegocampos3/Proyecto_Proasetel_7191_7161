import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateObjetivosEmprDto {
    
    
    @IsString()
    @IsOptional()
    titulo: string;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsBoolean()
    @IsOptional()
    estado: boolean;
}
