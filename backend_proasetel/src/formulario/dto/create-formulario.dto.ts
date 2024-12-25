import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFormularioDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
