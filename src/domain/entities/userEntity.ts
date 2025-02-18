import { Role } from "../../application/dtos";

export interface User {
  _id: string 
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: Role
  isBlocked:boolean;
  otpVerified?: boolean;
  googleVerified?:boolean
  phone?: string;
  profilePic?: string;
  age?: string ,
  height?: string ,
  weight?: string ,
  gender?: string ,
  trainerData?: {
    yearsOfExperience?: string;
    specializations?: string[];
    certifications?: { fileName: string, url: string }[]; 
    aboutMe?:string
  };
  medicalDetails?: {
    bloodGroup?: string ,
    medicalConditions?: string ,
    otherConcerns?: string ,
  },
}
