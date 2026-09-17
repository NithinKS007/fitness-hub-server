import nodemailer, { Transporter } from "nodemailer";
import {
  AuthStatus,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import dotenv from "dotenv";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEmailService } from "@application/interfaces/services/communication/IEmail.service";
import { SendEmail } from "@application/dtos/service/email.service";
import { injectable } from "inversify";
import { ReqLogService } from "@di/container-resolver";
dotenv.config();

@injectable()
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
        ApplicationStatus.MissingEmailEnvironmentVariables
      );
    }
  }
  async sendEmail({ to, subject, text }: SendEmail) {
    try {
      await this.transporter.sendMail({
        to: to,
        from: this.emailUser,
        subject: subject,
        text: text,
      });
      ReqLogService.log(`${to} ${subject} ${text}`);
    } catch (error) {
      console.log(`Error sending the email:${error}`);
      throw new validationError(AuthStatus.EmailSendFailed);
    }
  }
}
