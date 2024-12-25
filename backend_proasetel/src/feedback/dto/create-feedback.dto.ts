import { IsString, IsUUID } from "class-validator";

export class CreateFeedbackDto {

    
    @IsUUID()
    peridoEvaId: string;

    @IsString()
    descripcion: string;
}
