import { IsEmail, IsString } from 'class-validator';

export class SendMail{

    @IsString()
    nombres: string;
    
    @IsEmail()
    email: string;
}