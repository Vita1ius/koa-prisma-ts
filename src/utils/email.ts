import { Prisma } from '@prisma/client';
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default class Email {
  #emailUser: string = process.env.EMAIL_USER || '';
  firstName: string;
  to: string;
  constructor(private user: Prisma.UserCreateInput, private url: string) {
    this.firstName = user.username.split(' ')[0];
    this.to = user.email;
  }

  async sendPasswordResetToken() {
    const mailOptions = {
      from: this.#emailUser,
      to: this.to,
      templateId: "d-5a0670f8875746cebc715dd600646272",
      dynamic_template_data: {
        firstName: this.firstName,
        reset_link: this.url,
        subject : 'Your password reset token (valid for only 10 minutes)'
      }
    };

    await sgMail.send(mailOptions);
  }
}
