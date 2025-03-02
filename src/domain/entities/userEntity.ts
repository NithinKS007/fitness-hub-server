export interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role:"user"| "admin"| "trainer";
  isBlocked: boolean;
  password : string;
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender?: "male" | "female";
  
  bloodGroup?: string;
  medicalConditions?: string;
  otherConcerns?: string;
}

