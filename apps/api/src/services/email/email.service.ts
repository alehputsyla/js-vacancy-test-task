import config from 'config';

import nodemailer from 'nodemailer';

import { renderEmailHtml, Template } from 'mailer';

import { From, EmailServiceConstructorProps, SendTemplateParams } from './email.types';

class EmailService {
  transporter: nodemailer.Transporter;

  from: From;

  constructor({ from, port, pass, user, host }: EmailServiceConstructorProps) {
    this.from = from;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendTemplate<T extends Template>({ to, subject, template, params }: SendTemplateParams<T>) {
    const html = await renderEmailHtml({ template, params });

    return this.transporter.sendMail({
      from: `${this.from.name} <${this.from.email}>`,
      to,
      subject,
      html,
    });
  }
}


export default new EmailService({
  host: config.EMAIL_SERVER_HOST,
  port: config.EMAIL_SERVER_PORT,
  user: config.EMAIL_SERVER_USER,
  pass: config.EMAIL_SERVER_PASSWORD,
  from: {
    email: config.EMAIL_FROM,
    name: 'Chuvaaak.ru',
  },
});
