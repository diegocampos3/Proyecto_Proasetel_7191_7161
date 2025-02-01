import { IsString } from "class-validator";

export class CreateObjetivosPerDto {

    @IsString()
    objetivoDep: string;

}
