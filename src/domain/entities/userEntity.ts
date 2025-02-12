export interface User {
  _id: string | unknown
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "trainer";
  isBlocked:boolean;
  otpVerified?: boolean;
  googleVerified?:boolean
  phone?: string;
  profilePic?: string;
  trainerData?: {
    yearsOfExperience?: string;
    specializations?: string[];
    certifications?: string[]; 
  };
}
