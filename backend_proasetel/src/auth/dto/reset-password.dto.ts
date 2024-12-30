import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
 
  @IsOptional()  
  @IsUUID('4')
  resetPasswordToken?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'La contraseña debe tener por lo menos una letra mayúscula, una minúscula y un número.'
    }
  )
  password: string;
}
