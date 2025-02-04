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

export interface OtpDTO {
  email: string;
  otp: string;
}
