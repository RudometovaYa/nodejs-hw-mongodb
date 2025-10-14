import nodemailer from 'nodemailer';

import { getEnvVar } from './getEnvVar.js';

const transport = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) {
  mail.from = getEnvVar('SMTP_FROM');

  await transport.sendMail(mail);
}
