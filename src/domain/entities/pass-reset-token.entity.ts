export interface PasswordResetToken{
  _id: string;
  email: string;
  resetToken: string;
  resetTokenCreatedAt: Date;
}
