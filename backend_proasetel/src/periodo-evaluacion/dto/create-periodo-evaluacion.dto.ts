import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreatePeriodoEvaluacionDto {

    @IsUUID()
    @IsNotEmpty()
    idFormulario: string;

    @IsUUID()
    @IsNotEmpty()
    idPeriodo: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}
