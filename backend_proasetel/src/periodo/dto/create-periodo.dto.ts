import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class CreatePeriodoDto {

    @Type(() => Date)
    @IsDate()
    fecha_ini: Date;

    @Type(() => Date)
    @IsDate()
    fecha_fin: Date;

}
