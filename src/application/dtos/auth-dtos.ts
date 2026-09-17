export interface SignInDTO {
  email: string;
  password: string;
}

export interface FindEmailDTO {
  email: string;
}

export interface OtpDTO {
  email: string;
  otp: string;
}

export interface PasswordResetDTO {
  password?: string;
  resetToken: string;
}

export interface CreatePassResetTokenDTO {
  email: string;
  resetToken: string;
}

export interface DeletePasswordResetTokenDTO extends CreatePassResetTokenDTO {}

export interface UpdatePasswordDTO {
  email: string;
  password: string;
  newPassword?: string;
}

export interface ChangePasswordDTO {
  userId: string;
  password: string;
  newPassword: string;
}

export interface GoogleTokenDTO {
  token: string;
}

export interface UpdateBlockStatusDTO {
  userId: string;
  isBlocked: boolean;
}

export enum RoleType {
  Trainer = "trainer",
  User = "user",
  Admin = "admin",
}
