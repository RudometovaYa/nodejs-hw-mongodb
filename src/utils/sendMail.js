import nodemailer from 'nodemailer';

import { getEnvVar } from './getEnvVar.js';

const transport = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  secure: true,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) {
  mail.from = getEnvVar('SMTP_FROM');

  await transport.sendMail(mail);
}
