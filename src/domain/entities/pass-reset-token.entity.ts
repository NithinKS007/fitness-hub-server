export interface PasswordResetToken {
  id: string;
  email: string;
  resetToken: string;
  resetTokenCreatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
