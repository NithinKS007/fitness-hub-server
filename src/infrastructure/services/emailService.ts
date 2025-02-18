import nodemailer from "nodemailer";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  port:465,
  secure:true,
  logger:true,
  debug:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls:{
    rejectUnauthorized:true
  }
});

export const sendEmail = async (email:string, subject:string, text:string) => {
    try {
        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_USER,
            subject: subject,
            text: text
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log(`Error sending the email:${error}`);
        throw new Error(HttpStatusMessages.FailedToSendEmail);
    }
};
