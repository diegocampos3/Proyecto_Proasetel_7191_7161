import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateObjetivosPerDto {

    @IsString()
    objetivoDep: string;

    @IsBoolean()
    @IsOptional()
    evaluado_empleado: boolean;

    @IsBoolean()
    @IsOptional()
    evaluado_supervisor: boolean;

}
