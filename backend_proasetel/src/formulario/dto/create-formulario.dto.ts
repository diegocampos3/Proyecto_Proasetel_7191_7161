import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFormularioDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}
