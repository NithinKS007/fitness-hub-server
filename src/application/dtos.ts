export interface CreateUserDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string | Date;
  trainerData?: {
    yearsOfExperience?: string | number;
    specializations?: string[];
    certifications?: string[];
  };
}

export interface FindEmailDTO {
  email: string;
}
export interface SignInDTO {
  email: string;
  password: string;
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
export interface UpdatePassword {
  email: string;
  password: string;
  newPassword?: string;
}
export interface googleTokenDTO {
  token: string;
}
export interface CreateGoogleUserDTO {
  fname?: string;
  lname?: string;
  email?: string;
  profilePic?: string;
}
export interface UserDTO {
  id: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: Role;
  isBlocked: boolean;
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  profilePic?: string;
}

export interface updateBlockStatus {
  _id: string;
  isBlocked: boolean;
}
export type Role = "user" | "admin" | "trainer";

export interface trainerVerification {
  _id: string;
  action: "approved" | "rejected";
}
