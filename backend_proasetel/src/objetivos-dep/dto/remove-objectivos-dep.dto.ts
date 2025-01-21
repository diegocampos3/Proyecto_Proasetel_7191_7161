import { IsString } from "class-validator";

export class RemoveObjetivosDepDto{

    @IsString()
    id: string;

    @IsString()
    objtivoEmpDep: string
}