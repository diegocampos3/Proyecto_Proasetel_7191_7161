import {IsUUID } from "class-validator";

export class VerificarUserFeedbackDto {

    
    @IsUUID()
    peridoEvaId: string;

    @IsUUID()
    userId: string;
}
