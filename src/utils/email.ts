import nodemailer from 'nodemailer';
import { Prisma } from '@prisma/client';
import pug from 'pug';
const { convert } = require('html-to-text');

// const host: string = process.env.EMAIL_HOST || '';
// const user: string = process.env.EMAIL_USER || '';
// const password: string = process.env.PASS || '';

export default class Email {
  #emailHost: string = process.env.EMAIL_HOST || '';
  #emailUser: string = process.env.EMAIL_USER || '';
  #emailPassword: string = process.env.EMAIL_PASS || '';
  firstName: string;
  to: string;
  constructor(private user: Prisma.UserCreateInput, private url: string) {
    this.firstName = user.username.split(' ')[0];
    this.to = user.email;
  }
  private newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    // }

    return nodemailer.createTransport({
      host: this.#emailHost, // SMTP server address (usually mail.your-domain.com)
      port: 465, // Port for SMTP (usually 465)
      secure: true, // Usually true if connecting to port 465
      auth: {
        user: this.#emailUser,
        pass: this.#emailPassword,
      },
    });
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
    const info = await this.newTransport().sendMail(mailOptions);
    console.log(info.messageId);
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
