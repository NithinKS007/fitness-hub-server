export interface SendEmail {
  to: string;
  subject: string;
  text: string;
}
export interface EmailConfig {
  user: string;
  pass: string;
}
