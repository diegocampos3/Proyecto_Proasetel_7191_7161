import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto{

    @IsString()
    @MinLength(10)
    nombres: string;

    @IsString()
    @MinLength(10)
    apellidos: string;

    @IsString()
    @IsEmail()
    email: string;


    @IsString()
    departamento: string;

    @IsString()
    rol: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
    })
    password: string;


}



