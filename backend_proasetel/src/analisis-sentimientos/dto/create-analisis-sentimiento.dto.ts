import { IsBoolean, IsUUID } from "class-validator";

export class CreateAnalisisSentimientoDto {

    @IsUUID()
    feedbackId: string;

    @IsBoolean()
    resultado : boolean;
}
