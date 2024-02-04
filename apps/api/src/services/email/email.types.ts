import { Template, TemplateProps } from 'mailer';

export type From = { email: string, name: string };

export interface EmailServiceConstructorProps {
  host: string,
  port: number,
  user: string,
  pass: string,
  from: From,
}

export interface SendTemplateParams<T extends Template> {
  to: string,
  subject: string,
  template: T,
  params: TemplateProps[T],
}
