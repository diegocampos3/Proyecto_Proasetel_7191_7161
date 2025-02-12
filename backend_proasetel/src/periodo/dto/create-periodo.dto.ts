import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsString, Min } from "class-validator";

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

    @Type(() => Date)
    @IsDate()
    fecha_ini_config: Date;

    @Type(() => Date)
    @IsDate()
    fecha_fin_config: Date;

    @Type(() => Date)
    @IsDate()
    fecha_ini_eval: Date;

    @Type(() => Date)
    @IsDate()
    fecha_fin_eval: Date;

    @IsString()
    color: string;

    @IsString()
    textColor: string;

    @IsBoolean()
    estado: boolean;

}
