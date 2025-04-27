import { SendEmail } from "../../dtos/serviceDTOs/emailServiceDTOs";

export interface IEmailService {
  sendEmail(SendEmailData: SendEmail): Promise<void>;
}
