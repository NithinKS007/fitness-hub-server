import { SendEmail } from "@application/dtos/service/email.service";

export interface IEmailService {
  sendEmail(SendEmailData: SendEmail): Promise<void>;
}
