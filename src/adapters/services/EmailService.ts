import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  }
}
