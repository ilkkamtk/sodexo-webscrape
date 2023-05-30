import nodemailer from 'nodemailer';
import Mail from '../interfaces/Mail';

export default async function sendMail(mail: Mail) {
  // test account from ethereal.email
  let testAccount = {
    user: 'luisa61@ethereal.email',
    pass: 'wcErbXMP2vqaU7VEuz',
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const info = await transporter.sendMail(mail);

  console.log(info);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
