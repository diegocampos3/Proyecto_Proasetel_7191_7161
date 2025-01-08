import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto{

    @IsString()
    @MinLength(1)
    nombres: string;

    @IsString()
    @MinLength(1)
    apellidos: string;

    @IsString()
    @IsEmail()
    email: string;


    @IsString()
    departamento: string;

    @IsString()
    @IsOptional()
    rol: string;
    
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
    })
    password: string;


}



