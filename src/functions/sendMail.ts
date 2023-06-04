import nodemailer from 'nodemailer';
import Mail from '../interfaces/Mail';

export default async function sendMail(mail: Mail) {
  // test account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const info = await transporter.sendMail(mail);

  return nodemailer.getTestMessageUrl(info);
}
