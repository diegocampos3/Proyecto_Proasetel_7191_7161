import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  
  constructor( private mailerService: MailerService) {}

  async sendCodeConfirmation(user: string, email: string, token: string ){
    
    const url = `${process.env.URL_RESET}/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reestablecer contraseña',
      template: './reset-password',
      context: {
        name: user,
        url
      }
    })
  }


  
}
