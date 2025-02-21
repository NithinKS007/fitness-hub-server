export interface CreateUserDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string | Date;
  yearsOfExperience?: string | number;
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
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  profilePic?: string;
  dateOfBirth?: string;
  yearsOfExperience?: string;
  specifications?: string[];
  certifications?: string[];
  aboutMe?: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  bloodGroup: string;
  medicalConditions: string;
  otherConcerns: string;
}

export interface UpdateUserDetails {
  _id: string;
  fname: string;
  lname: string;
  phone?: string;
  profilePic?: string;
  dateOfBirth?: string;
  yearsOfExperience?: string;
  certifications?: { url: string; fileName: string }[];
  specifications?: string[];
  aboutMe?: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  bloodGroup: string;
  medicalConditions: string;
  otherConcerns: string;
}
export interface CertificationsDTO {
  _id: string;
  certifications: { url: string; fileName: string }[];
}
export interface SpecializationsDTO {
  _id: string;
  specifications: string[];
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

export type IdDTO = string;

export interface changePasswordDTO {
  _id:string
  password: string;
  newPassword:string
}
