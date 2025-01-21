import { IsString } from "class-validator";

export class CreateObjtivosEmpDepDto {
    
    @IsString()
    objetivoEmprId: string;
}
