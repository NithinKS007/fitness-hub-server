import { UserRepository } from "../interfaces/userRepository";
import { OtpRepository } from "../interfaces/otpRepository";
import { User } from "../entities/userEntity";
import { CreateUserDTO } from "../../application/dtos";
import { hashPassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository,private otpRepository:OtpRepository) {}
  public async execute(data: CreateUserDTO): Promise<User> {

    const {email, password } = data
    const existinguser = await this.userRepository.findUserByEmail({email:email})
    if(existinguser && existinguser.otpVerified) {
      throw new Error(HttpStatusMessages.EmailConflict)
    } 

    if(existinguser && !existinguser.otpVerified){

      const otp = generateOtp(6)
      await this.otpRepository.createOtp({ email, otp });
      await sendEmail(email, "OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`);
      return existinguser;
    }
    const hashedPassword = await hashPassword(password)
    const userData = await this.userRepository.createUser({...data,password:hashedPassword});

    const otp = generateOtp(6)
    await this.otpRepository.createOtp({email,otp})
    await sendEmail(email,"OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`)
    
    return userData
  }
}
