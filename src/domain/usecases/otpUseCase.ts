import { OtpRepository } from "../interfaces/otpRepository";
import { UserRepository } from "../interfaces/userRepository";
import { Otp } from "../entities/otpEntity";
import { OtpDTO } from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";


export class OtpUseCase {
  constructor(private otpRepository: OtpRepository,private userRepository:UserRepository) {}
  
  public async createOtp(data: OtpDTO): Promise<Otp> {
    return await this.otpRepository.createOtp(data);
  }
  public async verifyOtpByEmail(data: OtpDTO): Promise<void> {
    const otpData = await this.otpRepository.verifyOtpByEmail(data);

    if(!otpData){
       throw new  validationError(HttpStatusMessages.InvalidOtp)
    }
    const {email} = otpData
    await this.userRepository.updateUserVerificationStatus({email})
    await this.otpRepository.deleteOtp(otpData)
  }
  public async resendOtp(data:OtpDTO):Promise<void> {
     const {email} = data

     const userData = await this.userRepository.findUserByEmail({email})

     if(userData?.otpVerified) {
       throw new validationError(HttpStatusMessages.AlreadyUserVerifiedByOtp)
     }
     const otp = generateOtp(6)
     await this.otpRepository.createOtp({email,otp})
     await sendEmail(email, "OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`)
  }
}
