import { IsBoolean, IsUUID } from "class-validator";

export class CreatePeriodoEvaluacionDto {

    @IsUUID()
    idPeriodo: string;

    @IsUUID()
    idUser: string;

    @IsBoolean()
    estado: boolean;
}
