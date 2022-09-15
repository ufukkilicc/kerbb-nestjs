import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}
  async plainTextEmail(toemail: string) {
    return await this.mailService.sendMail({
      to: toemail,
      from: 'support@kerbb.com',
      subject: 'Simple plain text',
      text: 'Welcome to nestjs email demo',
    });
  }
  async resetPasswordMail(toemail: string, payload) {
    const mailResponse = await this.mailService.sendMail({
      to: toemail,
      from: 'support@kerbb.com',
      subject: 'Reset Password',
      template: 'resetPassword',
      context: {
        payload: payload,
      },
    });
    console.log(mailResponse);
    return mailResponse;
  }
}
