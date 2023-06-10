import { Prisma } from '@prisma/client';
import pug from 'pug';
const { convert } = require('html-to-text');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default class Email {
  #emailUser: string = process.env.EMAIL_USER || '';
  firstName: string;
  to: string;
  constructor(private user: Prisma.UserCreateInput, private url: string) {
    this.firstName = user.username.split(' ')[0];
    this.to = user.email;
  }

  async send(template: string, subject: string) {
    // Generate HTML template based on the template string
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      subject,
      url: this.url,
    });
    // Create mailOptions
    const mailOptions = {
      from: this.#emailUser,
      to: this.to,
      subject,
      text: convert(html),
      html,
    };

    // Send email
    await sgMail.send(mailOptions);
  }

  async sendVerificationCode() {
    await this.send('verificationCode', 'Your account verification code');
  }

  async sendPasswordResetToken() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}
