import { IsBoolean, IsOptional, IsUUID } from "class-validator";

export class CreatePeriodoEvaluacionDto {

    @IsUUID()
    idPeriodo: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}
