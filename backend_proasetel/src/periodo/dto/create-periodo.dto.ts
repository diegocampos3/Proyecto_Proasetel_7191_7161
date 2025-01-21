import { Type } from "class-transformer";
import { IsDate, IsString, Min } from "class-validator";

export class CreatePeriodoDto {

    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;
    
    @Type(() => Date)
    @IsDate()
    fecha_ini: Date;

    @Type(() => Date)
    @IsDate()
    fecha_fin: Date;

    @IsString()
    color: string;

    @IsString()
    textColor: string;

}
