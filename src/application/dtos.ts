export interface CreateUserDTO {
  fname: string 
  lname: string 
  email: string;
  password : string
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
  password ?:string
  resetToken :string,
}
export interface PassResetTokenDTO {
  email:string
  resetToken :string,
}
export interface UpdatePassword {
  email:string
  password :string,
  newPassword ? :string
}
export interface googleTokenDTO {
  token:string
}
export interface CreateGoogleUserDTO {
  fname?: string 
  lname?: string 
  email?: string;
  profilePic?:string
}