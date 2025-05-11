import { SendEmail } from "../../dtos/service/emailService";

export interface IEmailService {
  sendEmail(SendEmailData: SendEmail): Promise<void>;
}
