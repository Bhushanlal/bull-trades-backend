
  import * as nodemailer from 'nodemailer';
import { SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT } from '../utils/envConstants';
  
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  
  export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html: string,
  ) => {
    try {
      const mailOptions: any = {
        from: process.env.SMTP_FROM, // sender address
        to: to.split(',').map((email) => email.trim()),
        subject: subject,
        text: text,
        html: html,
      };
  

  
      await transporter.sendMail(mailOptions);
      console.log('Message sent successfully');
    } catch (error) {
      console.log(error, 'Error in sending email');
    }
  };
  