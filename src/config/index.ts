import 'dotenv/config';

export default {
  databaseUrl: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  senderMail: process.env.SENDER_EMAIL,
  webURL: process.env.WEB_URL,
  appURL: process.env.APP_URL,
  serverPort: Number(process.env.SERVER_PORT || '3333'),
  jwt_secret: process.env.JWT_SECRET || 'secret',
  mailTransporter: {
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }
};
