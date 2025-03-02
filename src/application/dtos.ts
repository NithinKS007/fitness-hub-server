import {
  SubPeriod,
} from "../infrastructure/databases/models/subscriptionModel";

export interface CreateUserDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

export interface CreateTrainerDTO {
  fname: string;
  lname: string;
  email: string;
  password:string
  dateOfBirth: string 
  phone:string
  specializations:string[]
  certificate:string
  yearsOfExperience: string
}

export interface CreateTrainerSpecificDTO{
  specializations:string[]
  certificate:string
  yearsOfExperience: string
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
export interface UpdateUserDetails {
  _id: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
  dateOfBirth: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  bloodGroup?: string;
  medicalConditions?: string;
  otherConcerns?: string;
}
export interface UpdateTrainerDetails {
  _id: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
  dateOfBirth: string;
  aboutMe: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  yearsOfExperience: string;
  certifications: { url: string; fileName: string }[];
  specializations: string[];
}


export interface TrainerSpecificDTO {
  _id:string
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  aboutMe?: string;
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


export interface CertificationsDTO {
  _id: string;
  certifications: { url: string; fileName: string }[];
}
export interface SpecializationsDTO {
  _id: string;
  specializations: string[];
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
  _id: string;
  password: string;
  newPassword: string;
}

export interface CreateSubscriptionDTO {
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
}

export interface findExistingSubscriptionDTO {
  trainerId: string;
  subPeriod:SubPeriod
}

export interface updateSubscriptionBlockStatus {
  _id:string
  isBlocked:string
}

export interface updateSubscriptionDetails {
  _id:string,
  trainerId:string
  subPeriod:SubPeriod
  price:number,
  durationInWeeks:number
  sessionsPerWeek: number;
  totalSessions: number;
}