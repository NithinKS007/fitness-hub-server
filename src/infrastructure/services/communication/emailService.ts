import nodemailer, { Transporter } from "nodemailer";
import {
  AuthenticationStatusMessage,
  EnvironmentVariableStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import dotenv from "dotenv";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { IEmailService } from "../../../application/interfaces/communication/IEmailService";
import { SendEmail } from "../../../application/dtos/service/emailService";
dotenv.config();

export class EmailService implements IEmailService {
  private readonly emailUser = process.env.EMAIL_USER!;
  private readonly emailPass = process.env.EMAIL_PASS!;
  private transporter: Transporter;
  constructor() {
    this.validateEnv();
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    return nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: this.emailUser,
        pass: this.emailPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }
  private validateEnv(): void {
    if (!this.emailUser || !this.emailPass) {
      throw new validationError(
        EnvironmentVariableStatusMessage.MissingEmailEnvironmentVariables
      );
    }
  }
  public async sendEmail({ to, subject, text }: SendEmail) {
    console.log("data for sending email", to, subject, text);
    try {
      await this.transporter.sendMail({
        to: to,
        from: this.emailUser,
        subject: subject,
        text: text,
      });
      console.log("Email sent successfully to",to, subject, text);
    } catch (error) {
      console.log(`Error sending the email:${error}`);
      throw new validationError(AuthenticationStatusMessage.FailedToSendEmail);
    }
  }
}
