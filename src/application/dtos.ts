import { User } from "../domain/entities/userEntity";
export interface CreateUserDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

export interface FindEmailDTO {
  email: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface UserAuthResponseDTO {
  userData: User;               
  accessToken: string;      
  refreshToken: string;      
}

export interface OtpDTO {
  email: string;
  otp: string;
}

