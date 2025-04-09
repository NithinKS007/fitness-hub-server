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

export interface PassResetTokenDTO {
  email: string;
  resetToken: string;
}

export interface UpdatePasswordDTO {
  email: string;
  password: string;
  newPassword?: string;
}

export interface ChangePasswordDTO {
  _id: string;
  password: string;
  newPassword: string;
}

export interface GoogleTokenDTO {
  token: string;
}

export interface UpdateBlockStatusDTO {
  _id: string;
  isBlocked: boolean;
}
