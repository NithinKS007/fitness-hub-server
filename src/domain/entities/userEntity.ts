export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "trainer";
  isBlocked:boolean;
  otpVerified?: boolean;
  phone?: string;
  profilePic?: string;
}
