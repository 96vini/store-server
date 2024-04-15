import nodemailer from 'nodemailer';

import { ServiceError } from '@/modules/errors';
import config from '@/config';

const transporter = nodemailer.createTransport(config.mailTransporter);

const send = async ({ from, to, subject, text }) => {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ServiceError({
      message: error.message,
      action: 'Verifique se o serviço de emails está disponível.',
      stack: error.stack,
      context: mailOptions,
      errorLocationCode: 'INFRA:EMAIl:SEND'
    });
  }
};

export default Object.freeze({
  send
});
